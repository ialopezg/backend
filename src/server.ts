import { AppRunner } from '@ialopezg/corejs';
import * as dotenv from 'dotenv';
import * as path from 'path';

import { Application } from './app';
import { AppModule } from './modules/app';

dotenv.config({ path: path.join(__dirname, '..', '/.env') });

AppRunner.run(Application, AppModule);