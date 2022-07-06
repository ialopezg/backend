import { Application as App } from '@ialopezg/corejs';
import * as express from 'express';

import { ExpressConfig } from './config';

export class Application implements App {
  constructor(private readonly app: express.Application) {
    ExpressConfig.setup(this.app);
  }

  start(): void {
    this.app.listen(3000, () => {
      console.log('Application listen on port: ', 3000);
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
