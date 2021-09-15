import 'providers/polyfill.provider';

import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { contextMiddleware } from 'middlewares';
import { DatabaseModule } from 'modules/database';
import { AppService } from 'modules/app/services';
import { AuthModule } from 'modules/auth';
import { MailModule } from 'modules/mail';
import { UserModule } from 'modules/user';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        APP_PORT: Joi.number(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.number(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string().allow(''),
        DB_NAME: Joi.string(),
        JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_VERIFICATION_TOKEN_SECRET_KEY: Joi.string().required(),
        JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        EMAIL_HOST: Joi.string().required(),
        EMAIL_PORT: Joi.number().required(),
        EMAIL_ADDRESS: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        EMAIL_CONFIRMATION_URL: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: +configService.get<number>('REDIS_PORT'),
        },
      }),
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    MailModule,
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(contextMiddleware).forRoutes('*');
  }
}
