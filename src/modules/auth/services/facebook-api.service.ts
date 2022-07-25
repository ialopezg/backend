import { HttpClient, FacebookApiParams } from '../interfaces';

export class FacebookApiService {
  private readonly baseUrl = 'https://graph.facebook.com/';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {
  }

  async loadUser(params: FacebookApiParams): Promise<void> {
    const appToken = await this.httpClient.get({
      url: `${this.baseUrl}oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      },
    });
    const debugToken = await this.httpClient.get({
      url: `${this.baseUrl}debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: params.token,
      },
    });
    await this.httpClient.get({
      url: `${this.baseUrl}${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(', '),
        access_token: params.token,
      },
    });
  }
}
