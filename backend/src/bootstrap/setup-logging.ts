import { INestApplication, Logger } from '@nestjs/common';

const logger = new Logger('HTTP');

const getDurationInMilliseconds = (start: [number, number]) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

export const setupLogging = (app: INestApplication) => {
  app.use((req, res, next) => {
    const { method, originalUrl } = req;
    const start = process.hrtime();

    res.on('finish', () => {
      const { statusCode } = res;
      const durationInMilliseconds = getDurationInMilliseconds(start);

      if (method === 'OPTIONS') {
        return;
      }

      logger.log(
        `${method} ${originalUrl} ${statusCode} ${durationInMilliseconds}ms`,
      );
    });

    next();
  });
};
