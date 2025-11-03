import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemConfig, SystemConfigSchema } from './model/system-config.model';
import { SystemConfigController } from './controllers/system-config.controller';
import { SystemConfigService } from './services/system-config.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SystemConfig.name, schema: SystemConfigSchema },
    ]),
  ],
  providers: [SystemConfigService],
  controllers: [SystemConfigController],
  exports: [SystemConfigService],
})
export class SystemModule {}
