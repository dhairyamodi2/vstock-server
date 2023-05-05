import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { env } from 'process';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*'
  })


  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  await app.listen(env.PORT);
}
bootstrap();
