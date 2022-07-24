import {
  Length,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString, Matches,
  MinLength, IsEnum,
} from 'class-validator';
import { UserStatus } from '../../user/enums';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
    fid?: string;

  @IsEmail()
  @IsNotEmpty()
    email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required!' })
  @MinLength(8)
  @Matches(/\d/, { message: 'password must contains at least a digit' })
  @Matches(/(?=.*[a-z])/, { message: 'password must contains at least a lowercase character' })
  @Matches(/(?=.*[A-Z])/, { message: 'password must contains at least an uppercase character' })
  @Matches(/(?=.*\W)/, { message: 'password must contains at least a special character' })
  @IsOptional()
    password?: string;

  @IsString()
  @Length(4, 8)
  @Matches(/^(?=.*[A-z])/, { message: 'username must start with a alpha character' })
  @Matches(/^[A-Za-z\d-_.]+$/, { message: 'username contains invalid characters' })
  @IsOptional()
    username?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
    role?: string;

  @IsEnum(UserStatus)
  @IsOptional()
    status?: string;
}
