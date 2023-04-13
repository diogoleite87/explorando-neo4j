import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class People {
    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    address: string;

    @Field()
    neighborhood: string;

    @Field()
    cep: string;

    @Field()
    rg: string;

    @Field()
    cpf: string;

    @Field()
    cns: string;

    @Field()
    birthday: string;

    @Field()
    cell: string;
}