import 'providers/polyfill.provider';

import { SnakeNamingStrategy } from 'modules/database/strategies';
import { ConfigService } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';

const configService = new ConfigService();

const config: ConnectionOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: +configService.get<number>('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['src/modules/**/*{.entity,.index}{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  migrationsRun: true,
  subscribers: [],
  synchronize: false,
  logging: true,
};

export = config;
