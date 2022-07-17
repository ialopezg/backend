import {
  Controller,
  RequestMapping,
  RequestMethod,
  validateHash,
} from '@ialopezg/corejs';
import { Request, Response } from 'express';

import { errorHandler } from '../../../common/utils';
import { RegistrationDto } from '../dtos';
import { AuthService } from '../services';

@Controller({ path: '/' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @RequestMapping({ path: 'register', method: RequestMethod.POST })
  async register({ body }: Request, response: Response) {
    try {
      const { error, message, status, data } = await this.authService.register(
        <RegistrationDto>body,
      );

      response.status(status).json({
        details: error,
        message,
        success: true,
        user: data.user.toDto(),
      });
    } catch (e: any) {
      const { error, message, status } = errorHandler(e);

      response.status(status).json({
        message,
        error: error,
        success: false,
      });
    }
  }

  @RequestMapping({ path: 'login', method: RequestMethod.POST })
  async login(request: Request, response: Response) {
    // try {
    //   const { username, password } = request.body;
    //   const user = await this.authService.getUserByUsername(username);
    //   if (!user || !validateHash(password, user.password)) {
    //     throw new HttpException(
    //       'Wrong username or password!',
    //       HttpStatus.FORBIDDEN,
    //     );
    //   }
    //   const payload = { id: user.id };
    //   response.json({
    //     status: 'success',
    //     user,
    //   });
    // } catch (error) {
    //   const { status, message, details } = errorHandler(error);
    //   response.status(status).json({ message, details });
    // }
  }
}
