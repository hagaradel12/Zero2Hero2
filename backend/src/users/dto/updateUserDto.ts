import { IsOptional, IsNumber, IsString, IsArray, IsObject } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNumber()
  xp?: number;

  @IsOptional()
  @IsNumber()
  streak?: number;

  @IsOptional()
  @IsString()
  levelId?: string;

  @IsOptional()
  @IsArray()
  solvedQuestions?: string[];

  @IsOptional()
  @IsNumber()
  currentQuestionIndex?: number;

  @IsOptional()
  @IsString()
  currentLevel?: string;

  // Nested objects
  @IsOptional()
  @IsObject()
  completedQuestions?: { [roomId: string]: number[] };

  @IsOptional()
  @IsObject()
  foundClues?: { [roomId: string]: string[] };

  @IsOptional()
  @IsObject()
  passwordFragments?: { [roomId: string]: string };

  @IsOptional()
  @IsObject()
  savedCode?: { [roomId: string]: string };
}
