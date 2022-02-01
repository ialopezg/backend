import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'common/entities';
import { UserEntity } from 'modules/user/entities';
import { Column, Entity, ManyToOne, UpdateDateColumn } from 'typeorm';

import { FileDto } from '../dtos';

@Entity({ name: 'user_files' })
export class FileEntity extends AbstractEntity<FileDto> {
  @Column()
  public title: string;
  
  @Column({ unique: true })
  public url: string;

  @Column({ unique: true })
  public key: string;

  @Column({ default: false })
  public isPublic: boolean;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  @Exclude()
  updatedAt: Date;
  
  @ManyToOne(() => UserEntity, (owner: UserEntity) => owner.files)
  public owner: UserEntity;

  dtoClass = FileDto;
}
