import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';

import { Public } from 'src/auth/decorators/public.decorators';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Public()
  @Get('level/:levelId')
  getQuestionsByLevel(@Param('levelId') levelId: string) {
    return this.questionsService.getQuestionsByLevel(levelId);
  }

  @Public()
  @Get(':id')
  getQuestionById(@Param('id') id: string) {
    return this.questionsService.getQuestionById(id);
  }

@Public()
  @Post(':questionId/hint')
  async getHint(
    @Param('questionId') questionId: string,
    @Body('userId') userId: string,
    @Body('code') code: string,
    @Body('language') language = 'python',
  ) {
    if (!userId) throw new Error('Missing userId');
    if (!code) throw new Error('Missing code');

    return this.questionsService.useHint(userId, questionId, code, language);
  }


  @Public()
  @Post(':questionId/review')
  async reviewSubmission(
    @Param('questionId') questionId: string,
    @Body() body: any,
  ) {
    const { code, userId, language } = body;
    if (!code || !userId) throw new BadRequestException('Both code and userId are required');
    if (!language || !['python', 'java'].includes(language.toLowerCase()))
      throw new BadRequestException('Language must be "python" or "java"');

    return this.questionsService.reviewCode(userId, questionId, code, language.toLowerCase());
  }



  @Public()
  @Post(':questionId/finish')
  async finishQuestion(
    @Req() req: any,
    @Param('questionId') questionId: string,
    @Body('score') score: number,
    @Body('userId') userId?: string,
  ) {
    const finalUserId = req.user?._id || userId;
    if (!finalUserId) throw new BadRequestException('Missing userId');
    if (typeof score !== 'number') throw new BadRequestException('Score must be a number');
    return this.questionsService.finishQuestion(finalUserId, questionId, score);
  }
}
