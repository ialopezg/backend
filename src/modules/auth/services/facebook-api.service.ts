import { HttpClient, FacebookApiParams, HttpClientResult } from '../interfaces';
import { FacebookDataDto } from '../dtos';

export class FacebookApiService {
  private readonly baseUrl = 'https://graph.facebook.com/';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {
  }

  async loadUser(params: FacebookApiParams): Promise<FacebookDataDto> {
    const userInfo = await this.getUserInfo(params.token);

    return {
      id: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
    };
  }

  private async getUserInfo(clientToken: string): Promise<HttpClientResult> {
    const debugToken = await this.getDebugToken(clientToken);

    return await this.httpClient.get({
      url: `${this.baseUrl}${debugToken.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(', '),
        access_token: clientToken,
      },
    });
  }

  private async getDebugToken(clientToken: string): Promise<HttpClientResult> {
    const appToken = await this.getAppToken();

    return this.httpClient.get({
      url: `${this.baseUrl}debug_token`,
      params: {
        access_token: appToken.access_token,
        input_token: clientToken,
      },
    });
  }

  private async getAppToken(): Promise<HttpClientResult> {
    return this.httpClient.get({
      url: `${this.baseUrl}oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      },
    });
  }
}
