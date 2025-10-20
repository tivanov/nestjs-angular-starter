import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/shared/base/base-entity';
import { HydratedDocument } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { ContactRequestStatusEnum, ContactTypeEnum } from '@app/contracts';

export type ContactRequestDocument = HydratedDocument<ContactRequest>;

@Schema({
  timestamps: true,
})
export class ContactRequest extends BaseEntity {
  @Prop({
    required: true,
    type: String,
    enum: ContactTypeEnum,
    index: true,
  })
  type: ContactTypeEnum;

  @Prop({
    type: String,
    enum: ContactRequestStatusEnum,
    default: ContactRequestStatusEnum.New,
    index: true,
  })
  status: ContactRequestStatusEnum;

  @Prop({
    maxlength: 100,
    required: true,
  })
  name: string;

  @Prop({
    maxlength: 100,
    required: true,
  })
  email: string;

  @Prop({
    maxlength: 100,
  })
  company?: string;

  @Prop({
    maxlength: 5000,
    required: true,
  })
  message: string;
}

export const ContactRequestSchema =
  SchemaFactory.createForClass(ContactRequest);

ContactRequestSchema.plugin(mongoosePaginate);

ContactRequestSchema.index({ createdAt: -1, status: 1, type: 1 });
ContactRequestSchema.index({ createdAt: -1 });
