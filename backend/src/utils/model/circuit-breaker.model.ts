// backend/src/system/model/circuit-breaker.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '../../shared/base/base-entity';
import { CircuitBreakerOperation } from '@app/contracts';
import * as mongoosePaginate from 'mongoose-paginate-v2';

// Default values
const DEFAULT_TIMEOUT_MS = 60000;
const DEFAULT_RESET_TIMEOUT_MS = 300000;
const DEFAULT_FAILURE_THRESHOLD = 5;
const DEFAULT_SUCCESS_THRESHOLD = 3;

export enum CircuitBreakerState {
  Closed = 'closed', // Normal operation
  Open = 'open', // Circuit is open, failing fast
  HalfOpen = 'half-open', // Testing if service is back
}

export type CircuitBreakerDocument = HydratedDocument<CircuitBreaker>;

@Schema({
  timestamps: true,
})
export class CircuitBreaker extends BaseEntity {
  @Prop({
    type: String,
    enum: CircuitBreakerOperation,
    required: true,
    index: true,
  })
  operation: CircuitBreakerOperation;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  resourceId: string; // e.g., agent ID, policy ID, etc.

  @Prop({
    type: String,
    enum: CircuitBreakerState,
    default: CircuitBreakerState.Closed,
  })
  state: CircuitBreakerState;

  @Prop({
    type: Number,
    default: 0,
  })
  failureCount: number;

  @Prop({
    type: Number,
    default: DEFAULT_FAILURE_THRESHOLD,
  })
  failureThreshold: number;

  @Prop({
    type: Date,
  })
  lastFailureTime?: Date;

  @Prop({
    type: Date,
  })
  nextAttemptTime?: Date;

  @Prop({
    type: Number,
    default: DEFAULT_RESET_TIMEOUT_MS,
  })
  resetTimeoutMs: number;

  @Prop({
    type: Number,
    default: 0,
  })
  successCount: number;

  @Prop({
    type: Number,
    default: DEFAULT_SUCCESS_THRESHOLD,
  })
  successThreshold: number;

  @Prop({
    type: String,
  })
  lastError?: string;
}

export const CircuitBreakerSchema =
  SchemaFactory.createForClass(CircuitBreaker);
CircuitBreakerSchema.index({ operation: 1, resourceId: 1 }, { unique: true });

CircuitBreakerSchema.plugin(mongoosePaginate);
