import { Task } from '../model/task.model';
import { ModuleRef } from '@nestjs/core';
import { TaskTypeEnum } from '@app/contracts';

// Import all task implementations
import { RunScriptTask } from './run-script.task';
import { CleanAlertsTask } from './clean-alerts.task';

type TaskRunner = (task: Task, moduleRef: ModuleRef) => Promise<void>;

export class TaskImplementations {
  private static readonly implementations: Record<TaskTypeEnum, TaskRunner> = {
    [TaskTypeEnum.RunScript]: RunScriptTask.run,
    [TaskTypeEnum.CleanAlerts]: CleanAlertsTask.run,
  };

  public static get(type: TaskTypeEnum): TaskRunner {
    const implementation = this.implementations[type];
    if (!implementation) {
      throw new Error(`No implementation found for task type ${type}`);
    }
    return implementation;
  }
}
