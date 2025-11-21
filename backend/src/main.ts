import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import express from 'express';
//import { QuestionsSeeder } from './questions/question.seed';
import { ClueService } from './clue/clue.service';
import { CluesSeeder } from './clue/clue.seed';
import { RoomsSeeder } from './rooms/rooms.seed';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json()); // ✅ Required
  app.use(express.urlencoded({ extended: true })); // ✅ Helpful for form posts
  app.use(cookieParser());

  app.enableCors({
    origin: ['http://localhost:3000','http://localhost:5173'],
    credentials: true,
  });

app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: false,
  transform: true,
}));

  const puzzlesSeeder = app.get(CluesSeeder);
  await puzzlesSeeder.onApplicationBootstrap();

const config = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription('Clue & Game API Documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3002);
}
bootstrap();

