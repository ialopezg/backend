import { Module } from '@ialopezg/corejs';

import { SharedService } from './services';

@Module({
  components: [SharedService],
})
export class SharedModule {}
