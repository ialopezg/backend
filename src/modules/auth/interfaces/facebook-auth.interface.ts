import { AuthenticationException } from '../exceptions';
import { AccessTokenDto } from '../dtos';

export interface FacebookAuthenticationParams {
  token: string;
}

export interface FacebookAuthenticationResult {
  result: AccessTokenDto | AuthenticationException;
}

export interface FacebookAuthentication {
  perform: (params: FacebookAuthenticationParams) => Promise<FacebookAuthenticationResult>;
}
