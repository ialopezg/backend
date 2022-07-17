import { HttpStatus } from '@ialopezg/corejs';

export interface Response {
  data?: { [key: string]: any };
  details?:
    | string
    | { [key: string]: string }
    | { [key: string]: Record<string, string> };
  message: string;
  status?: HttpStatus;
}
