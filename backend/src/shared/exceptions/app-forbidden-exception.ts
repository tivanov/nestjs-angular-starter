import { ForbiddenException } from '@nestjs/common';

export class AppForbiddenException extends ForbiddenException {
  constructor(code: string, message: string = null) {
    super({ code, message });
  }
}
