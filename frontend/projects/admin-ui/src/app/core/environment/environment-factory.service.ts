import { EnvironmentService } from 'common-ui';
import { environment } from '../../../environments/environment';

export const EnvironmentFactoryService = () => {
  const env = new EnvironmentService();

  env.apiUrl = environment.apiUrl;

  return env;
}

export const EnvironmentServiceProvider = {
  provide: EnvironmentService,
  useFactory: EnvironmentFactoryService,
  deps: []
}
