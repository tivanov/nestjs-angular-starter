import { Document, SchemaTypes, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { UserSettings, UserSettingsSchema } from './userSettings';
import { UserRoleEnum } from '@app/contracts';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ maxlength: 200 })
  firstName?: string;

  @Prop({ maxlength: 200 })
  lastName?: string;

  @Prop({
    maxlength: 100,
    minlength: 3,
  })
  userName?: string;

  @Exclude()
  @Prop({
    minlength: 5,
    maxlength: 1024,
  })
  password: string;

  @Prop({
    required: true,
    enum: UserRoleEnum,
    type: String,
    default: UserRoleEnum.Regular,
  })
  role: UserRoleEnum;

  @Prop({ maxlength: 300 })
  displayName?: string;

  @Prop({
    lowercase: true,
    minlength: 5,
    maxlength: 255,
  })
  email?: string;

  @Prop({ maxlength: 1000 })
  address?: string;

  @Prop({
    maxlength: 200,
  })
  phone?: string;

  @Prop({
    minlength: 2,
    maxlength: 10,
  })
  country?: string;

  @Exclude()
  @Prop({
    default: 0,
  })
  loginAttempts: number;

  @Exclude()
  @Prop({
    default: Date.now,
  })
  blockExpires: Date;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
  })
  creator: User | Types.ObjectId;

  @Prop({
    type: UserSettingsSchema,
  })
  settings: UserSettings;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    if (!this.password) {
      return next();
    }
    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.plugin(mongoosePaginate);

// UserSchema.index({ email: 1, organisation: 1 }, { unique: true, sparse: true });
// UserSchema.index({ userName: 1, organisation: 1 }, { unique: true, sparse: true });
// UserSchema.index({ phone: 1, organisation: 1 }, { unique: true, sparse: true });
