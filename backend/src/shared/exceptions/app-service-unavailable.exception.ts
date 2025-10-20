import { ServiceUnavailableException } from '@nestjs/common';

export class AppServiceUnavailableException extends ServiceUnavailableException {
  constructor(code: string, message: string = null) {
    super({ code, message });
  }
}
