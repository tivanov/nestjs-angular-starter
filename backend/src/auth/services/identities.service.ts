import { Injectable } from '@nestjs/common';
import { BaseService } from '../../shared/base/base-service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Identity, IdentityDocument } from '../model/identity.model';

@Injectable()
export class IdentitiesService extends BaseService<IdentityDocument> {
  constructor(@InjectModel(Identity.name) model: Model<IdentityDocument>) {
    super(model);
  }

  getByUid(uid: string, provider: string) {
    return this.objectModel
      .findOne({
        uid,
        provider,
      })
      .lean();
  }

  getByUserId(userId: string, provider: string) {
    return this.objectModel
      .findOne({
        user: userId,
        provider,
      })
      .lean();
  }

  getByUserIds(userIds: string[], provider: string) {
    return this.objectModel
      .find({
        user: { $in: userIds },
        provider,
      })
      .lean();
  }

  getValid(userId: string, provider: string): Promise<Identity> {
    return this.objectModel
      .findOne({
        user: userId,
        token: { $exists: true },
        refreshToken: { $exists: true },
        // expirationDate: { $gte: new Date() },
        provider,
      })
      .lean();
  }

  deleteForUser(userId: string) {
    return this.objectModel.deleteMany({ user: userId });
  }

  onTwitterTokenRefresh(id: string, token: string, refreshToken: string) {
    return this.objectModel.findByIdAndUpdate(id, {
      $set: {
        token,
        refreshToken,
      },
    });
  }
}
