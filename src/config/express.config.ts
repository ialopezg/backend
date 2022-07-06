import {
  Application,
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from 'express';
import * as morgan from 'morgan';

export class ExpressConfig {
  static setup(app: Application) {
    app.use(morgan('combined'));
    app.use(json());
    app.use(urlencoded({ extended: true }));

    app.use((request: Request, response: Response, next: NextFunction) => {
      response.setHeader(
        'Access-Control-Allow-Origin',
        'http://localhost:4200',
      );
      response.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      );
      response.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With, content-type',
      );

      next();
    });
  }
}
