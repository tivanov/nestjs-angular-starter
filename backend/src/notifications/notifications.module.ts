import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Alert, AlertSchema } from './model/alert.model';
import { AlertsService } from './services/alerts.service';
import { AlertsController } from './controllers/alerts.controller';
import {
  ContactRequest,
  ContactRequestSchema,
} from './model/contact-request.model';
import { ContactRequestController } from './controllers/contact-request.controller';
import { ContactRequestService } from './services/contact-request.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Alert.name, useFactory: () => AlertSchema },
      { name: ContactRequest.name, useFactory: () => ContactRequestSchema },
    ]),
  ],
  providers: [AlertsService, ContactRequestService],
  controllers: [AlertsController, ContactRequestController],
  exports: [AlertsService, ContactRequestService],
})
export class NotificationsModule {}
