// import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { Model, Types } from 'mongoose';
// import { InjectModel } from '@nestjs/mongoose';
// import { UserDocument, Users } from './users.schema';
// import { CreateUserDto } from './dto/CreateUserDto';
// import { Level } from '../levels/levels.schema';
// import { UpdateUserDto } from './dto/updateUserDto';

// @Injectable()
// export class UsersService {
//   constructor(
//     @InjectModel(Users.name) private readonly userModel: Model<UserDocument>,
//     @InjectModel(Level.name) private readonly levelModel: Model<Level>,
//   ) {}

//   // 🧭 Find user by email
//   async findUserByEmail(email: string): Promise<UserDocument | null> {
//     return await this.userModel.findOne({ email }).populate('currentLevel').exec();
//   }

//   // 🧱 Create new user
//   async create(createUserDto: CreateUserDto): Promise<UserDocument> {
//     const newUser = new this.userModel({
//       name: createUserDto.name,
//       email: createUserDto.email,
//       passwordHash: createUserDto.passwordHash,
//     });
//     return await newUser.save();
//   }

//   // 🧠 Get user progress data (for Navbar)
//   async getUserProgress(userId: string): Promise<{
//     xp: number;
//     completedLevels: number;
//     totalLevels: number;
//     currentStreak: number;
//   }> {
//     const user = await this.userModel.findById(userId).exec();
//     const totalLevels = await this.levelModel.countDocuments();

//     if (!user) {
//       throw new Error('User not found');
//     }

//     const completedLevels = Math.floor(user.xp / 100);

//     return {
//       xp: user.xp,
//       completedLevels,
//       totalLevels,
//       currentStreak: user.streak,
//     };
//   }

//   // 🔥 Update user streak
//   async updateStreak(userId: string): Promise<void> {
//     const user = await this.userModel.findById(userId);
//     if (!user) return;

//     const today = new Date();
//     const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;

//     if (!lastActive) {
//       user.streak = 1;
//     } else {
//       const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

//       if (diffDays === 1) {
//         user.streak += 1;
//       } else if (diffDays > 1) {
//         user.streak = 1;
//       }
//     }

//     user.lastActiveDate = today;
//     await user.save();
//   }

//   async updateUserByEmail(email: string, updateUserDto: UpdateUserDto) {
//     return this.userModel.findOneAndUpdate(
//       { email },
//       { $set: updateUserDto },
//       { new: true },
//     );
//   }

//   async updateQuestionProgress(
//     email: string,
//     questionId: string,
//     nextQuestionIndex: number,
//   ) {
//     const user = await this.userModel.findOne({ email }).exec();
    
//     if (!user) {
//       throw new NotFoundException(`User with email ${email} not found`);
//     }

//     if (!user.solvedQuestions.includes(questionId)) {
//       user.solvedQuestions.push(questionId);
//     }

//     user.currentQuestionIndex = nextQuestionIndex;

//     await user.save();

//     console.log(`✅ Updated question progress for ${email}`);
//     return user;
//   }

//   async findById(userId: string) {
//     if (!Types.ObjectId.isValid(userId)) {
//       throw new BadRequestException('Invalid userId');
//     }
    
//     const user = await this.userModel.findById(userId);
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }
    
//     return user;
//   }

//   async updateUserById(userId: string, updateData: any) {
//     if (!Types.ObjectId.isValid(userId)) {
//       throw new BadRequestException('Invalid userId');
//     }
    
//     return await this.userModel.findByIdAndUpdate(
//       userId,
//       { $set: updateData },
//       { new: true }
//     );
//   }

//   // ========================================
//   // ✅ NEW: GAME STATE METHODS
//   // ========================================

//   // Get user's game state
//   async getGameState(userId: string) {
//     if (!Types.ObjectId.isValid(userId)) {
//       throw new BadRequestException('Invalid userId');
//     }

//     const user = await this.userModel.findById(userId);
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     return {
//       currentScene: user.currentScene || 'IntroScene',
//       currentLevelId: user.currentLevelId || 'lvl1',
//       completedQuestions: user.completedQuestions || {},
//       gameStateLastUpdated: user.gameStateLastUpdated,
//     };
//   }

//   // Update user's game state
//   async updateGameState(
//     userId: string,
//     gameState: {
//       currentScene?: string;
//       currentLevelId?: string;
//       completedQuestions?: { [levelId: string]: number[] };
//     },
//   ) {
//     if (!Types.ObjectId.isValid(userId)) {
//       throw new BadRequestException('Invalid userId');
//     }

//     const updateData: any = {
//       gameStateLastUpdated: new Date(),
//     };

//     if (gameState.currentScene) updateData.currentScene = gameState.currentScene;
//     if (gameState.currentLevelId) updateData.currentLevelId = gameState.currentLevelId;
//     if (gameState.completedQuestions) updateData.completedQuestions = gameState.completedQuestions;

//     const user = await this.userModel.findByIdAndUpdate(
//       userId,
//       { $set: updateData },
//       { new: true },
//     );

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     console.log('✅ Game state updated for user:', userId);
//     return {
//       currentScene: user.currentScene,
//       currentLevelId: user.currentLevelId,
//       completedQuestions: user.completedQuestions,
//       gameStateLastUpdated: user.gameStateLastUpdated,
//     };
//   }
// // REPLACE your markQuestionComplete method in users.service.ts with this:

// async markQuestionComplete(userId: string, levelId: string, questionIndex: number) {
//   if (!Types.ObjectId.isValid(userId)) {
//     throw new BadRequestException('Invalid userId');
//   }

//   const user = await this.userModel.findById(userId);
//   if (!user) {
//     throw new NotFoundException('User not found');
//   }

//   console.log('📝 Before marking complete:', {
//     userId,
//     levelId,
//     questionIndex,
//     currentCompleted: user.completedQuestions,
//   });

//   // Initialize completedQuestions if it doesn't exist
//   if (!user.completedQuestions) {
//     user.completedQuestions = {};
//   }

//   // Initialize level array if it doesn't exist
//   if (!user.completedQuestions[levelId]) {
//     user.completedQuestions[levelId] = [];
//   }

//   // Add question if not already completed
//   if (!user.completedQuestions[levelId].includes(questionIndex)) {
//     user.completedQuestions[levelId].push(questionIndex);
    
//     // ✅ CRITICAL: Tell Mongoose this nested object changed
//     user.markModified('completedQuestions');
    
//     console.log(`✅ Marked question ${questionIndex} as complete in ${levelId} for user ${userId}`);
//     console.log('📝 After marking:', user.completedQuestions);
//   } else {
//     console.log(`ℹ️ Question ${questionIndex} already completed in ${levelId}`);
//   }

//   user.gameStateLastUpdated = new Date();
//   await user.save();

//   // Verify it saved
//   const verifyUser = await this.userModel.findById(userId);


//   // Check if level is complete and unlock next level
//   const level = await this.levelModel.findById(levelId);
//   let isLevelComplete = false;
//   let nextLevelUnlocked = false;

//   if (level) {
//     const completedCount = user.completedQuestions[levelId].length;
//     isLevelComplete = completedCount >= level.totalQuestions;

//     // If level complete, unlock next level
//     if (isLevelComplete && level.nextLevelId) {
//       await this.levelModel.findByIdAndUpdate(
//         level.nextLevelId,
//         { isLocked: false }
//       );
//       nextLevelUnlocked = true;
//       console.log(`🔓 Unlocked next level: ${level.nextLevelId}`);
//     }
//   }

//   return {
//     success: true,
//     completedQuestions: user.completedQuestions[levelId],
//     allCompletedQuestions: user.completedQuestions, // Return full object
//     levelId,
//     questionIndex,
//     isLevelComplete,
//     nextLevelUnlocked,
//   };
// }
// // REPLACE your getCompletedQuestionsForLevel method with this:

// async getCompletedQuestionsForLevel(userId: string, levelId: string): Promise<number[]> {
//   if (!Types.ObjectId.isValid(userId)) {
//     throw new BadRequestException('Invalid userId');
//   }

//   const user = await this.userModel.findById(userId);
//   if (!user) {
//     throw new NotFoundException('User not found');
//   }

//   console.log('📊 Getting completed questions:', {
//     userId,
//     levelId,
//     allCompleted: user.completedQuestions,
//     forThisLevel: user.completedQuestions?.[levelId],
//   });

//   const completed = user.completedQuestions?.[levelId] || [];
  
//   console.log(`✅ Returning ${completed.length} completed questions for ${levelId}:`, completed);
  
//   return completed;
// }
// }
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, Users } from './users.schema';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/updateUserDto';
import { Room } from 'src/rooms/rooms.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
  ) {}

  // ===============================
  // AUTH / CREATE / BASIC
  // ===============================

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).exec();
  }

async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel({
      name: createUserDto.name,
      email: createUserDto.email,
      passwordHash: createUserDto.passwordHash,
      savedCode: {}, // 🔹 add this line
      completedQuestions: {},
      foundClues: {},
      passwordFragments: {}
    });
    return await newUser.save();
}


async updateUserByEmail(email: string, updateUserDto: UpdateUserDto) {
  const user = await this.userModel.findOne({ email });
  if (!user) throw new NotFoundException('User not found');

  // Merge nested objects safely
  if (updateUserDto.savedCode) {
    user.savedCode = { ...user.savedCode, ...updateUserDto.savedCode };
    user.markModified('savedCode');
  }

  if (updateUserDto.completedQuestions) {
    user.completedQuestions = { ...user.completedQuestions, ...updateUserDto.completedQuestions };
    user.markModified('completedQuestions');
  }

  if (updateUserDto.foundClues) {
    user.foundClues = { ...user.foundClues, ...updateUserDto.foundClues };
    user.markModified('foundClues');
  }

  if (updateUserDto.passwordFragments) {
    user.passwordFragments = { ...user.passwordFragments, ...updateUserDto.passwordFragments };
    user.markModified('passwordFragments');
  }

  // Update simple fields
  for (const key of Object.keys(updateUserDto)) {
    if (!['savedCode','completedQuestions','foundClues','passwordFragments'].includes(key)) {
      (user as any)[key] = (updateUserDto as any)[key];
    }
  }

  await user.save();
  return user;
}


  async findById(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid userId');
    }
    
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async updateUserById(userId: string, updateData: any) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid userId');
    }
    
    return await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );
  }

  // ===============================
  // USER PROGRESSION
  // ===============================

  async getUserProgress(userId: string): Promise<{
    xp: number;
    completedRooms: number;
    totalRooms: number;
    currentStreak: number;
    passwordFragments: { [roomId: string]: string };
  }> {
    const user = await this.userModel.findById(userId).exec();
    const totalRooms = await this.roomModel.countDocuments();

    if (!user) throw new NotFoundException('User not found');

    const completedRooms = Object.keys(user.passwordFragments || {}).length;

    return {
      xp: user.xp,
      completedRooms,
      totalRooms,
      currentStreak: user.streak,
      passwordFragments: user.passwordFragments || {},
    };
  }

  async updateStreak(userId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) return;

    const today = new Date();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;

    if (!lastActive) {
      user.streak = 1;
    } else {
      const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) user.streak += 1;
      else if (diffDays > 1) user.streak = 1;
    }

    user.lastActiveDate = today;
    await user.save();
  }

  async awardXP(userId: string, amount: number, reason: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    
    user.xp += amount;
    await user.save();
    
    return {
      xp: user.xp,
      awarded: amount,
      reason
    };
  }

  // ===============================
  // GAME STATE (PHASER)
  // ===============================

  async getGameState(userId: string) {
    if (!Types.ObjectId.isValid(userId)) throw new BadRequestException('Invalid userId');

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return {
      currentScene: user.currentScene,
      currentRoomId: user.currentRoomId,
      completedQuestions: user.completedQuestions,
      foundClues: user.foundClues,
      activeClueId: user.activeClueId,
      passwordFragments: user.passwordFragments,
      gameStateLastUpdated: user.gameStateLastUpdated,
    };
  }

  async updateGameState(
    userId: string,
    gameState: {
      currentScene?: string;
      currentRoomId?: string;
      completedQuestions?: { [roomId: string]: number[] };
      foundClues?: { [roomId: string]: string[] };
      activeClueId?: string | null;
    },
  ) {
    if (!Types.ObjectId.isValid(userId))
      throw new BadRequestException('Invalid userId');

    const updateData: any = {
      gameStateLastUpdated: new Date(),
    };

    if (gameState.currentScene) updateData.currentScene = gameState.currentScene;
    if (gameState.currentRoomId) updateData.currentRoomId = gameState.currentRoomId;
    if (gameState.completedQuestions) updateData.completedQuestions = gameState.completedQuestions;
    if (gameState.foundClues) updateData.foundClues = gameState.foundClues;
    if (gameState.activeClueId !== undefined)
      updateData.activeClueId = gameState.activeClueId;

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    );

    if (!user) throw new NotFoundException('User not found');

    return {
      currentScene: user.currentScene,
      currentRoomId: user.currentRoomId,
      completedQuestions: user.completedQuestions,
      foundClues: user.foundClues,
      activeClueId: user.activeClueId,
      passwordFragments: user.passwordFragments,
      gameStateLastUpdated: user.gameStateLastUpdated,
    };
  }

  // ===============================
  // CLUES: QUESTIONS / CLUES
  // ===============================

  async markQuestionComplete(
    userId: string,
    roomId: string,
    questionIndex: number
  ) {
    if (!Types.ObjectId.isValid(userId))
      throw new BadRequestException('Invalid userId');

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Init field if missing
    if (!user.completedQuestions) user.completedQuestions = {};
    if (!user.completedQuestions[roomId]) user.completedQuestions[roomId] = [];

    // Add subtask index
    if (!user.completedQuestions[roomId].includes(questionIndex)) {
      user.completedQuestions[roomId].push(questionIndex);
      user.markModified('completedQuestions');
      
      // Award XP for completing a subtask
      user.xp += 20;
    }

    user.gameStateLastUpdated = new Date();
    await user.save();

    // Check room completion
    const room = await this.roomModel.findById(roomId);
    let isRoomComplete = false;

    if (room) {
      isRoomComplete = user.completedQuestions[roomId].length >= room.totalQuestions;
    }

    return {
      success: true,
      roomId,
      questionIndex,
      completed: user.completedQuestions[roomId],
      isRoomComplete,
      xpAwarded: 20,
    };
  }

  async markClueFound(userId: string, roomId: string, clueId: string) {
    if (!Types.ObjectId.isValid(userId))
      throw new BadRequestException('Invalid userId');

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (!user.foundClues) user.foundClues = {};
    if (!user.foundClues[roomId]) user.foundClues[roomId] = [];

    if (!user.foundClues[roomId].includes(clueId)) {
      user.foundClues[roomId].push(clueId);
      user.markModified('foundClues');
      
      // Award XP for finding a clue
      user.xp += 10;
    }

    user.gameStateLastUpdated = new Date();
    await user.save();

    return {
      success: true,
      foundClues: user.foundClues[roomId],
      xpAwarded: 10,
    };
  }

  async getCompletedQuestionsForRoom(userId: string, roomId: string): Promise<number[]> {
    if (!Types.ObjectId.isValid(userId))
      throw new BadRequestException('Invalid userId');

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return user.completedQuestions?.[roomId] || [];
  }

  // ===============================
  // ROOM COMPLETION & PASSWORD FRAGMENTS
  // ===============================

  async savePasswordFragment(userId: string, roomId: string, fragment: string) {
    if (!Types.ObjectId.isValid(userId))
      throw new BadRequestException('Invalid userId');

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    
    if (!user.passwordFragments) user.passwordFragments = {};
    user.passwordFragments[roomId] = fragment;
    user.markModified('passwordFragments');
    
    await user.save();
    
    return {
      success: true,
      fragment,
      totalFragments: Object.keys(user.passwordFragments).length
    };
  }

  async completeRoom(userId: string, roomId: string) {
    if (!Types.ObjectId.isValid(userId))
      throw new BadRequestException('Invalid userId');

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const room = await this.roomModel.findById(roomId);
    if (!room) throw new NotFoundException('Room not found');

    // Check if all questions in room are completed
    const completedCount = user.completedQuestions[roomId]?.length || 0;
    
    if (completedCount >= room.totalQuestions) {
      // Award bonus XP for completing room
      user.xp += 100;
      
      // Unlock next room
      if (room.nextRoomId) {
        await this.roomModel.findByIdAndUpdate(
          room.nextRoomId,
          { isLocked: false }
        );
      }
      
      // Update user's current room
      user.currentRoomId = room.nextRoomId || roomId;
      await user.save();
      
      return {
        roomCompleted: true,
        nextRoomId: room.nextRoomId,
        nextRoomUnlocked: !!room.nextRoomId,
        xpAwarded: 100,
        totalXP: user.xp,
      };
    }
    
    return { 
      roomCompleted: false,
      message: `Complete ${room.totalQuestions - completedCount} more questions to finish this room`
    };
  }




  // ===============================
// CODE SAVING / RETRIEVAL
// ===============================
// ===============================
// CODE SAVING / RETRIEVAL
// ===============================
async saveUserCode(userId: string, roomId: string, code: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid userId');
    }

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Ensure savedCode object exists
    if (!user.savedCode) user.savedCode = {};

    // Assign code
    user.savedCode[roomId] = code;

    // Mark modified so Mongoose knows it changed
    user.markModified('savedCode');

    await user.save();

    return { success: true, roomId, savedCode: code };
  }

  async getUserCode(userId: string, roomId: string): Promise<string> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid userId');
    }

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return user.savedCode?.[roomId] || '';
  }

}