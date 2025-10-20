import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, PaginateModel, PaginateResult } from 'mongoose';
import { BaseService } from '../../shared/base/base-service';
import {
  ContactRequestCommand,
  ContactRequestStatusEnum,
  GetContactRequestQuery,
} from '@app/contracts';
import { ContactRequest } from '../model/contact-request.model';

@Injectable()
export class ContactRequestService extends BaseService<ContactRequest> {
  constructor(
    @InjectModel(ContactRequest.name) model: PaginateModel<ContactRequest>,
  ) {
    super(model);
  }

  async get(
    query: GetContactRequestQuery,
  ): Promise<PaginateResult<ContactRequest>> {
    const filter: FilterQuery<ContactRequest> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.type) {
      filter.type = query.type;
    }

    if (query.startDate || query.endDate) {
      filter.createdAt = {};
      if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
      if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
    }

    return await (this.objectModel as PaginateModel<ContactRequest>).paginate(
      filter,
      this.getPaginationOptions(query),
    );
  }

  public async create(command: ContactRequestCommand): Promise<ContactRequest> {
    const entity = {
      ...command,
      status: ContactRequestStatusEnum.New,
    };

    return await this.baseCreate(entity);
  }

  public async markAsRead(id: string): Promise<ContactRequest> {
    return await this.baseUpdate(id, {
      status: ContactRequestStatusEnum.Read,
    });
  }
}
