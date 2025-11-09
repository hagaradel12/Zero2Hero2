import { Controller, Get, Param, Put, Body } from '@nestjs/common';
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

}
