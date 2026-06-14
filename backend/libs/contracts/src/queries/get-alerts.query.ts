import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ShapeableQuery } from './shapeable-query';
import { AlertTypeEnum } from '../enums';

export class GetAlertsQuery extends ShapeableQuery {
  @IsOptional()
  @IsEnum(AlertTypeEnum)
  type?: AlertTypeEnum;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isRead?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  unreadOnly?: boolean;
}
