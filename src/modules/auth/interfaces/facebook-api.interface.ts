export interface FacebookApiParams {
  token?: string;
}

export interface FacebookApiResult {
  fid: string;
  name: string;
  email: string;
}

export interface FacebookApi {
  loadUser: (params: FacebookApiParams) => Promise<FacebookApiResult>;
}
