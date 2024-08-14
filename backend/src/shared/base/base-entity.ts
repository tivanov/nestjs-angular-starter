import { Types } from 'mongoose';

export class BaseEntity {
  _id: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
