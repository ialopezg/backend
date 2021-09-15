import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { TokenPayloadInterface } from 'modules/auth/interfaces';
import { UserEntity } from 'modules/user/entities';
import { UserService } from 'modules/user/services';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: _configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
    });
  }

  public async validate({ uuid }: TokenPayloadInterface): Promise<UserEntity> {
    return this._userService.getUser(uuid);
  }
}
