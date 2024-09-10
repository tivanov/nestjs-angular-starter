import { IdentityProviderEnum } from '@app/contracts';

export interface TokenPayload {
  username: string;
  sub: string;
  role: string;
  version: number;
  provider: IdentityProviderEnum;
}
