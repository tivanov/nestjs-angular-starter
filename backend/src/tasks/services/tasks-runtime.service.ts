import { Injectable, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from 'config/model';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ModuleRef } from '@nestjs/core';
import { Task } from '../model/task.model';
import { CronJob } from 'cron';
import { ImplementationRepository } from '../implementations/repository';

@Injectable()
export class TasksRuntimeService {
  private logger = new Logger(TasksRuntimeService.name);

  private managerIsRunning = false;
  private readonly managerInterval = 5000;

  constructor(
    configService: ConfigService,
    private readonly tasks: TasksService,
    private schedulerRegistry: SchedulerRegistry,
    private moduleRef: ModuleRef,
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
    setInterval(async () => {
      await this.manageTasks();
    }, this.managerInterval);
  }

  public run(task: Task) {
    if (!task.runOnce) {
      if (this.schedulerRegistry.doesExist('cron', task._id.toHexString())) {
        const existingJob = this.schedulerRegistry.getCronJob(
          task._id.toHexString(),
        );
        if (existingJob.cronTime.source === task.cronString) {
          return false;
        }
        this.schedulerRegistry.deleteCronJob(task._id.toHexString());
        this.logger.debug(`Rescheduling task ${task.name}`);
      }

      const job = new CronJob(
        task.cronString,
        async () => {
          try {
            if (!(await this.tasks.isActive(task))) {
              this.schedulerRegistry.deleteCronJob(task._id.toHexString());
              return;
            }
            await ImplementationRepository.get(task.type)(task, this.moduleRef);
          } catch (error) {
            this.logger.error(
              `Error running task ${task.name} of type ${task.type}`,
              error,
            );
          } finally {
            await this.tasks.afterRun(task);
          }
        },
        null,
        null,
        null,
        null,
        task.runImmediately,
      );

      this.schedulerRegistry.addCronJob(task._id.toHexString(), job);
      job.start();
      return true;
    } else {
      if (this.schedulerRegistry.doesExist('timeout', task._id.toHexString())) {
        return false;
      }

      const callback = async () => {
        try {
          if (!(await this.tasks.isActive(task))) {
            return;
          }
          await ImplementationRepository.get(task.type)(task, this.moduleRef);
        } catch (error) {
          this.logger.error(
            `Error running task ${task.name} of type ${task.type}`,
            error,
          );
        } finally {
          await this.tasks.afterRun(task);
        }
      };

      const timeout = setTimeout(callback, task.timeout);

      this.schedulerRegistry.addTimeout(task._id.toHexString(), timeout);
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
          } else {
            if (task.runOnce) {
              if (
                this.schedulerRegistry.doesExist(
                  'timeout',
                  task._id.toHexString(),
                )
              ) {
                this.schedulerRegistry.deleteTimeout(task._id.toHexString());
                this.logger.debug(`Stopping task ${task.name}`);
              }
            } else {
              if (
                this.schedulerRegistry.doesExist('cron', task._id.toHexString())
              ) {
                this.schedulerRegistry.deleteCronJob(task._id.toHexString());
                this.logger.debug(`Stopping task ${task.name}`);
              }
            }
          }
        } catch (error) {
          this.logger.error('Error managing tasks', error);
        }
      }
    } catch (error) {
      this.logger.error('Error managing tasks', error);
    } finally {
      this.managerIsRunning = false;
    }
  }
}
