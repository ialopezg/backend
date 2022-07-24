import { mock, MockProxy } from 'jest-mock-extended';

import { AuthenticationException } from '../../exceptions';
import { FacebookApi } from '../../interfaces';
import { FacebookAuthService } from '../../services/facebook-auth.service';
import { FacebookRepository } from '../../repositories';
import mocked = jest.mocked;
import { FacebookAccountDto } from '../../dtos';
import { TokenGeneratorService } from '../../../token/services';

jest.mock('../../dtos/facebook-account.dto');

describe('FacebookAuthService', () => {
  let api: MockProxy<FacebookApi>;
  let auth: FacebookAuthService;
  let repo: MockProxy<FacebookRepository>;
  let tokenGeneratorService: MockProxy<TokenGeneratorService>;
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
    repo.save.mockResolvedValue({ id: 'any_account_id' });
    tokenGeneratorService = mock();
    auth = new FacebookAuthService(api, repo, tokenGeneratorService);
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

  describe('TokenGeneratorService', () => {
    it('should call TokenGeneratorService with correct params', async() => {
      await auth.perform({ token });

      expect(tokenGeneratorService.generate).toHaveBeenCalledWith({ key: 'any_account_id' });
      expect(tokenGeneratorService.generate).toHaveBeenCalledTimes(1);
    });
  });
});
