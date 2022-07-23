import { mock, MockProxy } from 'jest-mock-extended';

import { AuthenticationException } from '../exceptions';
import { FacebookApi } from '../interfaces';
import { FacebookAuthService } from '../services/facebook-auth.service';

describe('FacebookAuthService', () => {
  type ServiceTypes = {
    auth: FacebookAuthService,
    api: MockProxy<FacebookApi>,
  }

  const createServices = (): ServiceTypes => {
    const api = mock<FacebookApi>();
    const auth = new FacebookAuthService(api);

    return { api, auth };
  };

  it('should call FacebookAuthenticationService with correct params', async () => {
    const { api, auth } = createServices();

    await auth.perform({ token: 'token' });

    expect(api.loadUser).toHaveBeenCalledWith({ token: 'token' });
    expect(api.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when FacebookApi returns undefined', async () => {
    const { api, auth } = createServices();
    api.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await auth.perform({ token: 'token' });

    expect(authResult).toEqual(new AuthenticationException());
  });
});
