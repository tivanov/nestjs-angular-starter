import { Document, Types, Model, FilterQuery, ClientSession } from 'mongoose';
import { AppBadRequestException } from '../exceptions/app-bad-request-exception';
import { ErrorCode, ShapeableQuery } from '@app/contracts';

export class BaseService<T extends Document> {
  protected objectModel: Model<T>;

  constructor(objectModel: Model<T>) {
    this.objectModel = objectModel;
  }

  public async expectEntityNotExists(
    id: string,
    errorCode: string = null,
    session?: ClientSession,
  ) {
    if (!id) {
      this.throwBadRequest(errorCode);
    }

    const entity: T = await this.objectModel.findById(id).session(session);

    if (entity) {
      this.throwBadRequest(errorCode);
    }
  }

  public async expectEntityExists(
    id: string,
    errorCode: string = null,
    session?: ClientSession,
  ): Promise<T> {
    if (!id || id === undefined) {
      this.throwBadRequest(errorCode);
    }

    const entity: T = await this.objectModel
      .findById(id)
      .session(session)
      .lean();

    if (!entity) {
      this.throwBadRequest(errorCode);
    }

    return entity;
  }

  public async expectEntitiesExist(
    idsToCheck: string[],
    errorCode: string = null,
    session?: ClientSession,
  ): Promise<T[]> {
    if ((idsToCheck?.length ?? 0) === 0) {
      this.throwBadRequest(errorCode);
    }
    const entities = await this.objectModel
      .find({
        _id: { $in: idsToCheck },
      } as FilterQuery<T>)
      .session(session);

    if ((entities?.length ?? 0) !== idsToCheck.length) {
      this.throwBadRequest(errorCode);
    }

    return entities;
  }

  public async baseCreate(command: any, session?: ClientSession): Promise<T> {
    const newEntity = new this.objectModel(command);
    await newEntity.save({ session });
    return newEntity;
  }

  baseCreateMany(commands: Partial<T>[]) {
    return this.objectModel.insertMany(commands, { lean: true });
  }

  public async baseUpdate(id: string, command: any, session?: ClientSession) {
    return this.objectModel.findByIdAndUpdate(
      id,
      {
        $set: command,
      },
      { new: true, session, lean: true },
    );
  }

  public async bulkCreate(docs: any[], session?: ClientSession) {
    await this.objectModel.insertMany(docs, { session });
  }

  public async baseDelete(id: string, session?: ClientSession): Promise<T> {
    const entity = await this.expectEntityExists(id);
    await this.objectModel.findByIdAndDelete(id, { session });
    return entity;
  }

  public async getById(
    id: Types.ObjectId | string,
    session?: ClientSession,
    populate?: string,
  ): Promise<T> {
    if (!id || id === undefined) {
      return null;
    }

    const query = this.objectModel.findById(id).session(session);

    if (populate) {
      query.populate(populate);
    }

    return await query;
  }

  public async getByIdLean(
    id: Types.ObjectId | string,
    session?: ClientSession,
    populate?: string,
  ): Promise<T> {
    if (!id || id === undefined) {
      return null;
    }

    const query = this.objectModel.findById(id).session(session);

    if (populate) {
      query.populate(populate);
    }

    return await query.lean();
  }

  public async getByIds(
    ids: string[],
    session?: ClientSession,
    populate?: string,
  ): Promise<T[]> {
    const query = this.objectModel
      .find({
        _id: { $in: this.getStringsAsObjectIds(ids) },
      } as FilterQuery<T>)
      .session(session);

    if (populate) {
      query.populate(populate);
    }

    return await query;
  }

  public async getByIdsLean(
    ids: string[],
    session?: ClientSession,
    populate?: string,
  ): Promise<T[]> {
    const query = this.objectModel
      .find({
        _id: { $in: this.getStringsAsObjectIds(ids) },
      } as FilterQuery<T>)
      .session(session);

    if (populate) {
      query.populate(populate);
    }

    return await query.lean();
  }

  public throwBadRequest(errorCode: string = null) {
    throw new AppBadRequestException(errorCode || ErrorCode.OBJECT_NOT_FOUND);
  }

  protected getPopulateString(populate: string | string[]): string {
    if (typeof populate === 'string') {
      return populate;
    }
    return populate?.join(' ');
  }

  protected getProjectString(project: string | string[]): string {
    if (typeof project === 'string') {
      const projectStr = project as string;
      if (projectStr.includes(',')) {
        return projectStr.split(',').join(' ');
      }
      return project;
    }
    return project?.join(' ');
  }

  protected getStringsAsObjectIds(source: string[]): Types.ObjectId[] {
    return source?.map((src) => new Types.ObjectId(src));
  }

  protected setProject(queryObj: any, query: ShapeableQuery) {
    if (query.select?.length ?? null) {
      queryObj.projection(this.getProjectString(query.select));
    }
    return queryObj;
  }

  protected setPopulate(queryObj: any, query: ShapeableQuery) {
    if (query.include?.length ?? null) {
      queryObj.populate(this.getPopulateString(query.include));
    }

    return queryObj;
  }

  protected async existsInSession(
    filter: any,
    session?: ClientSession,
  ): Promise<boolean> {
    const obj = await this.objectModel.findOne(filter, '_id', { session });
    if (obj) {
      return true;
    }
    return false;
  }

  protected getPaginationOptions(query: any, session?: ClientSession) {
    const options: any = {
      page: query.page && parseInt(query.page),
      limit: query.limit && parseInt(query.limit),
      lean: true,
    };

    if (!options.page) {
      options.pagination = false;
    }

    if (query.include?.length ?? null) {
      options.populate = this.getPopulateString(query.include as string);
    }

    if (query.select?.length ?? null) {
      options.select = this.getProjectString(query.select as string);
    }

    if (session) {
      options.options.session = session;
    }

    if (query.sortBy && query.sortBy !== '') {
      let sortOptions = query.sortBy;

      if (query.sortDirection === 'desc') {
        sortOptions = '-' + sortOptions;
      }

      options.sort = sortOptions;
    }

    return options;
  }
}
