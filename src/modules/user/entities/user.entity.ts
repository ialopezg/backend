import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'common/entities';
import { FileEntity } from 'modules/file/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';

import { UserDto } from '../dtos';
import { UserAuthEntity } from '../entities';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  motherName?: string;

  get shortName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Column({ unique: true, nullable: true })
  phone?: string;

  @OneToOne(() => FileEntity, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn()
  avatar?: FileEntity;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  @Exclude()
  updatedAt: Date;

  @OneToOne(() => UserAuthEntity, (userAuth: UserAuthEntity) => userAuth.user, {
    eager: true,
    onDelete: 'CASCADE',
  })
  public userAuth: UserAuthEntity;

  @OneToMany(() => FileEntity, (file: FileEntity) => file.owner)
  public files: FileEntity[];

  dtoClass = UserDto;

  constructor(
    firstName: string,
    middleName?: string,
    lastName?: string,
    motherName?: string,
    phone?: string,
    avatar?: FileEntity,
    userAuth?: UserAuthEntity,
  );
  constructor(
    firstName: string,
    middleName: string,
    lastName?: string,
    motherName?: string,
    phone?: string,
    avatar?: FileEntity,
    userAuth?: UserAuthEntity,
  );
  constructor(
    firstName: string,
    middleName: string,
    lastName: string,
    motherName?: string,
    phone?: string,
    avatar?: FileEntity,
    userAuth?: UserAuthEntity,
  );
  constructor(
    firstName: string,
    middleName: string,
    lastName: string,
    motherName: string,
    phone?: string,
    avatar?: FileEntity,
    userAuth?: UserAuthEntity,
  );
  constructor(
    firstName: string,
    middleName: string,
    lastName: string,
    motherName: string,
    phone: string,
    avatar?: FileEntity,
    userAuth?: UserAuthEntity,
  );
  constructor(
    firstName: string,
    middleName: string,
    lastName: string,
    motherName: string,
    phone: string,
    avatar?: FileEntity,
    userAuth?: UserAuthEntity,
  );
  constructor(
    firstName: string,
    middleName: string,
    lastName: string,
    motherName: string,
    phone: string,
    avatar?: FileEntity,
    userAuth?: UserAuthEntity,
  );
  constructor(
    firstName?: string,
    middleName?: string,
    lastName?: string,
    motherName?: string,
    phone?: string,
    avatar?: FileEntity,
    userAuth?: UserAuthEntity,
  );
  constructor(
    firstName?: string,
    middleName?: string,
    lastName?: string,
    motherName?: string,
    phone?: string,
    avatar?: FileEntity,
    userAuth?: UserAuthEntity,
  ) {
    super();

    this.firstName = firstName || '';
    this.middleName = middleName || '';
    this.lastName = lastName || '';
    this.motherName = motherName || '';
    this.phone = phone || '';
    this.avatar = avatar || undefined;
    this.userAuth = userAuth || undefined;
  }
}
