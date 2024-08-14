import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/shared/base/base-entity';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Document } from 'mongoose';
import { AlertTypeEnum } from '@app/contracts';

export type AlertDocument = Alert & Document;

@Schema({
  timestamps: true,
})
export class Alert extends BaseEntity {
  @Prop({
    required: true,
  })
  type: AlertTypeEnum;

  @Prop({
    maxlength: 1000,
  })
  message: string;

  @Prop({
    maxlength: 1000,
  })
  jsonData: string;

  @Prop()
  isRead?: boolean;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);

AlertSchema.plugin(mongoosePaginate);

AlertSchema.index({ createdAt: -1, isRead: 1 });
