import { isUndefined } from '@ialopezg/corejs';

import { FacebookAuthenticationParams, FacebookApi } from '../interfaces';
import { AuthenticationException } from '../exceptions';
import { FacebookRepository } from '../repositories';

export class FacebookAuthService {
  constructor(
    private readonly facebookApi: FacebookApi,
    private readonly facebookRepository: FacebookRepository,
  ) {}

  async perform(params: FacebookAuthenticationParams): Promise<AuthenticationException> {
    // get user data from facebook api
    const data = await this.facebookApi.loadUser(params);
    // if data found
    if (!isUndefined(data)) {
      // get user data from repository
      const user = await this.facebookRepository.load({ email: data.email });
      // if user account exists with update user account with facebook details
      await this.facebookRepository.save({
        id: user?.id,
        name: user?.name ?? data.name,
        email: data.email,
        fid: data.fid,
      });
    }

    return new AuthenticationException();
  }
}
