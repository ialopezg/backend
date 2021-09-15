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
import { JwtAuthenticationGuard } from 'modules/auth/guards';
import { RequestWithUserInterface } from 'modules/auth/interfaces';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('User')
@ApiTags('Users')
export class UserController {
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  public async getUser(@Req() { user }: RequestWithUserInterface) {
    return user;
  }
}
