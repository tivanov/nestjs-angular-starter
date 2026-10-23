import { UserRoleEnum } from '../enums/index.js';
import { BaseEntityDto } from './base-entity.dto.js';
import { UserSettingsDto } from './user-settings.dto.js';

export interface UserDto extends BaseEntityDto {
  avatar?: string;
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
