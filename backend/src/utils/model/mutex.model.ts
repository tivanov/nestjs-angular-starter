import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/shared/base/base-entity';
import { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type MutexDocument = HydratedDocument<Mutex>;

@Schema({
  timestamps: true,
})
export class Mutex extends BaseEntity {
  @Prop({ required: true })
  resourceId: string;

  @Prop()
  lockId?: string;

  @Prop()
  lockExpiresAt?: Date;
}

export const MutexSchema = SchemaFactory.createForClass(Mutex);

MutexSchema.plugin(mongoosePaginate);
MutexSchema.index({ resourceId: 1 }, { unique: true });
MutexSchema.index(
  { resourceId: 1, lockId: 1, lockExpiresAt: 1 },
  { unique: true },
);
