import {
  Controller,
  HttpException,
  HttpStatus,
  RequestMapping,
  RequestMethod,
  validateHash,
} from '@ialopezg/corejs';
import { Request, Response } from 'express';

import { errorHandler } from '../../../utils';
import { UserService } from '../../user/services';

@Controller({ path: '/' })
export class AuthController {
  private readonly userService = new UserService();

  @RequestMapping({ path: 'register', method: RequestMethod.POST })
  async register(request: Request, response: Response) {
    try {
      const { user, errors } = await this.userService.createUser(request.body);
      if (errors) {
        response
          .status(HttpStatus.UNPROCESSABLE_ENTITY)
          .json({ message: 'Validation error', errors });
        return;
      }

      response.status(HttpStatus.CREATED).json(user);
    } catch (error: any) {
      const { status, message, details } = errorHandler(error);
      response.status(status).json({ message, details });
    }
  }

  @RequestMapping({ path: 'login', method: RequestMethod.POST })
  async login(request: Request, response: Response) {
    try {
      const { username, password } = request.body;
      const user = await this.userService.getUserByUsername(username);
      if (!user || !validateHash(password, user.password)) {
        throw new HttpException(
          'Wrong username or password!',
          HttpStatus.FORBIDDEN,
        );
      }

      const payload = { id: user.id };

      response.json({
        status: 'success',
        user,
      });
    } catch (error) {
      const { status, message, details } = errorHandler(error);
      response.status(status).json({ message, details });
    }
  }
}
