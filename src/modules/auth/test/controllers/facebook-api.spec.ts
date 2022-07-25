import { mock, MockProxy } from 'jest-mock-extended';

import { FacebookApiService } from '../../services/facebook-api.service';
import { HttpClient } from '../../interfaces/http-client.interface';

describe('FacebookApi', () => {
  let api: FacebookApiService;
  let httpClient: MockProxy<HttpClient>;
  let clientId: string;
  let clientSecret: string;

  beforeAll(() => {
    httpClient = mock();
    clientId = 'any_client_id';
    clientSecret = 'any_client_secret';
  });

  beforeEach(() => {
    httpClient.get
      .mockResolvedValueOnce({ access_token: 'any_app_token' })
      .mockResolvedValueOnce({ data: { user_id: 'any_user_id' } });
    api = new FacebookApiService(httpClient, clientId, clientSecret);
  });

  it('should app get token', async () => {
    await api.loadUser({ token: 'any_client_token' });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token',
      },
    });
  });

  it('should get user information', async () => {
    await api.loadUser({ token: 'any_client_token' });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/any_user_id',
      params: {
        fields: 'id, name, email',
        access_token: 'any_client_token',
      },
    });
  });
});
