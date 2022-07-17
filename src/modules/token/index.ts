import { Module } from '@ialopezg/corejs';

import { PreferenceModule } from '../preference';
import { TokenService } from './services';

@Module({
  modules: [PreferenceModule],
  components: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
