import { Module } from '@ialopezg/corejs';

import { SharedModule } from '../shared';
import { UserModule } from '../user';
import { AuthController } from './controllers';
import { AuthService } from './services';

@Module({
  modules: [SharedModule, UserModule],
  controllers: [AuthController],
  components: [AuthService],
})
export class AuthModule {
  configure() {
    console.log('AuthModule configured');
  }
}
