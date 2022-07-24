import { mock, MockProxy } from 'jest-mock-extended';

import { AuthenticationException } from '../../exceptions';
import { FacebookApi } from '../../interfaces';
import { FacebookAuthService } from '../../services/facebook-auth.service';
import { UserRepository } from '../../repositories';
import mocked = jest.mocked;
import { FacebookAccountDto } from '../../dtos';
import { TokenGeneratorService } from '../../../token/services';
import { TokenDto } from '../../../token/dtos';
import { LoginPayloadDto } from '../../dtos/login-payload.dto';

jest.mock('../../dtos/facebook-account.dto');

describe('FacebookAuthService', () => {
  let api: MockProxy<FacebookApi>;
  let auth: FacebookAuthService;
  let repo: MockProxy<UserRepository>;
  let tokenService: MockProxy<TokenGeneratorService>;
  let token: string;

  beforeAll(() => {
    token = 'any_token';
    api = mock();
    api.loadUser.mockResolvedValue({
      id: 'any_facebook_id',
      email: 'any_facebook_email',
      name: 'any_facebook_name',
    });
    repo = mock();
    repo.load.mockResolvedValue(undefined);
    repo.save.mockResolvedValue({ id: 'any_account_id' });
    tokenService = mock();
    tokenService.generate.mockResolvedValue(new TokenDto('any_generated_token'));
  });

  beforeEach(() => {
    auth = new FacebookAuthService(api, repo, tokenService);
  });

  it('should call `load()` with correct params', async () => {
    await auth.perform({ token });

    expect(api.loadUser).toHaveBeenCalledWith({ token });
    expect(api.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when FacebookApi returns undefined', async () => {
    api.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await auth.perform({ token });

    expect(authResult).toEqual(new AuthenticationException());
  });

  it('should be thrown if FacebookApi cannot resolve user data', async () => {
    api.loadUser.mockRejectedValueOnce(new AuthenticationException());

    const authResult = auth.perform({ token });

    await expect(authResult).rejects.toThrow(new AuthenticationException());
  });

  it('should return an AccessToken on success', async () => {
    const authResult = await auth.perform({ token });

    expect((<LoginPayloadDto>authResult).token).toEqual(new TokenDto('any_generated_token'));
  });

  describe('FacebookRepository', () => {
    it('should call load user account with Facebook data', async () => {
      await auth.perform({ token });

      expect(repo.load).toHaveBeenCalledWith({ email: 'any_facebook_email' });
      expect(repo.load).toHaveBeenCalledTimes(1);
    });

    it('should be thrown if UserRepository cannot resolve user account data', async () => {
      repo.load.mockRejectedValueOnce(new AuthenticationException());

      const authResult = auth.perform({ token });

      await expect(authResult).rejects.toThrow(new AuthenticationException());
    });

    it('should call save() method with facebook account data', async () => {
      const facebookAccountDtoStub = jest.fn().mockImplementation(() => ({ any: 'any' }));
      mocked(FacebookAccountDto).mockImplementation(facebookAccountDtoStub);

      await auth.perform({ token });

      expect(repo.save).toHaveBeenCalledWith({ any: 'any' });
      expect(repo.save).toHaveBeenCalledTimes(1);
    });

    it('should be thrown if UserRepository cannot saves user account data', async () => {
      repo.save.mockRejectedValueOnce(new AuthenticationException());

      const authResult = auth.perform({ token });

      await expect(authResult).rejects.toThrow(new AuthenticationException());
    });
  });

  describe('TokenGeneratorService', () => {
    it('should call TokenGeneratorService with correct params', async () => {
      await auth.perform({ token });

      expect(tokenService.generate).toHaveBeenCalledWith({
        key: 'any_account_id',
        expiration: TokenDto.expirationInMs,
      });
      expect(tokenService.generate).toHaveBeenCalledTimes(1);
    });

    it('should be thrown if cannot generates a valid access token', async () => {
      tokenService.generate.mockRejectedValueOnce(new AuthenticationException());

      const authResult = auth.perform({ token });

      await expect(authResult).rejects.toThrow(new AuthenticationException());
    });
  });
});
