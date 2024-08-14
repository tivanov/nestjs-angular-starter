import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class UpdateTaskCommand {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @MaxLength(8000)
  params?: string;

  @IsOptional()
  @MaxLength(10000)
  script?: string;

  @IsNotEmpty()
  @MaxLength(100)
  cronString: string;

  @IsOptional()
  runImmediately?: boolean;
}
