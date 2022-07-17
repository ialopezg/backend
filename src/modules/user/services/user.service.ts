import { Component, HttpStatus } from '@ialopezg/corejs';

import { ValidationException } from '../../../common/exceptions';
import { Response } from '../../../common/interfaces';
import { validate } from '../../../common/utils';
import { MailerService } from '../../mailer/services';
import { PreferenceService } from '../../preference/services';
import { TokenService } from '../../token/services';
import { CreateUserDto } from '../dtos';
import { User } from '../entities';

@Component()
export class UserService {
  constructor(
    private readonly preferences: PreferenceService,
    private readonly tokenService: TokenService,
    private readonly mailerService: MailerService,
  ) {
  }

  async createUser(createUserDto: CreateUserDto): Promise<Response> {
    // Data validation
    const errors = await validate(createUserDto, CreateUserDto);
    if (errors) {
      throw new ValidationException(errors);
    }

    // creates user account
    const user = await User.create(createUserDto);
    // check if user registration requires verification
    if (await this.preferences.getValue('user.requires.verification')) {
      // generate token
      const token = await this.tokenService.createToken(user.id);
      if (!token) {
        return {
          data: { user },
          details: {
            token: 'Error while token creation!',
          },
          message: 'User created with no token',
          status: HttpStatus.CREATED,
        };
      }

      // send the email confirmation
      const hash = token.data.token.hash;
      const email = await this.mailerService.sendVerification(user, hash);
      if (!email) {
        return {
          data: { user },
          details: {
            email: 'confirmation email could not be sent!',
          },
          message: 'User created with errors',
          status: HttpStatus.CREATED,
        };
      }

      // result all results
      return {
        data: {
          user,
          token: hash,
        },
        message: email.message,
        status: HttpStatus.CREATED,
      };
    }

    return { data: { user }, message: 'User created successful', status: HttpStatus.CREATED };
  }

  async getUser(
    options: Partial<{
      uuid: number | string;
      username: string;
      email: string;
    }>,
    coincidence = true,
    exact = true,
  ): Promise<any> {
    if (options.username || options.email) {
      let filter: any;
      if (coincidence) {
        filter = {
          $or: [
            {
              username: exact
                ? options.username
                : new RegExp(`^${options.username}$`, 'i'),
            },
            {
              email: exact
                ? options.email
                : new RegExp(`^${options.email}$`, 'i'),
            },
          ],
        };
      } else {
        if (options.username) {
          filter = {
            username: exact
              ? options.username
              : new RegExp(`^${options.username}$`, 'i'),
          };
        }
        if (options.email) {
          filter = {
            email: exact
              ? options.email
              : new RegExp(`^${options.email}$`, 'i'),
          };
        }
      }

      return new Promise((resolve: any) => {
        User.findOne(filter, (error: any, user: any) => {
          if (error) {
            console.log(error);
            throw new Error(error.toString());
          }

          resolve(user || false);
        });
      });
    }

    if (options.uuid) {
      new Promise((resolve) => {
        User.findById(options.uuid, (error: any, user: any) => {
          if (error) {
            console.log(error);
            throw new Error(error.toString());
          }

          resolve(user || false);
        });
      });
    }

    return null;
  }

  async getUsers(): Promise<any[]> {
    return new Promise((resolve) => {
      User.find((error: any, users: any[]) => {
        if (error) {
          console.log(error);
          throw new Error(error.toString());
        }

        resolve(users || []);
      });
    });
  }

  async getUserById(id: number | string): Promise<any> {
    return this.getUser({ uuid: id });
  }

  async getUserByUsername(username: string): Promise<any> {
    return this.getUser({ username });
  }

  async getUserByEmail(email: string): Promise<any> {
    return this.getUser({ email });
  }

  async updateUser(uuid: number | string, userUpdate: any): Promise<any> {
    return new Promise((resolve) => {
      User.findByIdAndUpdate(uuid, userUpdate, (error: any, user: any) => {
        if (error) {
          console.log(error);
          throw new Error(error.toString());
        }

        resolve(user);
      });
    });
  }

  async deleteUser(uuid: number | string): Promise<any> {
    return new Promise((resolve) => {
      User.findByIdAndRemove(uuid, (error: any, user: any) => {
        if (error) {
          console.log(error);
          throw new Error(error.toString());
        }

        resolve(user);
      });
    });
  }

  async userExists(options: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      User.exists(options, function (error: any, user: any) {
        if (error) {
          reject(false);
        }

        resolve(user || false);
      });
    });
  }
}
