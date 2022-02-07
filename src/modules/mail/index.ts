import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'modules/auth';
import { MAIL_QUEUE } from 'modules/mail/constants';
import { MailProcessor } from 'modules/mail/processors';
import { resolve } from 'path';

import { MailService } from './services';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => AuthModule),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('EMAIL_HOST'),
          port: +configService.get('EMAIL_PORT'),
          secure: true,
          auth: {
            user: configService.get('EMAIL_ADDRESS'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
        },
        defaults: { from: configService.get('EMAIL_FROM') },
        template: {
          dir: resolve(__dirname, '..', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
    BullModule.registerQueue({
      name: MAIL_QUEUE,
    }),
  ],
  providers: [MailService, {
    provide: 'MAIL_SERVICE',
    useFactory: () => ClientProxyFactory.create({ transport: Transport.TCP }),
  },],
  exports: [MailService],
})
export class MailModule {}