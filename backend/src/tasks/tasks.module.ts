import { Module, forwardRef } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { Task, TaskSchema } from './model/task.model';
import { TaskLog, TaskLogSchema } from './model/task-log.model';
import { TaskLogsController } from './controllers/task-logs.controller';
import { TaskLogsService } from './services/task-logs.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksRuntimeService } from './services/tasks-runtime.service';

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
