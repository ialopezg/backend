export interface FacebookApiParams {
  token?: string;
}

export interface FacebookApiResult {
  result: undefined;
}

export interface FacebookApi {
  loadUser: (params: FacebookApiParams) => Promise<FacebookApiResult>;
}
