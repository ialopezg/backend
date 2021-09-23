import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import RateLimit from 'express-rate-limit';
import { HttpExceptionFilter, QueryFailedFilter } from 'filters';
import helmet from 'helmet';
import { AppModule } from 'modules/app';
import morgan from 'morgan';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import { setupSwagger } from 'utils/swagger';

async function bootstrap(): Promise<void> {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );

  app.enable('trust proxy');
  app.use(cookieParser());
  app.use(helmet());
  app.use(
    RateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('combined'));

  const reflector = app.get(Reflector);

  app.useGlobalFilters(
    new HttpExceptionFilter(reflector),
    new QueryFailedFilter(reflector),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  setupSwagger(app);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get('APP_PREFIX'));

  await app.listen(configService.get('APP_PORT'));
  Logger.log(
    `Application is running on: ${
      (await app.getUrl()).removeSlashAtEnd() + '/'
    }${configService.get('APP_PREFIX')}`,
    'InstanceLoader',
  );
}

void bootstrap();
