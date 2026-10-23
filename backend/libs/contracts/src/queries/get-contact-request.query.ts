import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ShapeableQuery } from './shapeable-query.js';
import { ContactRequestStatusEnum, ContactTypeEnum } from '../enums/index.js';

export class GetContactRequestQuery extends ShapeableQuery {
  @IsOptional()
  @IsEnum(ContactRequestStatusEnum)
  status?: ContactRequestStatusEnum;

  @IsOptional()
  @IsEnum(ContactTypeEnum)
  type?: ContactTypeEnum;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
