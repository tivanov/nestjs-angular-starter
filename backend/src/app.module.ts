import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as config from '../config';
import { MongooseModule } from '@nestjs/mongoose';
import { IDbConfig } from 'config/model';
import { ThrottlerModule } from '@nestjs/throttler';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

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
    ThrottlerModule.forRoot([
      {
        name: 'medium', // 20 calls in 10 seconds
        ttl: 10000,
        limit: 20,
      },
    ]),
    SharedModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
