import { registerAs } from '@nestjs/config';

let env = 'development';
if (process.env.NODE_ENV === 'production') {
  env = 'production';
} else if (process.env.NODE_ENV === 'stage') {
  env = 'stage';
}

const path = `./${env}`;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require(path).default;

const configsArray = [];
for (const key in config) {
  if (config.hasOwnProperty(key)) {
    configsArray.push(registerAs(key, () => config[key]));
  }
}

export default configsArray;
