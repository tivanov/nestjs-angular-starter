import { IsEAN, IsEnum, IsOptional } from 'class-validator';
import { ShapeableQuery } from './shapeable-query';
import { TaskTypeEnum } from '../enums';

export class GetTasksQuery extends ShapeableQuery {
  @IsOptional()
  activeOnly?: boolean;

  @IsOptional()
  id?: string;

  @IsOptional()
  @IsEnum(TaskTypeEnum)
  type?: TaskTypeEnum;

  @IsOptional()
  onlyOneTime?: boolean;

  @IsOptional()
  onlyRecurring?: boolean;

  @IsOptional()
  search?: string;
}
