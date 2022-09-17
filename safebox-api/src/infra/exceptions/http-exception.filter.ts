import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export default class HttpExceptionFilter implements ExceptionFilter<Error> {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { message, status } = this.isBusinessException(exception);
    response.status(status).json({
      message,
      statusCode: status,
    });
  }

  public isBusinessException(exception: any): any {
    let message = 'Unexpected API error',
      status = 500;
    console.log(exception)
    try {
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        switch (exception.getStatus()) {
          case HttpStatus.UNAUTHORIZED:
            message = 'Specified token does not match';
            break;
          case HttpStatus.NOT_FOUND:
            message = 'Requested safebox does not exist';
            break;
          case HttpStatus.UNPROCESSABLE_ENTITY:
            message = 'Malformed expected data';
            break;
          case 423:
            message = exception.message;
            break;
        }
      }
      if (exception.code) {
        switch ((exception as any).code) {
          case 11000:
            message = 'Safebox already exists';
            status = HttpStatus.CONFLICT;
            break;
        }
      }
      if (
        exception.constructor.name === 'ValidationError' ||
        exception.constructor.name === 'CastError'
      ) {
        message = 'Malformed expected data';
        status = HttpStatus.UNPROCESSABLE_ENTITY;
      }
    } finally {
      return { message, status };
    }
  }
}
