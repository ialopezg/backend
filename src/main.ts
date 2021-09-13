import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as compression from 'compression';
import * as RateLimit from 'express-rate-limit';
import { HttpExceptionFilter, QueryFailedFilter } from 'filters';
import * as helmet from 'helmet';
import { AppModule } from 'modules/app';
import * as morgan from 'morgan';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );

  app.enable('trust proxy');
  app.use(helmet());
  app.use(
    RateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );
  app.use(compression());
  app.use(morgan('combined'));
  app.setGlobalPrefix('api');

  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalFilters(
    new HttpExceptionFilter(reflector),
    new QueryFailedFilter(reflector),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      // dismissDefaultMessages: true,
      validationError: { target: false },
    }),
  );

  const configService = app.get(ConfigService);
  await app.listen(configService.get('APP_PORT'));
}

void bootstrap();
