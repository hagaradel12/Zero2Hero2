import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './rooms.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Room.name, schema:RoomSchema}])
  ],
  providers: [RoomsService],
  controllers: [RoomsController],
  exports:[
    RoomsService,
    MongooseModule
  ]
})
export class RoomsModule {}
