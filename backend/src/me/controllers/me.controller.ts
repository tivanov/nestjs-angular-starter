import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { LoggedInUser } from 'src/shared/decorators/logged-in-user.decorator';
import { UserMappers } from 'src/users/mappers/user.mappers';
import { User } from 'src/users/model/user.model';
import { UsersService } from 'src/users/services/users.service';

@Controller('me')
@UseGuards(JwtGuard)
export class MeController {
  logger = new Logger(MeController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async get(@LoggedInUser() user: User) {
    const res = UserMappers.toDto(user);

    if (user.lastLogin) {
      const lastLogin = new Date(user.lastLogin);
      const now = new Date();

      if (now.getTime() - lastLogin.getTime() <= 60 * 60 * 1000) {
        return res;
      }
    }

    this.usersService
      .registerActivity(user._id.toString())
      .then(() => null)
      .catch((err) =>
        this.logger.error(
          'Error while registering login activity',
          err.stack,
          err,
        ),
      );

    return res;
  }
}
