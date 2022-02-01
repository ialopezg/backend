import { EntityRepository, Repository } from 'typeorm';

import { FileEntity } from '../entities';

@EntityRepository(FileEntity)
export class FileRepository extends Repository<FileEntity> {}
