import { ContactRequestStatusEnum, ContactTypeEnum } from '../enums/index.js';
import { BaseEntityDto } from './base-entity.dto.js';

export interface ContactRequestDto extends BaseEntityDto {
  type: ContactTypeEnum;
  status: ContactRequestStatusEnum;
  name: string;
  email: string;
  company?: string;
  message: string;
}
