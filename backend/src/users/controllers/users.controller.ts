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
  Req,
  Delete,
} from '@nestjs/common';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { UserMappers } from '../mappers';
import {
  CreateUserCommand,
  GetUsersQuery,
  UpdateUserDataCommand,
} from '@app/contracts';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  // od tuka ke kreirame useri preku admin
  public async create(
    @Req() req,
    @Body() createUserCommand: CreateUserCommand,
  ) {
    const createdUser = await this.usersService.create(createUserCommand);
    return UserMappers.userToDto(createdUser);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  public async update(
    @Req() req,
    @Param('id') userId: string,
    @Body() command: UpdateUserDataCommand,
  ) {
    return UserMappers.userToDto(
      await this.usersService.updateBasicData(userId, command),
    );
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  public async delete(@Param('id') userId: string) {
    return await this.usersService.deleteUser(userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  public async get(@Query() query: GetUsersQuery) {
    return UserMappers.usersToDtoPaginated(await this.usersService.get(query));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  public async getOne(@Param() params) {
    return UserMappers.userToDto(await this.usersService.getById(params.id));
  }
}
