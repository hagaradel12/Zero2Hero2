import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClueDocument = Clue & Document;

@Schema({ timestamps: true })
export class Clue {
  // Let MongoDB auto-generate ObjectId
  _id: Types.ObjectId;
  
  // Add a custom string identifier for easy reference
  @Prop({ type: String, required: true, unique: true })
  clueKey: string; // e.g., "room1_taskA"
  
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  guidance: string;

  @Prop({ type: Array, default: [] })
  testCases: { 
    input: any; 
    expectedOutput: any; 
  }[];

  @Prop({ default: 0 })
  index: number;
}

export const ClueSchema = SchemaFactory.createForClass(Clue);