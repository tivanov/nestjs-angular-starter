import { UsersModule } from './../users/users.module';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import * as config from '../../config';
import { IDbConfig } from '../../config/model';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: config.default,
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
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => TasksModule),
  ],
})
export class MaintenanceModule {}
