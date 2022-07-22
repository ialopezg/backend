import { RuntimeException } from 'custom-error-service';

export class AuthenticationException extends RuntimeException {
  constructor() {
    super('Authentication failed!');
  }
}
