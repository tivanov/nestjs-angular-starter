import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Document, Types } from 'mongoose';
import { User } from '../../users/model/user.model';
import { BaseEntity } from '../../shared/base/base-entity';
import { IdentityProviderEnum } from '@app/contracts';

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
  token: string;

  @Prop({
    maxlength: 1000,
  })
  secret?: string;

  @Prop({
    maxlength: 1000,
  })
  refreshToken?: string;

  @Prop({
    required: true,
  })
  expirationDate: Date;

  @Prop({
    required: true,
    type: String,
    enum: IdentityProviderEnum,
  })
  provider: IdentityProviderEnum;

  @Prop({
    required: true,
    default: 1,
  })
  version: number;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  user: Types.ObjectId;
}

export const IdentitySchema = SchemaFactory.createForClass(Identity);

IdentitySchema.index({ uid: 1, provider: 1 }, { unique: true });
IdentitySchema.index({ uid: 1, provider: 1, version: 1 });
