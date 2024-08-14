import { TaskTypeEnum } from '../enums';
import { BaseEntityDto } from './base-entity.dto';

export interface TaskDto extends BaseEntityDto {
  active: boolean;
  type: TaskTypeEnum;
  name: string;
  params?: string;
  script?: string;
  cronString: string;
  lastRun?: string;
}
