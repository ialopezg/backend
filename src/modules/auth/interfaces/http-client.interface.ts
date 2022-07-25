export interface HttpClientParams {
  url: string;
  params: { [key: string]: any };
}

export interface HttpClientResult {
  [property: string]: any;
}

export interface HttpClient {
  get: (params: HttpClientParams) => Promise<HttpClientResult>;
}
