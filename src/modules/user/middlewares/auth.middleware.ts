import { Component, Middleware } from '@ialopezg/corejs';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { PassportJwtConfig } from '../../../config';

@Component()
export class AuthMiddleware implements Middleware {
  resolve(): any {
    return (request: Request | any, response: Response, next: NextFunction) => {
      const token = request.headers['x-access-token'];

      if (token) {
        jwt.verify(
          token,
          PassportJwtConfig.secretKey,
          (error: any, decoded: any) => {
            if (error) {
              return response.json({
                success: false,
                message: 'Failed to authenticate token!',
              });
            }

            request.decoded = decoded;
            next();
          },
        );
      } else {
        return response.status(403).send({
          success: false,
          message: 'No token provided!',
        });
      }
    };
  }
}
