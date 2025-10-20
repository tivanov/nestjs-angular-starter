import { forwardRef, Module } from '@nestjs/common';
import { RandomService } from './services/random.service';
import { CryptographyHelpersService } from './services/cryptography-helpers.service';
import { StringUtilsService } from './services/string-utils.service';
import { DateUtilsService } from './services/date-utils.service';
import { NumberUtilsService } from './services/number-utils.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { EnumUtilsService } from './services/enum-utils.service';
import { Mutex, MutexSchema } from './model/mutex.model';
import { MongooseModule } from '@nestjs/mongoose';
import { MutexService } from './services/mutex.service';
import {
  CircuitBreaker,
  CircuitBreakerSchema,
} from './model/circuit-breaker.model';
import { CircuitBreakersService } from './services/circuit-breakers.service';
import { CircuitBreakersController } from './controllers/circuit-breakers.controller';
import { DbTransactionsService } from './services/db-transactions.service';

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
