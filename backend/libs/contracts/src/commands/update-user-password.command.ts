import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class UpdateUserPasswordCommand {
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  logOutEverywhere?: boolean;
}
