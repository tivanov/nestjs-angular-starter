import { IsEnum, IsOptional } from 'class-validator';
import { ShapeableQuery } from './shapeable-query';
import { AlertTypeEnum } from '../enums';

export class GetAlertsQuery extends ShapeableQuery {
  @IsOptional()
  @IsEnum(AlertTypeEnum)
  type?: AlertTypeEnum;

  @IsOptional()
  isRead?: boolean;

  @IsOptional()
  unreadOnly?: boolean;
}
