import { Controller, UseGuards, Query, Get } from '@nestjs/common';
import { JwtGuard } from '../../auth/guards/jwt.guard.js';
import { GetIdentitiesQuery, UserRoleEnum } from '@app/contracts';
import { RolesGuard } from '../../auth/guards/roles-guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { IdentitiesService } from '../services/identities.service.js';
import { UsersService } from '../../users/services/users.service.js';
import { IdentityMappers } from '../mappers/identity.mappers.js';

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
    return IdentityMappers.toDtosPaged(await this.identities.get(query));
  }
}
