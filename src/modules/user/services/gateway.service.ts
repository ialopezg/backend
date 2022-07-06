import { Component, Gateway, SocketGateway } from '@ialopezg/corejs';
import { Subject } from 'rxjs';

@Component()
@SocketGateway()
export class ChatGatewayService implements Gateway {
  constructor() {
    console.log('Gateway listening!');
  }

  connection(_client: any) {
    console.log('Client connected!');
  }

  onInit(_server: any) {
    console.log('Server initialized!');
  }
}
