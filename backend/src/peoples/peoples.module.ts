import { Module } from '@nestjs/common';
import { Neo4JModule } from 'src/database/database.module';
import { PeoplesRepository } from './repositories/peoples.repository';
import { PeoplesResolver } from './peoples.resolver';
import { PeoplesService } from './peoples.service';

@Module({
    imports: [Neo4JModule],
    providers: [PeoplesService, PeoplesResolver, PeoplesRepository],
    exports: [PeoplesService],
})
export class PeoplesModule { }