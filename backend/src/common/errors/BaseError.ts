import { HttpException } from '@nestjs/common';

export class BaseError extends HttpException {
  constructor(message: string, readonly code: number) {
    super(message, code);
  }
}
