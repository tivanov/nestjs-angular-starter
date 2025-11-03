import { PaginateResult, Types } from 'mongoose';
import { BaseMapper } from '../../shared/base/base-mapper';
import { PagedListDto, TaskDto } from '@app/contracts';
import { Task } from '../model/task.model';

export class TaskMappers extends BaseMapper {
  public static toDtosPaged(
    source: PaginateResult<Task>,
  ): PagedListDto<TaskDto> {
    return {
      docs: TaskMappers.toDtos(source.docs) as TaskDto[],
      totalDocs: source.totalDocs,
      limit: source.limit,
      page: source.page,
      totalPages: source.totalPages,
    };
  }

  public static toDtos(
    source: Task[] | Types.ObjectId[],
  ): TaskDto[] | string[] {
    if (!this.isValidArray(source)) {
      return null;
    }

    const res = [];
    source?.forEach((u: Types.ObjectId | Task) =>
      res.push(TaskMappers.toDto(u)),
    );
    return res;
  }

  public static toDto(source: Task | Types.ObjectId): TaskDto | string {
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
}
