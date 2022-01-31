import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponse } from 'common/decorators';
import { PageDto, PageOptionsDto } from 'common/dtos';
import { EmailConfirmationGuard, JwtAccessTokenGuard, JwtRefreshTokenGuard } from 'modules/auth/guards';
import { RequestWithUser } from 'modules/auth/interfaces';
import { FileDto } from 'modules/file/dtos';
import { FileEntity } from 'modules/file/entities';
import { UserDto } from '../dtos';
import { UserService } from '../services';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('User')
@ApiTags('Users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @UseGuards(JwtAccessTokenGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @PaginateResponse(UserDto)
  @ApiOperation({ summary: 'Get user list' })
  async getUsers(@Query() options: PageOptionsDto): Promise<PageDto<UserDto>> {
    return this._userService.getUsers(options);
  }
}
