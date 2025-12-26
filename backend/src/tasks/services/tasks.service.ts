import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../shared/base/base-service';
import { Task } from '../model/task.model';
import { InjectModel } from '@nestjs/mongoose';
import {
  ClientSession,
  Model,
  PaginateModel,
  PaginateResult,
  QueryFilter,
} from 'mongoose';
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

  constructor(@InjectModel(Task.name) model: Model<Task>) {
    super(model);
  }

  public async create(command: CreateTaskCommand): Promise<Task> {
    if (command.runOnce && !command.timeout) {
      throw new AppBadRequestException(ErrorCode.TIMEOUT_REQUIRED);
    }

    if (!command.runOnce && !command.cronString) {
      throw new AppBadRequestException(ErrorCode.CRON_STRING_REQUIRED);
    }

    return await super.baseCreate(command);
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
    const filter: QueryFilter<Task> = {};

    if (query.activeOnly) {
      filter.active = true;
    }

    if (query.id) {
      filter._id = query.id;
    }

    if (query.type) {
      filter.type = query.type;
    }

    if (query.onlyOneTime) {
      filter.runOnce = true;
    }

    if (query.onlyRecurring) {
      filter.runOnce = false;
    }

    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }

    return await (this.objectModel as PaginateModel<Task>).paginate(
      filter,
      this.getPaginationOptions(query),
    );
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
    return this.objectModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true, lean: true },
    );
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

  public async isActive(inputTask: Task) {
    const task = await this.getByIdLean(inputTask._id.toHexString());

    if (task?.active) {
      return true;
    }

    return false;
  }

  public async afterRun(inputTask: Task) {
    try {
      const task = await this.updateLastRun(inputTask._id.toHexString());
      if (task.runOnce) {
        await this.deactivate(inputTask._id.toHexString());
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async delete(id: string, options?: { session?: ClientSession }) {
    const task = await this.expectEntityExists(id, ErrorCode.TASK_NOT_FOUND);
    if (task.active) {
      await this.deactivate(id);
    }

    return super.baseDelete(id, options?.session);
  }

  public async clean() {
    const aMonthAgo = new Date();
    aMonthAgo.setMonth(aMonthAgo.getMonth() - 1);

    return this.objectModel.deleteMany({
      active: false,
      lastRun: { $lt: aMonthAgo },
      runOnce: true,
    });
  }
}
