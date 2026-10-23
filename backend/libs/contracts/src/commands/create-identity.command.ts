import { IdentityProviderEnum } from '../enums/index.js';

export class CreateIdentityCommand {
  token?: string;
  secret?: string;
  refreshToken?: string;
  expirationDate: Date;
  provider: IdentityProviderEnum;
  uid: string;
  version: number;
  userName?: string;
  user: string;
}
