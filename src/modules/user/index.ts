import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuthRepository, UserRepository } from 'modules/user/repositories';
import { UserAuthService, UserService } from 'modules/user/services';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, UserAuthRepository])],
  providers: [UserService, UserAuthService],
  exports: [UserService, UserAuthService],
})
export class UserModule {}
