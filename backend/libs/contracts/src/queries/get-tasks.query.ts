import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ShapeableQuery } from './shapeable-query';
import { TaskTypeEnum } from '../enums';
import { Transform } from 'class-transformer';

export class GetTasksQuery extends ShapeableQuery {
  @IsOptional()
  activeOnly?: boolean;

  @IsOptional()
  id?: string;

  @IsOptional()
  @IsEnum(TaskTypeEnum)
  type?: TaskTypeEnum;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  onlyOneTime?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  onlyRecurring?: boolean;

  @IsOptional()
  search?: string;
}
