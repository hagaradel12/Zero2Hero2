// import { Controller, Get, Param, Put, Body, Post } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { UpdateUserDto } from './dto/updateUserDto';
// import { Public } from 'src/auth/decorators/public.decorators';

// @Controller('users')
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}

//   // Get user by email
//   @Public()
//   @Get(':email')
//   async getUserByEmail(@Param('email') email: string) {
//     return this.usersService.findUserByEmail(email);
//   }

//   // Update user XP, level, streak, or solved questions
//   @Public()
//   @Put(':email')
//   async updateUser(
//     @Param('email') email: string,
//     @Body() updateUserDto: UpdateUserDto
//   ) {
//     return this.usersService.updateUserByEmail(email, updateUserDto);
//   }

//   @Public()
//   @Get('progress/:userId')
//   async getUserProgress(@Param('userId') userId: string) {
//     return this.usersService.getUserProgress(userId);
//   }
  
//   @Public()
//   @Put('progress/:email')
//   async updateQuestionProgress(
//     @Param('email') email: string,
//     @Body() body: { questionId: string; nextQuestionIndex: number }
//   ) {
//     return this.usersService.updateQuestionProgress(email, body.questionId, body.nextQuestionIndex);
//   }

//   // ========================================
//   // ✅ NEW: GAME STATE ENDPOINTS
//   // ========================================

//   // Get user's game state
//   @Public()
//  @Get(':userId/game-state')
//   async getGameState(@Param('userId') userId: string) {
//     const user = await this.usersService.findById(userId);
    
//     return {
//       currentScene: user.currentScene,
//       currentLevelId: user.currentLevelId,
//       completedQuestions: user.completedQuestions,
//     };
//   }

//   // Update user's game state
//   @Public()
//   @Post(':userId/game-state')
//   async updateGameState(
//     @Param('userId') userId: string,
//     @Body() gameState: {
//       currentScene?: string;
//       currentLevelId?: string;
//       completedQuestions?: { [levelId: string]: number[] };
//     },
//   ) {
//     return this.usersService.updateGameState(userId, gameState);
//   }

//   // Mark question as complete
//   @Public()
//   @Post(':userId/complete-question')
//   async markQuestionComplete(
//     @Param('userId') userId: string,
//     @Body() body: { levelId: string; questionIndex: number },
//   ) {
//     return this.usersService.markQuestionComplete(
//       userId,
//       body.levelId,
//       body.questionIndex,
//     );
//   }

//   // Get completed questions for a specific level
//   @Public()
//   @Get(':userId/completed-questions/:levelId')
//   async getCompletedQuestionsForLevel(
//     @Param('userId') userId: string,
//     @Param('levelId') levelId: string,
//   ) {
//     const completedQuestions = await this.usersService.getCompletedQuestionsForLevel(userId, levelId);
//     return {
//       levelId,
//       completedQuestions,
//     };
//   }
// }
import { Controller, Get, Param, Put, Body, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/updateUserDto';
import { Public } from 'src/auth/decorators/public.decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ============================
  // AUTH / BASIC USER DATA
  // ============================

  @Public()
  @Get('by-email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.usersService.findUserByEmail(email);
  }

  @Public()
  @Put('by-email/:email')
  async updateUser(
    @Param('email') email: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.updateUserByEmail(email, updateUserDto);
  }

  // ============================
  // USER PROGRESSION
  // ============================

  @Public()
  @Get('progress/:userId')
  async getUserProgress(@Param('userId') userId: string) {
    return this.usersService.getUserProgress(userId);
  }

  @Public()
  @Post(':userId/update-streak')
  async updateStreak(@Param('userId') userId: string) {
    await this.usersService.updateStreak(userId);
    return { success: true };
  }

  // ============================
  // GAME STATE (PHASER)
  // ============================

  @Public()
  @Get(':userId/game-state')
  async getGameState(@Param('userId') userId: string) {
    return this.usersService.getGameState(userId);
  }

  @Public()
  @Post(':userId/game-state')
  async updateGameState(
    @Param('userId') userId: string,
    @Body()
    gameState: {
      currentScene?: string;
      currentRoomId?: string;
      completedQuestions?: { [roomId: string]: number[] };
      foundClues?: { [roomId: string]: string[] };
      activeClueId?: string | null;
    },
  ) {
    return this.usersService.updateGameState(userId, gameState);
  }

  // ============================
  // CLUES: QUESTIONS/SUBTASKS
  // ============================

  @Public()
  @Post(':userId/complete-question')
  async markQuestionComplete(
    @Param('userId') userId: string,
    @Body() body: { roomId: string; questionIndex: number },
  ) {
    return this.usersService.markQuestionComplete(
      userId,
      body.roomId,
      body.questionIndex,
    );
  }

  @Public()
  @Get(':userId/completed-questions/:roomId')
  async getCompletedQuestionsForRoom(
    @Param('userId') userId: string,
    @Param('roomId') roomId: string,
  ) {
    const completed = await this.usersService.getCompletedQuestionsForRoom(
      userId,
      roomId,
    );

    return {
      roomId,
      completedQuestions: completed,
    };
  }

  // ============================
  // CLUES: CLUES
  // ============================

  @Public()
  @Post(':userId/clue-found')
  async markClueFound(
    @Param('userId') userId: string,
    @Body() body: { roomId: string; clueId: string },
  ) {
    return this.usersService.markClueFound(
      userId,
      body.roomId,
      body.clueId,
    );
  }

  // ============================
  // ROOM COMPLETION & PASSWORD FRAGMENTS
  // ============================

  @Public()
  @Post(':userId/complete-room')
  async completeRoom(
    @Param('userId') userId: string,
    @Body() body: { roomId: string; passwordFragment?: string },
  ) {
    // Save password fragment if provided
    if (body.passwordFragment) {
      await this.usersService.savePasswordFragment(
        userId,
        body.roomId,
        body.passwordFragment
      );
    }
    
    return this.usersService.completeRoom(userId, body.roomId);
  }

  @Public()
  @Get(':userId/password-fragments')
  async getPasswordFragments(@Param('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    const totalRooms = 5;
    
    return {
      fragments: user.passwordFragments || {},
      completedRooms: Object.keys(user.passwordFragments || {}).length,
      totalRooms,
      isComplete: Object.keys(user.passwordFragments || {}).length === totalRooms,
      fullPassword: this.buildFullPassword(user.passwordFragments || {})
    };
  }

  // Helper to build full password from fragments
  private buildFullPassword(fragments: { [roomId: string]: string }): string | null {
    if (Object.keys(fragments).length < 5) return null;
    
    // Assuming fragments need to be combined in order: room1, room2, room3, room4, room5
    const orderedFragments = [
      fragments['room1'],
      fragments['room2'],
      fragments['room3'],
      fragments['room4'],
      fragments['room5']
    ].filter(Boolean);
    
    if (orderedFragments.length === 5) {
      return orderedFragments.join('-');
    }
    
    return null;
  }


  // Save code
  @Public()
  @Post(':userId/save-code')
  async saveCode(
    @Param('userId') userId: string,
    @Body() body: { roomId: string; code: string }
  ) {
    const { roomId, code } = body;
    return this.usersService.saveUserCode(userId, roomId, code);
  }

  // Get code
  @Public()
  @Get(':userId/saved-code/:roomId')
  async getCode(
    @Param('userId') userId: string,
    @Param('roomId') roomId: string
  ) {
    const code = await this.usersService.getUserCode(userId, roomId);
    return { roomId, code };
  }
}