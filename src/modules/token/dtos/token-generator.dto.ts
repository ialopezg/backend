import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class TokenGeneratorDto {
  @IsNotEmpty()
  @IsString()
    key: string;

  @IsPositive()
  @IsNumber()
    expiration: number;
}
