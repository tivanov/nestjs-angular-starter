import { IsOptional, MaxLength } from 'class-validator';

export class CreateUserSettingsCommand {
  @IsOptional()
  @MaxLength(10)
  currencyCode?: string;

  @IsOptional()
  @MaxLength(10)
  language?: string;

  @IsOptional()
  @MaxLength(10)
  theme?: string;
}
