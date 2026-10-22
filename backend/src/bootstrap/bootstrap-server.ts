import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IAppConfig } from 'config/model';
import { AppModule } from '../app.module';
import { setupHttp } from './setup-http';

export async function bootstrapServer() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('query parser', 'extended');
  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>('app');

  setupHttp(app, appConfig);

  let port = 8200;
  if (appConfig.port) {
    port = appConfig.port;
  }
  await app.listen(port);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
