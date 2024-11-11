import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class UpdateTaskCommand {
  @IsOptional()
  active?: boolean;

  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @MaxLength(8000)
  params?: string;

  @IsOptional()
  @MaxLength(10000)
  script?: string;

  @IsOptional()
  @MaxLength(100)
  cronString?: string;

  @IsOptional()
  runOnce?: boolean;

  @IsOptional()
  timeout?: number;

  @IsOptional()
  runImmediately?: boolean;
}
