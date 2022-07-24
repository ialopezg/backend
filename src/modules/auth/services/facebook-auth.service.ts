import { isUndefined } from '@ialopezg/corejs';

import { FacebookAuthenticationParams, FacebookApi, FacebookAuthentication } from '../interfaces';
import { AuthenticationException } from '../exceptions';
import { FacebookRepository } from '../repositories';
import { FacebookAccountDto } from '../dtos';
import { TokenGeneratorService } from '../../token/services';
import { TokenDto } from '../../token/dtos';
import { LoginPayloadDto } from '../dtos/login-payload.dto';

export class FacebookAuthService implements FacebookAuthentication {
  constructor(
    private readonly facebookApi: FacebookApi,
    private readonly facebookRepository: FacebookRepository,
    private readonly tokenGeneratorService: TokenGeneratorService,
  ) {
  }

  async perform(params: FacebookAuthenticationParams): Promise<LoginPayloadDto | AuthenticationException> {
    // get user data from facebook api
    const data = await this.facebookApi.loadUser(params);
    // if data returned
    if (!isUndefined(data)) {
      // get user data from repository
      const user = await this.facebookRepository.load({ email: data.email });
      // if user account exists with update user account with facebook details
      const facebookAccount = new FacebookAccountDto(data, user);
      const userAccount = await this.facebookRepository.save(facebookAccount);
      const token = await this.tokenGeneratorService.generate({
        key: userAccount.id,
        expiration: TokenDto.expirationInMs,
      });

      return new LoginPayloadDto(userAccount, token);
    }

    return new AuthenticationException();
  }
}
