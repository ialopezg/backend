import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { RoleType } from 'common/constants';
import { UserAuthEntity, UserEntity } from 'modules/user/entities';
import {
  PinCodeGenerationErrorException,
  UserCreationException,
} from 'modules/user/exceptions';
import { UserAuthRepository } from 'modules/user/repositories';
import { UserService } from 'modules/user/services';
import { UpdateResult } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
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
      throw new UserCreationException(error);
    }
  }

  public async findUserAuth(
    options: Partial<{ pinCode: number; role: RoleType }>,
  ): Promise<UserEntity | undefined> {
    return this._userService.findUser(options);
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
