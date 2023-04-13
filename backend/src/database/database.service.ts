import { Injectable } from '@nestjs/common';
import { auth, Driver, driver as neo4jDriver } from 'neo4j-driver';

@Injectable()
export class Neo4JService {
  private driver: Driver;

  constructor() {
    this.driver = neo4jDriver(
      process.env.DATABASE_URL_CONNECTION,
      auth.basic(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD),
    );
  }

  getReadSession() {
    return this.driver.session();
  }

  getWriteSession() {
    return this.driver.session();
  }

  async read(cypher: string) {
    const session = this.getReadSession();
    try {
      const query = await session.run(cypher);
      return query.records;
    } catch (error) {
      throw new Error(`Failed to read data from Neo4J: ${error.message}`);
    }
  }

  async write(cypher: string) {
    const session = this.getWriteSession();
    try {
      const query = await session.run(cypher);
      return query.records;
    } catch (error) {
      throw new Error(`Failed to write data to Neo4J: ${error.message}`);
    }
  }

  close() {
    this.driver.close();
  }
}
