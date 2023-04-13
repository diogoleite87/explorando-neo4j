import { Field, InputType } from '@nestjs/graphql';
import { User } from './user-model';

@InputType()
export class CreateUserInput implements Partial<User> {
  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  name: string;

}
