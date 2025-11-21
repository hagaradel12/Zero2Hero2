import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorators';
import { Clue } from './clue.schema';
import { ClueService } from './clue.service';

@Controller('clue')
export class ClueController {
  constructor(private readonly clueService: ClueService) {}

  @Public()
  @Get('/:id')
  async getClue(@Param('id') clueId: string): Promise<Clue> {
    const clue = await this.clueService.getClue(clueId);
    if (!clue) throw new NotFoundException("No clue found");
    return clue;
  }

  @Public()
  @Get('/by-key/:clueKey')
  async getClueByKey(@Param('clueKey') clueKey: string): Promise<Clue> {
    const clue = await this.clueService.getClueByKey(clueKey);
    if (!clue) throw new NotFoundException(`Clue with key ${clueKey} not found`);
    return clue;
  }
}