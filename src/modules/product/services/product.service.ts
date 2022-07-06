import { Component } from '@ialopezg/corejs';

import { getPath } from '../../../utils';

@Component()
export class ProductService {
  getImagePath(thumbnail = false): string {
    return getPath(`product${thumbnail ? '/thumbnail' : ''}`);
  }
}
