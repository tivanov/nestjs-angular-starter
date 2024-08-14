import { ModuleRef } from '@nestjs/core';
import { Task } from '../model/task.model';
import { Logger } from '@nestjs/common';
import { TaskLogsService } from '../services/task-logs.service';
import { BaseTaskImplementation } from './base.task';
import { AlertsService } from 'src/notifications/services/alerts.service';

export class CleanAlertsTask extends BaseTaskImplementation {
  private static readonly logger = new Logger(CleanAlertsTask.name);
  private static isRunning = false;

  public static async run(task: Task, moduleRef: ModuleRef) {
    const log = moduleRef.get(TaskLogsService, { strict: false });
    const alerts = moduleRef.get(AlertsService, { strict: false });

    if (!(await CleanAlertsTask.isActive(task, moduleRef))) {
      return;
    }

    if (CleanAlertsTask.isRunning) {
      log.debug(task.type, `Task ${task.name} is already running`);
      return;
    }

    CleanAlertsTask.isRunning = true;

    try {
      log.debug(task.type, `Running task ${task.name}`);
      await alerts.cleanOldAlerts();
    } catch (error) {
      log.error(task.type, `Error running task ${task.name}`, error);
    } finally {
      CleanAlertsTask.isRunning = false;
    }
  }
}
