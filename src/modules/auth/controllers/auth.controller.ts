import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRegistrationDto } from 'modules/auth/dtos';
import {
  JwtAccessTokenGuard,
  JwtRefreshTokenGuard,
  LocalAuthenticationGuard,
} from 'modules/auth/guards';
import { RequestWithUser } from 'modules/auth/interfaces';
import { AuthService } from 'modules/auth/services';
import { MailService } from 'modules/mail/services';
import { UserDto } from 'modules/user/dtos';
import { UserService } from 'modules/user/services';

@Controller('Auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
    private readonly _mailService: MailService,
  ) {}

  @Post('signup')
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

    await this._mailService.sendConfirmationEmail(user);

    return user.toDto();
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'An user logged in and a session cookie',
    status: HttpStatus.OK,
    type: UserDto,
  })
  @ApiOperation({ summary: 'Starts a new user session' })
  async login(@Req() request: RequestWithUser): Promise<UserDto> {
    const [accessTokenCookie, refreshTokenCookie] =
      await this._authService.login(request.user);

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return request.user.toDto();
  }

  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('signout')
  @ApiOperation({ summary: 'Delete current user session' })
  async logout(@Req() request: RequestWithUser): Promise<void> {
    await this._authService.logout(request.user);

    request.res.setHeader(
      'Set-Cookie',
      this._authService.getCookiesForLogout(),
    );
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Get('refresh')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User information with a new access token',
    type: UserDto,
  })
  @ApiOperation({ summary: 'Refresh current user access token' })
  async refresh(@Req() request: RequestWithUser): Promise<void> {
    const accessTokenCookie = this._authService.refreshToken(request.user);

    request.res.setHeader('Set-Cookie', accessTokenCookie);
  }
}
