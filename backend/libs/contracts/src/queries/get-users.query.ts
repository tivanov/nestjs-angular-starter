import { UserRoleEnum } from '../enums';
import { ShapeableQuery } from './shapeable-query';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class GetUsersQuery extends ShapeableQuery {
  @IsOptional()
  @MaxLength(100)
  @MinLength(3)
  userName?: string;

  @IsOptional()
  @IsEnum(UserRoleEnum)
  role: string;

  @IsOptional()
  @MaxLength(200)
  searchQuery?: string;
}
