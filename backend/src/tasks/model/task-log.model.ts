import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { BaseEntity } from '../../shared/base/base-entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TaskLogTypeEnum, TaskTypeEnum } from '@app/contracts';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Task } from './task.model';

export type TaskLogDocument = HydratedDocument<TaskLog>;

@Schema({
  timestamps: true,
})
export class TaskLog extends BaseEntity {
  @Prop({
    type: String,
    enum: TaskTypeEnum,
    required: true,
    index: true,
  })
  taskType: TaskTypeEnum;

  @Prop({
    type: String,
    enum: TaskLogTypeEnum,
    required: true,
    index: true,
  })
  logType: TaskLogTypeEnum;

  @Prop({
    maxlength: 1000,
  })
  message: string;

  @Prop({
    maxlength: 15000,
  })
  jsonData: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Task.name,
    index: true,
  })
  task?: Types.ObjectId | Task;
}

export const TaskLogSchema = SchemaFactory.createForClass(TaskLog);

TaskLogSchema.plugin(mongoosePaginate);
TaskLogSchema.index({ createdAt: -1 });
