import { Injectable } from '@nestjs/common';
import { UserAlreadyExists } from 'src/common/errors/UserAlreadyExists';
import { UserNotFound } from 'src/common/errors/UserNotFound';
import { Neo4JService } from 'src/database/database.service';
import { hashPassword } from 'src/utils/Bcrypt';
import { CreateUserInput } from '../models/create-user-input';
import { UpdateUserInput } from '../models/update-user-input';

@Injectable()
export class UsersRepository {
  constructor(private readonly service: Neo4JService) { }


  async findByUsername(username: string) {
    const result = await this.service.read(
      `MATCH (u:User) WHERE u.username = '${username}' RETURN u`,
    );

    return result;
  }

  async findAll() {
    const result = await this.service.read(`
    MATCH (u:User) RETURN u
    `);

    return result;
  }

  async create(user: CreateUserInput) {
    const queryUser = await this.service.read(
      `MATCH (u:User) WHERE u.username = '${user.username}' RETURN u`,
    );

    if (queryUser.length !== 0) {
      throw new UserAlreadyExists(user.username);
    }

    const hashedPassword = await hashPassword(user.password);

    const result = await this.service.write(
      `CREATE (u:User {username: '${user.username}', name: '${user.name}', password: '${hashedPassword}'}) RETURN u`,
    );


    return result[0].get(0).properties;
  }

  async delete(username: string) {
    const userExists = await this.service.read(`
    MATCH (u: User {username: '${username}'}) RETURN u
    `);

    if (userExists.length === 0) {
      throw new UserNotFound(username);
    }

    await this.service.write(`
    MATCH (u:User {username: '${username}'})
    DETACH DELETE u
    `);

    return true;
  }

  async update(username: string, updateUser: UpdateUserInput) {
    const queryUser = await this.service.read(`
    MATCH (u:User {username: '${username}'})
    RETURN u
    `);

    if (queryUser.length === 0) {
      throw new UserNotFound(username);
    }

    const originalUser = queryUser[0].get('u').properties;

    const password = updateUser.password
      ? await hashPassword(updateUser.password)
      : originalUser.password;

    const updatedUser = await this.service.write(`
    MATCH(u:User {username: '${username}'})
    SET u.name = '${updateUser.name ? updateUser.name : originalUser.name
      }', u.password = '${password}'
    RETURN u
    `);

    return updatedUser;
  }
}
