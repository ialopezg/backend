import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { bool } from 'aws-sdk/clients/signer';
import { PageDto, PageMetaDto, PageOptionsDto } from 'common/dtos';
import { FilesPageOptionsDto } from 'modules/file/dtos';
import { FilesPageDto } from 'modules/file/dtos/files-page.dto';
import { FileEntity } from 'modules/file/entities';
import { FileNotImageException } from 'modules/file/exceptions';
import { FileService } from 'modules/file/services';
import { UpdateResult } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { isEmail, isImage, isNumeric, isUUID } from 'utils';

import { UserCreateDto, UserDto } from '../dtos';
import { UserEntity } from '../entities';
import { UserNotFoundException } from '../exceptions';
import { UserRepository } from '../repositories';
import { UserAuthService } from '../services';

@Injectable()
export class UserService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _userAuthService: UserAuthService,
    private readonly _fileService: FileService,
  ) { }

  @Transactional()
  public async createUser(userCreateDto: UserCreateDto): Promise<UserEntity> {
    const user = this._userRepository.create(userCreateDto);
    await this._userRepository.save(user);

    const createdUser = { ...userCreateDto, user };

    await Promise.all([this._userAuthService.createUserAuth(createdUser)]);

    return this.findUser({ uuid: user.uuid });
  }

  public async findUser(
    options: Partial<{ uuid: string; email: string; pinCode: number }>,
  ): Promise<UserEntity | undefined> {
    const queryBuilder = this._userRepository.createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.userAuth', 'userAuth');
    queryBuilder.leftJoinAndSelect('user.avatar', 'userFiles');

    if (options.uuid && isUUID(options.uuid)) {
      queryBuilder.where('user.uuid = :uuid', { uuid: options.uuid });

      return queryBuilder.getOne();
    }

    if (options.pinCode && isNumeric(options.pinCode)) {
      queryBuilder.orWhere('userAuth.pinCode = :pinCode', {
        pinCode: options.pinCode,
      });

      return queryBuilder.getOne();
    }

    if (options.email && isEmail(options.email)) {
      queryBuilder.orWhere('userAuth.email = :email', { email: options.email });

      return queryBuilder.getOne();
    }

    throw new UserNotFoundException();
  }

  public async getUser(uuid: string): Promise<UserEntity | undefined> {
    return this.findUser({ uuid });
  }

  public async getUsers(options: PageOptionsDto): Promise<PageDto<UserDto>> {
    const queryBuilder = this._userRepository.createQueryBuilder('user');

    const [users, itemCount] = await queryBuilder
      .orderBy('user.createdAt', options.order)
      .skip(options.skip)
      .take(options.take)
      .getManyAndCount();

    return new PageDto(users.toDtos(), new PageMetaDto({ options, itemCount }));
  }

  @Transactional()
  public async addAvatar(
    user: UserEntity,
    file: Express.Multer.File,
  ): Promise<UserEntity> {
    let avatar: FileEntity;
    if (file && !isImage(file.mimetype)) {
      throw new FileNotImageException(
        `File '${file.originalname}' is not an image.`,
      );
    }

    if (file) {
      avatar = await this._fileService.uploadFile(file, 'users/avatars', user);
    }

    this._userRepository.update(user.id, { avatar });

    return this.findUser({ uuid: user.uuid });
  }

  public async getAvatar(user: UserEntity) {
    if (user.avatar) {
      return this._fileService.getFileStream(user.avatar?.uuid);
    }

    throw new NotFoundException('User avatar not found.');
  }

  @Transactional()
  public async deleteAvatar(
    user: UserEntity,
    deleteFile: bool = false,
  ): Promise<UpdateResult> {
    if (user.avatar) {
      const result = await this._userRepository.update(user.id, {
        avatar: null,
      });

      if (result && deleteFile) {
        const deletionResult = await this._fileService.deleteFile(
          user.avatar?.uuid,
        );
        if (deletionResult) {
          return result;
        }

        throw new InternalServerErrorException(
          'An error has been occured while trying to delete user avatar file. Current user has no avatar attached.',
        );
      } else if (result && !deleteFile) {
        return result;
      }

      throw new InternalServerErrorException(
        'An error has been occured while trying to delete user avatar. No actions were executed.',
      );
    }

    throw new NotFoundException(
      'Current user has not avatar image attached.',
    );
  }

  public async getUserFiles(uuid: string): Promise<FilesPageDto> {
    const user = await this.findUser({ uuid });

    if (user) {
      return this._fileService.getFiles(new FilesPageOptionsDto(), user);
    }

    throw new UserNotFoundException();
  }
}
