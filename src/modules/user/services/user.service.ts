import { Injectable } from '@nestjs/common';
import { UserCreationDto } from 'modules/user/dtos';
import { UserEntity } from 'modules/user/entities';
import { UserRepository } from 'modules/user/repositories';

@Injectable()
export class UserService {
  constructor(private readonly _userRepository: UserRepository) {}

  public async createUser(userCreation: UserCreationDto): Promise<UserEntity> {
    const user = this._userRepository.create(userCreation);

    return this._userRepository.save(user);
  }

  public async getUser(
    options: Partial<{ email: string }>,
  ): Promise<UserEntity | undefined> {
    const queryBuilder = this._userRepository.createQueryBuilder('users');

    queryBuilder.where('users.email = :email', { email: options.email });

    return queryBuilder.getOne();
  }
}
