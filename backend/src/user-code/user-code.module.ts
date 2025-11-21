import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCodeController } from './user-code.controller';
import { UserCodeService } from './user-code.service';
import { UserCode, UserCodeSchema } from './user-code.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserCode.name, schema: UserCodeSchema }])
  ],
  controllers: [UserCodeController],
  providers: [UserCodeService],
  exports: [UserCodeService], // optional if you want to inject it elsewhere
})
export class UserCodeModule {}
