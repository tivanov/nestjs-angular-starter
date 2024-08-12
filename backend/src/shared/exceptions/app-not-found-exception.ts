import { NotFoundException } from '@nestjs/common';
export class AppNotFoundException extends NotFoundException {
  constructor(code: string, message: string = null) {
    super({ code, message });
  }
}
