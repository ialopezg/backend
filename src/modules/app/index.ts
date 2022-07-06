import { Module } from '@ialopezg/corejs';

import { AccountModule } from '../account';
import { AuthModule } from '../auth';
import { CurrencyModule } from '../currency';
import { MathModule } from '../math';
import { ProductModule } from '../product';
import { UserModule } from '../user';
import { ConfigController } from './controllers';

@Module({
  modules: [
    UserModule,
    AuthModule,
    AccountModule,
    MathModule,
    CurrencyModule,
    ProductModule,
  ],
  controllers: [ConfigController],
})
export class AppModule {}
