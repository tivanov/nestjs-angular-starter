import { Injectable, Logger } from '@nestjs/common';
import { TaskLog, TaskLogDocument } from '../model/task-log.model';
import { BaseService } from 'src/shared/base/base-service';
import {
  Model,
  PaginateModel,
  PaginateResult,
  Types,
  QueryFilter,
} from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  GetTaskLogsQuery,
  TaskLogTypeEnum,
  TaskTypeEnum,
} from '@app/contracts';

@Injectable()
export class TaskLogsService extends BaseService<TaskLog> {
  private logger = new Logger(TaskLogsService.name);

  constructor(@InjectModel(TaskLog.name) model: Model<TaskLog>) {
    super(model);
  }

  async get(query: GetTaskLogsQuery): Promise<PaginateResult<TaskLog>> {
    const filter: QueryFilter<TaskLog> = {};

    if (query.taskType) {
      filter.taskType = query.taskType;
    }

    if (query.logType) {
      filter.logType = query.logType;
    }

    if (query.startDate || query.endDate) {
      filter.createdAt = {};
      if (query.startDate) {
        filter.createdAt.$gte = new Date(query.startDate);
      }
      if (query.endDate) {
        filter.createdAt.$lte = new Date(query.endDate);
      }
    }

    if (query.taskId) {
      filter.task = query.taskId;
    }

    return await (this.objectModel as PaginateModel<TaskLog>).paginate(
      filter,
      this.getPaginationOptions(query),
    );
  }

  info(
    taskType: TaskTypeEnum,
    message: string,
    errorObject?: any,
    taskId?: string,
  ) {
    return this.log(
      TaskLogTypeEnum.Info,
      taskType,
      message,
      errorObject,
      taskId,
    );
  }

  error(
    taskType: TaskTypeEnum,
    message: string,
    errorObject?: any,
    taskId?: string,
  ) {
    return this.log(
      TaskLogTypeEnum.Error,
      taskType,
      message,
      errorObject,
      taskId,
    );
  }

  debug(
    taskType: TaskTypeEnum,
    message: string,
    errorObject?: any,
    taskId?: string,
  ) {
    return this.log(
      TaskLogTypeEnum.Debug,
      taskType,
      message,
      errorObject,
      taskId,
    );
  }

  log(
    logType: TaskLogTypeEnum,
    taskType: TaskTypeEnum,
    message: string,
    errorObject?: any,
    taskId?: string,
  ) {
    let jsonData = '';

    try {
      if (errorObject) {
        jsonData = JSON.stringify(
          errorObject,
          function replacer(key, value) {
            return value;
          },
          // Object.getOwnPropertyNames(errorObject),
        );

        jsonData =
          jsonData.length > 15000 ? jsonData.substring(0, 15000) : jsonData;
      }
    } catch (error) {
      this.logger.error('Error while parsing error object', error);
    }

    const log: Partial<TaskLog> = {
      taskType,
      logType,
      message,
      jsonData,
    };

    if (taskId) {
      log.task = new Types.ObjectId(taskId);
    }

    try {
      return this.baseCreate(log);
    } catch (error) {
      this.logger.error('Error while logging', error);
      this.logger.error('Log data', log);
    }
  }

  async clean() {
    const olderThan = new Date();
    olderThan.setTime(olderThan.getTime() - 1000 * 60 * 60 * 24 * 30);

    return await this.objectModel.deleteMany({
      createdAt: { $lte: olderThan },
    });
  }
}
