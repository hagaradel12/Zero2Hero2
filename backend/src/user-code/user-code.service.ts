import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserCode, UserCodeDocument } from './user-code.schema';

@Injectable()
export class UserCodeService {
  constructor(
    @InjectModel(UserCode.name) 
    private readonly userCodeModel: Model<UserCodeDocument>
  ) {}

  async saveUserCode(userId: string, roomId: string, code: string) {
    // Validate userId
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid userId');
    }

    // Upsert: update if exists, create if not
    const result = await this.userCodeModel.findOneAndUpdate(
      { user: new Types.ObjectId(userId), roomId },
      { $set: { code } },
      { upsert: true, new: true, runValidators: true }
    );

    console.log(`✅ Code saved for user ${userId} in room ${roomId}`);
    return result;
  }

  async getUserCode(userId: string, roomId: string): Promise<string> {
    // Validate userId
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid userId');
    }

    const entry = await this.userCodeModel.findOne({ 
      user: new Types.ObjectId(userId), 
      roomId 
    });

    // Return empty string if no code found
    if (!entry) {
      console.log(`No saved code found for user ${userId} in room ${roomId}`);
      return '';
    }

    console.log(`✅ Code loaded for user ${userId} in room ${roomId}`);
    return entry.code || '';
  }

  // Optional: Delete user code
  async deleteUserCode(userId: string, roomId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid userId');
    }

    await this.userCodeModel.deleteOne({ 
      user: new Types.ObjectId(userId), 
      roomId 
    });

    console.log(`🗑️ Code deleted for user ${userId} in room ${roomId}`);
    return { success: true, message: 'Code deleted' };
  }
}