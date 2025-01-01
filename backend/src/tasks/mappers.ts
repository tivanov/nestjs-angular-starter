import { PaginateResult, Types } from 'mongoose';
import { BaseMapper } from '../shared/base/base-mapper';
import { PagedListDto, TaskDto, TaskLogDto } from '@app/contracts';
import { Task } from './model/task.model';
import { TaskLog } from './model/task-log.model';

export class TasksMappers extends BaseMapper {
  public static tasksToDtoPaged(
    source: PaginateResult<Task>,
  ): PagedListDto<TaskDto> {
    return {
      docs: TasksMappers.tasksToDto(source.docs) as TaskDto[],
      totalDocs: source.totalDocs,
      limit: source.limit,
      page: source.page,
      totalPages: source.totalPages,
    };
  }

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

    const task = source as Task;

    return {
      id: task._id.toHexString(),
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      lastRun: task.lastRun?.toISOString(),
      runImmediately: task.runImmediately,
      runOnce: task.runOnce,
      timeout: task.timeout,
      active: task.active,
      type: task.type,
      name: task.name,
      params: task.params,
      script: task.script,
      cronString: task.cronString,
    };
  }

  public static taskLogToDto(
    source: TaskLog | Types.ObjectId,
  ): TaskLogDto | string {
    if (!this.isValidDocument(source)) {
      return BaseMapper.objectIdToString(source);
    }

    const taskLog = source as TaskLog;

    return {
      id: taskLog._id.toHexString(),
      createdAt: taskLog.createdAt?.toISOString(),
      taskType: taskLog.taskType,
      logType: taskLog.logType,
      message: taskLog.message,
      jsonData: taskLog.jsonData,
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

  public static taskLogsToDtoPaged(
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
