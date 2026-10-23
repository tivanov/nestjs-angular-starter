import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/shared/base/base-entity.js';

@Schema({
  timestamps: true,
})
export class SystemConfig extends BaseEntity {}

export const SystemConfigSchema = SchemaFactory.createForClass(SystemConfig);
