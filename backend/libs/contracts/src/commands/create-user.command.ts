import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateUserSettingsCommand } from './create-user-settings.command';
import { UserRoleEnum } from '../enums';

export class CreateUserCommand {
  @IsOptional()
  @MaxLength(1000)
  avatar?: string;

  @MaxLength(200)
  @IsString()
  @IsOptional()
  firstName?: string;

  @MaxLength(200)
  @IsString()
  @IsOptional()
  lastName?: string;

  @MaxLength(100)
  @MinLength(5)
  @IsString()
  @IsOptional()
  userName?: string;

  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MaxLength(200)
  phone?: string;

  @MaxLength(1000)
  @IsString()
  @IsOptional()
  address?: string;

  @IsNotEmpty()
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @IsOptional()
  @ValidateNested()
  settings?: CreateUserSettingsCommand;

  creator?: string;
}
