import { IsOptional, IsEnum } from 'class-validator';
import { CircuitBreakerOperation } from '../enums/index.js';
import { ShapeableQuery } from './shapeable-query.js';

export class GetCircuitBreakersQuery extends ShapeableQuery {
  @IsOptional()
  @IsEnum(CircuitBreakerOperation)
  operation?: CircuitBreakerOperation;

  @IsOptional()
  resourceId?: string;
}
