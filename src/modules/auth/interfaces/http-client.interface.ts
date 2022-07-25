export interface HttpClientParams {
  url: string;
  params: { [key: string]: any };
}

export interface HttpClientResult {
  access_token?: string;
  data?: any;
}

export interface HttpClient {
  get: (params: HttpClientParams) => Promise<HttpClientResult>;
}
