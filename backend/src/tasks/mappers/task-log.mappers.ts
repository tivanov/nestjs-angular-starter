import { PaginateResult, Types } from 'mongoose';
import { BaseMapper } from '../../shared/base/base-mapper';
import { PagedListDto, TaskLogDto } from '@app/contracts';
import { TaskLog } from '../model/task-log.model';

export class TaskLogMappers extends BaseMapper {
  public static toDtosPaged(
    source: PaginateResult<TaskLog>,
  ): PagedListDto<TaskLogDto> {
    return {
      docs: TaskLogMappers.toDtos(source.docs) as TaskLogDto[],
      totalDocs: source.totalDocs,
      limit: source.limit,
      page: source.page,
      totalPages: source.totalPages,
    };
  }

  public static toDtos(
    source: TaskLog[] | Types.ObjectId[],
  ): TaskLogDto[] | string[] {
    if (!this.isValidArray(source)) {
      return null;
    }

    const res = [];
    source?.forEach((u: Types.ObjectId | TaskLog) =>
      res.push(TaskLogMappers.toDto(u)),
    );
    return res;
  }

  public static toDto(source: TaskLog | Types.ObjectId): TaskLogDto | string {
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
      task: taskLog.task?.toString(),
      jsonData: taskLog.jsonData,
    };
  }
}
