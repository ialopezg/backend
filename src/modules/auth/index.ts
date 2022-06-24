import { Module } from '@ialopezg/corejs';

import { SharedModule } from '../shared';
import { UserModule } from '../user';
import { AuthController } from './controllers';

@Module({
  modules: [SharedModule, UserModule],
  controllers: [AuthController],
})
export class AuthModule {}
