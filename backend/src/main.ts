import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common"; // new

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe()); // new
  await app.listen(3000, '0.0.0.0');
  {
    console.log('server up');
  }
}
bootstrap();
