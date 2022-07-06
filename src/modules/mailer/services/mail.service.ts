import { Component } from '@ialopezg/corejs';
import * as fs from 'fs';
import { createTransport } from 'nodemailer';
import * as path from 'path';

@Component()
export class MailService {
  async sendMail(to: string, subject: string, template: string, text?: string) {
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD,
      },
    });

    const html = this.compileTemplate(template);
    // const from = '"Gailisis Dawsons 👻" <gailisisdawsons@gmail.com>';
    // const info = await transporter.sendMail({
    //   from,
    //   to,
    //   subject,
    //   html,
    // });
    // if (!info) {
    //   throw new HttpException(
    //     "Email cannot be sent!",
    //     HttpStatus.INTERNAL_SERVER_ERROR
    //   );
    // }

    // return info.messageId;
    return false;
  }

  private compileTemplate(template: string): string {
    const source = fs.readFileSync(path.join(__dirname, template), 'utf8');
    console.log(source);

    return '';
  }
}
