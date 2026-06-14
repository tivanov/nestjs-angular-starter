import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { MeController } from './controllers/me.controller';

@Module({
  imports: [forwardRef(() => UsersModule), forwardRef(() => AuthModule)],
  providers: [],
  controllers: [MeController],
  exports: [],
})
export class MeModule {}
