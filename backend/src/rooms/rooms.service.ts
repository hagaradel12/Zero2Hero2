import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, HydratedDocument } from 'mongoose';
import { Room } from './rooms.schema';
import { SrvRecord } from 'dns';
@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private readonly roomModel: Model<Room>) {}


   async updateOrCreate(id: string, data: Partial<Room>) {
      return this.roomModel.findByIdAndUpdate(id, data, {
        upsert: true,
        new: true,
      });
  }

  async findAllRooms(){
     const rooms = await this.roomModel.find();
     if(!rooms.length) throw new NotFoundException("No Rooms");
     return rooms;
  }

  async findRoomById(roomId: string){
    const room = await this.roomModel.findById(roomId);
    if(!room) throw new NotFoundException("room not found");
    return room;
  }
}
