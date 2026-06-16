import { ConfigService } from '@nestjs/config';
import { IAuthConfig, IAppConfig, IDbConfig } from 'config/model';
import { TEST_MONGO_URI } from '../constants';

const defaultAuthConfig: IAuthConfig = {
  jwtSecret: 'test-jwt-secret',
  jwtExpirationTime: '30m',
  jwtRefreshSecret: 'test-jwt-refresh-secret',
  jwtRefreshExpirationTime: '7d',
  userBlockTime: 86400000,
  loginAttempts: 10,
  encryptionKey: 'test-encryption-key-32-chars!!',
};

const defaultAppConfig: IAppConfig = {
  isProduction: false,
  enableCors: true,
  port: 8200,
  enableTasks: false,
  uploadsDir: '/tmp/nest-angular-starter-test-uploads',
};

const defaultDbConfig: IDbConfig = {
  mongoUri: TEST_MONGO_URI,
};

export function createMockConfigService(
  overrides: {
    auth?: Partial<IAuthConfig>;
    app?: Partial<IAppConfig>;
    db?: Partial<IDbConfig>;
  } = {},
): Pick<ConfigService, 'get'> {
  const auth = { ...defaultAuthConfig, ...overrides.auth };
  const app = { ...defaultAppConfig, ...overrides.app };
  const db = { ...defaultDbConfig, ...overrides.db };

  return {
    get: jest.fn((key: string) => {
      if (key === 'auth') return auth;
      if (key === 'app') return app;
      if (key === 'db') return db;
      return undefined;
    }),
  };
}
