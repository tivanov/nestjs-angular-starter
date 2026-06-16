import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { execSync } from 'child_process';
import { resolve } from 'path';

export async function clearDatabase(app: INestApplication): Promise<void> {
  const connection = app.get<Connection>(getConnectionToken());
  const collections = connection.collections;

  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
}

export async function seedFullDatabase(app: INestApplication): Promise<void> {
  const backendRoot = resolve(__dirname, '../..');
  execSync('npm run init-db:test', {
    cwd: backendRoot,
    stdio: 'inherit',
  });
}
