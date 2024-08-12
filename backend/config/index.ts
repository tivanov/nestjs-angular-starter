import { registerAs } from '@nestjs/config';
import developmentConfig from './development';
import { IConfig } from './model';
import productionConfig from './production';


let config: IConfig = developmentConfig;
if (process.env.NODE_ENV === 'production') {
  config = productionConfig;
}

const configsArray = [];
for (const key in config) {
  if (config.hasOwnProperty(key)) {
    configsArray.push(registerAs(key, () => (config[key])));
  }
}

export default configsArray;
