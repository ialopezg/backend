import { Module } from '@ialopezg/corejs';

import { ProductService } from './services';

@Module({
  components: [ProductService],
})
export class ProductModule {}
