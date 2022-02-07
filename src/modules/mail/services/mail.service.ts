import { InjectQueue } from '@nestjs/bull';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Queue } from 'bull';

import { AuthService } from '../../auth/services';
import { CONFIRM_REGISTRATION, MAIL_QUEUE } from '../../mail/constants';
import { UserEntity } from '../../user/entities';

@Injectable()
export class MailService {
  private readonly _logger = new Logger(MailService.name);

  constructor(
    private readonly _configService: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private readonly _authService: AuthService,
    // @InjectQueue(MAIL_QUEUE) private readonly _mailQueue: Queue,
    @Inject('MAIL_SERVICE') private _client: ClientProxy,
  ) {}

  public async sendConfirmationEmail(user: UserEntity): Promise<void> {
    const confirmUrl = this._getConfirmUrl(user.userAuth.email);

    try {
      // await this._mailQueue.add(CONFIRM_REGISTRATION, { user, confirmUrl });
      this._client.emit(
        { cmd: 'send-message' },
        {
          from: this._configService.get('EMAIL_FROM'),
          subject: `${this._configService.get('EMAIL_DEFAULT_SUBJECT')} ${
            user.firstName
          } ${user.lastName}`,
          emailAddress: user.userAuth.email,
          context: {
            confirmUrl,
            recipientName: `${user.firstName} ${user.lastName}`,
            customerId: user.userAuth.pinCode,
            apiTitle: this._configService.get('APP_SITE_TITLE'),
            apiLogoUrl: this._configService.get('APP_SITE_LOGO_URL'),
            senderName: this._configService.get('APP_SITE_TITLE'),
            senderAddress: this._configService.get('APP_CONTACT_ADDRESS'),
            senderCity: this._configService.get('APP_CONTACT_CITY'),
            senderState: this._configService.get('APP_CONTACT_STATE_ABBR'),
            senderPostalCode: this._configService.get(
              'APP_CONTACT_POSTAL_CODE',
            ),
            contactUrl: this._configService.get('APP_CONTACT_URL'),
            unsubscribeUrl: this._configService.get('APP_UNSUBSCRIBE_URL'),
            unsubscribePreferencesUrl: this._configService.get(
              'APP_UNSUBSCRIBE_PREFERENCES_URL',
            ),
          },
        },
      );
    } catch (error) {
      this._logger.error(
        `Error queueing registration email to user ${user.userAuth.email}`,
      );

      throw error;
    }
  }

  private _getConfirmUrl(email: string): string {
    const token = this._authService.getJwtConfirmToken(email);

    return `${this._configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;
  }
}
