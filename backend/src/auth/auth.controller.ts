// auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, Req, Res, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-dto';
import { SignInDto } from './dto/signIn-dto';
import express from 'express';
import { CreateUserDto } from 'src/users/dto/CreateUserDto';
import { Public } from './decorators/public.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUser: CreateUserDto) {
    return this.authService.register(createUser);
  }
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: express.Response
  ) {
    const result = await this.authService.login(signInDto);
    console.log('🔥 Login endpoint hit with body:', signInDto);
    // Set HTTP-only cookie
    response.cookie('token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return result;
  }
@Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: express.Response) {
    response.clearCookie('token');
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  async getProfile(@Req() req: any) {
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Not authenticated');
    }
    
    const decoded = await this.authService.validateToken(token);
    return decoded;
  }
}