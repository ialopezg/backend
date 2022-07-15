import { Application as App } from '@ialopezg/corejs';
import * as express from 'express';

import { ExpressConfig, PassportJwtConfig } from './config';

export class Application implements App {
  constructor(private readonly app: express.Application) {
    ExpressConfig.setup(this.app);
    PassportJwtConfig.setup(this.app);
  }

  start(): void {
    const port = process.env.APP_PORT || 5000;
    this.app.listen(port, () => {
      console.log('Application listen on port', port);
    });

    let route: any;
    const routes = [];

    this.app._router.stack.forEach((middleware: any) => {
      if (middleware.route) {
        // routes registered directly on the app
        routes.push(middleware.route);
      } else if (middleware.name === 'router') {
        // router middleware
        middleware.handle.stack.forEach((handler: any) => {
          route = handler.route;
          route && routes.push(route);
        });
      }
    });
    console.log('Current Routes: ', routes);
  }
}
