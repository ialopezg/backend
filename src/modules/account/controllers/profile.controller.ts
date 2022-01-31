import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
  JwtRefreshTokenGuard,
  EmailConfirmationGuard,
  JwtAccessTokenGuard,
  JwtConfirmTokenGuard,
} from 'modules/auth/guards';
import { RequestWithUser } from 'modules/auth/interfaces';
import { AuthService } from 'modules/auth/services';
import { FileDto } from 'modules/file/dtos';
import { UserDto } from 'modules/user/dtos';
import { UserService } from 'modules/user/services';

@Controller('account')
@ApiTags('Profile')
export class ProfileController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
  ) {}

  @UseGuards(JwtConfirmTokenGuard)
  @Patch('confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Send a confirmation email process for current user',
  })
  async confirm(@Req() { user }: RequestWithUser): Promise<void> {
    return this._authService.confirm(user);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post('confirm/resend')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Resend the confirmation link for current user',
  })
  async resendConfirmationLink(
    @Req() { user }: RequestWithUser,
  ): Promise<void> {
    await this._authService.resendConfirmationLink(user);
  }

  @UseGuards(JwtRefreshTokenGuard, EmailConfirmationGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get current user profile',
    type: UserDto,
  })
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() { user }: RequestWithUser): Promise<UserDto> {
    return user.toDto();
  }

  @Post('profile/avatar')
  @UseGuards(JwtRefreshTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Current user profile with avatar',
    type: UserDto,
  })
  @ApiOperation({ summary: 'Uploads an avatar to current user' })
  async addAvatar(
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserDto> {
    const user = await this._userService.addAvatar(request.user, file);

    return user.toDto();
  }

  @Get('profile/avatar')
  @UseGuards(JwtAccessTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Current user profile with avatar',
    type: FileDto,
  })
  @ApiOperation({ summary: 'Gets current user avatar' })
  async getAvatar(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ): Promise<any> {
    if (request.user.avatar.isPublic) {
      return request.user.toDto().avatar;
    }

    const file = await this._userService.getAvatar(request.user);
    file.stream.pipe(response);
  }

  @Delete('profile/avatar')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ description: 'Avatar image succesfully deleted.' })
  @ApiOperation({ summary: 'Delete current user avatar image' })
  async deleteAvatar(@Req() request: RequestWithUser) {
    const result = this._userService.deleteAvatar(request.user);

    return {
      affectedRows: (await result).affected,
      message: 'Avatar successfully removed from current user.',
    };
  }
}
