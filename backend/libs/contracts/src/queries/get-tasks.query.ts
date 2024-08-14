import { IsOptional } from 'class-validator';
import { ShapeableQuery } from './shapeable-query';

export class GetTasksQuery extends ShapeableQuery {
  @IsOptional()
  activeOnly?: boolean;
}
