import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CircuitBreakersService } from '../services/circuit-breakers.service.js';
import { GetCircuitBreakersQuery, UserRoleEnum } from '@app/contracts';
import { Roles } from 'src/auth/decorators/roles.decorator.js';
import { JwtGuard } from 'src/auth/guards/jwt.guard.js';
import { RolesGuard } from 'src/auth/guards/roles-guard.js';
import { CircuitBreakerMappers } from '../mappers/circuit-breaker.mappers.js';

@Controller('circuit-breakers')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRoleEnum.Admin)
export class CircuitBreakersController {
  constructor(
    private readonly circuitBreakersService: CircuitBreakersService,
  ) {}

  @Get()
  async get(@Query() query: GetCircuitBreakersQuery) {
    return CircuitBreakerMappers.toDtosPaged(
      await this.circuitBreakersService.get(query),
    );
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return CircuitBreakerMappers.toDto(
      await this.circuitBreakersService.expectEntityExists(id),
    );
  }

  @Post(':id/reset')
  async reset(@Param('id') id: string) {
    const circuitBreaker =
      await this.circuitBreakersService.expectEntityExists(id);
    await this.circuitBreakersService.reset(
      circuitBreaker.operation,
      circuitBreaker.resourceId,
    );
  }
}
