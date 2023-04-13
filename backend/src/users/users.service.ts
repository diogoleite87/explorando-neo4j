import { Injectable } from '@nestjs/common';
import { UserNotFound } from 'src/common/errors/UserNotFound';
import { CreateUserInput } from './models/create-user-input';
import { UpdateUserInput } from './models/update-user-input';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) { }


  async findByUsername(username: string) {
    const result = await this.repository.findByUsername(username);

    if (result.length === 0) {
      throw new UserNotFound(username);
    }

    const userNode = result[0].get(0).properties;

    return {
      ...userNode
    };
  }

  async findAllUsers() {
    const result = await this.repository.findAll();

    console.log(result)

    const nodes = result.map((user) => user.toObject());

    const users = nodes.map((node) => ({
      ...node.u.properties
    }));

    return users;
  }


  async create(user: CreateUserInput) {
    return this.repository.create(user);
  }

  async delete(username: string) {
    return this.repository.delete(username);
  }

  async update(username: string, user: UpdateUserInput) {
    const result = await this.repository.update(username, user);

    const updatedNode = result[0].get(0).properties;

    return {
      ...updatedNode
    };
  }
}
