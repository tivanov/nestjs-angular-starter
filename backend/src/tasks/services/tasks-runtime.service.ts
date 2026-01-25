import { Injectable, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from 'config/model';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ModuleRef } from '@nestjs/core';
import { Task } from '../model/task.model';
import { CronJob } from 'cron';
import { TaskImplementations } from '../implementations/task-implementations';
import { TaskLogsService } from './task-logs.service';

@Injectable()
export class TasksRuntimeService {
  private logger = new Logger(TasksRuntimeService.name);

  private managerIsRunning = false;
  private readonly managerInterval = 5000;

  constructor(
    configService: ConfigService,
    private readonly tasks: TasksService,
    private readonly taskLogs: TaskLogsService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly moduleRef: ModuleRef,
  ) {
    const appConfig = configService.get<IAppConfig>('app');

    if (!appConfig.enableTasks) {
      return;
    }

    // Only the first worker should run tasks
    // See main.ts
    if (process.env.WORKER_NUMBER !== '0') {
      return;
    }

    this.logger.debug('Starting active tasks...');

    this.tasks.resetRunningFlags().then(() => {
      setInterval(async () => {
        await this.manageTasks();
      }, this.managerInterval);
    });
  }

  public run(task: Task) {
    if (!TaskImplementations.get(task.type)) {
      this.logger.error(`Task ${task.name} of type ${task.type} not found`);
      this.tasks
        .stop(task._id.toHexString())
        .then(() => {
          this.logger.debug(`Task ${task.name} of type ${task.type} stopped`);
        })
        .catch((error) => {
          this.logger.error(
            `Error stopping task ${task.name} of type ${task.type}`,
            error,
          );
        });
      return false;
    }

    if (task.runOnce) {
      if (this.schedulerRegistry.doesExist('timeout', task._id.toHexString())) {
        return false;
      }

      const timeout = setTimeout(
        async () => await this.doWork(task),
        task.timeout,
      );

      this.schedulerRegistry.addTimeout(task._id.toHexString(), timeout);
      return true;
    }

    if (this.schedulerRegistry.doesExist('cron', task._id.toHexString())) {
      const existingJob = this.schedulerRegistry.getCronJob(
        task._id.toHexString(),
      );
      if (existingJob.cronTime.source === task.cronString) {
        return false;
      }
      if (existingJob.isActive) {
        existingJob.stop();
      }
      this.schedulerRegistry.deleteCronJob(task._id.toHexString());
      this.logger.debug(`Rescheduling task ${task.name}`);
    }

    const job = new CronJob(
      task.cronString,
      async () => await this.doWork(task),
      null,
      null,
      null,
      null,
      task.runImmediately,
    );

    this.schedulerRegistry.addCronJob(task._id.toHexString(), job);
    job.start();
    return true;
  }

  private async doWork(task: Task) {
    try {
      if (!(await this.tasks.isActive(task))) {
        if (this.schedulerRegistry.doesExist('cron', task._id.toHexString())) {
          const existingJob = this.schedulerRegistry.getCronJob(
            task._id.toHexString(),
          );
          if (existingJob) {
            existingJob.stop();
            this.schedulerRegistry.deleteCronJob(task._id.toHexString());
          }
        }
        if (
          this.schedulerRegistry.doesExist('timeout', task._id.toHexString())
        ) {
          const existingTimeout = this.schedulerRegistry.getTimeout(
            task._id.toHexString(),
          );
          if (existingTimeout) {
            clearTimeout(existingTimeout);
            this.schedulerRegistry.deleteTimeout(task._id.toHexString());
          }
        }
      }
      await this.tasks.setRunning(task, true);
      await TaskImplementations.get(task.type)(task, this.moduleRef);
    } catch (error) {
      this.logger.error(
        `Error running task ${task.name} of type ${task.type}`,
        error,
      );
      await this.taskLogs.error(
        task.type,
        `Error running task ${task.name} of type ${task.type}`,
        error,
        task._id.toHexString(),
      );
    } finally {
      await this.tasks.afterRun(task);
    }
  }

  private async manageTasks() {
    try {
      if (this.managerIsRunning) {
        return;
      }

      this.managerIsRunning = true;

      const tasks = await this.tasks.get({});

      for (const task of tasks?.docs || []) {
        try {
          if (task.active) {
            if (this.run(task)) {
              this.logger.debug(`Scheduling task ${task.name}`);
            }
            continue;
          }

          if (task.runOnce) {
            if (
              this.schedulerRegistry.doesExist(
                'timeout',
                task._id.toHexString(),
              )
            ) {
              const existingTimeout = this.schedulerRegistry.getTimeout(
                task._id.toHexString(),
              );
              if (existingTimeout) {
                clearTimeout(existingTimeout);
              }
              this.schedulerRegistry.deleteTimeout(task._id.toHexString());
              this.logger.debug(`Stopping task ${task.name}`);
            }
          } else {
            if (
              this.schedulerRegistry.doesExist('cron', task._id.toHexString())
            ) {
              const existingJob = this.schedulerRegistry.getCronJob(
                task._id.toHexString(),
              );
              if (existingJob.isActive) {
                existingJob.stop();
              }
              this.schedulerRegistry.deleteCronJob(task._id.toHexString());
              this.logger.debug(`Stopping task ${task.name}`);
            }
          }
        } catch (error) {
          this.logger.error('Error managing tasks', error);
          this.tasks.stop(task._id.toHexString());
        }
      }
    } catch (error) {
      this.logger.error('Error managing tasks', error);
    } finally {
      this.managerIsRunning = false;
    }
  }
}
