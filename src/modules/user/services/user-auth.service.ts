import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RoleType } from 'modules/auth/constants';
import { PostgresErrorCode } from 'modules/database/constraints';
import { UserAuthEntity, UserEntity } from 'modules/user/entities';
import {
  PinCodeGenerationErrorException,
  UserCreationException,
} from 'modules/user/exceptions';
import { UserAuthRepository } from 'modules/user/repositories';
import { UserService } from 'modules/user/services';
import { UpdateResult } from 'typeorm';
import { UtilsService } from 'utils/services';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly _userAuthRepository: UserAuthRepository,
    @Inject(forwardRef(() => UserService))
    private readonly _userService: UserService,
  ) {}

  public async createUserAuth(createdUser): Promise<UserAuthEntity[]> {
    const pinCode = await this._createPinCode();
    const auth = this._userAuthRepository.create({ ...createdUser, pinCode });

    try {
      return this._userAuthRepository.save(auth);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException('User with that email already exists');
      }

      throw new UserCreationException(error);
    }
  }

  public async findUserAuth(
    options: Partial<{ pinCode: number; role: RoleType }>,
  ): Promise<UserEntity | undefined> {
    return this._userService.findUser(options);
  }

  public async markEmailAsConfirmed(email: string): Promise<UpdateResult> {
    return this._userAuthRepository.update(
      { email },
      { isEmailConfirmed: true },
    );
  }

  public async updateRefreshToken(
    userAuthId: number,
    currentHashedRefreshToken: string,
  ): Promise<UpdateResult> {
    return this._userAuthRepository.update(userAuthId, {
      currentHashedRefreshToken,
    });
  }

  private async _createPinCode(): Promise<number> {
    const pinCode = this._generatePinCode();
    const user = await this.findUserAuth({ pinCode });

    try {
      return user ? await this._createPinCode() : pinCode;
    } catch (error) {
      throw new PinCodeGenerationErrorException(error);
    }
  }

  private _generatePinCode(): number {
    return UtilsService.generateRandomInteger(1, 10e5 - 1);
  }
}
