import { Module } from '@nestjs/common';
import { MeController } from './controllers/me.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [
    MeController,
  ],
  exports: [],
})
export class MeModule {}
