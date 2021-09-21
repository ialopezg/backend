import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { WrongCredentialsProvidedException } from 'modules/auth/exceptions';
import { VerificationTokenPayload } from 'modules/auth/interfaces';
import { UserEntity } from 'modules/user/entities';
import { UserService } from 'modules/user/services';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtConfirmTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-confirm-token',
) {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get('JWT_VERIFICATION_TOKEN_SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  public async validate({
    email,
  }: VerificationTokenPayload): Promise<UserEntity> {
    console.log('validating', email);

    const user = await this._userService.findUser({ email });

    if (!user) {
      throw new WrongCredentialsProvidedException();
    }

    if (user.userAuth.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    return user;
  }
}
