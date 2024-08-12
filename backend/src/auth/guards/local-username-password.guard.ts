import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalUsernamePasswordAuthGuard extends AuthGuard(
  'local-username-password-strategy',
) {}
