import { HttpException } from '@nestjs/common';

export class LockedException extends HttpException {
  constructor() {
    super('Requested safebox is locked', 423);
  }
}
