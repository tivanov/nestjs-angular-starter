import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IAppConfig } from '../../config/model';
import { setupCors } from './setup-cors';
import { setupLogging } from './setup-logging';

export function setupHttp(app: NestExpressApplication, appConfig: IAppConfig) {
  // raise the limit of the request body
  app.useBodyParser('json', { limit: '10mb' });

  setupCors(app, appConfig);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });

  setupLogging(app);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
}
