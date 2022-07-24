import { Module } from '@ialopezg/corejs';

import { AuthModule } from '../auth';
import { UserModule } from '../user';
import { AppService } from './services';
import { PreferenceModule } from '../preference';
import { TokenModule } from '../token';

@Module({
  modules: [
    PreferenceModule,
    TokenModule,
    UserModule,
    AuthModule,
  ],
  components: [AppService],
})
export class AppModule {
}
