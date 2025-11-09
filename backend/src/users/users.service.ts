import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, Users } from './users.schema';
import { CreateUserDto } from './dto/CreateUserDto';
import { Level } from '../levels/levels.schema'; // adjust path
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

    // Example: completed levels could be inferred if user.solvedQuestions >= totalQuestions of a level
    // (You can adjust this logic later depending on your app)
    const completedLevels = Math.floor(user.xp / 100); // temporary logic

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
      // First activity
      user.streak = 1;
    } else {
      const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Continued streak
        user.streak += 1;
      } else if (diffDays > 1) {
        // Missed day → reset
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

//   async updateQuestionProgress(email: string, questionId: string, nextQuestionIndex: number) {
//   return this.userModel.findOneAndUpdate(
//     { email },
//     {
//       $addToSet: { solvedQuestions: questionId }, // avoid duplicates
//       $set: { currentQuestionIndex: nextQuestionIndex },
//     },
//     { new: true },
//   );
// }


  // Update question progress
  async updateQuestionProgress(
    email: string,
    questionId: string,
    nextQuestionIndex: number,
  ) {
    const user = await this.userModel.findOne({ email }).exec();
    
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    // Add question to solved list if not already there
    if (!user.solvedQuestions.includes(questionId)) {
      user.solvedQuestions.push(questionId);
    }

    // Update question index
    user.currentQuestionIndex = nextQuestionIndex;

    await user.save();

    console.log(`✅ Updated question progress for ${email}`);
    return user;
  }
}
