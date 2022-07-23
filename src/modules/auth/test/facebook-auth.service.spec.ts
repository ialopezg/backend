import { mock, MockProxy } from 'jest-mock-extended';

import { AuthenticationException } from '../exceptions';
import { FacebookApi } from '../interfaces';
import { FacebookAuthService } from '../services/facebook-auth.service';
import { FacebookRepository } from '../repositories';

describe('FacebookAuthService', () => {
  let api: MockProxy<FacebookApi>;
  let auth: FacebookAuthService;
  let repo: FacebookRepository;
  const token = 'token';

  beforeEach(() => {
    api = mock();
    api.loadUser.mockResolvedValue({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      fid: 'any_facebook_id',
    });
    repo = mock();
    auth = new FacebookAuthService(api, repo);
  });

  it('should call FacebookAuthenticationService with correct params', async () => {
    await auth.perform({ token });

    expect(api.loadUser).toHaveBeenCalledWith({ token });
    expect(api.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when FacebookApi returns undefined', async () => {
    api.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await auth.perform({ token });

    expect(authResult).toEqual(new AuthenticationException());
  });

  it('should call FacebookRepository when FacebookAuthService returns data', async () => {
    await auth.perform({ token });

    expect(repo.load).toHaveBeenCalledWith({ email: 'any_facebook_email' });
    expect(repo.load).toHaveBeenCalledTimes(1);
  });

  it('should call `FacebookRepository.create()` when `FacebookAuthService.load` returns undefined', async () => {
    await auth.perform({ token });

    expect(repo.create).toHaveBeenCalledWith({
      fid: 'any_facebook_id',
      name: 'any_facebook_name',
      email: 'any_facebook_email',
    });
    expect(repo.create).toHaveBeenCalledTimes(1);
  });
});
