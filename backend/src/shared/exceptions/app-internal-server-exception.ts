import { InternalServerErrorException } from '@nestjs/common';
import { ErrorCode } from '@app/contracts';

export class AppInternalServerErrorException extends InternalServerErrorException {
  constructor(
    code: string = ErrorCode.INTERNAL_SERVER_ERROR,
    message: string = null,
  ) {
    super({ code, message });
  }
}
