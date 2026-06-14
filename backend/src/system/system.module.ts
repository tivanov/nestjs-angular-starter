import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { SystemConfig, SystemConfigSchema } from './model/system-config.model';
import { SystemConfigController } from './controllers/system-config.controller';
import { HealthController } from './controllers/health.controller';
import { SystemConfigService } from './services/system-config.service';

@Module({
  imports: [
    TerminusModule,
    MongooseModule.forFeature([
      { name: SystemConfig.name, schema: SystemConfigSchema },
    ]),
  ],
  providers: [SystemConfigService],
  controllers: [SystemConfigController, HealthController],
  exports: [SystemConfigService],
})
export class SystemModule {}
