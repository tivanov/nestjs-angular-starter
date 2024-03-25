import { IConfig } from './model';

const config: IConfig = {
  app: {
    isProduction: false,
    enableCors: true,
    corsOrigins: ['http://localhost:5100', 'http://localhost:5200'],
    port: 8200,
  },
  db: {
    mongoUri: 'mongodb://localhost/nest-angular-starter',
  },
  auth: {
    jwtSecret: 'YOURJWTSECRETCHANGEIT55',
    encryptJwtSecret: 'YOURJWTENCRIPTINGPASSCHANGEIT55',
    jwtExpirationTime: 1800000,

    jwtRefreshSecret: 'YOURJWTSECRETCHANGEIT',
    encryptJwtRefreshSecret: 'YOURJWTENCRIPTINGPASSCHANGEIT',
    jwtRefreshExpirationTime: 604800000,
    userBlockTime: 86400000,
    loginAttempts: 10,
  },
};

export default config;
