import { UnauthorizedException } from '@nestjs/common';
export class AppUnauthorizedException extends UnauthorizedException {
  constructor(code: string, message: string = null) {
    super({ code, message });
  }
}
