import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFound extends HttpException {
  constructor(username: string) {
    super(`User with username '${username}' not found.`, HttpStatus.NOT_FOUND);
  }
}
