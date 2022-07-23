import { FacebookAuthenticationParams, FacebookApi } from '../interfaces';
import { AuthenticationException } from '../exceptions';

export class FacebookAuthService {
  constructor(private readonly facebookApi: FacebookApi) {}

  async perform(params: FacebookAuthenticationParams): Promise<AuthenticationException> {
    await this.facebookApi.loadUser(params);

    return new AuthenticationException();
  }
}
