import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuthRepository, UserRepository } from 'modules/user/repositories';
import { UserAuthService, UserService } from 'modules/user/services';
import { FileModule } from 'modules/file';

import { UserController } from './controllers';

@Module({
  imports: [
    FileModule,
    TypeOrmModule.forFeature([UserRepository, UserAuthRepository]),
  ],
  controllers: [UserController],
  providers: [UserService, UserAuthService],
  exports: [UserService, UserAuthService],
})
export class UserModule {}
