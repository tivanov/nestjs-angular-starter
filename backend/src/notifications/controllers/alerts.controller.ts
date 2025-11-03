import {
  Controller,
  UseGuards,
  Query,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { GetAlertsQuery, UserRoleEnum } from '@app/contracts';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AlertsService } from '../services/alerts.service';
import { AlertMappers } from '../mappers/alert.mappers';

@Controller('alerts')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRoleEnum.Admin)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  public async get(@Query() query: GetAlertsQuery) {
    return AlertMappers.toDtosPaged(await this.alertsService.get(query));
  }

  @Patch(':id/dismiss')
  public async dismiss(@Param('id') id: string) {
    return AlertMappers.toDto(await this.alertsService.dismiss(id));
  }

  @Patch('dismiss-all')
  public async dismissAll() {
    await this.alertsService.dismissAll();
  }
}
