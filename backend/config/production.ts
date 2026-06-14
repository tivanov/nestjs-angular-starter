import { join } from 'path';
import { IConfig } from './model';

const config: IConfig = {
  app: {
    isProduction: true,
    enableCors: true,
    // Set your deployed admin-ui and user-ui origins before going live
    corsOrigins: [],
    port: 8200,
    enableTasks: true,
    uploadsDir: join(process.cwd(), '/uploads'),
  },
  db: {
    mongoUri: 'mongodb://localhost/nest-angular-starter-prod',
  },
  auth: {
    jwtSecret: 'YOURJWTSECRETCHANGEIT55',
    jwtExpirationTime: '30m',
    jwtRefreshSecret: 'YOURJWTSECRETCHANGEIT',
    jwtRefreshExpirationTime: '2h',
    userBlockTime: 86400000,
    loginAttempts: 10,
  },
};

export default config;
