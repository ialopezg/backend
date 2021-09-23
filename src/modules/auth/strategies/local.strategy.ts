import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from 'modules/auth/services';
import { UserEntity } from 'modules/user/entities';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly _authService: AuthService) {
    super({ usernameField: 'identifier', passwordField: 'password' });
  }

  public async validate(
    identifier: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this._authService.validateUser({
      identifier,
      password,
    });
    console.log(user);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
