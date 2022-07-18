import { Component, HttpStatus } from '@ialopezg/corejs';
import { sign } from 'jsonwebtoken';

import { Response } from '../../../common/interfaces';
import { PreferenceService } from '../../preference/services';
import { TokenType } from '../enums';
import { Token } from '../models';

@Component()
export class TokenService {
  constructor(private readonly preferences: PreferenceService) {
  }

  async createToken(
    uuid: string,
    type: TokenType = TokenType.VERIFICATION,
  ): Promise<Response> {
    // generate token
    const hash = await this.generateToken(uuid, type);
    // store the token into tokens collection
    const token = await Token.create({ user: uuid, type, hash });

    // return result
    return {
      status: HttpStatus.CREATED,
      message: 'Token creation successful!',
      data: { token },
    };
  }

  async generateToken(uuid: string, type: TokenType): Promise<string> {
    //set key for preference value
    const key = `token.${type.toString().toLowerCase()}`;
    // get key value from preferences
    const options = await this.preferences.getValue(key);

    // create and return the hash token
    return sign({ uid: uuid }, options.secretKey, {
      expiresIn: options.expiresIn,
    });
  }
}
