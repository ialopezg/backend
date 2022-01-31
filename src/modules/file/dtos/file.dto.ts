import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from 'common/dtos';

import { FileEntity } from '../entities';

export class FileDto extends AbstractDto {
  @ApiProperty({ description: 'File url access' })
  readonly url: string;

  @ApiProperty({ description: 'File storage key' })
  readonly key: string;

  @ApiProperty({ description: 'Whether avatar has public visibility' })
  readonly isPublic: boolean;

  constructor(file: FileEntity) {
    super(file);

    this.url = file.url;
    this.key = file.key;
  }
}
