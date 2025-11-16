import { Controller, Get, Param, Put, Body, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUserDto';
import { Public } from 'src/auth/decorators/public.decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Get user by email
  @Public()
  @Get(':email')
  async getUserByEmail(@Param('email') email: string) {
    return this.usersService.findUserByEmail(email);
  }

  // Update user XP, level, streak, or solved questions
  @Public()
  @Put(':email')
  async updateUser(
    @Param('email') email: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.updateUserByEmail(email, updateUserDto);
  }

  @Public()
  @Get('progress/:userId')
  async getUserProgress(@Param('userId') userId: string) {
    return this.usersService.getUserProgress(userId);
  }
  
  @Public()
  @Put('progress/:email')
  async updateQuestionProgress(
    @Param('email') email: string,
    @Body() body: { questionId: string; nextQuestionIndex: number }
  ) {
    return this.usersService.updateQuestionProgress(email, body.questionId, body.nextQuestionIndex);
  }

  // ========================================
  // ✅ NEW: GAME STATE ENDPOINTS
  // ========================================

  // Get user's game state
  @Public()
 @Get(':userId/game-state')
  async getGameState(@Param('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    
    return {
      currentScene: user.currentScene,
      currentLevelId: user.currentLevelId,
      completedQuestions: user.completedQuestions,
    };
  }

  // Update user's game state
  @Public()
  @Post(':userId/game-state')
  async updateGameState(
    @Param('userId') userId: string,
    @Body() gameState: {
      currentScene?: string;
      currentLevelId?: string;
      completedQuestions?: { [levelId: string]: number[] };
    },
  ) {
    return this.usersService.updateGameState(userId, gameState);
  }

  // Mark question as complete
  @Public()
  @Post(':userId/complete-question')
  async markQuestionComplete(
    @Param('userId') userId: string,
    @Body() body: { levelId: string; questionIndex: number },
  ) {
    return this.usersService.markQuestionComplete(
      userId,
      body.levelId,
      body.questionIndex,
    );
  }

  // Get completed questions for a specific level
  @Public()
  @Get(':userId/completed-questions/:levelId')
  async getCompletedQuestionsForLevel(
    @Param('userId') userId: string,
    @Param('levelId') levelId: string,
  ) {
    const completedQuestions = await this.usersService.getCompletedQuestionsForLevel(userId, levelId);
    return {
      levelId,
      completedQuestions,
    };
  }
}