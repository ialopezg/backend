import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'modules/auth/controllers';
import { AuthService } from 'modules/auth/services';
import {
  JwtAccessTokenStrategy,
  JwtConfirmTokenStrategy,
  JwtRefreshTokenStrategy,
  LocalStrategy,
} from 'modules/auth/strategies';
import { MailModule } from 'modules/mail';
import { UserModule } from 'modules/user';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    forwardRef(() => MailModule),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    JwtConfirmTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
