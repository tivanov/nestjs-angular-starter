import { Injectable, Logger } from '@nestjs/common';

import { Mutex } from '../model/mutex.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppBadRequestException } from 'src/shared/exceptions/app-bad-request-exception';
import { ErrorCode } from '@app/contracts';
import { BaseService } from 'src/shared/base/base-service';

@Injectable()
export class MutexService extends BaseService<Mutex> {
  private readonly logger = new Logger(MutexService.name);

  /** Base TTL; extended by heartbeat while the holder is still running. */
  private readonly mutexLockTimeoutMs = 60_000;

  /** Renew well before TTL so slow work cannot outlive the lock. */
  private readonly mutexRenewIntervalMs = 20_000;

  constructor(@InjectModel(Mutex.name) mutexModel: Model<Mutex>) {
    super(mutexModel);
  }

  async execWithMutex<T>(resourceId: string, fn: () => Promise<T>): Promise<T> {
    const mutexId = new Types.ObjectId().toString();
    await this.lockMutex(resourceId, mutexId);

    const renewTimer = setInterval(() => {
      void this.renewLock(resourceId, mutexId);
    }, this.mutexRenewIntervalMs);

    try {
      return await fn();
    } finally {
      clearInterval(renewTimer);
      await this.unlockMutex(resourceId, mutexId);
    }
  }

  private lockExpiresAt(): Date {
    return new Date(Date.now() + this.mutexLockTimeoutMs);
  }

  private async lockMutex(resourceId: string, mutexId: string): Promise<void> {
    const expiresAt = this.lockExpiresAt();
    const now = new Date();

    const acquired = await this.objectModel.findOneAndUpdate(
      {
        resourceId,
        $or: [
          { lockExpiresAt: { $lte: now } },
          { lockExpiresAt: { $exists: false } },
        ],
      },
      {
        $set: {
          lockId: mutexId,
          lockExpiresAt: expiresAt,
        },
      },
      { new: true, lean: true },
    );

    if (acquired?.lockId === mutexId) {
      return;
    }

    const held = await this.objectModel
      .findOne({ resourceId, lockExpiresAt: { $gt: now } })
      .lean();

    if (held) {
      throw new AppBadRequestException(ErrorCode.MUTEX_LOCKED, 'Mutex locked');
    }

    try {
      await this.objectModel.create({
        resourceId,
        lockId: mutexId,
        lockExpiresAt: expiresAt,
      });
    } catch (error) {
      const mongoError = error as { code?: number };
      if (mongoError.code === 11000) {
        throw new AppBadRequestException(
          ErrorCode.MUTEX_LOCKED,
          'Mutex locked',
        );
      }
      throw error;
    }
  }

  private async renewLock(resourceId: string, mutexId: string): Promise<void> {
    const result = await this.objectModel.updateOne(
      { resourceId, lockId: mutexId },
      { $set: { lockExpiresAt: this.lockExpiresAt() } },
    );

    if (result.modifiedCount === 0) {
      this.logger.warn(
        `Failed to renew mutex for ${resourceId}; lock may have been lost`,
      );
    }
  }

  private unlockMutex(resourceId: string, mutexId: string) {
    return this.objectModel.deleteOne({
      resourceId,
      lockId: mutexId,
    });
  }
}
