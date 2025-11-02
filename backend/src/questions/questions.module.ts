import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './questions.schema';
import { Level, LevelSchema } from '../levels/levels.schema';
import { Users, UsersSchema } from '../users/users.schema';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { QuestionsSeeder } from './question.seed';
import { LevelsModule } from '../levels/levels.module'; // ✅ add this import

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: Level.name, schema: LevelSchema },
      { name: Users.name, schema: UsersSchema },
    ]),
    LevelsModule, // ✅ import LevelsModule here
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService, QuestionsSeeder],
  exports: [QuestionsService, MongooseModule],
})
export class QuestionsModule {}
