import { InjectQueue } from '@nestjs/bull';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    @InjectQueue(MAIL_QUEUE) private readonly _mailQueue: Queue,
  ) {}

  public async sendConfirmationEmail(user: UserEntity): Promise<void> {
    const confirmUrl = this._getConfirmUrl(user.userAuth.email);

    try {
      await this._mailQueue.add(CONFIRM_REGISTRATION, { user, confirmUrl });
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
