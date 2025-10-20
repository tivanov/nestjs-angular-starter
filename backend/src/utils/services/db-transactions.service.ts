import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DbTransactionsService {
  constructor(@InjectConnection() private readonly conn: Connection) {}

  public async exec<T>(fn: (session: ClientSession) => T): Promise<T> {
    const session = await this.conn.startSession();
    let res: T | null = null;
    try {
      session.startTransaction();
      res = await fn(session);
      await session.commitTransaction();
      return res;
    } catch (e) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      throw e;
    } finally {
      session.endSession();
    }
  }
}
