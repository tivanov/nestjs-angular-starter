import { TaskLogTypeEnum, TaskTypeEnum } from '../enums';
import { BaseEntityDto } from './base-entity.dto';

export interface TaskLogDto extends BaseEntityDto {
  taskType: TaskTypeEnum;
  logType: TaskLogTypeEnum;
  message: string;
  jsonData: string;
}
