import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as process from 'process';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Implement the OnModuleInit interface to ensure proper initialization
  async onModuleInit() {
    // Establish a connection to the database
    await this.$connect();
  }

  // Destroy connection to the database
  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Used for integration and e2e testing purposes to clean the database.
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;
    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');
    return await Promise.all(
      models.map(async (modelKey) => {
        const model = this[modelKey];
        if (model && typeof model.deleteMany === 'function') {
          await model.deleteMany(); // Perform bulk deletion for each model
        }
      }),
    );
  }
}
