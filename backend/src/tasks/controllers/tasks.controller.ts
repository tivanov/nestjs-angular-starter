import { TaskMappers } from '../mappers/task.mappers';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Roles } from 'src/auth/decorators/roles.decorator';
import {
  CreateTaskCommand,
  GetTasksQuery,
  UpdateTaskCommand,
  UserRoleEnum,
} from '@app/contracts';
import { RolesGuard } from 'src/auth/guards/roles-guard';

@Controller('tasks')
@Roles(UserRoleEnum.Admin)
@UseGuards(JwtGuard, RolesGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  @Post()
  async create(@Body() command: CreateTaskCommand) {
    return TaskMappers.toDto(await this.tasksService.create(command));
  }

  @Get()
  async findAll(@Query() query: GetTasksQuery) {
    return TaskMappers.toDtosPaged(await this.tasksService.get(query));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return TaskMappers.toDto(await this.tasksService.getByIdLean(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() command: UpdateTaskCommand) {
    return TaskMappers.toDto(await this.tasksService.update(id, command));
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return TaskMappers.toDto(await this.tasksService.delete(id));
  }

  @Post(':id/start')
  async start(@Param('id') id: string) {
    await this.tasksService.start(id);
  }

  @Post(':id/stop')
  async stop(@Param('id') id: string) {
    await this.tasksService.stop(id);
  }

  @Get(':id/status')
  @Roles(UserRoleEnum.Admin, UserRoleEnum.Manager)
  async getStatus(@Param('id') id: string) {
    const task = await this.tasksService.expectEntityExists(id);
    return {
      isFinished: task.runOnce && !task.active && !!task.lastRun,
    };
  }
}
