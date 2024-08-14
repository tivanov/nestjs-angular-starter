import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Alert, AlertSchema } from './model/alert.model';
import { AlertsService } from './services/alerts.service';
import { AlertsController } from './controllers/alerts.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Alert.name, useFactory: () => AlertSchema },
    ]),
  ],
  providers: [AlertsService],
  controllers: [AlertsController],
  exports: [AlertsService],
})
export class NotificationsModule {}
