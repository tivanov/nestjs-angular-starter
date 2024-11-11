import { Injectable, Logger } from '@nestjs/common';
import { TaskLog, TaskLogDocument } from '../model/task-log.model';
import { BaseService } from 'src/shared/base/base-service';
import { FilterQuery, Model, PaginateModel, PaginateResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  GetTaskLogsQuery,
  TaskLogTypeEnum,
  TaskTypeEnum,
} from '@app/contracts';

@Injectable()
export class TaskLogsService extends BaseService<TaskLogDocument> {
  private logger = new Logger(TaskLogsService.name);

  constructor(@InjectModel(TaskLog.name) model: Model<TaskLogDocument>) {
    super(model);
  }

  async get(query: GetTaskLogsQuery): Promise<PaginateResult<TaskLog>> {
    const filter: FilterQuery<TaskLogDocument> = {};

    if (query.taskType) {
      filter.taskType = query.taskType;
    }

    if (query.logType) {
      filter.logType = query.logType;
    }

    if (query.startDate) {
      filter.createdAt = { $gte: new Date(query.startDate) };
    }

    if (query.endDate) {
      filter.createdAt = { ...filter.createdAt, $lte: new Date(query.endDate) };
    }

    return await (this.objectModel as PaginateModel<TaskLogDocument>).paginate(
      filter,
      this.getPaginationOptions(query),
    );
  }

  info(taskType: TaskTypeEnum, message: string, errorObject?: any) {
    return this.log(TaskLogTypeEnum.Info, taskType, message, errorObject);
  }

  error(taskType: TaskTypeEnum, message: string, errorObject?: any) {
    return this.log(TaskLogTypeEnum.Error, taskType, message, errorObject);
  }

  debug(taskType: TaskTypeEnum, message: string, errorObject?: any) {
    return this.log(TaskLogTypeEnum.Debug, taskType, message, errorObject);
  }

  log(
    logType: TaskLogTypeEnum,
    taskType: TaskTypeEnum,
    message: string,
    errorObject?: any,
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
