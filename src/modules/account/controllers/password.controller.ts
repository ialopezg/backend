import { HttpStatus } from '@ialopezg/corejs';
import {
  Controller,
  generateHash,
  RequestMapping,
  RequestMethod,
  randomString,
} from '@ialopezg/corejs';
import { Request, Response } from 'express';

import { MailService } from '../../mailer/services';
import { UserService } from '../../user/services';
import { PasswordService } from '../services';

@Controller({ path: 'account/password' })
export class PasswordController {
  private readonly userService = new UserService();
  private readonly passwordService = new PasswordService();
  private readonly mailerService = new MailService();

  @RequestMapping({ path: 'recovery', method: RequestMethod.POST })
  async recover(request: Request | any, response: Response) {
    const user = await this.userService.getUserByEmail(request.body.email);
    console.log(user);
    if (!user) {
      response
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'User not found!' });

      return;
    }

    const storedToken = await this.passwordService.getToken(user.id);
    const context = process.env.APP_NAME;
    const token = await generateHash(randomString(32));
    const url = `${process.env.FRONTEND_URL}account/password/reset/${user.id}/${token}`;

    let newToken = null;
    if (storedToken) {
      newToken = await this.passwordService.updateToken(user.id, {
        token,
        url,
      });
    } else {
      newToken = await this.passwordService.createPasswordToken({
        token,
        user: user.id,
      });
    }

    if (!newToken) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Password cannot be reseted. Try again!' });

      return;
    }

    const body = `
    <h2>Hi ${user.name},</h2>
    <p>Please, click the link below to reset your password</p>
    <a href=${url}>Reset password</a>`;
    const result = await this.mailerService.sendMail(
      user.email,
      `:::${context}::: - Password Reset`,
      body,
    );

    response.json({
      message: 'A recovery password email has been sent.',
    });
  }
}
