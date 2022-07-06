import { Component, isEmpty } from '@ialopezg/corejs';
import * as Joi from 'joi';

import { User } from '../../../models';
import { MailService } from '../../mailer/services';

@Component()
export class UserService {
  async createUser(userCreate: any): Promise<any> {
    const errors = this.validateRequest(
      {
        name: Joi.string().required(),
        lastname: Joi.string(),
        email: Joi.string().email().required(),
        username: Joi.string().min(4).required(),
        password: Joi.string().required().min(6),
      },
      userCreate,
      { abortEarly: false },
    );
    if (!isEmpty(errors)) {
      return { errors, user: null };
    }

    const user = await User.create(userCreate);

    return { errors: null, user };
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

      return new Promise((resolve, reject) => {
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

  private validateRequest(
    rules: { [key: string]: any },
    data: any,
    options = {},
  ): any[] {
    const schema = Joi.object(rules);
    const { error } = schema.validate(data, options);
    if (error) {
      return (<any>error).details.map((e: any) => {
        return { [e.context.key]: e.message };
      });
    }

    return [];
  }
}
