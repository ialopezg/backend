import { Component, HttpStatus, isEmpty } from '@ialopezg/corejs';

import { UserService } from '../../user/services';
import { RegistrationDto } from '../dtos';
import { TokenService } from '../../token/services';
import { MailerService } from '../../mailer/services';
import { PreferenceService } from '../../preference/services';

@Component()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly preferences: PreferenceService,
    private readonly tokenService: TokenService,
    private readonly mailerService: MailerService,
  ) {
  }

  async createDefaultUsers(): Promise<void> {
    await this.createRootUser();
    await this.createAdminUser();
  }

  private async createRootUser(): Promise<void> {
    const email = process.env.APP_ROOT_USER_EMAIL;
    const password = process.env.APP_ROOT_USER_PASSWORD;

    if (!(await this.userService.getUser({ email }))) {
      await this.userService.createUser({
        name: 'ROOT',
        lastname: 'USER',
        email,
        password,
        role: 'ROOT',
        status: 'Active',
      });
      console.log('Root user successfully created!');
    }
  }

  private async createAdminUser(): Promise<void> {
    const email = process.env.APP_ADMIN_USER_EMAIL;
    const password = process.env.APP_ADMIN_USER_PASSWORD;
    if (!isEmpty(email) && !isEmpty(password)) {
      if (!(await this.userService.getUser({ email }))) {
        await this.register({
          name: 'ADMIN',
          lastname: 'USER',
          email,
          password,
        });
        console.log('Default administrator user successfully created!');
      }
    }
  }

  async register(registrationDto: RegistrationDto): Promise<any> {
    return await this.userService.createUser(registrationDto).then(async (user) => {
      // check if user registration requires verification
      if (await this.preferences.getValue('user.requires.verification')) {
        // generate token
        const token = await this.tokenService.createToken(user.id);
        if (!token) {
          return {
            data: {
              user: user.toDto(),
            },
            error: {
              token: 'Error while token creation!',
            },
            message: 'User created with no token',
            status: HttpStatus.CREATED,
          };
        }

        // send the email confirmation
        const hash = token.data.token.hash;
        const email = await this.mailerService.sendVerification(user, hash);
        if (!email) {
          return {
            data: { user },
            error: {
              email: 'confirmation email could not be sent!',
            },
            message: 'User created with errors',
            status: HttpStatus.CREATED,
          };
        }

        // result all results
        return {
          data: {
            user,
            token: hash,
          },
          message: email.message,
          status: HttpStatus.CREATED,
        };
      }

      return user;
    });
  }
}
