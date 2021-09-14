import { EntityRepository, Repository } from 'typeorm';
import { UserAuthEntity } from 'modules/user/entities';

@EntityRepository(UserAuthEntity)
export class UserAuthRepository extends Repository<UserAuthEntity> {}
