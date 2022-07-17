import { AbstractDto } from '../../../common/dtos';

export class UserDto extends AbstractDto {
  name: string;
  lastname: string;
  username: string;
  email: string;
  phone?: string;
  mobile?: string;
  avatar?: string;
  role: string;
  status: string;
  verifiedAt: Date;
}
