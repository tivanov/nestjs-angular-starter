import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Document, Types } from 'mongoose';
import { User } from '../../users/model/user';
import { BaseEntity } from '../../shared/base/base-entity';

export type IdentityDocument = Identity & Document;

@Schema({
  timestamps: true,
})
export class Identity extends BaseEntity {
  @Prop({
    required: true,
    unique: true,
    maxlength: 1000,
  })
  uid: string;

  @Prop({
    maxlength: 1000,
  })
  secret: string;

  @Prop({
    required: true,
    maxlength: 50,
  })
  provider: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    required: true,
  })
  user: Types.ObjectId;
}

export const IdentitySchema = SchemaFactory.createForClass(Identity);
