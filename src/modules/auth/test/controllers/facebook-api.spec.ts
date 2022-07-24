import { mock } from 'jest-mock-extended';

import { FacebookApiParams } from '../../interfaces';

interface HttpClientParams {
  url: string;
  params: { [key: string]: any };
}

interface HttpClient {
  get: (params: HttpClientParams) => Promise<void>;
}

export class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com/oauth';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {
  }

  async loadUser(params: FacebookApiParams): Promise<void> {
    await this.httpClient.get({
      url: `${this.baseUrl}/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      },
    });
  }
}

describe('FacebookApi', () => {
  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';

  it('should app get token', async () => {
    const httpClient = mock<HttpClient>();
    const api = new FacebookApi(httpClient, clientId, clientSecret);

    await api.loadUser({ token: 'any_client_token' });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      },
    });
  });
});
