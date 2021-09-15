import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRegistrationDto, UserLoginDto } from 'modules/auth/dtos';
import { UserEntity } from 'modules/user/entities';
import { WrongCredentialsProvidedException } from 'modules/auth/exceptions';
import { TokenPayloadInterface } from 'modules/auth/interfaces';
import { UserService } from 'modules/user/services';
import { validateHash } from 'utils/hash.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) {}

  public getCookieWithJwtToken(uuid: string): string {
    const payload: TokenPayloadInterface = { uuid };
    const token = this._jwtService.sign(payload);

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this._configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`;
  }

  public getCookieForLogout(): string {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  public async register(
    userRegistrationDto: UserRegistrationDto,
  ): Promise<UserEntity> {
    const user = await this._userService.createUser(userRegistrationDto);

    return user;
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
}
