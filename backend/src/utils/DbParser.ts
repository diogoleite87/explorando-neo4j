import { Integer } from 'neo4j-driver';

export function parseDbInt(value: Integer) {
  return value.toNumber();
}
