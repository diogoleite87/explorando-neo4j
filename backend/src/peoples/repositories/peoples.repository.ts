import { Injectable } from '@nestjs/common';
import { Neo4JService } from 'src/database/database.service';


@Injectable()
export class PeoplesRepository {
    constructor(private readonly service: Neo4JService) { }

    async findPeopleByName(name: string) {
        const result = await this.service.read(
            `MATCH (u:People) WHERE u.name = '${name}' RETURN u`,
        );

        return result;
    }

    async findAllPeoples() {
        const result = await this.service.read(`
        MATCH (u:People) RETURN u
        `);

        return result;
    }

}