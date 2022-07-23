import { AuthenticationException } from '../exceptions';
import { IFacebookApi, FacebookApiParams, FacebookApiResult } from '../interfaces';
import { FacebookAuthService } from '../services/facebook-auth.service';

describe('FacebookAuthService', () => {
  afterAll(async () => {
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });

  class FacebookApiSpy implements IFacebookApi {
    token?: string;
    result: undefined;

    async loadUser({ token }: FacebookApiParams): Promise<FacebookApiResult> {
      this.token = token;

      return this.result;
    }
  }

  it('should call FacebookAuthenticationService with correct params', async () => {
    const api = new FacebookApiSpy();
    const service = new FacebookAuthService(api);

    await service.perform({ token: 'token' });

    expect(api.token).toBe('token');
  });

  it('should return AuthenticationError when FacebookApi returns undefined', async () => {
    const api = new FacebookApiSpy();
    api.result = undefined;
    const service = new FacebookAuthService(api);
    const authResult = await service.perform({ token: 'token' });

    expect(authResult).toEqual(new AuthenticationException());
  });
});
