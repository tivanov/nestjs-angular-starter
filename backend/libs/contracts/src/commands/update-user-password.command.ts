import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserPasswordCommand {
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
