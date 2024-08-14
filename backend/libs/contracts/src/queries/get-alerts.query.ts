import { IsOptional } from 'class-validator';
import { ShapeableQuery } from './shapeable-query';

export class GetAlertsQuery extends ShapeableQuery {
  @IsOptional()
  isRead?: boolean;

  @IsOptional()
  unreadOnly?: boolean;
}
