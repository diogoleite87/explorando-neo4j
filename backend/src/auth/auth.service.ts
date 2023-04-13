import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/models/user-model';
import { UsersService } from 'src/users/users.service';
import { matchPassword } from 'src/utils/Bcrypt';
import { JwtPayloadResponse } from './jwt/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async validateUser(username: string, password: string) {
    const user: User = await this.userService.findByUsername(username);
    const isPasswordValid = await matchPassword(password, user.password);

    if (isPasswordValid) {
      return user;
    }

    return null;
  }

  async createToken(username: string, password: string) {
    const payload: JwtPayloadResponse = {
      username: username,
      password: password,
      iat: Date.now(),
      exp: Date.now() + 3600 * 1000, // +1 hour
    };

    const token = this.jwtService.sign(payload);

    return { ...payload, token: token };
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
