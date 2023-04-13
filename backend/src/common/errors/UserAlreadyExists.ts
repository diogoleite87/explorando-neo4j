import { HttpStatus } from '@nestjs/common';
import { BaseError } from './BaseError';

export class UserAlreadyExists extends BaseError {
  constructor(username: string) {
    super(
      `User with username '${username}' already exists.`,
      HttpStatus.CONFLICT,
    );
  }
}
