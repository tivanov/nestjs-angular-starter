import { UsersService } from '../services/users.service';
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Delete,
  Patch,
} from '@nestjs/common';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { UserMappers } from '../mappers';
import {
  CreateUserCommand,
  GetUsersQuery,
  UpdateUserDataCommand,
  UpdateUserPasswordCommand,
  UserRoleEnum,
} from '@app/contracts';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles-guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoleEnum.Admin)
  public async create(@Body() createUserCommand: CreateUserCommand) {
    const createdUser = await this.usersService.create(createUserCommand);
    return UserMappers.userToDto(createdUser);
  }

  @Put(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoleEnum.Admin)
  public async update(
    @Param('id') userId: string,
    @Body() command: UpdateUserDataCommand,
  ) {
    return UserMappers.userToDto(
      await this.usersService.updateBasicData(userId, command),
    );
  }

  @Patch(':id/password')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoleEnum.Admin)
  public async updatePassword(
    @Param('id') userId: string,
    @Body() command: UpdateUserPasswordCommand,
  ) {
    return UserMappers.userToDto(
      await this.usersService.updatePassword(userId, command),
    );
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoleEnum.Admin)
  public async delete(@Param('id') userId: string) {
    return await this.usersService.deleteUser(userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoleEnum.Admin)
  public async get(@Query() query: GetUsersQuery) {
    return UserMappers.usersToDtoPaginated(await this.usersService.get(query));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoleEnum.Admin)
  public async getOne(@Param('id') id: string) {
    return UserMappers.userToDto(await this.usersService.getById(id));
  }
}
