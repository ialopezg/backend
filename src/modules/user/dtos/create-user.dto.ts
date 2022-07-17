import { IsMobilePhone, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

import { CreateAuthDto } from '../../auth/dtos/create-auth.dto';

export class CreateUserDto extends CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsMobilePhone()
  @IsOptional()
  mobile?: string;
}