import { IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePreferenceDto {
  @IsJSON()
  @IsString()
  @IsNotEmpty()
  value: string;
}
