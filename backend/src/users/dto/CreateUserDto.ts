import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty() // Name is required
  @IsString()
  name: string;

  @IsNotEmpty() // Email is required and must be valid
  @IsEmail()
  email: string;

  @IsNotEmpty() // Password is required and must have at least 8 characters
  @MinLength(8)
  password: string;

  passwordHash: string;
  }