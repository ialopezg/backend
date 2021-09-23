import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginateResponse } from 'common/decorators';
import { PageDto, PageOptionsDto } from 'common/dtos';
import { JwtAccessTokenGuard } from 'modules/auth/guards';
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
