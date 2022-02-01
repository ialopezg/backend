import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from 'common/dtos';
import { UserDto } from 'modules/user/dtos';

import { FileEntity } from '../entities';

export class FileDto extends AbstractDto {
  @ApiProperty({ description: 'File title' })
  readonly title: string;

  @ApiPropertyOptional({ description: 'File url access' })
  readonly url?: string;

  @ApiProperty({ description: 'File storage key' })
  readonly key: string;

  @ApiProperty({ description: 'Whether avatar has public visibility' })
  readonly isPublic: boolean;

  @ApiProperty({ description: 'File owner', type: () => UserDto })
  readonly owner?: UserDto;

  constructor(file: FileEntity) {
    super(file);

    this.title = file.title;
    if (file.isPublic) {
      this.url = file.url;
    }
    this.key = file.key;
    this.owner = file.owner?.toDto();
  }
}
