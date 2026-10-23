import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module.js';
import { UsersModule } from 'src/users/users.module.js';
import { MeController } from './controllers/me.controller.js';

@Module({
  imports: [forwardRef(() => UsersModule), forwardRef(() => AuthModule)],
  providers: [],
  controllers: [MeController],
  exports: [],
})
export class MeModule {}
