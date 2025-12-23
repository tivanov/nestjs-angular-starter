import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, Model } from 'mongoose';
type FilterQuery<T> = Record<string, any>;
import { BaseService } from '../../shared/base/base-service';
import { LoginRecord, LoginRecordDocument } from '../model/login-record.model';
import { User } from '../model/user.model';
import * as requestIp from 'request-ip';
import * as DeviceDetector from 'device-detector-js';
import { GetLoginRecordsQuery, UserRoleEnum } from '@app/contracts';
import { Request } from 'express';
import { IpLocationService } from './iplocation.service';

@Injectable()
export class LoginRecordsService extends BaseService<LoginRecordDocument> {
  private logger = new Logger(LoginRecordsService.name);

  constructor(
    @InjectModel(LoginRecord.name) model: PaginateModel<LoginRecordDocument>,
    private readonly ipLocation: IpLocationService,
  ) {
    super(model);
  }

  public async get(
    query: GetLoginRecordsQuery,
  ): Promise<PaginateResult<LoginRecordDocument>> {
    const filter: FilterQuery<LoginRecordDocument> = {};
    if (query.userId) {
      filter.user = query.userId;
    }

    if (query.startDate) {
      filter.createdAt = { $gte: query.startDate };
    }

    if (query.endDate) {
      if (!filter.createdAt) {
        filter.createdAt = {};
      }
      filter.createdAt.$lte = query.endDate;
    }

    return await (
      this.objectModel as PaginateModel<LoginRecordDocument>
    ).paginate(filter, this.getPaginationOptions(query));
  }

  public async weeklyByDeviceSummary() {
    const startDate = new Date();
    startDate.setTime(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const filter: FilterQuery<LoginRecordDocument> = {
      createdAt: { $gte: startDate },
    };

    const res = await this.objectModel
      .aggregate()
      .match(filter)
      .group({
        _id: '$deviceType',
        count: { $sum: 1 },
      });
    return res;
  }

  public async weeklyByCountrySummary() {
    const startDate = new Date();
    startDate.setTime(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const filter: FilterQuery<LoginRecordDocument> = {
      createdAt: { $gte: startDate },
    };

    const res = await this.objectModel
      .aggregate()
      .match(filter)
      .group({
        _id: '$countryName',
        count: { $sum: 1 },
      });
    return res;
  }

  public async addLoginEntry(
    user: User,
    request: Request,
  ): Promise<LoginRecordDocument> {
    try {
      if (user.role === UserRoleEnum.Admin) {
        return null;
      }

      const ip = requestIp.getClientIp(request).replace(/^.*:/, '');
      const geoData = await this.ipLocation.getLocation(ip);

      const userAgent = request.headers['user-agent'];
      let deviceData = null;
      if (userAgent) {
        const detector = new DeviceDetector();
        deviceData = detector.parse(userAgent);
      }

      const loginRecordCommand = {
        ip,
        countryCode: geoData?.country_code2,
        countryName: geoData?.country_name,
        clientType: deviceData?.client?.type,
        clientName: deviceData?.client?.name,
        osName: deviceData?.os?.name,
        deviceType: deviceData?.device?.type,
        deviceName: deviceData?.device?.name,
        isBot: deviceData?.bot,
        user: user._id,
      };
      return await this.baseCreate(loginRecordCommand);
    } catch (error) {
      this.logger.error(error);
    }
    return null;
  }

  public addInBackground(user: User, request: Request) {
    this.addLoginEntry(user, request)
      .then(() => null)
      .catch((err) =>
        this.logger.error('Error while saving login records', err.stack, err),
      );
  }
}
