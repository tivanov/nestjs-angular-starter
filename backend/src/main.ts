/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from 'config/model';
import {
  INestApplication,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import * as fs from 'fs/promises';
import { NestExpressApplication } from '@nestjs/platform-express';

const logger = new Logger('HTTP');

const os = require('os');
const cluster = require('cluster');

const getDurationInMilliseconds = (start: [number, number]) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

const setupCors = (app: INestApplication, appConfig: IAppConfig) => {
  if (!appConfig.enableCors) {
    return;
  }
  app.enableCors({
    origin: appConfig.corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Authorization',
      'X-Auth-Refresh-Token',
    ],
    // headers exposed to the client
    exposedHeaders: ['Authorization'],
    credentials: true,
  });
};

const setupLogging = (app: INestApplication) => {
  app.use((req, res, next) => {
    const { method, originalUrl } = req;
    const start = process.hrtime();

    res.on('finish', () => {
      const { statusCode } = res;
      const durationInMilliseconds = getDurationInMilliseconds(start);

      if (method === 'OPTIONS') {
        return;
      }

      logger.log(
        `${method} ${originalUrl} ${statusCode} ${durationInMilliseconds}ms`,
      );
    });

    next();
  });
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('query parser', 'extended');
  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>('app');

  if (process.env.WORKER_NUMBER === '0') {
    if (appConfig.uploadsDir) {
      try {
        await fs.mkdir(appConfig.uploadsDir, { recursive: true });
      } catch (err) {
        Logger.error(err);
      }
    }
  }

  // raise the limit of the request body
  (app as any).useBodyParser('json', { limit: '10mb' });

  setupCors(app, appConfig);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // cut additional properties that do not have class-validator decorators
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

  let port = 8200;
  if (appConfig.port) {
    port = appConfig.port;
  }
  await app.listen(port);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}

let numCPUs = os.cpus().length;

if (process.env.NODE_ENV === 'development') {
  numCPUs = 1;
}

if (cluster.isPrimary) {
  Logger.log(`Master server started on ${process.pid}`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      WORKER_NUMBER: i,
    });
  }
  cluster.on('exit', (worker) => {
    Logger.log(`Worker ${worker.process.pid} died. Restarting`);
    cluster.fork();
  });
} else {
  Logger.log(`Cluster server started on ${process.pid}`);
  bootstrap();
}
