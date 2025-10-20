import { Injectable } from '@nestjs/common';

import { Mutex } from '../model/mutex.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppBadRequestException } from 'src/shared/exceptions/app-bad-request-exception';
import { ErrorCode } from '@app/contracts';
import { BaseService } from 'src/shared/base/base-service';

@Injectable()
export class MutexService extends BaseService<Mutex> {
  private readonly mutexLockTimeout = 1000 * 60 * 1;

  constructor(@InjectModel(Mutex.name) mutexModel: Model<Mutex>) {
    super(mutexModel);
  }

  async execWithMutex<T>(resourceId: string, fn: () => Promise<T>) {
    const mutexId = new Types.ObjectId().toString();
    await this.lockMutex(resourceId, mutexId);
    try {
      return await fn();
    } finally {
      await this.unlockMutex(resourceId, mutexId);
    }
  }

  private async lockMutex(resourceId: string, mutexId: string) {
    const lock = await this.objectModel
      .findOne({
        resourceId,
      })
      .lean();

    if (lock) {
      if (lock.lockId !== mutexId && lock.lockExpiresAt > new Date()) {
        throw new AppBadRequestException(
          ErrorCode.MUTEX_LOCKED,
          'Mutex locked',
        );
      }

      await this.unlockMutex(resourceId, lock.lockId);
    }

    return await this.baseCreate({
      lockId: mutexId,
      lockExpiresAt: new Date(Date.now() + this.mutexLockTimeout),
      resourceId,
    });
  }

  private unlockMutex(resourceId: string, mutexId: string) {
    return this.objectModel.deleteOne({
      resourceId,
      lockId: mutexId,
    });
  }
}
