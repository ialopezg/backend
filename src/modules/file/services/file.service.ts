import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { PageMetaDto } from 'common/dtos';
import { info } from 'console';
import mime from 'mime-types';
import { UserEntity } from 'modules/user/entities';
import { DeleteResult } from 'typeorm';
import { generateFilename, getFileExtension, getFilenameWithoutExtension } from 'utils';

import { FilesPageDto, FilesPageOptionsDto } from '../dtos';
import { FileCreateDto } from '../dtos/file-create.dto';
import { FileEntity } from '../entities';
import { FileNotFoundException } from '../exceptions';
import { FileRepository } from '../repositories';

@Injectable()
export class FileService {
  private readonly _s3: AWS.S3;

  constructor(
    private readonly _configService: ConfigService,
    private readonly _fileRepository: FileRepository,
  ) {
    const region = this._configService.get('AWS_REGION');
    const options: AWS.S3.ClientConfiguration = {
      apiVersion: '2006-03-01',
      region,
    };

    const accessKeyId = this._configService.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this._configService.get('AWS_SECRET_ACCESS_KEY');
    if (accessKeyId && secretAccessKey) {
      options.credentials = new AWS.Credentials({
        accessKeyId,
        secretAccessKey,
      });
    }

    this._s3 = new AWS.S3(options);
  }

  public async getFileStream(uuid: string) {
    const file = await this.findFile(uuid);
    if (file) {
      const stream = this._s3
        .getObject({
          Bucket: this._configService.get('AWS_BUCKET_NAME'),
          Key: file.key,
        })
        .createReadStream();

      return {
        stream,
        info: file,
      };
    }

    throw new FileNotFoundException();
  }

  public async getFile(uuid: string): Promise<FileEntity> {
    const file = await this.findFile(uuid);
    if (file) {
      return file;
    }

    throw new FileNotFoundException('File not found');
  }

  public async getFiles(options: FilesPageOptionsDto, user: UserEntity = null): Promise<FilesPageDto> {
    const queryBuilder = this._fileRepository.createQueryBuilder('files');

    queryBuilder.leftJoinAndSelect('files.owner', 'user');
    if (user) {
      queryBuilder.where('user.id = :owner', { owner: user.id });
    }
    const [files, itemCount] = await queryBuilder
      .skip(options.skip)
      .take(options.take)
      .getManyAndCount();

    return new FilesPageDto(files.toDtos(), new PageMetaDto({ options, itemCount }));
  }

  public async uploadFile(
    file: Express.Multer.File,
    fileCreateDto: FileCreateDto,
    user: UserEntity,
  ): Promise<FileEntity> {
    const filename = generateFilename(<string>mime.extension(file.mimetype));
    const key = `${fileCreateDto.path.length ? fileCreateDto.path + '/' : ''}${filename}`;

    const result = await this._s3
      .putObject({
        Bucket: this._configService.get('AWS_BUCKET_NAME'),
        Body: file.buffer,
        ACL: 'public-read',
        Key: key,
      })
      .promise();

    if (result) {
      const newFile = this._fileRepository.create({
        title: fileCreateDto.title ?? getFilenameWithoutExtension(file.originalname),
        key,
        url: `${this._configService.get('AWS_PUBLIC_URL')}/${key}`,
        isPublic: fileCreateDto.isPublic,
        owner: user,
      });
      await this._fileRepository.save(newFile);

      return newFile;
    }

    throw new InternalServerErrorException(
      'Error while trying to upload a file, please try again',
    );
  }

  public async findFile(uuid: string): Promise<FileEntity> {
    const queryBuilder = this._fileRepository.createQueryBuilder('file');
    const file = await queryBuilder
      .where('file.uuid = :uuid', { uuid })
      .getOne();

    if (file) {
      return file;
    }

    throw new FileNotFoundException();
  }

  public async deleteFile(uuid: string): Promise<DeleteResult> {
    const file = await this.findFile(uuid);
    if (file) {
      this._s3
        .deleteObject({
          Bucket: this._configService.get('AWS_BUCKET_NAME'),
          Key: file.key,
        })
        .promise();

      return this._fileRepository.delete(file.id);
    }

    throw new NotFoundException('File not found');
  }
}
