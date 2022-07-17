import {
  capitalizeFirst,
  HttpException,
  HttpStatus,
  RuntimeException,
} from '@ialopezg/corejs';

import { ValidationException } from '../exceptions';
import { Response } from '../interfaces';

export const errorHandler = (error: any): Response => {
  console.log('Error Type:', error.name);
  console.log('isHttpException', error instanceof RuntimeException);
  console.log('isHttpException', error instanceof HttpException);
  if (error.name === 'MongoServerError') {
    if (error && (error.code === 11000 || error.code === 11001)) {
      const key = Object.keys(error.keyValue).join('');
      const value = error.keyValue[key];

      return {
        status: HttpStatus.CONFLICT,
        message: 'Validation Conflict',
        details: {
          [key]: `${capitalizeFirst(key)} '${value}' is already taken!`,
        },
      };
    }

    const errors = null;
    Object.keys(error.errors).map((key) => {
      errors[key] = error.errors[key].message;
    });

    return {
      status: HttpStatus.BAD_REQUEST,
      message: 'Validation Error - Other',
      details: errors,
    };
  }

  if (error instanceof HttpException) {
    return {
      status: error.getStatus(),
      message: error.getMessage(),
    };
  }

  if (error instanceof ValidationException) {
    return {
      message: error.getMessage(),
      status: error.getStatus(),
      details: error.details,
    };
  }

  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Internal Error Server',
    details: {
      type: 'Unknown',
      message: error.message,
    },
  };
};
