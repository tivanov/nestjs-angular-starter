import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { DashboardController } from './dashboard.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [forwardRef(() => UsersModule), forwardRef(() => AuthModule)],
  providers: [],
  controllers: [DashboardController],
  exports: [],
})
export class DashboardModule {}
