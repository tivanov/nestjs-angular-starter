import { ModuleRef } from '@nestjs/core';
import { Task } from '../model/task.model';
import { TasksService } from '../services/tasks.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Logger } from '@nestjs/common';

export class BaseTaskImplementation {
  private static readonly baseLogger = new Logger(this.constructor.name);

  protected static async isActive(inputTask: Task, moduleRef: ModuleRef) {
    const tasks = moduleRef.get(TasksService, { strict: false });
    const task = await tasks.getByIdLean(inputTask._id.toHexString());

    if (task?.active) {
      return true;
    }

    const registry = moduleRef.get(SchedulerRegistry, { strict: false });
    registry.deleteCronJob(task.name);
    return false;
  }

  protected static async afterRun(inputTask: Task, moduleRef: ModuleRef) {
    try {
      const tasks = moduleRef.get(TasksService, { strict: false });
      await tasks.updateLastRun(inputTask._id.toHexString());
      if (inputTask.runOnce) {
        await tasks.deactivate(inputTask._id.toHexString());
      }
    } catch (error) {
      BaseTaskImplementation.baseLogger.error(error);
    }
  }
}
