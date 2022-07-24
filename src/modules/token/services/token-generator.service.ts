import { TokenDto, TokenGeneratorDto } from '../dtos';

export interface TokenGeneratorService {
  generate: (params: TokenGeneratorDto) => Promise<TokenDto>;
}
