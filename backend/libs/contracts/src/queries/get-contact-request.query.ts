import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ShapeableQuery } from './shapeable-query';
import { ContactRequestStatusEnum, ContactTypeEnum } from '../enums';

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
