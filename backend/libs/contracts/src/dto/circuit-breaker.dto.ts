import { CircuitBreakerOperation } from '../enums';
import { BaseEntityDto } from './base-entity.dto';

export interface CircuitBreakerDto extends BaseEntityDto {
  operation: CircuitBreakerOperation;
  resourceId: string;
  state: string;
  failureCount: number;
  failureThreshold: number;
  lastFailureTime: string;
  nextAttemptTime: string;
  resetTimeoutMs: number;
  successCount: number;
  successThreshold: number;
  lastError: string;
}
