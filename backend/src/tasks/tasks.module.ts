import { Module, forwardRef } from '@nestjs/common';
import { TasksService } from './services/tasks.service.js';
import { TasksController } from './controllers/tasks.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module.js';
import { Task, TaskSchema } from './model/task.model.js';
import { TaskLog, TaskLogSchema } from './model/task-log.model.js';
import { TaskLogsController } from './controllers/task-logs.controller.js';
import { TaskLogsService } from './services/task-logs.service.js';
import { NotificationsModule } from 'src/notifications/notifications.module.js';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksRuntimeService } from './services/tasks-runtime.service.js';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    forwardRef(() => UsersModule),
    forwardRef(() => NotificationsModule),
    MongooseModule.forFeatureAsync([
      { name: Task.name, useFactory: () => TaskSchema },
      { name: TaskLog.name, useFactory: () => TaskLogSchema },
    ]),
  ],
  controllers: [TasksController, TaskLogsController],
  providers: [TasksService, TaskLogsService, TasksRuntimeService],
  exports: [TasksService],
})
export class TasksModule {}
