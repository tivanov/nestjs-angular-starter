import { TaskLogTypeEnum, TaskTypeEnum } from '../enums/index.js';
import { BaseEntityDto } from './base-entity.dto.js';

export interface TaskLogDto extends BaseEntityDto {
  taskType: TaskTypeEnum;
  logType: TaskLogTypeEnum;
  message: string;
  task: string;
  jsonData: string;
}
