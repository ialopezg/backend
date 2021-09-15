import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { CONFIRM_REGISTRATION, MAIL_QUEUE } from 'modules/mail/constants';
import { UserEntity } from 'modules/user/entities';

@Injectable()
@Processor(MAIL_QUEUE)
export class MailProcessor {
  private readonly _logger = new Logger(MailProcessor.name);

  constructor(
    private readonly _configService: ConfigService,
    private readonly _mailerService: MailerService,
  ) {}

  @OnQueueActive()
  public onActive(job: Job): void {
    this._logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job): void {
    this._logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onError(job: Job<any>, error: any): void {
    this._logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process(CONFIRM_REGISTRATION)
  public async confirmRegistration(
    job: Job<{ user: UserEntity; confirmUrl: string }>,
  ) {
    this._logger.log(
      `Sending confirm registration email to '${job.data.user.userAuth.email}'`,
    );

    try {
      return this._mailerService.sendMail({
        to: job.data.user.userAuth.email,
        from: this._configService.get('EMAIL_ADDRESS'),
        subject: 'Registration',
        template: './registration',
        context: { confirmUrl: job.data.confirmUrl },
      });
    } catch {
      this._logger.error(
        `Failed to send confirmation email to '${job.data.user.userAuth.email}'`,
      );
    }
  }
}
