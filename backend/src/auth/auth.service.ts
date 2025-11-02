import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register-dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signIn-dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(user: RegisterDto): Promise<{ message: string }> {
    const existingUser = await this.usersService.findUserByEmail(user.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    await this.usersService.create({
      ...user,
      passwordHash: hashedPassword,
    });

    return { message: 'Registered successfully' };
  }

  async login(signInDto: SignInDto): Promise<{ access_token: string; user: any }> {
    const { email, password } = signInDto;

    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role || 'user',
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user: {
        _id: user._id, // 👈 FIXED HERE
        email: user.email,
        name: user.name,
        role: user.role || 'user',
      },
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
