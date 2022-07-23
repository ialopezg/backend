export interface FacebookApiParams {
  token?: string;
}

export interface FacebookApiResult {
  result: undefined;
}

export interface IFacebookApi {
  loadUser: (params: FacebookApiParams) => Promise<FacebookApiResult>;
}
