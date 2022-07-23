import { AuthenticationException } from '../exceptions';
import { IFacebookApi, FacebookApiParams, FacebookApiResult, FacebookAuthenticationParams } from '../interfaces';

describe('FacebookAuthenticationService', () => {
  class FacebookApiSpy implements IFacebookApi {
    token?: string;
    result: undefined;

    async loadUser({ token }: FacebookApiParams): Promise<FacebookApiResult> {
      this.token = token;

      return this.result;
    }
  }

  class FacebookAuthenticationService {
    constructor(private readonly facebookApi: IFacebookApi) {}

    async perform(params: FacebookAuthenticationParams): Promise<AuthenticationException> {
      await this.facebookApi.loadUser(params);

      return new AuthenticationException();
    }
  }

  it('should call FacebookAuthenticationService with correct params', async () => {
    const api = new FacebookApiSpy();
    const service = new FacebookAuthenticationService(api);

    await service.perform({ token: 'token' });

    expect(api.token).toBe('token');
  });

  it('should return AuthenticationError when FacebookApi returns undefined', async () => {
    const api = new FacebookApiSpy();
    api.result = undefined;
    const service = new FacebookAuthenticationService(api);
    const authResult = await service.perform({ token: 'token' });

    expect(authResult).toEqual(new AuthenticationException());
  });
});
