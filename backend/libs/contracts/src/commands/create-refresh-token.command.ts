export class CreateRefreshTokenCommand {
  token: string;
  isRevoked?: boolean;
  expires: Date;
  ip: string;
  browser: string;
  country: string;
  user: string;
  identity: string;
}
