import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply a global validation pipe to automatically validate incoming data
  // and transform it to the desired DTO instance
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
