import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class FileCreateDto {
  @ApiPropertyOptional({ description: 'User file title' })
  @IsString()
  @IsOptional()
  readonly title: string;

  @ApiPropertyOptional({ description: 'User file path' })
  @IsString()
  @IsOptional()
  readonly path: string;

  @ApiPropertyOptional({ description: 'Whether avatar has public visibility', default: false })
  @IsBoolean()
  @IsOptional()
  readonly isPublic: boolean;
}