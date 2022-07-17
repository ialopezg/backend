import { Module } from '@ialopezg/corejs';

import { PreferenceModule } from '../preference';
import { MailerService } from './services';

@Module({
  modules: [PreferenceModule],
  components: [MailerService],
  exports: [MailerService],
})
export class MailerModule {
  configure() {
    console.log('MailerModule configured!');
  }
}
