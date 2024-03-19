import { IConfig } from './model';

const config: IConfig = {
  app: {
    isProduction: false,
    enableCors: true,
    corsOrigins: ['http://localhost:5002', 'http://localhost:5001'],
    port: 8200,
  },
  db: {
    mongoUri: 'mongodb://localhost/ib-wallet-dev',
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

    sessionCookieSecret: 'YOURSESSIONSECRETCHANGEIT',
    cookieMaxAge: 30 * 60 * 1000,
    sessionStoreDir: './sessions',
    sessionStoreDbName: 'sessions.db',
  },
};

export default config;
