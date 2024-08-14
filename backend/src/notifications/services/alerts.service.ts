import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, PaginateModel, PaginateResult } from 'mongoose';
import { BaseService } from '../../shared/base/base-service';
import { AlertTypeEnum, GetAlertsQuery } from '@app/contracts';
import { Alert, AlertDocument } from '../model/alert.model';

@Injectable()
export class AlertsService extends BaseService<AlertDocument> {
  constructor(@InjectModel(Alert.name) model: PaginateModel<AlertDocument>) {
    super(model);
  }

  async get(query: GetAlertsQuery): Promise<PaginateResult<AlertDocument>> {
    const filter: FilterQuery<AlertDocument> = {};

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

    return await (this.objectModel as PaginateModel<AlertDocument>).paginate(
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
}
