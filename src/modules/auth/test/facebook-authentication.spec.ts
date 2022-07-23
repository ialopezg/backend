import { mock, MockProxy } from 'jest-mock-extended';

import { AuthenticationException } from '../exceptions';
import { FacebookApi } from '../interfaces';
import { FacebookAuthService } from '../services/facebook-auth.service';

describe('FacebookAuthService', () => {
  let api: MockProxy<FacebookApi>;
  let auth: FacebookAuthService;

  beforeEach(() => {
    api = mock();
    auth = new FacebookAuthService(api);
  });

  it('should call FacebookAuthenticationService with correct params', async () => {
    await auth.perform({ token: 'token' });

    expect(api.loadUser).toHaveBeenCalledWith({ token: 'token' });
    expect(api.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when FacebookApi returns undefined', async () => {
    api.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await auth.perform({ token: 'token' });

    expect(authResult).toEqual(new AuthenticationException());
  });
});
