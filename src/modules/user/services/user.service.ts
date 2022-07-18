import { Component } from '@ialopezg/corejs';

import { ValidationException } from '../../../common/exceptions';
import { validate } from '../../../common/utils';
import { PreferenceService } from '../../preference/services';
import { TokenService } from '../../token/services';
import { CreateUserDto } from '../dtos';
import { User } from '../entities';
import { UserRoleService } from './user-role.service';

@Component()
export class UserService {
  constructor(
    private readonly preferences: PreferenceService,
    private readonly tokenService: TokenService,
    private readonly userRoleService: UserRoleService,
  ) {
    this.init()
      .then(() => {})
      .catch((error: any) => console.log(error));
  }

  async init(): Promise<void> {
    console.log('AppService initialized!');
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    // Data validation
    const errors = await validate(createUserDto, CreateUserDto);
    if (errors) {
      throw new ValidationException(errors);
    }

    // creates user account
    const user = new User(createUserDto);
    let role;
    // set user role
    if (createUserDto.role) {
      // if provided
      role = await this.userRoleService.getRoleByName(createUserDto.role);
    } else {
      // otherwise, default role
      role = await this.userRoleService.getDefaultRole();
    }
    user.role = role.id;

    // and return result
    return user.save();
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
