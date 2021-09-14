import { UserAuthEntity } from 'modules/user/entities';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { UtilsService } from 'utils/services';

@EventSubscriber()
export class UserAuthSubscriber
  implements EntitySubscriberInterface<UserAuthEntity>
{
  listenTo() {
    return UserAuthEntity;
  }

  beforeInsert({ entity }: InsertEvent<UserAuthEntity>): void {
    console.log('event', entity);

    if (entity.password) {
      entity.password = UtilsService.generateHash(entity.password);
    }
  }

  beforeUpdate({ entity, databaseEntity }: UpdateEvent<UserAuthEntity>): void {
    if (entity?.password !== databaseEntity?.password) {
      entity.password = UtilsService.generateHash(entity.password);
    }
  }
}
