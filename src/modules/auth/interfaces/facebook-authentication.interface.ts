import { AuthenticationException } from '../exceptions';
import { AccessToken } from './access-token.interface';

export interface FacebookAuthenticationParams {
  token: string;
}

export interface FacebookAuthenticationResult {
  result: AccessToken | AuthenticationException;
}

export interface FacebookAuthentication {
  perform: (params: FacebookAuthenticationParams) => Promise<FacebookAuthenticationResult>;
}
