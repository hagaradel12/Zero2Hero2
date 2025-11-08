import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import express from 'express';
import { QuestionsSeeder } from './questions/question.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json()); // ✅ Required
  app.use(express.urlencoded({ extended: true })); // ✅ Helpful for form posts
  app.use(cookieParser());

  app.enableCors({
    origin: ['http://localhost:3000','http://localhost:5173'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  const questionSeeder = app.get(QuestionsSeeder);
  await questionSeeder.onApplicationBootstrap();

  await app.listen(3002);
}
bootstrap();
