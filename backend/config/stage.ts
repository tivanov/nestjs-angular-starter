import { join } from 'path';
import { IConfig } from './model';

const config: IConfig = {
  app: {
    isProduction: false,
    enableCors: true,
    corsOrigins: ['http://localhost:5100', 'http://localhost:5200'],
    port: 8200,
    uploadsDir: join(process.cwd(), '/uploads'),
  },
  db: {
    mongoUri: 'mongodb://localhost/nest-angular-starter-stage',
  },
  auth: {
    jwtSecret: 'YOURJWTSECRETCHANGEIT55',
    encryptJwtSecret: 'YOURJWTENCRIPTINGPASSCHANGEIT55',
    jwtExpirationTime: '30m',

    jwtRefreshSecret: 'YOURJWTSECRETCHANGEIT',
    encryptJwtRefreshSecret: 'YOURJWTENCRIPTINGPASSCHANGEIT',
    jwtRefreshExpirationTime: '2h',
    userBlockTime: 86400000,
    loginAttempts: 10,
  },
};

export default config;
