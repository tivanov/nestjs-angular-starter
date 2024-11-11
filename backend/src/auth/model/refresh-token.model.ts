import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Document, Types } from 'mongoose';
import { User } from '../../users/model/user.model';
import * as bcrypt from 'bcrypt';
import { Identity } from './identity.model';
import { BaseEntity } from 'src/shared/base/base-entity';

@Schema({
  timestamps: true,
})
export class RefreshToken extends BaseEntity {
  @Prop({
    required: true,
    index: true,
  })
  token: string;

  @Prop({
    required: true,
    default: false,
    index: true,
  })
  isRevoked: boolean;

  @Prop({
    required: true,
    index: true,
  })
  expires: Date;

  @Prop({
    required: true,
  })
  ip: string;

  @Prop({
    required: true,
  })
  browser: string;

  @Prop({
    required: true,
  })
  country: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    required: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Identity.name,
    required: true,
  })
  identity: Types.ObjectId;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
