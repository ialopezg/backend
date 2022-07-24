import { FacebookDataDto } from '../dtos';

export interface FacebookApiParams {
  token?: string;
}

export interface FacebookApi {
  loadUser: (params: FacebookApiParams) => Promise<FacebookDataDto>;
}
