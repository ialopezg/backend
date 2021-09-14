import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'modules/auth/services';
import { UserRegistrationDto } from 'modules/auth/dtos';
import { UserDto } from 'modules/user/dtos';

@Controller('Auth')
@ApiTags('Auth')
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
}
