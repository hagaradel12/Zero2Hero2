import { IsOptional, IsNumber, IsString, IsArray } from 'class-validator';

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
}
