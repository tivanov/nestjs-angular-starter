import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, PaginateModel, PaginateResult } from 'mongoose';
import { BaseService } from '../../shared/base/base-service';
import { AlertTypeEnum, GetAlertsQuery } from '@app/contracts';
import { Alert } from '../model/alert.model';

@Injectable()
export class AlertsService extends BaseService<Alert> {
  constructor(@InjectModel(Alert.name) model: PaginateModel<Alert>) {
    super(model);
  }

  async get(query: GetAlertsQuery): Promise<PaginateResult<Alert>> {
    const filter: FilterQuery<Alert> = {};

    if (query.type) {
      filter.type = query.type;
    }

    if (query.isRead) {
      filter.isRead = query.isRead;
    }

    if (query.unreadOnly) {
      filter.$or = [
        {
          isRead: false,
        },
        {
          isRead: { $exists: false },
        },
      ];
    }

    return await (this.objectModel as PaginateModel<Alert>).paginate(
      filter,
      this.getPaginationOptions(query),
    );
  }

  async dismiss(id: string) {
    return await this.objectModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true, lean: true },
    );
  }

  async dismissAll() {
    return await this.objectModel.updateMany(
      { $or: [{ isRead: false }, { isRead: { $exists: false } }] },
      { isRead: true },
    );
  }

  async info(message: string, jsonData?: string, organisation?: string) {
    return await this.baseCreate({
      type: AlertTypeEnum.Info,
      message,
      jsonData,
      organisation,
    });
  }

  async error(message: string, jsonData?: string, organisation?: string) {
    return await this.baseCreate({
      type: AlertTypeEnum.Error,
      message,
      jsonData,
      organisation,
    });
  }

  async debug(message: string, jsonData?: string, organisation?: string) {
    return await this.baseCreate({
      type: AlertTypeEnum.Debug,
      message,
      jsonData,
      organisation,
    });
  }

  async clean() {
    const olderThan = new Date();
    olderThan.setTime(olderThan.getTime() - 1000 * 60 * 60 * 24 * 30); // 30 days
    return await this.objectModel.deleteMany({
      createdAt: { $lt: olderThan },
      isRead: true,
    });
  }
}
