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
      // if user account exists with facebook email account
      if (!isUndefined(user?.name)) {
        // update user account
        await this.facebookRepository.update({
          id: user.id,
          name: user.name,
          fid: data.fid,
        });
      } else {
        // create user account from facebook user data
        await this.facebookRepository.create(data);
      }
    }

    return new AuthenticationException();
  }
}
