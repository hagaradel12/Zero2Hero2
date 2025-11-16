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
        dialog: [
          {
            speaker: 'Narrator',
            text: 'You now enter the Hall of Functions, where every spell has a purpose, and every purpose has a helper.',
          },
          {
            speaker: 'Narrator',
            text: 'Here, you’ll learn that big problems can be split into smaller, reusable parts — functions that work together like a team of wizards.',
          },
          {
            speaker: 'Narrator',
            text: 'Each function performs one job clearly and can be called whenever it’s needed.',
          },
          {
            speaker: 'Narrator',
            text: 'This is where you begin to build not just code, but systems of cooperation.',
          },
          {
            speaker: 'Narrator',
            text: 'Goal: Learn to divide work into smaller functions and combine them to solve bigger problems.',
          },
        ],
        objectives: [
          'Split complex problems into smaller subproblems',
          'Build reusable functions for repeated tasks',
          'Combine multiple functions to solve bigger challenges',
        ],
        order: 2,
        totalQuestions: 3,
        xpReward: 150,
        isLocked: false,
        nextLevelId: 'lvl3',
      },
      {
        _id: 'lvl3',
        name: 'Hierarchical Decomposition',
        dialog: [
          {
            speaker: 'Narrator',
            text: 'Climb now to the Tower of Hierarchies, where great codemasters design from the top down.',
          },
          {
            speaker: 'Narrator',
            text: 'Before writing any code, they plan how each function will call others — forming a layered structure of commands and helpers.',
          },
          {
            speaker: 'Narrator',
            text: 'Here, you’ll practice being the architect of your own magic.',
          },
          {
            speaker: 'Narrator',
            text: 'You’ll draw your design first, then bring it to life in code — building clear chains of command between your functions.',
          },
          {
            speaker: 'Narrator',
            text: 'Goal: Learn to design programs in layers, from the main idea down to the smallest helper.',
          },
        ],
        objectives: [
          'Structure code using main and helper functions',
          'Practice top-down design and modular implementation',
        ],
        order: 3,
        totalQuestions: 3,
        xpReward: 200,
        isLocked: false,
        nextLevelId: 'lvl4',
      },
      {
        _id: 'lvl4',
        name: 'Abstraction and Reuse',
        dialog: [
          {
            speaker: 'Narrator',
            text: 'Welcome to the Library of Reuse, where shelves glow with your past creations.',
          },
          {
            speaker: 'Narrator',
            text: 'Every spell, every function you’ve written before, can live again — reused, reshaped, or combined to make something new.',
          },
          {
            speaker: 'Narrator',
            text: 'Wise coders never start from zero; they adapt old magic to meet new challenges.',
          },
          {
            speaker: 'Narrator',
            text: 'Here, you’ll learn the art of abstraction — building systems that are flexible and reusable, not just functional.',
          },
          {
            speaker: 'Narrator',
            text: 'Goal: Learn to reuse and adapt old code to create smarter, cleaner, and more powerful solutions.',
          },
        ],
        objectives: [
          'Promote abstraction by reusing previous functions',
          'Adapt existing code to solve related problems efficiently',
        ],
        order: 4,
        totalQuestions: 3,
        xpReward: 250,
        isLocked: false,
        nextLevelId: 'lvl5',
      },
      {
        _id: 'lvl5',
        name: 'System Decomposition',
        dialog: [
          {
            speaker: 'Narrator',
            text: 'You stand at the gates of the Hall of Systems, your final trial.',
          },
          {
            speaker: 'Narrator',
            text: 'Now, you must design an entire magical system — perhaps a Library Keeper, Student Registry, or Bank of Mana.',
          },
          {
            speaker: 'Narrator',
            text: 'This time, no one gives you the pieces. You must plan, organize, and connect all the parts yourself — showing how every function, idea, and structure fits into one complete system.',
          },
          {
            speaker: 'Narrator',
            text: 'This is where an apprentice becomes a true Architect of Code and Magic. 🏰✨',
          },
          {
            speaker: 'Narrator',
            text: 'Goal: Learn to design and organize a full, working system made of many connected parts.',
          },
        ],
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
