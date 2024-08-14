import { BaseEntityDto } from './base-entity.dto';
import { UserDto } from './user.dto';

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
  user: string | UserDto;
}
