import { AbstractEntity } from 'common/entities';
import { UserDto } from 'modules/user/dtos';
import { Column, CreateDateColumn, Entity, OneToOne, UpdateDateColumn } from 'typeorm';
import { UserAuthEntity } from '.';

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

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  updatedAt: Date;

  @OneToOne(() => UserAuthEntity, (userAuth: UserAuthEntity) => userAuth.user)
  public userAuth: UserAuthEntity;

  dtoClass = UserDto;
}
