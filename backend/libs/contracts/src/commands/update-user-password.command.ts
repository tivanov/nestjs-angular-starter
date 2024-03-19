import { IsNotEmpty } from 'class-validator';

export class UpdateUserPasswordCommand {
  userId?: string;

  @IsNotEmpty()
  oldPassword?: string;

  @IsNotEmpty()
  newPassword?: string;
}
