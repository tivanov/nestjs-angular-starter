import { MaxLength, IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateUserDataCommand {
  @MaxLength(200)
  @IsString()
  @IsOptional()
  firstName?: string;

  @MaxLength(200)
  @IsString()
  @IsOptional()
  lastName?: string;

  @MaxLength(300)
  @IsString()
  @IsOptional()
  displayName?: string;

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
}
