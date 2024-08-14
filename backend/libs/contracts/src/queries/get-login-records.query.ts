import { IsDateString, IsMongoId, IsOptional } from 'class-validator';
import { ShapeableQuery } from './shapeable-query';

export class GetLoginRecordsQuery extends ShapeableQuery {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
