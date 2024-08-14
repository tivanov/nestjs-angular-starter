import { Document } from 'mongoose';
import { BaseEntity } from '../../shared/base/base-entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TaskLogTypeEnum, TaskTypeEnum } from '@app/contracts';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type TaskLogDocument = TaskLog & Document;

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
}

export const TaskLogSchema = SchemaFactory.createForClass(TaskLog);

TaskLogSchema.plugin(mongoosePaginate);

TaskLogSchema.index({ createdAt: -1 });
