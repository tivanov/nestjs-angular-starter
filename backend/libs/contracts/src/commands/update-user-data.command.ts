import {
  MaxLength,
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
} from 'class-validator';

export class UpdateUserDataCommand {
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

  @IsOptional()
  @IsEmail()
  email?: string;

  @MaxLength(1000)
  @IsString()
  @IsOptional()
  address?: string;

  @IsOptional()
  @MaxLength(200)
  phone?: string;

  @IsOptional()
  @MaxLength(10)
  @MinLength(2)
  country?: string;
}
