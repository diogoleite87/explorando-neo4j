import { Field, InputType } from '@nestjs/graphql';
import { User } from './user-model';

@InputType()
export class UpdateUserInput implements Partial<User> {
  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  name?: string;

}
