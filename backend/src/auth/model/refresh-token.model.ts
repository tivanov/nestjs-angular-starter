import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Document, Types } from 'mongoose';
import { User } from '../../users/model/user.model';
import * as bcrypt from 'bcrypt';

@Schema({
  timestamps: true,
})
export class RefreshToken extends Document {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    required: true,
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
  })
  token: string;

  @Prop({
    required: true,
    default: false,
  })
  isRevoked: boolean;

  @Prop({
    required: true,
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
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

RefreshTokenSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('token')) {
      return next();
    }
    const hashed = await bcrypt.hash(this.token, 10);
    this.token = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});
