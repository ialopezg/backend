import { Application } from 'express';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import * as passport from 'passport';

import { UserService } from '../modules/user/services';

export class PassportJwtConfig {
  static readonly secretKey = 'XD';

  static readonly jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: PassportJwtConfig.secretKey,
  };

  static setup(app: Application): void {
    this.init();
    app.use(passport.initialize());
  }

  private static init() {
    const strategy = new Strategy(
      PassportJwtConfig.jwtOptions,
      (payload: any, next: any) => {
        console.log('Payload received', payload);

        const userService = new UserService(null, null/*, null */);
        const user = userService.getUserById(payload.id);

        next(null, user || false);
      },
    );

    passport.use(strategy);
  }
}
