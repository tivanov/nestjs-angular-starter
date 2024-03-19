import { BadRequestException } from '@nestjs/common';
export class AppBadRequestException extends BadRequestException {
  constructor(code: string, message: string = null) {
    super({ code, message });
  }
}
