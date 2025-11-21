// import {
//   Controller,
//   Get,
//   Param,
//   Post,
//   Body,
//   UseGuards,
//   Req,
//   BadRequestException,
// } from '@nestjs/common';
// import { QuestionsService } from './questions.service';

// import { Public } from 'src/auth/decorators/public.decorators';
// import { UsersService } from 'src/users/users.service';

// @Controller('questions')
// export class QuestionsController {

//   constructor(private readonly questionsService: QuestionsService,
//     private readonly usersService: UsersService,
//   ) {}

//   @Public()
//   @Get('level/:levelId')
//   getQuestionsByLevel(@Param('levelId') levelId: string) {
//     return this.questionsService.getQuestionsByLevel(levelId);
//   }

//   @Public()
//   @Get(':id')
//   getQuestionById(@Param('id') id: string) {
//     return this.questionsService.getQuestionById(id);
//   }

// @Public()
//   @Post(':questionId/hint')
//   async getHint(
//     @Param('questionId') questionId: string,
//     @Body('userId') userId: string,
//     @Body('code') code: string,
//     @Body('language') language = 'python',
//   ) {
//     if (!userId) throw new Error('Missing userId');
//     if (!code) throw new Error('Missing code');

//     return this.questionsService.useHint(userId, questionId, code, language);
//   }


//   @Public()
//   @Post(':questionId/review')
//   async reviewSubmission(
//     @Param('questionId') questionId: string,
//     @Body() body: any,
//   ) {
//     const { code, userId, language } = body;
//     if (!code || !userId) throw new BadRequestException('Both code and userId are required');
//     if (!language || !['python', 'java'].includes(language.toLowerCase()))
//       throw new BadRequestException('Language must be "python" or "java"');

//     return this.questionsService.reviewCode(userId, questionId, code, language.toLowerCase());
//   }



//   // @Public()
//   // @Post(':questionId/finish')
//   // async finishQuestion(
//   //   @Req() req: any,
//   //   @Param('questionId') questionId: string,
//   //   @Body('score') score: number,
//   //   @Body('userId') userId?: string,
//   //   @Body('levelId') levelId?: string,
//   // ) {
//   //   const finalUserId = req.user?._id || userId;
//   //   if (!finalUserId) throw new BadRequestException('Missing userId');
//   //   if (typeof score !== 'number') throw new BadRequestException('Score must be a number');
//   //   if(!levelId) throw new BadRequestException('Missing levelId');
//   //   return this.questionsService.finishQuestion(finalUserId, questionId, score, levelId);
//   // }
// @Post(':questionId/finish')
// async finishQuestion(
//   @Param('questionId') questionId: string,
//   @Body() body: { userId: string; score: number; levelId: string }
// ) {
//   const { userId, score, levelId } = body;

//   try {
//     // ✅ FIXED: Use findById instead of findUserByEmail
//     const user = await this.usersService.findById(userId);
//     if (!user) throw new BadRequestException('User not found');

//     // 2. Add question to solved list if not already there
//     if (!user.solvedQuestions.includes(questionId)) {
//       user.solvedQuestions.push(questionId);
//     }

//     // 3. Add XP for completing the question
//     const xpGain = score || 100;
//     const newXp = (user.xp || 0) + xpGain;

//     // 4. Update streak logic
//     const today = new Date().toDateString();
//     const lastActive = user.lastActiveDate
//       ? new Date(user.lastActiveDate).toDateString()
//       : null;

//     let newStreak = user.streak || 0;
//     if (!lastActive || today !== lastActive) {
//       const isNextDay =
//         lastActive &&
//         new Date(today).getTime() - new Date(lastActive).getTime() === 86400000;
//       newStreak = isNextDay ? newStreak + 1 : 1;
//     }

//     // 5. Update user with new data
//     await this.usersService.updateUserById(userId, {
//       solvedQuestions: user.solvedQuestions,
//       xp: newXp,
//       currentLevel: levelId,
//       streak: newStreak,
//       lastActiveDate: new Date(),
//     });

//     console.log(`✅ User finished question ${questionId} in ${levelId}`);
//     console.log(`✅ User will return to ${levelId}`);

//     return {
//       success: true,
//       message: 'Question completed successfully!',
//       xpGained: xpGain,
//       totalXp: newXp,
//       currentLevel: levelId,
//       streak: newStreak,
//     };
//   } catch (error) {
//     console.error('❌ Error finishing question:', error);
//     throw new BadRequestException(error.message || 'Failed to finish question');
//   }
// }
// }
