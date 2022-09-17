import { HttpException } from '@nestjs/common';

export default class LoginFailException extends HttpException {
  constructor() {
    super('Login fail', 401);
  }
}
