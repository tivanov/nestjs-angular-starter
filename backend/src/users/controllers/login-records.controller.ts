import { Controller, UseGuards, Query, Get } from '@nestjs/common';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { GetLoginRecordsQuery, UserRoleEnum } from '@app/contracts';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserMappers } from '../mappers';
import { LoginRecordsService } from '../services/login-records.service';

@Controller('login-records')
export class LoginRecordsController {
  constructor(private readonly loginRecordsService: LoginRecordsService) {}

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoleEnum.Admin)
  public async get(@Query() query: GetLoginRecordsQuery) {
    return UserMappers.loginRecordsToDtoPaginated(
      await this.loginRecordsService.get(query),
    );
  }
}
