import { Controller, RequestMapping, RequestMethod } from '@ialopezg/corejs';
import { NextFunction, Request, Response } from 'express';

import { UserService } from '../services';

@Controller({ path: 'users' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @RequestMapping({ path: '/', method: RequestMethod.POST })
  async createUser(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      let users = await this.userService.createUser(request.body);

      response.status(201).json(users);
    } catch (error) {
      console.log(error);
      next(error.message);
    }
  }

  @RequestMapping({ path: '/' })
  async getUsers(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      let users = (await this.userService.getUsers()) || [];

      response.status(200).json(users);
    } catch (error) {
      console.log(error);
      next(error.message);
    }
  }

  @RequestMapping({ path: ':id' })
  async getUserById(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      let user = await this.userService.getUserById(request.params.id);

      response.status(200).json(user);
    } catch (error) {
      console.log(error);
      next(error.message);
    }
  }

  @RequestMapping({ path: ':id', method: RequestMethod.PUT })
  async updateUser(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      let user = await this.userService.updateUser(
        request.params.id,
        request.body,
      );

      response.status(200).json(user);
    } catch (error) {
      console.log(error);
      next(error.message);
    }
  }

  @RequestMapping({ path: ':id', method: RequestMethod.DELETE })
  async deleteUser(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      let user = await this.userService.deleteUser(request.params.id);

      response.status(200).json(user);
    } catch (error) {
      console.log(error);
      next(error.message);
    }
  }
}
