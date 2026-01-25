import { Document, HydratedDocument } from 'mongoose';
import { BaseEntity } from '../../shared/base/base-entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TaskTypeEnum } from '@app/contracts';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type TaskDocument = HydratedDocument<Task>;

@Schema({
  timestamps: true,
})
export class Task extends BaseEntity {
  @Prop({
    index: true,
  })
  active: boolean;

  @Prop()
  runOnce?: boolean;

  @Prop()
  timeout?: number;

  @Prop()
  runImmediately: boolean;

  @Prop({
    type: String,
    enum: TaskTypeEnum,
    required: true,
  })
  type: TaskTypeEnum;

  @Prop({
    required: true,
    maxlength: 100,
  })
  name: string;

  @Prop({
    maxlength: 8000,
  })
  params?: string;

  @Prop({
    maxlength: 10000,
  })
  script?: string;

  @Prop()
  lastRun?: Date;

  @Prop({
    maxlength: 100,
  })
  cronString: string;

  @Prop({
    default: false,
  })
  running?: boolean;

  @Prop()
  workItemsTotal?: number;

  @Prop()
  workItemsRemaining?: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.plugin(mongoosePaginate);
