import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { TaskLogTypeEnum, TaskTypeEnum } from '../enums';
import { ShapeableQuery } from './shapeable-query';

export class GetTaskLogsQuery extends ShapeableQuery {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(TaskTypeEnum)
  taskType?: TaskTypeEnum;

  @IsOptional()
  @IsEnum(TaskLogTypeEnum)
  logType?: TaskLogTypeEnum;
}
