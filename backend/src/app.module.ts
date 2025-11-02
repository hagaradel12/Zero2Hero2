import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard'; // 👈 import the guard
import { LevelsModule } from './levels/levels.module';
import { LevelsSeeder } from './levels/levels.seed';
import { QuestionsModule } from './questions/questions.module';
import { QuestionsSeeder } from './questions/question.seed';
import { CodeExecutionModule } from './code-execution/code-execution.module';
import { CodeExecutionController } from './code-execution/code-execution.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/zerotohero',
    ),
    UsersModule,
    AuthModule,
    LevelsModule,
    QuestionsModule,
    CodeExecutionModule,
  ],
  controllers: [AppController, CodeExecutionController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 👈 apply guard globally
    },
    LevelsSeeder,
    QuestionsSeeder
  ],
})
export class AppModule {}
