import { Column, Generated, PrimaryGeneratedColumn } from 'typeorm';

import { UtilsService } from '../../utils/services';
import { AbstractDto } from '../dtos';

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  abstract dtoClass: new (entity: AbstractEntity, options?: any) => T;

  toDto(options?: any): T {
    return UtilsService.toDto(this.dtoClass, this, options);
  }

  constructor(id: number, uuid?: string);
  constructor(id: number, uuid: string);
  constructor(id?: number, uuid?: string);
  constructor(id?: number, uuid?: string) {
    this.id = id;
    this.uuid = uuid;
  }
}
