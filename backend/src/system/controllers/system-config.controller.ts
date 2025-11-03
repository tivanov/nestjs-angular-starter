import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { SystemConfigService } from '../services/system-config.service';
import { UserRoleEnum } from '@app/contracts';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { SystemConfigMappers } from '../mappers/system-config.mappers';

@Controller('system-config')
@Roles(UserRoleEnum.Admin)
@UseGuards(JwtGuard, RolesGuard)
export class SystemConfigController {
  constructor(private readonly systemConfig: SystemConfigService) {}

  @Get()
  async get() {
    const result = await this.systemConfig.get();
    return SystemConfigMappers.toDto(result);
  }
}
