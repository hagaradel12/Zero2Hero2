import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Level } from './levels.schema';
import { Model } from 'mongoose';

@Injectable()
export class LevelsService {
constructor(@InjectModel(Level.name) private levelModel:Model<Level>){}

async findAll():Promise<Level[]>{
    return this.levelModel.find().sort({order:1}).exec();
}

async findById(id:string):  Promise<Level | null>{
    return this.levelModel.findById(id).exec();
}
async create(levelData: Partial<Level>): Promise<Level> {
  const newLevel = new this.levelModel(levelData);
  return newLevel.save();
}

 async updateOrCreate(id: string, data: Partial<Level>) {
    return this.levelModel.findByIdAndUpdate(id, data, {
      upsert: true,
      new: true,
    });
}
  async findByName(name: string) {
    return this.levelModel.findOne({ name }).exec();
  }

    async findDialogByLevelId(id: string) {
    const level = await this.levelModel.findById(id, 'dialog name order').exec();
    return level?.dialog || [];
  }


}
