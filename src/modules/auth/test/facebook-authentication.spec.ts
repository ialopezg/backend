import { AuthenticationException } from '../exceptions';
import { FacebookAuthService } from '../services/facebook-auth.service';

describe('FacebookAuthService', () => {
  // afterAll(async () => {
  //   await new Promise<void>(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  // });

  it('should call FacebookAuthenticationService with correct params', async () => {
    const api = { loadUser: jest.fn() };
    const service = new FacebookAuthService(api);

    await service.perform({ token: 'token' });

    expect(api.loadUser).toHaveBeenCalledWith({ token: 'token' });
    expect(api.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when FacebookApi returns undefined', async () => {
    const api = { loadUser: jest.fn() };
    api.loadUser.mockResolvedValueOnce(undefined);
    const service = new FacebookAuthService(api);
    const authResult = await service.perform({ token: 'token' });

    expect(authResult).toEqual(new AuthenticationException());
  });
});
