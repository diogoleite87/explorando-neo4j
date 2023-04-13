import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CreateUserInput } from './models/create-user-input';
import { UpdateUserInput } from './models/update-user-input';
import { User } from './models/user-model';
import { UsersService } from './users.service';

@Injectable()
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) { }


  @Query(() => User)
  async findUserByUsername(@Args('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @Query(() => [User])
  async findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Mutation(() => User)
  async createUser(@Args('userInput') userInput: CreateUserInput) {
    return this.userService.create(userInput);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('username') username: string) {
    return this.userService.delete(username);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Args('username') username: string,
    @Args('updatedUser') updatedUser: UpdateUserInput,
  ) {
    return this.userService.update(username, updatedUser);
  }
}
