import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {Users, UsersSchema } from './users.schema';
import { LevelsModule } from 'src/levels/levels.module';
import { Room } from 'src/rooms/rooms.schema';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    LevelsModule,
    RoomsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, MongooseModule], // 👈 export if other modules (like AuthModule) need it
})
export class UsersModule {}
