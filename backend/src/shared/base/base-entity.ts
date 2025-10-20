import { Prop } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

export class BaseEntity {
  _id: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;

  @Prop({
    type: SchemaTypes.ObjectId,
    index: true,
    ref: 'User',
  })
  createdBy?: Types.ObjectId | any;
}
