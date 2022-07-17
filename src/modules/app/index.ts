import { Module } from '@ialopezg/corejs';

import { AuthModule } from '../auth';
import { UserModule } from '../user';

@Module({
  modules: [
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
