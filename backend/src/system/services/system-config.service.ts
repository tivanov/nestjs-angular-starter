import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SystemConfig } from '../model/system-config.model';
import { BaseService } from 'src/shared/base/base-service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SystemConfigService extends BaseService<SystemConfig> {
  private readonly logger = new Logger(SystemConfigService.name);

  constructor(
    @InjectModel(SystemConfig.name)
    systemConfigModel: Model<SystemConfig>,
    private readonly configService: ConfigService,
  ) {
    super(systemConfigModel);

    // only the first worker should initialize the config
    if (process.env.WORKER_NUMBER !== '0') {
      return;
    }
  }

  async get(): Promise<SystemConfig> {
    return this.objectModel.findOne({}).lean();
  }
}
