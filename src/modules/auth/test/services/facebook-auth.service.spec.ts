import { mock, MockProxy } from 'jest-mock-extended';

import { AuthenticationException } from '../../exceptions';
import { FacebookApi } from '../../interfaces';
import { FacebookAuthService } from '../../services/facebook-auth.service';
import { FacebookRepository } from '../../repositories';

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
    it('should call load user account whit Facebook data', async () => {
      await auth.perform({ token });

      expect(repo.load).toHaveBeenCalledWith({ email: 'any_facebook_email' });
      expect(repo.load).toHaveBeenCalledTimes(1);
    });

    it('should call create user account whit Facebook data', async () => {
      await auth.perform({ token });

      expect(repo.save).toHaveBeenCalledWith({
        fid: 'any_facebook_id',
        name: 'any_facebook_name',
        email: 'any_facebook_email',
      });
      expect(repo.save).toHaveBeenCalledTimes(1);
    });

    it('should not update user account name', async () => {
      repo.load.mockResolvedValueOnce({
        id: 'any_id',
        name: 'any_name',
      });

      await auth.perform({ token });

      expect(repo.save).toHaveBeenCalledWith({
        fid: 'any_facebook_id',
        email: 'any_facebook_email',
        id: 'any_id',
        name: 'any_name',
      });
      expect(repo.save).toHaveBeenCalledTimes(1);
    });

    it('should update user account name', async () => {
      repo.load.mockResolvedValue({ id: 'any_id' });

      await auth.perform({ token });

      expect(repo.save).toHaveBeenCalledWith({
        fid: 'any_facebook_id',
        email: 'any_facebook_email',
        id: 'any_id',
        name: 'any_facebook_name',
      });
      expect(repo.save).toHaveBeenCalledTimes(1);
    });
  });
});
