import { Exclude } from 'class-transformer';
import { AbstractDto } from '../../../common/dtos';

export class UserDto extends AbstractDto {
  name: string;
  lastname: string;
  username: string;
  @Exclude()
  password: string;
  email: string;
  phone?: string;
  mobile?: string;
  avatar?: string;
  role: string;
  status: string;
  verifiedAt: Date;
}
