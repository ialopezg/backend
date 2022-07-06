import { Module } from '@ialopezg/corejs';

import { CurrencyService } from './services';

@Module({
  components: [CurrencyService],
})
export class CurrencyModule {}
