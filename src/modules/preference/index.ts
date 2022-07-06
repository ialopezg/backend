import { Module } from '@ialopezg/corejs';
import { PreferenceService } from './services';

@Module({
  components: [PreferenceService],
  exports: [PreferenceService],
})
export class PreferenceModule {}