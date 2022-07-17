import { Component, HttpStatus } from '@ialopezg/corejs';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { createTransport } from 'nodemailer';
import * as path from 'path';

import { Response } from '../../../common/interfaces';
import { PreferenceService } from '../../preference/services';

@Component()
export class MailerService {
  private options: any;
  private appOptions: any;
  private frontendOptions: any;
  public enabled: boolean;

  constructor(private readonly preferences: PreferenceService) {
    this.init().then(() => console.log('MailerService initialized!'));
  }

  async sendMail(to: string, subject: string, html: any): Promise<Response> {
    if (!this.enabled) {
      return {
        status: HttpStatus.FORBIDDEN,
        message: 'MailerService has bad configuration or is not enabled',
      };
    }

    const transporter = createTransport({
      service: this.options.name,
      auth: {
        user: this.options.user,
        pass: this.options.password,
      },
    });
    const from = this.options.sender;

    const info = await transporter.sendMail({
      to,
      from,
      subject,
      html,
    });

    return {
      status: HttpStatus.OK,
      message:
        'An email with Activation details was sent to your email address!',
      data: { info },
    };
  }

  async sendPasswordRecovery(user: any, token: string): Promise<Response> {
    const to = user.email;
    const subject = `:::${this.appOptions.name}::: - New user registration`;
    const name = user.name;
    const username = user.username;
    const link = `${this.frontendOptions.url.password}/${token}`;
    const html = MailerService.compileTemplate('password-reset');

    return this.sendMail(
      to,
      subject,
      html({
        baseUrl: this.frontendOptions.url.base,
        logoUrl: this.appOptions.logo.web,
        app: this.appOptions.name,
        name,
        username,
        link,
      }),
    );
  }

  async sendVerification(user: any, token: string): Promise<Response> {
    const to = user.email;
    const subject = `:::${this.appOptions.name}::: - New user registration`;
    const name = user.name;
    const username = user.username;
    const link = `${this.frontendOptions.url.verification}/${token}`;
    const html = MailerService.compileTemplate('verification');
    console.log(link);
    return this.sendMail(
      to,
      subject,
      html({
        baseUrl: this.frontendOptions.url.base,
        logoUrl: this.appOptions.logo.web,
        app: this.appOptions.name,
        name,
        username,
        link,
      }),
    );
  }

  private static compileTemplate(template: string): any {
    const fileName = path.join(__dirname, '../templates', `${template}.hbs`);
    const source = fs.readFileSync(fileName, 'utf8');

    return handlebars.compile(source);
  }

  private async init(): Promise<void> {
    this.options = await this.preferences.getValue('mailer.service');
    this.enabled = !!this.options;
    this.appOptions = await this.preferences.getValue('company');
    this.frontendOptions = await this.preferences.getValue('frontend');
  }
}
