import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../config/index.js';
import { MongooseModule } from '@nestjs/mongoose';
import { IAppConfig, IDbConfig } from '../config/model.js';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { SharedModule } from './shared/shared.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { APP_GUARD } from '@nestjs/core';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { TasksModule } from './tasks/tasks.module.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UtilsModule } from './utils/utils.module.js';
import { SystemModule } from './system/system.module.js';
import { MeModule } from './me/me.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
    }),
    MongooseModule.forRootAsync({
      imports: [],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<IDbConfig>('db');
        const dbUri = dbConfig.mongoUri;
        if (!dbUri || dbUri === '') {
          throw new Error('MONGO_URI not set');
        }
        return {
          uri: dbUri,
        };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'medium', // 20 calls in 10 seconds
        ttl: 10000,
        limit: 20,
      },
    ]),
    ServeStaticModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const appConfig = configService.get<IAppConfig>('app');
        return [
          {
            rootPath: appConfig.uploadsDir,
            serveRoot: '/v1/uploads',
          },
        ];
      },
      inject: [ConfigService],
    }),
    SharedModule,
    AuthModule,
    UsersModule,
    DashboardModule,
    NotificationsModule,
    TasksModule,
    UtilsModule,
    SystemModule,
    MeModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
