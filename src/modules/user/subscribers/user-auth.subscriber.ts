import { UserAuthEntity } from 'modules/user/entities';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { encodeString, generateHash } from 'utils';

@EventSubscriber()
export class UserAuthSubscriber
  implements EntitySubscriberInterface<UserAuthEntity>
{
  listenTo() {
    return UserAuthEntity;
  }

  async beforeInsert({ entity }: InsertEvent<UserAuthEntity>): Promise<void> {
    console.log('event', entity);

    if (entity.password) {
      entity.password = await generateHash(entity.password);
    }
  }

  async beforeUpdate({
    entity,
    databaseEntity,
  }: UpdateEvent<UserAuthEntity>): Promise<void> {
    const password = await generateHash(entity.password);

    if (password !== databaseEntity?.password) {
      entity.password = generateHash(entity.password);
    }

    if (entity.currentHashedRefreshToken) {
      const currentHashedRefreshToken = await encodeString(
        entity.currentHashedRefreshToken,
      );

      entity.currentHashedRefreshToken = await generateHash(
        currentHashedRefreshToken,
      );
    }
  }
}
