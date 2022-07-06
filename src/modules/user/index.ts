import { Module } from '@ialopezg/corejs';

import { SharedModule } from '../shared';
import { UserController } from './controllers';
import {
  ChatGatewayService,
  NotificationService,
  UserService,
} from './services';

@Module({
  modules: [SharedModule],
  controllers: [UserController],
  components: [ChatGatewayService, UserService, NotificationService],
})
export class UserModule {}
