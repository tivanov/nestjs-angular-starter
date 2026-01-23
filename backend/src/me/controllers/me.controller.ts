import { Controller, Logger, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('me')
@UseGuards(JwtGuard)
export class MeController {
  logger = new Logger(MeController.name);

  constructor() {}

}
