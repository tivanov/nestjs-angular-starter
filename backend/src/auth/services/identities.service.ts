import { Injectable } from '@nestjs/common';
import { BaseService } from '../../shared/base/base-service';
import { Model, PaginateModel, QueryFilter } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Identity, IdentityDocument } from '../model/identity.model';
import { GetIdentitiesQuery, IdentityProviderEnum } from '@app/contracts';

@Injectable()
export class IdentitiesService extends BaseService<Identity> {
  constructor(@InjectModel(Identity.name) model: Model<Identity>) {
    super(model);
  }

  async get(query: GetIdentitiesQuery) {
    const filter: QueryFilter<IdentityDocument> = {};

    if (query.uid) {
      filter.uid = query.uid;
    }

    if (query.userId) {
      filter.user = query.userId;
    }

    if (query.provider) {
      filter.provider = query.provider;
    }

    return await (this.objectModel as PaginateModel<IdentityDocument>).paginate(
      filter,
      this.getPaginationOptions(query),
    );
  }

  getByUid(uid: string, provider: IdentityProviderEnum) {
    return this.objectModel
      .findOne({
        uid,
        provider,
      })
      .lean();
  }

  getByUserId(userId: string, provider: IdentityProviderEnum) {
    return this.objectModel
      .findOne({
        user: userId,
        provider,
      })
      .lean();
  }

  getByUserIds(userIds: string[], provider: IdentityProviderEnum) {
    return this.objectModel
      .find({
        user: { $in: userIds },
        provider,
      })
      .lean();
  }

  getValid(
    userId: string,
    provider: IdentityProviderEnum,
    version?: number,
  ): Promise<Identity> {
    const query: QueryFilter<IdentityDocument> = {
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
