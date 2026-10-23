import { Types, Document, SchemaTypes } from 'mongoose';
import { User } from './user.model.js';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { BaseEntity } from 'src/shared/base/base-entity.js';

export type LoginRecordDocument = LoginRecord & Document;

@Schema({
  timestamps: true,
})
export class LoginRecord extends BaseEntity {
  @Prop({ required: true })
  ip: string;

  @Prop()
  countryCode?: string;

  @Prop()
  countryName?: string;

  @Prop()
  regionName?: string;

  @Prop()
  cityName?: string;

  @Prop()
  clientType?: string;

  @Prop()
  clientName?: string;

  @Prop()
  osName?: string;

  @Prop()
  deviceType?: string;

  @Prop()
  deviceName?: string;

  @Prop()
  isBot?: boolean;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    required: true,
  })
  user: Types.ObjectId | User;
}

export const LoginRecordSchema = SchemaFactory.createForClass(LoginRecord);

LoginRecordSchema.plugin(mongoosePaginate);
