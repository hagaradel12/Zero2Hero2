import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { ClueService } from './clue.service';

@Injectable()
export class CluesSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(CluesSeeder.name);

  constructor(private readonly clueService: ClueService) {}

  async onApplicationBootstrap() {
    const clues = [
      // ===== Room 1 =====
      {
        clueKey: 'room1_taskA',
        title: 'Task A — Clean the Corrupted Logs',
        guidance: 'Extract digits from the corrupted log string.',
        testCases: [
          { input: '@2#1!8&', expectedOutput: '218' },
          { input: 'a1b2c3', expectedOutput: '123' },
        ],
        index: 0,
      },
      {
        clueKey: 'room1_taskB',
        title: 'Task B — Extract the Password Fragment',
        guidance: 'Sum only even digits.',
        testCases: [
          { input: '218', expectedOutput: 10 },
          { input: '1234', expectedOutput: 6 },
        ],
        index: 1,
      },

      // ===== Room 2 =====
      {
        clueKey: 'room2_taskA',
        title: 'Count Occurrences of Pattern',
        guidance: 'Count non-overlapping occurrences of a pattern.',
        testCases: [
          { input: { signal: 'ABABXABABABZ', pattern: 'AB' }, expectedOutput: 6 },
        ],
        index: 0,
      },
      {
        clueKey: 'room2_taskB',
        title: 'Longest Consecutive Pattern Streak',
        guidance: 'Find longest consecutive repetition of the pattern.',
        testCases: [
          { input: { signal: 'ABABXABABABZ', pattern: 'AB' }, expectedOutput: 3 },
        ],
        index: 1,
      },

      // ===== Room 3 =====
      {
        clueKey: 'room3_taskA',
        title: 'Count Even Numbers in Segment 1',
        guidance: 'Count even numbers in first backup segment.',
        testCases: [
          { input: [2, 3, 4, 5], expectedOutput: 2 },
        ],
        index: 0,
      },
      {
        clueKey: 'room3_taskB',
        title: 'Count Even Numbers in Segment 2',
        guidance: 'Count even numbers in second backup segment.',
        testCases: [
          { input: [6, 8, 10, 3], expectedOutput: 3 },
        ],
        index: 1,
      },
      {
        clueKey: 'room3_taskC',
        title: 'Find Maximum Even Count Across Segments',
        guidance: 'Determine which segment has the highest even count.',
        testCases: [
          { input: [[2, 3, 4, 5], [6, 8, 10, 3], [1, 2, 2, 4]], expectedOutput: 3 },
        ],
        index: 2,
      },

      // ===== Room 4 =====
      {
        clueKey: 'room4_taskA',
        title: 'Segment Binary String',
        guidance: 'Divide binary string into 8-bit blocks.',
        testCases: [
          { input: '010001000100010101000011', expectedOutput: ['01000100', '01000101', '01000011'] },
        ],
        index: 0,
      },
      {
        clueKey: 'room4_taskB',
        title: 'Binary to ASCII Conversion',
        guidance: 'Convert 8-bit segments to characters.',
        testCases: [
          { input: ['01000100', '01000101', '01000011'], expectedOutput: ['D', 'E', 'C'] },
        ],
        index: 1,
      },
      {
        clueKey: 'room4_taskC',
        title: 'Reorder to Form Password Fragment',
        guidance: 'Reorder decoded characters to form fragment.',
        testCases: [
          { input: { chars: ['D', 'E', 'C'], pattern: [0, 1, 2] }, expectedOutput: 'DEC' },
        ],
        index: 2,
      },

      // ===== Room 5 =====
      {
        clueKey: 'room5_taskA',
        title: 'Assemble Letter Portion',
        guidance: 'Extract letters from hidden codes.',
        testCases: [
          { input: ['O2','M0','P5','S1','E3','E4'], expectedOutput: 'OMPOSE' },
        ],
        index: 0,
      },
      {
        clueKey: 'room5_taskB',
        title: 'Combine All Fragments',
        guidance: 'Combine numeric fragments and decoded IDs with letters to form full password.',
        testCases: [
          { input: { fragments: [8,5,4,'DEC'], letters: 'OMPOSE' }, expectedOutput: '8-5-4-DEC-OMPOSE' },
        ],
        index: 1,
      },
    ];

    for (const clue of clues) {
      try {
        await this.clueService.updateOrCreateByKey(clue.clueKey, clue);
        this.logger.log(`✅ Upserted: ${clue.title}`);
      } catch (error) {
        this.logger.error(`❌ Error seeding ${clue.title}: ${error.message}`);
      }
    }

    this.logger.log('🎯 Clues seeding completed successfully!');
  }
}