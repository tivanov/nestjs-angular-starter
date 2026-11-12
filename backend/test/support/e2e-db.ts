import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';

export async function clearDatabase(app: INestApplication): Promise<void> {
  const connection = app.get<Connection>(getConnectionToken());
  const collections = connection.collections;

  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
}
