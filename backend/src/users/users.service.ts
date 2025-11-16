import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, Users } from './users.schema';
import { CreateUserDto } from './dto/CreateUserDto';
import { Level } from '../levels/levels.schema';
import { UpdateUserDto } from './dto/updateUserDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Level.name) private readonly levelModel: Model<Level>,
  ) {}

  // 🧭 Find user by email
  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).populate('currentLevel').exec();
  }

  // 🧱 Create new user
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel({
      name: createUserDto.name,
      email: createUserDto.email,
      passwordHash: createUserDto.passwordHash,
    });
    return await newUser.save();
  }

  // 🧠 Get user progress data (for Navbar)
  async getUserProgress(userId: string): Promise<{
    xp: number;
    completedLevels: number;
    totalLevels: number;
    currentStreak: number;
  }> {
    const user = await this.userModel.findById(userId).exec();
    const totalLevels = await this.levelModel.countDocuments();

    if (!user) {
      throw new Error('User not found');
    }

    const completedLevels = Math.floor(user.xp / 100);

    return {
      xp: user.xp,
      completedLevels,
      totalLevels,
      currentStreak: user.streak,
    };
  }

  // 🔥 Update user streak
  async updateStreak(userId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) return;

    const today = new Date();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;

    if (!lastActive) {
      user.streak = 1;
    } else {
      const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    }

    user.lastActiveDate = today;
    await user.save();
  }

  async updateUserByEmail(email: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate(
      { email },
      { $set: updateUserDto },
      { new: true },
    );
  }

  async updateQuestionProgress(
    email: string,
    questionId: string,
    nextQuestionIndex: number,
  ) {
    const user = await this.userModel.findOne({ email }).exec();
    
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    if (!user.solvedQuestions.includes(questionId)) {
      user.solvedQuestions.push(questionId);
    }

    user.currentQuestionIndex = nextQuestionIndex;

    await user.save();

    console.log(`✅ Updated question progress for ${email}`);
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

  // ========================================
  // ✅ NEW: GAME STATE METHODS
  // ========================================

  // Get user's game state
  async getGameState(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid userId');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      currentScene: user.currentScene || 'IntroScene',
      currentLevelId: user.currentLevelId || 'lvl1',
      completedQuestions: user.completedQuestions || {},
      gameStateLastUpdated: user.gameStateLastUpdated,
    };
  }

  // Update user's game state
  async updateGameState(
    userId: string,
    gameState: {
      currentScene?: string;
      currentLevelId?: string;
      completedQuestions?: { [levelId: string]: number[] };
    },
  ) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid userId');
    }

    const updateData: any = {
      gameStateLastUpdated: new Date(),
    };

    if (gameState.currentScene) updateData.currentScene = gameState.currentScene;
    if (gameState.currentLevelId) updateData.currentLevelId = gameState.currentLevelId;
    if (gameState.completedQuestions) updateData.completedQuestions = gameState.completedQuestions;

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    console.log('✅ Game state updated for user:', userId);
    return {
      currentScene: user.currentScene,
      currentLevelId: user.currentLevelId,
      completedQuestions: user.completedQuestions,
      gameStateLastUpdated: user.gameStateLastUpdated,
    };
  }
// REPLACE your markQuestionComplete method in users.service.ts with this:

async markQuestionComplete(userId: string, levelId: string, questionIndex: number) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new BadRequestException('Invalid userId');
  }

  const user = await this.userModel.findById(userId);
  if (!user) {
    throw new NotFoundException('User not found');
  }

  console.log('📝 Before marking complete:', {
    userId,
    levelId,
    questionIndex,
    currentCompleted: user.completedQuestions,
  });

  // Initialize completedQuestions if it doesn't exist
  if (!user.completedQuestions) {
    user.completedQuestions = {};
  }

  // Initialize level array if it doesn't exist
  if (!user.completedQuestions[levelId]) {
    user.completedQuestions[levelId] = [];
  }

  // Add question if not already completed
  if (!user.completedQuestions[levelId].includes(questionIndex)) {
    user.completedQuestions[levelId].push(questionIndex);
    
    // ✅ CRITICAL: Tell Mongoose this nested object changed
    user.markModified('completedQuestions');
    
    console.log(`✅ Marked question ${questionIndex} as complete in ${levelId} for user ${userId}`);
    console.log('📝 After marking:', user.completedQuestions);
  } else {
    console.log(`ℹ️ Question ${questionIndex} already completed in ${levelId}`);
  }

  user.gameStateLastUpdated = new Date();
  await user.save();

  // Verify it saved
  const verifyUser = await this.userModel.findById(userId);


  // Check if level is complete and unlock next level
  const level = await this.levelModel.findById(levelId);
  let isLevelComplete = false;
  let nextLevelUnlocked = false;

  if (level) {
    const completedCount = user.completedQuestions[levelId].length;
    isLevelComplete = completedCount >= level.totalQuestions;

    // If level complete, unlock next level
    if (isLevelComplete && level.nextLevelId) {
      await this.levelModel.findByIdAndUpdate(
        level.nextLevelId,
        { isLocked: false }
      );
      nextLevelUnlocked = true;
      console.log(`🔓 Unlocked next level: ${level.nextLevelId}`);
    }
  }

  return {
    success: true,
    completedQuestions: user.completedQuestions[levelId],
    allCompletedQuestions: user.completedQuestions, // Return full object
    levelId,
    questionIndex,
    isLevelComplete,
    nextLevelUnlocked,
  };
}
// REPLACE your getCompletedQuestionsForLevel method with this:

async getCompletedQuestionsForLevel(userId: string, levelId: string): Promise<number[]> {
  if (!Types.ObjectId.isValid(userId)) {
    throw new BadRequestException('Invalid userId');
  }

  const user = await this.userModel.findById(userId);
  if (!user) {
    throw new NotFoundException('User not found');
  }

  console.log('📊 Getting completed questions:', {
    userId,
    levelId,
    allCompleted: user.completedQuestions,
    forThisLevel: user.completedQuestions?.[levelId],
  });

  const completed = user.completedQuestions?.[levelId] || [];
  
  console.log(`✅ Returning ${completed.length} completed questions for ${levelId}:`, completed);
  
  return completed;
}
}