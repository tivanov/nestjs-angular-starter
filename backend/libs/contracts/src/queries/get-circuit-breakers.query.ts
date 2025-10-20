import { IsOptional, IsEnum } from 'class-validator';
import { CircuitBreakerOperation } from '../enums';
import { ShapeableQuery } from './shapeable-query';

export class GetCircuitBreakersQuery extends ShapeableQuery {
  @IsOptional()
  @IsEnum(CircuitBreakerOperation)
  operation?: CircuitBreakerOperation;

  @IsOptional()
  resourceId?: string;
}
