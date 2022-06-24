import { Module } from '@ialopezg/corejs';

import { MailerModule } from '../mailer';
import { UserModule } from '../user';
import { PasswordController } from './controllers';
import { PasswordService } from './services';

@Module({
  modules: [UserModule, MailerModule],
  controllers: [PasswordController],
  components: [PasswordService],
})
export class AccountModule {}
