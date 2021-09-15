import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuthRepository, UserRepository } from 'modules/user/repositories';
import { UserAuthService, UserService } from 'modules/user/services';
import { UserController } from 'modules/user/controllers';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, UserAuthRepository])],
  controllers: [UserController],
  providers: [UserService, UserAuthService],
  exports: [UserService, UserAuthService],
})
export class UserModule {}
