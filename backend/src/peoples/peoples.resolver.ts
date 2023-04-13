import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { PeoplesService } from './peoples.service';
import { People } from './models/people-model';


@Injectable()
@Resolver(() => People)
export class PeoplesResolver {
    constructor(private readonly peopleService: PeoplesService) { }

    @Query(() => Boolean)

    @Query(() => People)
    async findPeopleByName(@Args('name') name: string) {
        return this.peopleService.findPeopleByName(name);
    }

    @Query(() => [People])
    async findAllPeoples() {
        return this.peopleService.findAllPeoples();
    }

}