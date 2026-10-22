import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from '../../../config/model';
import * as fs from 'fs/promises';

@Injectable()
export class UploadsDirectoryService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    // Preserve the existing cluster worker contract for directory preparation.
    if (process.env.WORKER_NUMBER !== '0') {
      return;
    }

    const appConfig = this.configService.get<IAppConfig>('app');
    if (!appConfig.uploadsDir) {
      return;
    }

    try {
      await fs.mkdir(appConfig.uploadsDir, { recursive: true });
    } catch (err) {
      // Preserve startup behavior: report the error and continue initialization.
      Logger.error(err);
    }
  }
}
