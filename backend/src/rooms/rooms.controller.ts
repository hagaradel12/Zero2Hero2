import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Public } from 'src/auth/decorators/public.decorators';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Public()
  @Get()
  async getAllRooms() {
    return this.roomsService.findAllRooms();
  }

  @Public()
  @Get(':roomId')
  async getRoom(@Param('roomId') roomId: string) {
    return this.roomsService.findRoomById(roomId);
  }

  @Public()
  @Get(':roomId/clues')
  async getRoomClues(@Param('roomId') roomId: string) {
    const room = await this.roomsService.findRoomById(roomId);
    // Populate clues
    return room.clues;
  }
}