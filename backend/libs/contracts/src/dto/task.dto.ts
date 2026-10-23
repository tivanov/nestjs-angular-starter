import { TaskTypeEnum } from '../enums/index.js';
import { BaseEntityDto } from './base-entity.dto.js';

export interface TaskDto extends BaseEntityDto {
  active: boolean;
  runOnce?: boolean;
  runImmediately?: boolean;
  timeout?: number;
  type: TaskTypeEnum;
  name: string;
  params?: string;
  script?: string;
  cronString: string;
  lastRun?: string;
  running?: boolean;
  workItemsTotal?: number;
  workItemsRemaining?: number;
}
