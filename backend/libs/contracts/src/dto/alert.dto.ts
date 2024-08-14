import { AlertTypeEnum } from '../enums/alert-type.enum';

export interface AlertDto {
  id: string;
  createdAt: string;
  type: AlertTypeEnum;
  message?: string;
  jsonData?: string;
  isRead?: boolean;
}
