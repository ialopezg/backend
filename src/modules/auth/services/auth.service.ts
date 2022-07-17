import { Component } from '@ialopezg/corejs';

import { Response } from '../../../common/interfaces';
import { UserService } from '../../user/services';
import { RegistrationDto } from '../dtos';

@Component()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(registrationDto: RegistrationDto): Promise<Response> {
    return this.userService.createUser(registrationDto);
  }
}
