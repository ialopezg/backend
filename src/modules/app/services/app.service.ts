import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UserService } from 'modules/user/services';

@Injectable()
export class AppService {
  private readonly _logger: Logger = new Logger(AppService.name);

  constructor(private readonly _userService: UserService) {}

  async onModuleInit() {
    this._logger.log('AppService has been initialized.');

    try {
      let user = await this._userService.getUser({
        email: 'gailisisdawsons@gmail.com',
      });
      if (!user) {
        user = await this._userService.createUser({
          firstName: 'Gailisis',
          lastName: 'Dawsons',
          email: 'gailisisdawsons@gmail.com',
        });
      }
      console.log(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
