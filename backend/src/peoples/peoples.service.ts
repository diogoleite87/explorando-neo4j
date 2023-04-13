import { Injectable } from '@nestjs/common';
import { PeoplesRepository } from './repositories/peoples.repository';


@Injectable()
export class PeoplesService {
    constructor(private readonly repository: PeoplesRepository) { }


    async findPeopleByName(name: string) {
        const result = await this.repository.findPeopleByName(name);

        const userNode = result[0].get(0).properties;

        return userNode
    }

    async findAllPeoples() {
        const result = await this.repository.findAllPeoples();

        console.log(result)

        const nodes = result.map((people) => people.toObject());

        const people = nodes.map((node) => ({
            ...node.u.properties
        }));

        return people;
    }

}
