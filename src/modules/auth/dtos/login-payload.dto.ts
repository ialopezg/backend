import { UserDto } from './facebook-account.dto';
import { TokenDto } from '../../token/dtos';

export class LoginPayloadDto {
  readonly user: UserDto;

  readonly token: TokenDto;

  constructor(user: UserDto, token: TokenDto) {
    this.user = user;
    this.token = token;
  }
}
