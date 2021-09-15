import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRegistrationDto } from 'modules/auth/dtos';
import { RequestWithUserInterface } from 'modules/auth/interfaces';
import { AuthService } from 'modules/auth/services';
import { UserDto } from 'modules/user/dtos';
import { JwtAuthenticationGuard, LocalAuthenticationGuard } from '../guards';

@Controller('Auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully Registered',
    status: HttpStatus.OK,
    type: UserDto,
  })
  @ApiOperation({ summary: 'Allows new users registration' })
  async register(
    @Body() userRegistrationDto: UserRegistrationDto,
  ): Promise<UserDto> {
    const user = await this._authService.register(userRegistrationDto);

    return user.toDto();
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'An user logged in and a session cookie',
    status: HttpStatus.OK,
    type: UserDto,
  })
  @UseGuards(LocalAuthenticationGuard)
  @ApiOperation({ summary: 'Sign up users into the system' })
  async login(@Req() request: RequestWithUserInterface): Promise<UserDto> {
    const cookie = this._authService.getCookieWithJwtToken(request.user.uuid);

    request.res.setHeader('Set-Cookie', cookie);

    return request.user.toDto();
  }

  @UseGuards(JwtAuthenticationGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(@Req() request: RequestWithUserInterface) {
    request.res.setHeader('Set-Cookie', this._authService.getCookieForLogout());
  }
}
