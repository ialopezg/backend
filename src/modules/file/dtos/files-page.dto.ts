import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from 'common/dtos';

import { FileDto } from './file.dto';

export class FilesPageDto {
  @ApiProperty({
    description: 'User file list data',
    type: () => FileDto,
    isArray: true,
  })
  readonly data: FileDto[]

  @ApiProperty({ description: 'Additonal information' })
  readonly meta: PageMetaDto;

  constructor(data: FileDto[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}