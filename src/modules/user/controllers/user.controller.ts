import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from 'modules/auth/guards';
import { RequestWithUserInterface } from 'modules/auth/interfaces';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('User')
@ApiTags('Users')
export class UserController {
  @UseGuards(JwtAccessTokenGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  public async getUser(@Req() { user }: RequestWithUserInterface) {
    return user;
  }
}
