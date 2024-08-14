import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { TaskTypeEnum } from '../enums';

export class CreateTaskCommand {
  @IsOptional()
  active: boolean;

  @IsNotEmpty()
  type: TaskTypeEnum;

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
