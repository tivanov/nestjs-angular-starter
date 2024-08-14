import { EnvironmentService } from '../../../../../common-ui/services/environment.service';

export const EnvironmentFactoryService = () => {
  const env = new EnvironmentService();

  const browserWindow = window || {};
  const browserWindowEnv = browserWindow['__env'] || {};

  for (const key in browserWindowEnv) {
    if (Object.prototype.hasOwnProperty.call(browserWindowEnv, key)) {
      env[key] = window['__env'][key];
    }
  }

  return env;
};

export const EnvironmentServiceProvider = {
  provide: EnvironmentService,
  useFactory: EnvironmentFactoryService,
  deps: [],
};
