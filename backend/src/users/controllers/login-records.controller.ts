import { Controller, UseGuards, Query, Get } from '@nestjs/common';
import { JwtGuard } from '../../auth/guards/jwt.guard.js';
import { GetLoginRecordsQuery, UserRoleEnum } from '@app/contracts';
import { RolesGuard } from 'src/auth/guards/roles-guard.js';
import { Roles } from 'src/auth/decorators/roles.decorator.js';
import { LoginRecordsService } from '../services/login-records.service.js';
import { LoginRecordMappers } from '../mappers/login-record.mappers.js';

@Controller('login-records')
export class LoginRecordsController {
  constructor(private readonly loginRecordsService: LoginRecordsService) {}

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoleEnum.Admin)
  public async get(@Query() query: GetLoginRecordsQuery) {
    return LoginRecordMappers.toDtosPaged(
      await this.loginRecordsService.get(query),
    );
  }
}
