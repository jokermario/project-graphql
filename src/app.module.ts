import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { TodoModule } from './todo/todo.module';
import { PrismaService } from './prisma/prisma.service';
import { GraphQLError, GraphQLFormattedError } from 'graphql/error/index';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // Configure the GraphQL module
    GraphQLModule.forRoot({
      // Specify the GraphQL driver (Apollo in this case)
      driver: ApolloDriver,
      // Disable debugging in production (set to 'true' for development)
      debug: false,
      // Enable the GraphQL Playground (In PRODUCTION mode I would TURN THIS OFF)
      playground: true,
      // Specify the auto-generated schema file path
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // Adding the http request to the GraphQL execution context.
      context: ({ req }) => ({ headers: req.headers }),
      // Customize the error formatting for a consistent response format
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          extensions: {
            // Preserve the original error details for debugging
            originalError: error.extensions.originalError,
          },
          locations: error.locations,
          message: error.message,
          path: error.path,
        };
        return graphQLFormattedError;
      },
    }),
    // Include the TodoModule to enable its functionality
    TodoModule,
    UserModule,
  ],
  controllers: [],
  providers: [PrismaService], // Provide the Prisma service for dependency injection
})
export class AppModule {}
