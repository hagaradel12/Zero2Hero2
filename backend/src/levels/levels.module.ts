import { Module } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelsController } from './levels.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Level, LevelSchema } from './levels.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Level.name, schema: LevelSchema }])
  ],
  controllers: [LevelsController],
  providers: [LevelsService],
  exports: [
    LevelsService,                // optional, only if other modules need service
    MongooseModule,            // 👈 make LevelModel available to other modules
  ],
})
export class LevelsModule {}
