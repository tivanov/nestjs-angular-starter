export interface IAppConfig {
  isProduction: boolean;
  enableCors: boolean;
  corsOrigins?: string[];
  port?: number;
  enableSwagger?: boolean;
}

export interface IEnvironmentConfig {
  production: boolean;
}

export interface IDbConfig {
  mongoUri: string;
}

export interface IAuthConfig {
  jwtSecret: string;
  encryptJwtSecret: string;
  jwtExpirationTime: number;

  jwtRefreshSecret: string;
  encryptJwtRefreshSecret: string;
  jwtRefreshExpirationTime: number;
  userBlockTime: number;
  loginAttempts: number;
}

export interface IConfig {
  app: IAppConfig;
  db: IDbConfig;
  auth: IAuthConfig;
}
