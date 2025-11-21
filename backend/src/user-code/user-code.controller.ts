// ============================================
// user-code.controller.ts
// ============================================
import { Controller, Param, Body, Post, Get } from '@nestjs/common';
import { UserCodeService } from './user-code.service';
import { Public } from 'src/auth/decorators/public.decorators';

@Controller('user-code')
export class UserCodeController {
  constructor(private readonly userCodeService: UserCodeService) {}

  @Public()
  @Post(':userId/:roomId')
  async saveCode(
    @Param('userId') userId: string,
    @Param('roomId') roomId: string,
    @Body('code') code: string,
  ) {
    const result = await this.userCodeService.saveUserCode(userId, roomId, code);
    return { 
      success: true, 
      message: 'Code saved successfully',
      code: result.code 
    };
  }

  @Public()
  @Get(':userId/:roomId')
  async getCode(
    @Param('userId') userId: string, 
    @Param('roomId') roomId: string
  ) {
    const code = await this.userCodeService.getUserCode(userId, roomId);
    return { code }; // ✅ Return object with code property
  }
}