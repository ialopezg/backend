import { AuthenticationException } from '../exceptions';
import { AccessToken } from './access-token.interface';

interface FacebookAuthenticationParams {
  token: string;
}

interface FacebookAuthenticationResult {
  result: AccessToken | AuthenticationException;
}

export interface FacebookAuthentication {
  perform: (params: FacebookAuthenticationParams) => Promise<FacebookAuthenticationResult>;
}
