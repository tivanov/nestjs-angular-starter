import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../shared/base/base-service';
import { Task, TaskDocument } from '../model/task.model';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PaginateModel, PaginateResult } from 'mongoose';
import { IAppConfig } from '../../../config/model';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ModuleRef } from '@nestjs/core';
import { ImplementationRepository } from '../implementations/repository';
import { TasksDefinition } from '../definitions';
import {
  CreateTaskCommand,
  ErrorCode,
  GetTasksQuery,
  UpdateTaskCommand,
} from '@app/contracts';
import { AppBadRequestException } from 'src/shared/exceptions/app-bad-request-exception';

@Injectable()
export class TasksService extends BaseService<Task> {
  private logger = new Logger(TasksService.name);

  constructor(
    @InjectModel(Task.name) model: Model<Task>,
    configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
    private moduleRef: ModuleRef,
  ) {
    super(model);

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
    setInterval(() => {
      this.get({ activeOnly: true }).then((tasks) => {
        for (const task of tasks.docs) {
          if (this.run(task)) {
            this.logger.debug(`Scheduling task ${task.name}`);
          }
        }
      });
    }, 5000);
  }

  public async create(command: CreateTaskCommand): Promise<Task> {
    if (command.runOnce && !command.timeout) {
      throw new AppBadRequestException(ErrorCode.TIMEOUT_REQUIRED);
    }

    if (!command.runOnce && !command.cronString) {
      throw new AppBadRequestException(ErrorCode.CRON_STRING_REQUIRED);
    }

    const task = await super.baseCreate(command);
    // if (task.active) {
    //   this.run(task);
    // }
    return task;
  }

  public async update(id: string, command: UpdateTaskCommand) {
    if (command.runOnce && !command.timeout) {
      throw new AppBadRequestException(ErrorCode.TIMEOUT_REQUIRED);
    }

    if (!command.runOnce && !command.cronString) {
      throw new AppBadRequestException(ErrorCode.CRON_STRING_REQUIRED);
    }

    return super.baseUpdate(id, command);
  }

  public async get(query: GetTasksQuery): Promise<PaginateResult<Task>> {
    const filter: FilterQuery<TaskDocument> = {};

    if (query.activeOnly) {
      filter.active = true;
    }

    return await (this.objectModel as PaginateModel<TaskDocument>).paginate(
      filter,
      this.getPaginationOptions(query),
    );
  }

  public run(task: Task) {
    if (!task.runOnce) {
      if (this.schedulerRegistry.doesExist('cron', task.name)) {
        const existingJob = this.schedulerRegistry.getCronJob(task.name);
        if (existingJob.cronTime.source === task.cronString) {
          return false;
        }
        this.schedulerRegistry.deleteCronJob(task.name);
        this.logger.debug(`Rescheduling task ${task.name}`);
      }

      const job = new CronJob(
        task.cronString,
        async () => {
          try {
            await ImplementationRepository.get(task.type)(task, this.moduleRef);
          } catch (error) {
            this.logger.error(
              `Error running task ${task.name} of type ${task.type}`,
              error,
            );
          }
        },
        null,
        null,
        null,
        null,
        task.runImmediately,
      );

      this.schedulerRegistry.addCronJob(task.name, job);
      job.start();
      return true;
    } else {
      if (this.schedulerRegistry.doesExist('timeout', task.name)) {
        return false;
      }

      const callback = async () => {
        try {
          await ImplementationRepository.get(task.type)(task, this.moduleRef);
        } catch (error) {
          this.logger.error(
            `Error running task ${task.name} of type ${task.type}`,
            error,
          );
        } finally {
          try {
            this.deactivate(task._id.toHexString());
          } catch (error: Error | any) {
            this.logger.error(
              `Error deactivating task ${task.name} of type ${task.type}`,
              error,
            );
          }
        }
      };

      const timeout = setTimeout(callback, task.timeout);

      this.schedulerRegistry.addTimeout(task.name, timeout);
    }
  }

  public async createDefault() {
    await Promise.all(
      TasksDefinition.map(async (command) => {
        return super.baseCreate(command);
      }),
    );
  }

  public async start(id: string) {
    const task = await this.expectEntityExists(id, ErrorCode.TASK_NOT_FOUND);
    if (task.active) {
      throw new AppBadRequestException(ErrorCode.TASK_ALREADY_RUNNING);
    }

    await this.objectModel.findByIdAndUpdate(id, { active: true }).exec();
  }

  public async stop(id: string) {
    const task = await this.expectEntityExists(id, ErrorCode.TASK_NOT_FOUND);
    if (!task.active) {
      throw new AppBadRequestException(ErrorCode.TASK_NOT_FOUND);
    }

    await this.objectModel.findByIdAndUpdate(id, { active: false });
  }

  public async updateLastRun(id: string): Promise<Task> {
    return this.objectModel.findByIdAndUpdate(
      id,
      {
        lastRun: new Date(),
      },
      { new: true, lean: true },
    );
  }

  public async deactivate(id: string) {
    return this.objectModel.findByIdAndUpdate(id, { active: false });
  }
}
