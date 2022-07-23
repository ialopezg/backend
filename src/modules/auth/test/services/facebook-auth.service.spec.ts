import { mock, MockProxy } from 'jest-mock-extended';

import { AuthenticationException } from '../../exceptions';
import { FacebookApi } from '../../interfaces';
import { FacebookAuthService } from '../../services/facebook-auth.service';
import { FacebookRepository } from '../../repositories';
import mocked = jest.mocked;
import { FacebookAccountDto } from '../../dtos';

jest.mock('../../dtos/facebook-account.dto');

describe('FacebookAuthService', () => {
  let api: MockProxy<FacebookApi>;
  let auth: FacebookAuthService;
  let repo: MockProxy<FacebookRepository>;
  const token = 'token';

  beforeEach(() => {
    api = mock();
    api.loadUser.mockResolvedValue({
      id: 'any_facebook_id',
      email: 'any_facebook_email',
      name: 'any_facebook_name',
    });
    repo = mock();
    repo.load.mockResolvedValue(undefined);
    auth = new FacebookAuthService(api, repo);
  });

  describe('FacebookApi', () => {
    it('should call `load()` with correct params', async () => {
      await auth.perform({ token });

      expect(api.loadUser).toHaveBeenCalledWith({ token });
      expect(api.loadUser).toHaveBeenCalledTimes(1);
    });

    it('should return `AuthenticationError` when `load()` returns undefined', async () => {
      api.loadUser.mockResolvedValueOnce(undefined);
      const authResult = await auth.perform({ token });

      expect(authResult).toEqual(new AuthenticationException());
    });
  });

  describe('FacebookRepository', () => {
    it('should call load user account with Facebook data', async () => {
      await auth.perform({ token });

      expect(repo.load).toHaveBeenCalledWith({ email: 'any_facebook_email' });
      expect(repo.load).toHaveBeenCalledTimes(1);
    });

    it('should call save() method with facebook account data', async () => {
      const facebookAccountDtoStub = jest.fn().mockImplementation(() => ({ any: 'any' }));
      mocked(FacebookAccountDto).mockImplementation(facebookAccountDtoStub);

      await auth.perform({ token });

      expect(repo.save).toHaveBeenCalledWith({ any: 'any' });
      expect(repo.save).toHaveBeenCalledTimes(1);
    });
  });
});
