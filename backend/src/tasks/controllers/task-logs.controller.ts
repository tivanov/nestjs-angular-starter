import { GetTaskLogsQuery, UserRoleEnum } from '@app/contracts';
import { TaskLogsService } from '../services/task-logs.service';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { TasksMappers } from '../mappers';

@Controller('task-logs')
@Roles(UserRoleEnum.Admin)
@UseGuards(JwtGuard, RolesGuard)
export class TaskLogsController {
  constructor(private readonly taskLogsService: TaskLogsService) {}

  @Get()
  async findAll(@Query() query: GetTaskLogsQuery) {
    return TasksMappers.taskLogsToDtoPaged(
      await this.taskLogsService.get(query),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return TasksMappers.taskLogToDto(
      await this.taskLogsService.expectEntityExists(id),
    );
  }
}
