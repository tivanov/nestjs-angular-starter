import { registerAs } from '@nestjs/config';
import development from './development.js';
import production from './production.js';
import stage from './stage.js';
import test from './test.js';

const configs = {
  development,
  production,
  stage,
  test,
};

let env: keyof typeof configs = 'development';
if (process.env.NODE_ENV === 'production') {
  env = 'production';
} else if (process.env.NODE_ENV === 'stage') {
  env = 'stage';
} else if (process.env.NODE_ENV === 'test') {
  env = 'test';
}

const config = configs[env];

const configsArray = [];
for (const key in config) {
  if (config.hasOwnProperty(key)) {
    configsArray.push(registerAs(key, () => config[key]));
  }
}

export default configsArray;
