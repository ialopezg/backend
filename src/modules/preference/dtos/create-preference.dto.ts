import { IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class CreatePreferenceDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsJSON()
  @IsString()
  @IsNotEmpty()
  value: string;
}
