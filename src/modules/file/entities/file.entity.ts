import { AbstractEntity } from 'common/entities';
import { Column, Entity } from 'typeorm';
import { FileDto } from '../dtos';

@Entity({ name: 'user_files' })
export class FileEntity extends AbstractEntity<FileDto> {
  @Column({ unique: true })
  public url: string;

  @Column({ unique: true })
  public key: string;

  @Column({ default: false })
  public isPublic: boolean;

  dtoClass = FileDto;
}
