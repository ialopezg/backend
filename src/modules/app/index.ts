import { Module } from '@ialopezg/corejs';

import { AuthModule } from '../auth';
import { UserModule } from '../user';
import { AppService } from './services';
import { PreferenceModule } from '../preference';

@Module({
  modules: [
    PreferenceModule,
    UserModule,
    AuthModule,
  ],
  components: [ AppService ],
})
export class AppModule {
}
