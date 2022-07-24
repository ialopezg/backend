import { AuthenticationException } from '../exceptions';
import { LoginPayloadDto } from '../dtos/login-payload.dto';

export interface FacebookAuthenticationParams {
  token: string;
}

export interface FacebookAuthentication {
  perform: (params: FacebookAuthenticationParams) => Promise<LoginPayloadDto | AuthenticationException>;
}
