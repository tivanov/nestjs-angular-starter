import { BaseEntityDto } from './base-entity.dto.js';
import { IdNameDto } from './id-name.dto.js';

export interface LoginRecordDto extends BaseEntityDto {
  ip: string;
  countryCode?: string;
  countryName?: string;
  regionName?: string;
  cityName?: string;
  clientType?: string;
  clientName?: string;
  osName?: string;
  deviceType?: string;
  deviceName?: string;
  isBot?: boolean;
  user: string | IdNameDto;
}
