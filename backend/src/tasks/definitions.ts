import { CreateTaskCommand, TaskTypeEnum } from '@app/contracts';
import { CronExpression } from '@nestjs/schedule';

export const TasksDefinition: CreateTaskCommand[] = [
  {
    name: 'Clean Alerts',
    type: TaskTypeEnum.CleanAlerts,
    cronString: CronExpression.EVERY_WEEK,
    active: true,
  },
];
