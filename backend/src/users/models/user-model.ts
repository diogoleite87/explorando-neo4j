import { Field, HideField, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  name: string;

  @HideField()
  @Field()
  password: string;

  @Field()
  username: string;

}
