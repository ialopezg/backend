import { isUndefined } from '@ialopezg/corejs';

import { FacebookAuthenticationParams, FacebookApi } from '../interfaces';
import { AuthenticationException } from '../exceptions';
import { FacebookRepository } from '../repositories';
import { FacebookAccountDto } from '../dtos';
import { TokenGeneratorService } from '../../token/services';

export class FacebookAuthService {
  constructor(
    private readonly facebookApi: FacebookApi,
    private readonly facebookRepository: FacebookRepository,
    private readonly tokenGeneratorService: TokenGeneratorService,
  ) {}

  async perform(params: FacebookAuthenticationParams): Promise<AuthenticationException> {
    // get user data from facebook api
    const data = await this.facebookApi.loadUser(params);
    // if data found
    if (!isUndefined(data)) {
      // get user data from repository
      const user = await this.facebookRepository.load({ email: data.email });
      // if user account exists with update user account with facebook details
      const facebookAccount = new FacebookAccountDto(data, user);
      const { id } = await this.facebookRepository.save(facebookAccount);
      await this.tokenGeneratorService.generate({ key: id });
    }

    return new AuthenticationException();
  }
}
