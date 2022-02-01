import { Request } from 'express';
import { UserEntity } from 'modules/user/entities';

export interface RequestWithUser extends Request {
  user: UserEntity;
}
