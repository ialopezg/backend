import { Component } from '@ialopezg/corejs';

import { PasswordTokenModel } from '../../../models';

@Component()
export class PasswordService {
  async createPasswordToken(data: any): Promise<any> {
    return PasswordTokenModel.create(data);
  }

  async getToken(uuid: string): Promise<any> {
    return new Promise((resolve: any) => {
      PasswordTokenModel.findOne({ user: uuid }, (error: any, doc: any) => {
        if (error) {
          throw error;
        }
        console.log(uuid, doc);
        resolve(doc || false);
      });
    });
  }

  async updateToken(uuid: string, tokenUpdate: any): Promise<any> {
    return new Promise((resolve) => {
      PasswordTokenModel.findOneAndUpdate(
        { user: uuid },
        tokenUpdate,
        (error: any, token: any) => {
          if (error) {
            console.log(error);
            throw new Error(error.toString());
          }

          resolve(token);
        },
      );
    });
  }
}
