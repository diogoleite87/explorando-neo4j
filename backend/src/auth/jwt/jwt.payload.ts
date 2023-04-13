import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { GraphQLBigInt } from 'graphql-scalars';

export interface JwtPayload {
  username: string;
  password: string;
  iat: number;
  exp: number;
  token: null | string;
}

@ObjectType()
export class JwtPayloadResponse {
  @Field()
  username: string;

  @HideField()
  @Field()
  password: string;

  @Field(() => GraphQLBigInt)
  iat: number;

  @Field(() => GraphQLBigInt)
  exp: number;

  @Field({ nullable: true })
  token?: string;
}
