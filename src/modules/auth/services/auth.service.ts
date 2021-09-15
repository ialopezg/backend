import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRegistrationDto, UserLoginDto } from 'modules/auth/dtos';
import { UserEntity } from 'modules/user/entities';
import {
  RefreshTokenNotMatchingException,
  WrongCredentialsProvidedException,
} from 'modules/auth/exceptions';
import {
  TokenPayloadInterface,
  VerificationTokenPayload,
} from 'modules/auth/interfaces';
import { MailService } from 'modules/mail/services';
import { UserAuthService, UserService } from 'modules/user/services';
import { validateHash } from 'utils/hash.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly _userAuthService: UserAuthService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
    private readonly _mailService: MailService,
  ) {}

  public async register(
    userRegistrationDto: UserRegistrationDto,
  ): Promise<UserEntity> {
    const user = await this._userService.createUser(userRegistrationDto);

    return user;
  }

  public async login(user: UserEntity): Promise<string[]> {
    const accessTokenCookie = this._getCookieWithJwtToken(user.uuid);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this._getCookieWithJwtRefreshToken(user.uuid);

    await this._userAuthService.updateRefreshToken(
      user.userAuth.id,
      refreshToken,
    );

    return [accessTokenCookie, refreshTokenCookie];
  }

  public async logout(user: UserEntity): Promise<void> {
    await this._userAuthService.updateRefreshToken(user.userAuth.id, null);
  }

  public async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const { identifier, password } = userLoginDto;
    const user = await this._userService.findUser({
      pinCode: +identifier,
      email: identifier,
      uuid: identifier,
    });

    if (!user) {
      throw new WrongCredentialsProvidedException();
    }

    const isPasswordValid = await validateHash(
      password,
      user.userAuth.password,
    );

    if (!isPasswordValid) {
      throw new WrongCredentialsProvidedException();
    }

    return user;
  }

  public refreshToken(user: UserEntity): string {
    return this._getCookieWithJwtToken(user.uuid);
  }

  public getCookiesForLogout(): string[] {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  public async getUserIfRefreshTokenMatches(
    refreahToken: string,
    user: UserEntity,
  ): Promise<UserEntity> {
    const isRefreshTokenMatching = await validateHash(
      refreahToken,
      user.userAuth.currentHashedRefreshToken,
    );

    if (!isRefreshTokenMatching) {
      throw new RefreshTokenNotMatchingException();
    }

    return user;
  }

  public getJwtConfirmToken(email: string): string {
    const payload: VerificationTokenPayload = { email };
    const token = this._jwtService.sign(payload, {
      secret: this._configService.get('JWT_VERIFICATION_TOKEN_SECRET_KEY'),
      expiresIn: `${this._configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    return token;
  }

  public async resendConfirmationLink(uuid: string): Promise<void> {
    const user = await this._userService.getUser(uuid);

    if (user.userAuth.active) {
      throw new BadRequestException('Email already confirmed');
    }

    await this._mailService.sendConfirmationEmail(user);
  }

  public async confirm(token: string) {
    const email = await this._decodeConfirmationToken(token);

    return this._confirmEmail(email);
  }

  private _getCookieWithJwtToken(uuid: string): string {
    const payload: TokenPayloadInterface = { uuid };
    const token = this._jwtService.sign(payload, {
      secret: this._configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
      expiresIn: `${this._configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this._configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`;
  }

  private _getCookieWithJwtRefreshToken(uuid: string) {
    const payload: TokenPayloadInterface = { uuid };
    const token = this._jwtService.sign(payload, {
      secret: this._configService.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: `${this._configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this._configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;

    return { cookie, token };
  }

  private async _decodeConfirmationToken(token: string): Promise<string> {
    try {
      const payload = await this._jwtService.verify(token, {
        secret: this._configService.get('JWT_VERIFICATION_TOKEN_SECRET_KEY'),
      });

      if (typeof payload === 'object' && 'userAuth' in payload) {
        return payload.userAuth.email;
      }

      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }

      throw new BadRequestException('Bad confirmation token');
    }
  }

  private async _confirmEmail(email: string): Promise<void> {
    const user = await this._userService.findUser({ email });

    if (user.userAuth.active) {
      throw new BadRequestException('Email already confirmed');
    }

    await this._userAuthService.markEmailAsConfirmed(email);
  }
}
