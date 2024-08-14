import { UserRoleEnum } from '@app/contracts';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { UsersService } from 'src/users/services/users.service';
import { LoginRecordsService } from 'src/users/services/login-records.service';

@Controller('dashboard')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRoleEnum.Admin, UserRoleEnum.Manager)
export class DashboardController {
  constructor(
    private readonly users: UsersService,
    private readonly loginRecords: LoginRecordsService,
  ) {}

  @Get('users-tiles')
  async getUsersTiles() {
    const results = await Promise.all([
      this.users.getRegularUsersCount(),
      this.users.getRegisteredTodayCount(),
      this.users.getInactiveUsersCount(),
    ]);

    return {
      totalUsers: results[0],
      newUsersToday: results[1],
      totalInactive: results[2],
    };
  }

  @Get('login-records-by-device')
  async getLoginRecords() {
    return this.loginRecords.weeklyByDeviceSummary();
  }

  @Get('login-records-by-country')
  async getLoginRecordsByCountry() {
    return this.loginRecords.weeklyByCountrySummary();
  }
}
