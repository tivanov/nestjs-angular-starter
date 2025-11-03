import {
  Controller,
  UseGuards,
  Query,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { GetContactRequestQuery, UserRoleEnum } from '@app/contracts';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ContactRequestMappers } from '../mappers/contact-request.mappers';
import { ContactRequestService } from '../services/contact-request.service';

@Controller('contact-request')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRoleEnum.Admin)
export class ContactRequestController {
  constructor(private readonly contactRequest: ContactRequestService) {}

  @Get()
  public async get(@Query() query: GetContactRequestQuery) {
    return ContactRequestMappers.toDtosPaged(
      await this.contactRequest.get(query),
    );
  }

  @Get(':id')
  public async getOne(@Param('id') id) {
    return ContactRequestMappers.toDto(await this.contactRequest.getById(id));
  }

  @Patch(':id/mark-as-read')
  public async markAsRead(@Param('id') id: string) {
    return ContactRequestMappers.toDto(
      await this.contactRequest.markAsRead(id),
    );
  }
}
