import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Alert, AlertSchema } from './model/alert.model.js';
import { AlertsService } from './services/alerts.service.js';
import { AlertsController } from './controllers/alerts.controller.js';
import {
  ContactRequest,
  ContactRequestSchema,
} from './model/contact-request.model.js';
import { ContactRequestController } from './controllers/contact-request.controller.js';
import { ContactRequestService } from './services/contact-request.service.js';

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
