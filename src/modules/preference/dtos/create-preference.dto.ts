import { IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class CreatePreferenceDto {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsJSON()
  @IsNotEmpty()
  @IsString()
  value: string;
}
