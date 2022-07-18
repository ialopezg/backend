import { Module } from '@ialopezg/corejs';

import { UserModule } from '../user';
import { AuthController } from './controllers';
import { MailerModule } from '../mailer';
import { PreferenceModule } from '../preference';
import { AuthService } from './services';
import { TokenModule } from '../token';

@Module({
  modules: [ PreferenceModule, TokenModule, MailerModule, UserModule ],
  controllers: [ AuthController ],
  components: [ AuthService ],
  exports: [ AuthService ],
})
export class AuthModule {
  configure() {
    console.log('AuthModule configured');
  }
}
