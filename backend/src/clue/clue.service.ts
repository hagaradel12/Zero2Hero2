import { Injectable, NotFoundException } from '@nestjs/common';
import { Clue } from './clue.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ClueService {
  constructor(@InjectModel(Clue.name) private clueModel: Model<Clue>) {}

  async updateOrCreateByKey(clueKey: string, data: any) {
    return this.clueModel.findOneAndUpdate(
      { clueKey },
      data,
      {
        upsert: true,
        new: true,
      }
    );
  }

  async getClue(clueId: string) {
    if (!Types.ObjectId.isValid(clueId)) {
      throw new NotFoundException("Invalid clue ID");
    }
    const clue = await this.clueModel.findById(clueId);
    if (!clue) throw new NotFoundException("Clue not found");
    return clue;
  }

  async getClueByKey(clueKey: string) {
    const clue = await this.clueModel.findOne({ clueKey });
    if (!clue) throw new NotFoundException("Clue not found");
    return clue;
  }

  async getCluesByKeys(clueKeys: string[]) {
    return this.clueModel.find({ clueKey: { $in: clueKeys } }).sort({ index: 1 });
  }
}