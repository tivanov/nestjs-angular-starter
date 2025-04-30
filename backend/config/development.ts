import { join } from 'path';
import { IConfig } from './model';

const config: IConfig = {
  app: {
    isProduction: false,
    enableCors: true,
    corsOrigins: ['http://localhost:5100', 'http://localhost:5200'],
    port: 8200,
    enableTasks: true,
    uploadsDir: join(process.cwd(), '/uploads'),
  },
  db: {
    mongoUri: 'mongodb://localhost/nest-angular-starter',
  },
  auth: {
    jwtSecret: 'YOURJWTSECRETCHANGEIT55',
    jwtExpirationTime: '30m',
    jwtRefreshSecret: 'YOURJWTSECRETCHANGEIT',
    jwtRefreshExpirationTime: '7d',
    userBlockTime: 86400000,
    loginAttempts: 10,
  },
};

export default config;
