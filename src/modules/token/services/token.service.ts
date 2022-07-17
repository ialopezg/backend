import { Component, HttpException, HttpStatus } from '@ialopezg/corejs';
import { sign } from 'jsonwebtoken';

import { Response } from '../../../common/interfaces';
import { errorHandler } from '../../../common/utils';
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

    return {
      status: HttpStatus.CREATED,
      message: 'Token creation successful!',
      data: { token },
    };
  }

  async generateToken(uuid: string, type: TokenType): Promise<string> {
    const key = `token.${type.toString().toLowerCase()}`;
    const options = await this.preferences.getValue(key);

    return sign({ uid: uuid }, options.secretKey, {
      expiresIn: options.expiresIn,
    });
  }
}
