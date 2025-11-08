import { Controller, Get ,NotFoundException,Param} from '@nestjs/common';
import { LevelsService } from './levels.service';
import { Level } from './levels.schema';
import { Public } from 'src/auth/decorators/public.decorators';
@Controller('levels')
export class LevelsController {
constructor(private readonly levelsService: LevelsService) {}

@Public()  
@Get('/levels')
  async getAll(): Promise<Level[]> {
    return this.levelsService.findAll();
  }
@Public()  
@Get(':id')
async getLevel(@Param('id') id: string) {
  const level = await this.levelsService.findById(id);
  if (!level) {
    throw new NotFoundException(`Level with ID ${id} not found`);
  }
  return level;
}
  @Public()
  @Get(':id/dialog')
  async getDialogByLevel(@Param('id') id: string) {
    return this.levelsService.findDialogByLevelId(id);
  }
    
}


