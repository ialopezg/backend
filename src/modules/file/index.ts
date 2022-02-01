import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './controllers/file.controller';
import { FileRepository } from './repositories/file.repository';

import { FileService } from './services';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([FileRepository])],
  controllers: [FileController],
  exports: [FileService],
  providers: [FileService],
})
export class FileModule {}
