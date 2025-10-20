import { ContactRequestStatusEnum, ContactTypeEnum } from '../enums';
import { BaseEntityDto } from './base-entity.dto';

export interface ContactRequestDto extends BaseEntityDto {
  type: ContactTypeEnum;
  status: ContactRequestStatusEnum;
  name: string;
  email: string;
  company?: string;
  message: string;
}
