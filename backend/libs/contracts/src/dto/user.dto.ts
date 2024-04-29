import { UserRoleEnum } from '../enums';
import { UserSettingsDto } from './user-settings.dto';

export class UserDto {
  id?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  role: UserRoleEnum;
  displayName?: string;
  email?: string;
  address?: string;
  phone?: string;
  country?: string;
  creator?: UserDto | string;
  settings?: UserSettingsDto;
}
