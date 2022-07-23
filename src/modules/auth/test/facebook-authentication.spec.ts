import { mock } from 'jest-mock-extended';

import { AuthenticationException } from '../exceptions';
import { FacebookApi } from '../interfaces';
import { FacebookAuthService } from '../services/facebook-auth.service';

describe('FacebookAuthService', () => {
  it('should call FacebookAuthenticationService with correct params', async () => {
    const api = mock<FacebookApi>();
    const service = new FacebookAuthService(api);

    await service.perform({ token: 'token' });

    expect(api.loadUser).toHaveBeenCalledWith({ token: 'token' });
    expect(api.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when FacebookApi returns undefined', async () => {
    const api = mock<FacebookApi>();
    api.loadUser.mockResolvedValueOnce(undefined);
    const service = new FacebookAuthService(api);
    const authResult = await service.perform({ token: 'token' });

    expect(authResult).toEqual(new AuthenticationException());
  });
});
