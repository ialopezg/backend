import { Module } from '@nestjs/common';
import { AuthController } from 'modules/auth/controllers';
import { AuthService } from 'modules/auth/services';
import { UserModule } from 'modules/user';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
