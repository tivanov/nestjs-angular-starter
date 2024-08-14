import { UserRoleEnum } from '../enums';
import { BaseEntityDto } from './base-entity.dto';
import { UserSettingsDto } from './user-settings.dto';

export interface UserDto extends BaseEntityDto {
  firstName?: string;
  lastName?: string;
  userName?: string;
  role: UserRoleEnum;
  displayName?: string;
  email?: string;
  address?: string;
  phone?: string;
  country?: string;
  lastLogin?: string;
  creator?: UserDto | string;
  settings?: UserSettingsDto;
}
