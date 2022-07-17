import { IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePreferenceDto {
  @IsJSON()
  @IsNotEmpty()
  @IsString()
  value: string;
}
