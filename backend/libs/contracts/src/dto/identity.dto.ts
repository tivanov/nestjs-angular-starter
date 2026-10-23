import { BaseEntityDto } from './base-entity.dto.js';
import { IdNameDto } from './id-name.dto.js';

export interface IdentityDto extends BaseEntityDto {
  uid: string;
  user: string | IdNameDto;
  userName: string;
  provider: string;
  version: number;
  expirationDate: string;
}
