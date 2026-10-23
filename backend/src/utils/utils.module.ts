import { forwardRef, Module } from '@nestjs/common';
import { RandomService } from './services/random.service.js';
import { CryptographyHelpersService } from './services/cryptography-helpers.service.js';
import { StringUtilsService } from './services/string-utils.service.js';
import { DateUtilsService } from './services/date-utils.service.js';
import { NumberUtilsService } from './services/number-utils.service.js';
import { NotificationsModule } from 'src/notifications/notifications.module.js';
import { EnumUtilsService } from './services/enum-utils.service.js';
import { Mutex, MutexSchema } from './model/mutex.model.js';
import { MongooseModule } from '@nestjs/mongoose';
import { MutexService } from './services/mutex.service.js';
import {
  CircuitBreaker,
  CircuitBreakerSchema,
} from './model/circuit-breaker.model.js';
import { CircuitBreakersService } from './services/circuit-breakers.service.js';
import { CircuitBreakersController } from './controllers/circuit-breakers.controller.js';
import { DbTransactionsService } from './services/db-transactions.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mutex.name, schema: MutexSchema },
      { name: CircuitBreaker.name, schema: CircuitBreakerSchema },
    ]),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [CircuitBreakersController],
  providers: [
    RandomService,
    CryptographyHelpersService,
    StringUtilsService,
    DateUtilsService,
    NumberUtilsService,
    EnumUtilsService,
    MutexService,
    CircuitBreakersService,
    DbTransactionsService,
  ],
  exports: [
    RandomService,
    CryptographyHelpersService,
    StringUtilsService,
    DateUtilsService,
    NumberUtilsService,
    EnumUtilsService,
    MutexService,
    CircuitBreakersService,
    DbTransactionsService,
  ],
})
export class UtilsModule {}
