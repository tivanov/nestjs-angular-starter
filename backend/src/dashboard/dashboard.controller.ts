import {
  LoginRecordsSummaryDto,
  UsersTilesDto,
  UserRoleEnum,
} from '@app/contracts';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtGuard } from '../auth/guards/jwt.guard.js';
import { RolesGuard } from '../auth/guards/roles-guard.js';
import { UsersService } from '../users/services/users.service.js';
import { LoginRecordsService } from '../users/services/login-records.service.js';

@Controller('dashboard')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRoleEnum.Admin, UserRoleEnum.Manager)
export class DashboardController {
  constructor(
    private readonly users: UsersService,
    private readonly loginRecords: LoginRecordsService,
  ) {}

  @Get('users-tiles')
  async getUsersTiles(): Promise<UsersTilesDto> {
    const [totalUsers, newUsersToday, totalInactive] = await Promise.all([
      this.users.getRegularUsersCount(),
      this.users.getRegisteredTodayCount(),
      this.users.getInactiveUsersCount(),
    ]);

    return {
      totalUsers,
      newUsersToday,
      totalInactive,
    };
  }

  @Get('login-records-by-device')
  getLoginRecords(): Promise<LoginRecordsSummaryDto[]> {
    return this.loginRecords.weeklyByDeviceSummary();
  }

  @Get('login-records-by-country')
  getLoginRecordsByCountry(): Promise<LoginRecordsSummaryDto[]> {
    return this.loginRecords.weeklyByCountrySummary();
  }
}
