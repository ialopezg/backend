import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { UserEntity } from 'modules/user/entities';
import { UtilsService } from 'utils/services';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  public listenTo(): any {
    return UserEntity;
  }

  beforeInsert({ entity }: InsertEvent<UserEntity>): void {
    if (entity.firstName) {
      entity.firstName = UtilsService.capitalizeFirst(entity.firstName);
    }
    if (entity.lastName) {
      entity.lastName = UtilsService.capitalizeFirst(entity.lastName);
    }
  }

  beforeUpdate({ entity, databaseEntity }: UpdateEvent<UserEntity>): void {
    if (entity.firstName && entity.firstName !== databaseEntity.firstName) {
      entity.firstName = UtilsService.capitalizeFirst(entity.firstName);
    }
    if (entity.lastName && entity.lastName !== databaseEntity.lastName) {
      entity.lastName = UtilsService.capitalizeFirst(entity.lastName);
    }
  }
}
