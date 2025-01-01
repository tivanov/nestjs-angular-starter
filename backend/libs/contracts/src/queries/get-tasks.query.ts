import { IsEnum, IsOptional } from 'class-validator';
import { ShapeableQuery } from './shapeable-query';
import { TaskTypeEnum } from '../enums';

export class GetTasksQuery extends ShapeableQuery {
  @IsOptional()
  activeOnly?: boolean;

  @IsOptional()
  @IsEnum(TaskTypeEnum)
  type?: TaskTypeEnum;

  @IsOptional()
  id?: string;
}
