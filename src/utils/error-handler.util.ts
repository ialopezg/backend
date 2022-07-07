import { capitalizeFirst, HttpException, HttpStatus } from '@ialopezg/corejs';

import { Response } from '../common/interfaces';

export const errorHandler = (error: any): Response => {
  if (error.name === 'MongoServerError') {
    const message = 'Validation failed';
    const status = HttpStatus.BAD_REQUEST;

    if (error && (error.code === 11000 || error.code === 11001)) {
      const key = Object.keys(error.keyValue).shift();
      const value = error.keyValue[key];

      return {
        status: HttpStatus.CONFLICT,
        message,
        error: {
          [key]: `${capitalizeFirst(key)} "${value}" is already taken!`,
        },
      };
    }

    const errors = null;
    Object.keys(error.errors).map((key) => {
      errors[key] = error.errors[key].message;
    });

    return { status, message, error: errors };
  } else if (error instanceof HttpException) {
    return {
      status: error.getStatus(),
      message: error.getMessage(),
    };
  } else {
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Error Server',
      error: {
        type: 'Unknown error',
        message: error.message,
      },
    };
  }
};
