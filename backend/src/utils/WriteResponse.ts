export type Neo4JResponse = {
  message: string;
};

export const writeSuccesfullResponse: Neo4JResponse = {
  message: 'OK',
};

export const writeBadResponse: Neo4JResponse = {
  message: 'Failed to write in Neo4J',
};
