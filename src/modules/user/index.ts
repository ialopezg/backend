import { Module } from '@ialopezg/corejs';

import { MailerModule } from '../mailer';
import { UserController } from './controllers';
import { AuthMiddleware } from './middlewares';
import {
  ChatGatewayService,
  NotificationService, UserRoleService,
  UserService,
} from './services';
import { TokenModule } from '../token';
import { PreferenceModule } from '../preference';

@Module({
  modules: [PreferenceModule, TokenModule, MailerModule],
  controllers: [UserController],
  components: [ChatGatewayService, UserService, UserRoleService, NotificationService],
  exports: [UserService, UserRoleService],
})
export class UserModule {
  configure(router: any): any {
    console.log('UserModule configured!');

    return router.use({
      middlewares: [AuthMiddleware],
      forRoutes: [{ path: '/users' }],
    });
  }
}
