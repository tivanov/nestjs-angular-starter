import { Controller, UseGuards, Query, Get } from '@nestjs/common';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { GetIdentitiesQuery, UserRoleEnum } from '@app/contracts';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { IdentitiesService } from '../services/identities.service';
import { UsersService } from 'src/users/services/users.service';
import { AuthMappers } from '../mappers';

@Controller('identities')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRoleEnum.Admin)
export class IdentitiesController {
  constructor(
    private readonly users: UsersService,
    private readonly identities: IdentitiesService,
  ) {}

  @Get()
  public async get(@Query() query: GetIdentitiesQuery) {
    return AuthMappers.identitiesToDtoPaged(await this.identities.get(query));
  }
}
