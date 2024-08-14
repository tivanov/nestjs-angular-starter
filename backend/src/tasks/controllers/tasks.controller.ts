import { TasksMappers } from './../mappers';
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
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() command: CreateTaskCommand) {
    return TasksMappers.taskToDto(await this.tasksService.create(command));
  }

  @Get()
  async findAll(@Query() query: GetTasksQuery) {
    return TasksMappers.tasksToDto(await this.tasksService.get(query));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return TasksMappers.taskToDto(await this.tasksService.getByIdLean(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() command: UpdateTaskCommand) {
    return TasksMappers.taskToDto(
      await this.tasksService.baseUpdate(id, command),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return TasksMappers.taskToDto(await this.tasksService.baseDelete(id));
  }

  @Post(':id/start')
  async start(@Param('id') id: string) {
    await this.tasksService.start(id);
  }

  @Post(':id/stop')
  async stop(@Param('id') id: string) {
    await this.tasksService.stop(id);
  }
}
