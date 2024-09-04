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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { UserMappers } from '../mappers';
import {
  CreateUserCommand,
  ErrorCode,
  GetUsersQuery,
  UpdateUserDataCommand,
  UpdateUserPasswordCommand,
  UserRoleEnum,
} from '@app/contracts';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppBadRequestException } from 'src/shared/exceptions/app-bad-request-exception';
import { join } from 'path';
import * as fs from 'fs/promises';
import { IAppConfig } from 'config/model';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';

@Controller('users')
export class UsersController {
  private readonly appConfig: IAppConfig;
  constructor(
    config: ConfigService,
    private usersService: UsersService,
  ) {
    this.appConfig = config.get('app');
  }

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
    return UserMappers.userToDto(await this.usersService.deleteUser(userId));
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

  @Put(':id/avatar')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRoleEnum.Admin)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 2 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    const user = await this.usersService.expectEntityExists(
      id,
      ErrorCode.USER_NOT_FOUND,
    );

    const savePath = join(this.appConfig.uploadsDir, 'avatars');
    const fileFullPath = join(savePath, `${user._id}.webp`);
    const frontendPath = join('/uploads/avatars', `${user._id}.webp`);
    await fs.mkdir(savePath, { recursive: true });
    const compressedImageBuffer = await sharp(file.buffer)
      .webp({ quality: 75 })
      .toBuffer();
    await fs.writeFile(fileFullPath, compressedImageBuffer);

    await this.usersService.updateAvatar(id, frontendPath);
  }
}
