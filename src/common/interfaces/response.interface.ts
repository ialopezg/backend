import { HttpStatus } from '@ialopezg/corejs';

export class Response {
  data?: { [key: string]: any };
  error?:
    | string
    | { [key: string]: string }
    | { [key: string]: Record<string, string> };
  message: string;
  status?: HttpStatus;
}
