import { CircuitBreakerDto } from '@app/contracts/dto/circuit-breaker.dto';
import { PaginateResult, Types } from 'mongoose';
import { BaseMapper } from 'src/shared/base/base-mapper';
import { CircuitBreaker } from '../model/circuit-breaker.model';
import { PagedListDto } from '@app/contracts';

export class CircuitBreakerMappers extends BaseMapper {
  public static toDto(
    source: CircuitBreaker | Types.ObjectId,
  ): CircuitBreakerDto | string {
    if (!this.isValidDocument(source)) {
      return BaseMapper.objectIdToString(source);
    }

    const doc = source as CircuitBreaker;

    return {
      id: doc._id.toHexString(),
      createdAt: doc.createdAt?.toISOString(),
      updatedAt: doc.updatedAt?.toISOString(),
      operation: doc.operation,
      resourceId: doc.resourceId,
      state: doc.state,
      failureCount: doc.failureCount,
      failureThreshold: doc.failureThreshold,
      lastFailureTime: doc.lastFailureTime?.toISOString(),
      nextAttemptTime: doc.nextAttemptTime?.toISOString(),
      resetTimeoutMs: doc.resetTimeoutMs,
      successCount: doc.successCount,
      successThreshold: doc.successThreshold,
      lastError: doc.lastError,
    };
  }

  public static toDtos(
    source: CircuitBreaker[] | Types.ObjectId[],
  ): CircuitBreakerDto[] | string[] {
    if (!this.isValidArray(source)) {
      return null;
    }

    return source.map((u) => CircuitBreakerMappers.toDto(u) as any);
  }

  public static toDtosPaged(
    source: PaginateResult<CircuitBreaker>,
  ): PagedListDto<CircuitBreakerDto> {
    return {
      docs: CircuitBreakerMappers.toDtos(source.docs) as CircuitBreakerDto[],
      totalDocs: source.totalDocs,
      limit: source.limit,
      page: source.page,
      totalPages: source.totalPages,
    };
  }
}
