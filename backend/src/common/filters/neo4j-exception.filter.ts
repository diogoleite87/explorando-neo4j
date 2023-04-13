import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { Neo4jError } from 'neo4j-driver';

@Catch(Neo4jError)
export class Neo4JExceptionFilter implements ExceptionFilter {
  catch(exception: Neo4jError, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext();
    const res = ctx.res;

    if (exception.code == 'Neo.ClientError.Schema.ConstraintValidationFailed') {
      throw new Error(exception.message);
    }

    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
