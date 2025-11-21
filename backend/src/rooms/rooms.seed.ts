import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { ClueService } from '../clue/clue.service';

@Injectable()
export class RoomsSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(RoomsSeeder.name);

  constructor(
    private readonly roomsService: RoomsService,
    private readonly clueService: ClueService,
  ) {}

  async onApplicationBootstrap() {
    // Wait a bit to ensure clues are seeded first
    await new Promise(resolve => setTimeout(resolve, 1000));

    const roomsData = [
      {
        _id: 'room1',
        title: 'Room 1: Old Data Center',
        description: 'Find damaged logs, extract digits.',
        clueKeys: ['room1_taskA', 'room1_taskB'],
        totalQuestions: 2,
        isLocked: false,
        nextRoomId: 'room2'
      },
      {
        _id: 'room2',
        title: 'Room 2: Network Operations Room',
        description: 'Analyze repeating network signals to detect anomalies.',
        clueKeys: ['room2_taskA', 'room2_taskB'],
        totalQuestions: 2,
        isLocked: true,
        nextRoomId: 'room3'
      },
      {
        _id: 'room3',
        title: 'Room 3: Backup & Recovery Storage',
        description: 'Analyze backup segments and find the strongest one.',
        clueKeys: ['room3_taskA', 'room3_taskB', 'room3_taskC'],
        totalQuestions: 3,
        isLocked: true,
        nextRoomId: 'room4'
      },
      {
        _id: 'room4',
        title: 'Room 4: Cybersecurity Forensics Lab',
        description: 'Decode binary logs to reveal next password fragment.',
        clueKeys: ['room4_taskA', 'room4_taskB', 'room4_taskC'],
        totalQuestions: 3,
        isLocked: true,
        nextRoomId: 'room5'
      },
      {
        _id: 'room5',
        title: 'Room 5: Executive Security Vault',
        description: 'Combine all fragments to shut down the compromised server.',
        clueKeys: ['room5_taskA', 'room5_taskB'],
        totalQuestions: 2,
        isLocked: true,
      },
    ];

    for (const roomData of roomsData) {
      try {
        // Get ObjectIds for clues
        const clues = await this.clueService.getCluesByKeys(roomData.clueKeys);
        const clueIds = clues.map(c => c._id);

        // Create room with clue ObjectIds
        const { clueKeys, ...roomDataWithoutKeys } = roomData;
        await this.roomsService.updateOrCreate(roomData._id, {
          ...roomDataWithoutKeys,
          clues: clueIds,
        });

        this.logger.log(`✅ Upserted: ${roomData.title} with ${clueIds.length} clues`);
      } catch (error) {
        this.logger.error(`❌ Error seeding ${roomData.title}: ${error.message}`);
      }
    }

    this.logger.log('🎯 Rooms seeding completed successfully!');
  }
}