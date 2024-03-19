
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '../../shared/base/base-entity';

export type UserSettingsDocument = UserSettings & Document;

@Schema({
  timestamps: true,
})
export class UserSettings extends BaseEntity {
  @Prop({
    maxlength: 10,
  })
  currencyCode: string;

  @Prop({
    maxlength: 10,
  })
  language: string;

  @Prop()
  theme: string;
}

export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);
