import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ContactTypeEnum } from '../enums';

export class ContactRequestCommand {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsEnum(ContactTypeEnum)
  type: ContactTypeEnum;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MaxLength(100)
  company?: string;

  @IsNotEmpty()
  @MinLength(50)
  @MaxLength(5000)
  message: string;

  @IsNotEmpty()
  @MaxLength(2048)
  token: string;
}
