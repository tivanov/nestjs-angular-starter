import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../shared/base/base-service';
import { Task, TaskDocument } from '../model/task.model';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { IAppConfig } from '../../../config/model';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ModuleRef } from '@nestjs/core';
import { ImplementationRepository } from '../implementations/repository';
import { TasksDefinition } from '../definitions';
import { CreateTaskCommand, ErrorCode, GetTasksQuery } from '@app/contracts';
import { AppBadRequestException } from 'src/shared/exceptions/app-bad-request-exception';

@Injectable()
export class TasksService extends BaseService<TaskDocument> {
  private logger = new Logger(TasksService.name);

  constructor(
    @InjectModel(Task.name) model: Model<TaskDocument>,
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
        for (const task of tasks) {
          if (this.run(task)) {
            this.logger.debug(`Scheduling task ${task.name}`);
          }
        }
      });
    }, 5000);
  }

  public async create(command: CreateTaskCommand): Promise<Task> {
    const task = await super.baseCreate(command);
    if (task.active) {
      this.run(task);
    }
    return task;
  }

  public get(query: GetTasksQuery): Promise<Task[]> {
    const filter: FilterQuery<TaskDocument> = {};

    if (query.activeOnly) {
      filter.active = true;
    }

    let dbQuery = this.objectModel.find(filter);
    dbQuery = this.setPopulate(dbQuery, query);
    dbQuery = this.setProject(dbQuery, query);

    return dbQuery.lean();
  }

  public run(task: Task) {
    if (this.schedulerRegistry.doesExist('cron', task.name)) {
      return false;
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
}
