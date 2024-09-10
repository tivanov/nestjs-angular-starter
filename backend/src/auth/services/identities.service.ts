import { Injectable } from '@nestjs/common';
import { BaseService } from '../../shared/base/base-service';
import { FilterQuery, Model } from 'mongoose';
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

  getValid(
    userId: string,
    provider: string,
    version?: number,
  ): Promise<Identity> {
    const query: FilterQuery<IdentityDocument> = {
      user: userId,
      expirationDate: { $gte: new Date() },
      provider,
    };

    if (version) {
      query.version = version;
    }

    return this.objectModel.findOne(query).lean();
  }

  deleteForUser(userId: string) {
    return this.objectModel.deleteMany({ user: userId });
  }

  updateToken(id: string, token: string, refreshToken: string) {
    return this.objectModel.findByIdAndUpdate(id, {
      $set: {
        token,
        refreshToken,
      },
    });
  }

  updateSecret(id: string, secret: any, changeVersion: boolean) {
    const updCommand = {
      $set: {
        secret,
      },
    };
    if (changeVersion) {
      updCommand['$inc'] = { version: 1 };
    }
    return this.objectModel.findByIdAndUpdate(id, updCommand, {
      new: true,
      lean: true,
    });
  }
}
