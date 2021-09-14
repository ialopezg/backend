import { RoleType } from 'common/constants';
import { AbstractEntity } from 'common/entities';
import { UserAuthDto } from 'modules/user/dtos';
import { UserEntity } from 'modules/user/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users_auth' })
export class UserAuthEntity extends AbstractEntity<UserAuthDto> {
  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @Column({ unique: true })
  pinCode: number;

  @Column()
  password: string;

  @Column({ nullable: true })
  lastSuccessfulLoggedDate?: Date;

  @Column({ nullable: true })
  lastFailedLoggedDate?: Date;

  @Column({ nullable: true })
  lastLogoutDate?: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  updatedAt: Date;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.userAuth)
  @JoinColumn()
  public user: UserEntity;

  dtoClass = UserAuthDto;
}
