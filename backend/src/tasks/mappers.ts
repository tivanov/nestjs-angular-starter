import { PaginateResult, Types } from 'mongoose';
import { BaseMapper } from '../shared/base/base-mapper';
import { PagedListDto, TaskDto, TaskLogDto } from '@app/contracts';
import { Task } from './model/task.model';
import { TaskLog } from './model/task-log.model';

export class TasksMappers extends BaseMapper {
  public static tasksToDto(
    source: Task[] | Types.ObjectId[],
  ): TaskDto[] | string[] {
    if (!this.isValidArray(source)) {
      return null;
    }

    const res = [];
    source?.forEach((u: Types.ObjectId | Task) =>
      res.push(TasksMappers.taskToDto(u)),
    );
    return res;
  }

  public static taskToDto(source: Task | Types.ObjectId): TaskDto | string {
    if (!this.isValidDocument(source)) {
      return BaseMapper.objectIdToString(source);
    }

    const quest = source as Task;

    return {
      id: quest._id.toHexString(),
      createdAt: quest.createdAt.toISOString(),
      updatedAt: quest.updatedAt.toISOString(),
      lastRun: quest.lastRun?.toISOString(),
      active: quest.active,
      type: quest.type,
      name: quest.name,
      params: quest.params,
      script: quest.script,
      cronString: quest.cronString,
    };
  }

  public static taskLogToDto(
    source: TaskLog | Types.ObjectId,
  ): TaskLogDto | string {
    if (!this.isValidDocument(source)) {
      return BaseMapper.objectIdToString(source);
    }

    const quest = source as TaskLog;

    return {
      id: quest._id.toHexString(),
      createdAt: quest.createdAt.toISOString(),
      updatedAt: quest.updatedAt.toISOString(),
      taskType: quest.taskType,
      logType: quest.logType,
      message: quest.message,
      jsonData: quest.jsonData,
    };
  }

  public static taskLogsToDto(
    source: TaskLog[] | Types.ObjectId[],
  ): TaskLogDto[] | string[] {
    if (!this.isValidArray(source)) {
      return null;
    }

    const res = [];
    source?.forEach((u: Types.ObjectId | TaskLog) =>
      res.push(TasksMappers.taskLogToDto(u)),
    );
    return res;
  }

  public static taskLogsToDtoPaginated(
    source: PaginateResult<TaskLog>,
  ): PagedListDto<TaskLogDto> {
    return {
      docs: TasksMappers.taskLogsToDto(source.docs) as TaskLogDto[],
      totalDocs: source.totalDocs,
      limit: source.limit,
      page: source.page,
      totalPages: source.totalPages,
    };
  }
}
