import { Module } from '@nestjs/common';
import { Neo4JModule } from 'src/database/database.module';
import { UsersRepository } from './repositories/users.repository';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [Neo4JModule],
  providers: [UsersService, UsersResolver, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
