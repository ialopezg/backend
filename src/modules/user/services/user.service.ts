import { Injectable } from '@nestjs/common';
import { UserCreateDto } from 'modules/user/dtos';
import { UserEntity } from 'modules/user/entities';
import { UserRepository } from 'modules/user/repositories';
import { UserAuthService } from 'modules/user/services';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class UserService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _userAuthService: UserAuthService,
  ) {}

  @Transactional()
  public async createUser(userCreateDto: UserCreateDto): Promise<UserEntity> {
    const user = this._userRepository.create(userCreateDto);
    await this._userRepository.save(user);

    const createdUser = { ...userCreateDto, user };

    await Promise.all([this._userAuthService.createUserAuth(createdUser)]);
    console.log(createdUser);

    return this.findUser({ uuid: user.uuid });
  }

  public async findUser(
    options: Partial<{ uuid: string; email: string; pinCode: number }>,
  ): Promise<UserEntity | undefined> {
    const queryBuilder = this._userRepository.createQueryBuilder('user');

    queryBuilder.leftJoinAndSelect('user.userAuth', 'userAuth');

    if (options.uuid) {
      queryBuilder.orWhere('user.uuid = :uuid', { uuid: options.uuid });
    }

    if (options.pinCode) {
      queryBuilder.orWhere('userAuth.pinCode = :pinCode', {
        pinCode: options.pinCode,
      });
    }

    queryBuilder.orWhere('user.email = :email', { email: options.email });

    return queryBuilder.getOne();
  }

  public async getUser(uuid: string): Promise<UserEntity> {
    return this.findUser({ uuid });
  }
}
