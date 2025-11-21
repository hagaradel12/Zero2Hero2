import { Module } from '@nestjs/common';
import { ClueService } from './clue.service';
import { ClueController } from './clue.controller';
import { Clue, ClueSchema } from './clue.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Clue.name, schema: ClueSchema }])
  ],
  providers: [ClueService],
  controllers: [ClueController],
  exports: [
    ClueService,
    MongooseModule,
  ],
})
export class ClueModule {}