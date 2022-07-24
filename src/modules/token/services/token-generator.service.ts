export interface TokenGeneratorParams {
  key: string;
}

export interface TokenGeneratorResult {
  hash: string;
}

export interface TokenGeneratorService {
  generate: (params: TokenGeneratorParams) => Promise<TokenGeneratorResult>;
}
