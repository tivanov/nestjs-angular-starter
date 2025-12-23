// backend/src/system/services/circuit-breaker.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
type FilterQuery<T> = Record<string, any>;
import {
  CircuitBreaker,
  CircuitBreakerState,
} from '../model/circuit-breaker.model';
import { BaseService } from 'src/shared/base/base-service';
import {
  CircuitBreakerOperation,
  GetCircuitBreakersQuery,
} from '@app/contracts';

@Injectable()
export class CircuitBreakersService extends BaseService<CircuitBreaker> {
  private readonly logger = new Logger(CircuitBreakersService.name);

  constructor(
    @InjectModel(CircuitBreaker.name)
    circuitBreakerModel: Model<CircuitBreaker>,
  ) {
    super(circuitBreakerModel);
  }

  async get(query: GetCircuitBreakersQuery) {
    const filter: FilterQuery<CircuitBreaker> = {};

    if (query.operation) {
      filter.operation = query.operation;
    }

    if (query.resourceId) {
      filter.resourceId = query.resourceId;
    }

    return await (this.objectModel as PaginateModel<CircuitBreaker>).paginate(
      filter,
      this.getPaginationOptions(query),
    );
  }

  async executeWithCircuitBreaker<T>(
    operation: CircuitBreakerOperation,
    resourceId: string,
    operationFn: () => Promise<T>,
    options?: {
      failureThreshold?: number;
      resetTimeoutMs?: number;
      successThreshold?: number;
      onOpen?: () => void;
    },
  ): Promise<T | null> {
    let circuitBreaker = await this.getOrCreate(operation, resourceId, options);

    if (circuitBreaker.state === CircuitBreakerState.Open) {
      if (this.shouldAttemptReset(circuitBreaker)) {
        circuitBreaker = await this.baseUpdate(circuitBreaker._id.toString(), {
          state: CircuitBreakerState.HalfOpen,
          failureCount: 0,
          successCount: 0,
        });
      } else {
        this.logger.warn(
          `Circuit breaker is OPEN for ${operation}:${resourceId}. Next attempt at ${circuitBreaker.nextAttemptTime}`,
        );
        return null;
      }
    }

    try {
      const result = await operationFn();
      await this.recordSuccess(circuitBreaker);
      return result;
    } catch (error) {
      const updatedCb = await this.recordFailure(circuitBreaker, error);
      if (updatedCb.state === CircuitBreakerState.Open) {
        if (options.onOpen) {
          await options.onOpen();
        }
      }
      throw error;
    }
  }

  async reset(
    operation: CircuitBreakerOperation,
    resourceId: string,
  ): Promise<void> {
    await this.objectModel.updateOne(
      { operation, resourceId },
      {
        state: CircuitBreakerState.Closed,
        failureCount: 0,
        successCount: 0,
        lastFailureTime: undefined,
        nextAttemptTime: undefined,
        lastError: undefined,
      },
    );
  }

  private async getOrCreate(
    operation: CircuitBreakerOperation,
    resourceId: string,
    options?: {
      failureThreshold?: number;
      resetTimeoutMs?: number;
      successThreshold?: number;
    },
  ): Promise<CircuitBreaker> {
    let circuitBreaker = await this.objectModel
      .findOne({
        operation,
        resourceId,
      })
      .lean();

    if (circuitBreaker) {
      return circuitBreaker;
    }

    return await this.baseCreate({
      operation,
      resourceId,
      failureThreshold: options?.failureThreshold || 1,
      resetTimeoutMs: options?.resetTimeoutMs || 1000 * 60 * 15,
      successThreshold: options?.successThreshold || 2,
    });
  }

  private shouldAttemptReset(circuitBreaker: CircuitBreaker): boolean {
    if (!circuitBreaker.nextAttemptTime) {
      return true;
    }
    return new Date() >= circuitBreaker.nextAttemptTime;
  }

  private async recordSuccess(circuitBreaker: CircuitBreaker): Promise<void> {
    const patch: Partial<CircuitBreaker> = {
      successCount: circuitBreaker.successCount + 1,
      lastFailureTime: undefined,
      nextAttemptTime: undefined,
    };

    if (circuitBreaker.state === CircuitBreakerState.HalfOpen) {
      if (patch.successCount >= circuitBreaker.successThreshold) {
        patch.state = CircuitBreakerState.Closed;
        patch.failureCount = 0;
        patch.successCount = 0;
      }
    }

    await this.baseUpdate(circuitBreaker._id.toString(), patch);
  }

  private async recordFailure(
    circuitBreaker: CircuitBreaker,
    error: any,
  ): Promise<CircuitBreaker> {
    const patch: Partial<CircuitBreaker> = {
      failureCount: circuitBreaker.failureCount + 1,
      lastFailureTime: new Date(),
      lastError: error.message || 'Unknown error',
      successCount: 0,
    };

    if (patch.failureCount >= circuitBreaker.failureThreshold) {
      patch.state = CircuitBreakerState.Open;
      patch.nextAttemptTime = new Date(
        Date.now() + circuitBreaker.resetTimeoutMs,
      );
      this.logger.warn(
        `Circuit breaker OPENED for ${circuitBreaker.operation}:${circuitBreaker.resourceId} after ${patch.failureCount} failures`,
      );
    }

    return await this.baseUpdate(circuitBreaker._id.toString(), patch);
  }
}
