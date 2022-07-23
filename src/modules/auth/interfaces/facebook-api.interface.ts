import { FacebookDataDto } from '../dtos/facebook-account.dto';

export interface FacebookApiParams {
  token?: string;
}

export interface FacebookApi {
  loadUser: (params: FacebookApiParams) => Promise<FacebookDataDto>;
}
