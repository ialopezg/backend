import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRegistrationDto } from 'modules/auth/dtos';
import {
  JwtAuthenticationGuard,
  JwtRefreshGuard,
  LocalAuthenticationGuard,
} from 'modules/auth/guards';
import { RequestWithUserInterface } from 'modules/auth/interfaces';
import { AuthService } from 'modules/auth/services';
import { UserDto } from 'modules/user/dtos';
import { UserEntity } from 'modules/user/entities';
import { UserService } from 'modules/user/services';

@Controller('Auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
  ) {}

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
  @ApiOperation({ summary: 'Starts a new user session' })
  async login(@Req() request: RequestWithUserInterface): Promise<UserDto> {
    const [accessTokenCookie, refreshTokenCookie] =
      await this._authService.login(request.user);

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return request.user.toDto();
  }

  @Get('/profile')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get current user profile',
    type: UserDto,
  })
  @ApiOperation({ summary: 'Get current user profile' })
  async userProfile(
    @Req() { user }: RequestWithUserInterface,
  ): Promise<UserDto> {
    const userEntity = await this._userService.getUser(user.uuid);

    return userEntity.toDto();
  }

  @UseGuards(JwtAuthenticationGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('logout')
  @ApiOperation({ summary: 'Delete current user session' })
  async logout(@Req() request: RequestWithUserInterface): Promise<void> {
    await this._authService.logout(request.user);

    request.res.setHeader(
      'Set-Cookie',
      this._authService.getCookiesForLogout(),
    );
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User information with a new access token',
    type: UserDto,
  })
  @ApiOperation({ summary: 'Refresh current user access token' })
  async refresh(@Req() request: RequestWithUserInterface): Promise<UserEntity> {
    const accessTokenCookie = this._authService.refreshToken(request.user);

    request.res.setHeader('Set-Cookie', accessTokenCookie);

    return request.user;
  }
}
