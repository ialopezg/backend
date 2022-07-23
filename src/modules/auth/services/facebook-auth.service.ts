import { FacebookAuthenticationParams, FacebookApi } from '../interfaces';
import { AuthenticationException } from '../exceptions';
import { FacebookRepository } from '../repositories';
import { isUndefined } from '@ialopezg/corejs';

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
      await this.facebookRepository.load({ email: data.email });
      // create user account from facebook user data
      await this.facebookRepository.create(data);
    }

    return new AuthenticationException();
  }
}
