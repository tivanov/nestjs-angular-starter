import { Task } from '../model/task.model';
import { ModuleRef } from '@nestjs/core';
import { RunScriptTask } from './run-script.task';
import { TaskTypeEnum } from '@app/contracts';
import { CleanAlertsTask } from './clean-alerts.task';

export class ImplementationRepository {
  public static get(
    type: TaskTypeEnum,
  ): (task: Task, moduleRef: ModuleRef) => Promise<void> {
    switch (type) {
      case TaskTypeEnum.RunScript:
        return RunScriptTask.run;
      case TaskTypeEnum.CleanAlerts:
        return CleanAlertsTask.run;
      default:
        throw new Error(`No implementation found for task type ${type}`);
    }
  }
}
