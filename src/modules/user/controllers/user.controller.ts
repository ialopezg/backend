import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateResponse } from 'common/decorators';
import { PageDto, PageOptionsDto } from 'common/dtos';
import { JwtAccessTokenGuard } from 'modules/auth/guards';
import { FileDto, FilesPageDto } from 'modules/file/dtos';
import { UserDto } from '../dtos';
import { UserService } from '../services';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
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

  @UseGuards(JwtAccessTokenGuard)
  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  @PaginateResponse(UserDto)
  @ApiOperation({ summary: 'Get user' })
  async getUser(@Param('uuid') uuid: string): Promise<UserDto> {
    const user = await this._userService.getUser(uuid);

    return user.toDto();
  }

  @UseGuards(JwtAccessTokenGuard)
  @Get(':uuid/files')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user file list for given user',
    type: FileDto,
  })
  @PaginateResponse(FileDto)
  @ApiOperation({ summary: "Gets the user's files by given universal identifier" })
  async getUserFiles(@Param('uuid') uuid: string): Promise<FilesPageDto> {
    const user = await this._userService.getUserFiles(uuid);

    return user;
  }
}
