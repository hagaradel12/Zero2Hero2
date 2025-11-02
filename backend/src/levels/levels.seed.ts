import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { LevelsService } from './levels.service';

@Injectable()
export class LevelsSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(LevelsSeeder.name);

  constructor(private readonly levelsService: LevelsService) {}

  async onApplicationBootstrap() {
    const levels = [
      {
        _id: 'lvl2',
        name: 'Functional Decomposition',
        description:
          'Level up your logic! 🧠 Divide problems into multiple tasks and craft reusable functions like a true code architect.',
        objectives: [
          'Split problems into multiple smaller subproblems',
          'Encourage modular function design and reuse',
        ],
        order: 2,
        totalQuestions: 3,
        xpReward: 150,
        isLocked: false, // first level unlocked
        nextLevelId: 'lvl3',
      },
      {
        _id: 'lvl3',
        name: 'Hierarchical Decomposition',
        description:
          'Time to go pro 🔥 — organize your code into layers, from main heroes to helper sidekicks. Master top-down thinking!',
        objectives: [
          'Structure code using main and helper functions',
          'Practice top-down design and modular implementation',
        ],
        order: 3,
        totalQuestions: 4,
        xpReward: 200,
        isLocked: false,
        nextLevelId: 'lvl4',
      },
      {
        _id: 'lvl4',
        name: 'Abstraction and Reuse',
        description:
          'You’re now a seasoned builder 🧩. Reuse and adapt your previous creations to solve new quests efficiently and cleanly.',
        objectives: [
          'Promote abstraction by reusing previous functions',
          'Adapt existing code to solve related problems efficiently',
        ],
        order: 4,
        totalQuestions: 4,
        xpReward: 250,
        isLocked: false,
        nextLevelId: 'lvl5',
      },
      {
        _id: 'lvl5',
        name: 'System Decomposition',
        description:
          'The final trial ⚡! Design and plan a complete system before you code — a true test of mastery and foresight.',
        objectives: [
          'Plan and design complete systems before implementation',
          'Combine multiple modules into a cohesive program',
        ],
        order: 5,
        totalQuestions: 1,
        xpReward: 300,
        isLocked: false,
        nextLevelId: null,
      },
    ];

    for (const level of levels) {
      try {
        await this.levelsService.updateOrCreate(level._id, level);
        this.logger.log(`✅ Upserted: ${level.name}`);
      } catch (error) {
        this.logger.error(`❌ Error seeding ${level.name}: ${error.message}`);
      }
    }

    this.logger.log('🎯 Levels seeding (2–5) completed successfully!');
  }
}
