import { capitalizeFirst, HttpException, HttpStatus } from '@ialopezg/corejs';

export const errorHandler = (error: any): any => {
  console.log('isMongoError', error.name === 'MongoServerError');
  console.log('isHttpException', error instanceof HttpException);
  if (error.name === 'MongoServerError') {
    const message = 'Validation failed';
    const status = HttpStatus.BAD_REQUEST;

    if (error && (error.code === 11000 || error.code === 11001)) {
      const key = Object.keys(error.keyValue).join('');
      const value = error.keyValue[key];

      return {
        status: HttpStatus.CONFLICT,
        message,
        details: [
          { key: `${capitalizeFirst(key)} '${value}' is already taken!` },
        ],
      };
    }

    const errors = Object.keys(error.errors).map((key) => {
      errors[key] = error.errors[key].message;
    });

    return { status, message, details: errors };
  } else if (error instanceof HttpException) {
    return {
      status: error.getStatus(),
      message: error.getMessage(),
      details: [],
    };
  } else {
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Error Server',
      details: {
        type: 'Unknown',
        message: error.message,
      },
    };
  }
};
