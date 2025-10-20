import { ForbiddenException } from '@nestjs/common';
import { ErrorCode } from '@app/contracts';
export class AppForbiddenException extends ForbiddenException {
  constructor(code: string = ErrorCode.FORBIDDEN, message: string = null) {
    super({ code, message });
  }
}
