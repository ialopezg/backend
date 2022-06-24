import { Module } from '@ialopezg/corejs';

import { MailService } from './services';

@Module({
  components: [MailService],
})
export class MailerModule {}
