import { Module } from '@nestjs/common';
import { AuthModule } from 'modules/auth';
import { UserModule } from 'modules/user';

import { ProfileController } from './controllers';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [ProfileController],
})
export class AccountModule {}
