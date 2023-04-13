import { UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { JwtPayloadResponse } from './jwt/jwt.payload';

@Resolver(() => JwtPayloadResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => JwtPayloadResponse)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.authService.createToken(username, password);
  }
}
