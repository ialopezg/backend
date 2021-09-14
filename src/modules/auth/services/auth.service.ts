import { Injectable } from '@nestjs/common';
import { UserRegistrationDto, UserLoginDto } from 'modules/auth/dtos';
import { UserEntity } from 'modules/user/entities';
import { WrongCredentialsProvidedException } from 'modules/auth/exceptions';
import { UserNotFoundException } from 'modules/user/exceptions';
import { UserService } from 'modules/user/services';
import { UtilsService } from 'utils/services';

@Injectable()
export class AuthService {
  constructor(private readonly _userService: UserService) {}

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
      throw new UserNotFoundException();
    }

    const isPasswordValid = await this.validatePassword(
      password,
      user.userAuth.password,
    );

    if (!isPasswordValid) {
      throw new WrongCredentialsProvidedException();
    }

    return user;
  }

  public async validatePassword(
    hashedPassword: string,
    password: string,
  ): Promise<boolean> {
    const isPasswordValid = await UtilsService.validateHash(
      password,
      hashedPassword,
    );

    return isPasswordValid;
  }
}
