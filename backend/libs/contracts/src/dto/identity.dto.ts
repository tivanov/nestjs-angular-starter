import { BaseEntityDto } from './base-entity.dto';
import { IdNameDto } from './id-name.dto';

export interface IdentityDto extends BaseEntityDto {
  uid: string;
  user: string | IdNameDto;
  userName: string;
  provider: string;
  version: number;
  expirationDate: string;
}
