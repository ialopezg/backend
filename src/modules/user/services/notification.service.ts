import { Component } from '@ialopezg/corejs';

@Component()
export class NotificationService {
  storeNotification(data: any): void {
    const notification = this.mapDataToNotification(data);

    // store notification
  }

  mapDataToNotification(data: any): void {}
}
