describe('FacebookAuthenticationService', () => {
  interface FacebookApiParams {
    token: string;
  }

  interface FacebookApi {
    loadUser: (params: FacebookApiParams) => Promise<void>;
  }

  class FacebookApiSpy implements FacebookApi {
    token?: string;

    async loadUser({ token }: FacebookApiParams): Promise<void> {
      this.token = token;
    }
  }

  class FacebookAuthenticationService {
    constructor(private readonly facebookApi: FacebookApi) {}

    async perform(params: FacebookApiParams): Promise<void> {
      await this.facebookApi.loadUser(params);
    }
  }

  it('should call FacebookAuthenticationService with correct params', async () => {
    const api = new FacebookApiSpy();
    const service = new FacebookAuthenticationService(api);

    await service.perform({ token: 'token' });

    expect(api.token).toBe('token');
  });
});
