import 'providers/polyfill.provider';

import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { contextMiddleware } from 'middlewares';
import { DatabaseModule } from 'modules/database';
import { AccountModule } from 'modules/account';
import { AppService } from 'modules/app/services';
import { AuthModule } from 'modules/auth';
import { MailModule } from 'modules/mail';
import { UserModule } from 'modules/user';
import { FileModule } from 'modules/file';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        APP_PORT: Joi.number(),
        APP_SITE_TITLE: Joi.string(),
        APP_SITE_URL: Joi.string(),
        APP_CONTACT_ADDRESS: Joi.string(),
        APP_CONTACT_CITY: Joi.string(),
        APP_CONTACT_STATE_ABBR: Joi.string(),
        APP_CONTACT_STATE: Joi.string(),
        APP_CONTACT_POSTAL_CODE: Joi.string(),
        APP_CONTACT_URL: Joi.string(),
        APP_UNSUBSCRIBE_URL: Joi.string(),
        APP_UNSUBSCRIBE_PREFERENCES_URL: Joi.string(),
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
        EMAIL_QUEUE_TYPE: Joi.string().required(),
        EMAIL_QUEUE_HOST: Joi.string().required(),
        EMAIL_QUEUE_PORT: Joi.number().required(),
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('EMAIL_QUEUE_HOST'),
          port: +configService.get<number>('EMAIL_QUEUE_PORT'),
        },
      }),
    }),
    DatabaseModule,
    AuthModule,
    AccountModule,
    UserModule,
    FileModule,
    MailModule,
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(contextMiddleware).forRoutes('*');
  }
}
