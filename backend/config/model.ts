import { StringValue } from 'ms';

export interface IAppConfig {
  isProduction: boolean;
  enableCors: boolean;
  corsOrigins?: string[];
  port?: number;
  enableSwagger?: boolean;
  enableTasks?: boolean;
  uploadsDir: string;
}

export interface IEnvironmentConfig {
  production: boolean;
}

export interface IDbConfig {
  mongoUri: string;
}

export interface IAuthConfig {
  jwtSecret: string;
  jwtExpirationTime: number | StringValue;
  jwtRefreshSecret: string;
  jwtRefreshExpirationTime: number | StringValue;
  userBlockTime: number;
  loginAttempts: number;
  encryptionKey?: string;

  statePrivateKey?: string;
  statePublicKey?: string;
}

export interface IConfig {
  app: IAppConfig;
  db: IDbConfig;
  auth: IAuthConfig;
}
