import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Level extends Document {
  @Prop({ type: String })
  declare _id: string;

  @Prop({ required: true })
  name: string; // e.g. "Level 2: The Rune of Functions"

  @Prop({ required: true })
  description: string; // Narrative intro or story setup

  @Prop({ type: [String], default: [] })
  objectives: string[]; // e.g. ["Decompose problems", "Design reusable methods"]

  @Prop({ required: true })
  order: number; // Sequence in progression

  @Prop({ required: true, default: 0 })
  totalQuestions: number;

  @Prop({ required: true, default: 0 })
  xpReward: number;

  @Prop({ default: false })
  isLocked: boolean;

  @Prop({ type: String, default: null })
  nextLevelId: string | null;

  // Optional game/narrative fields
  @Prop({ default: 'Unknown Mentor' })
  mentor: string;

  @Prop({ default: 'Normal' })
  difficulty: string;

  @Prop({ type: String, default: 'Guild of Codemasters' })
  theme: string;
}

export const LevelSchema = SchemaFactory.createForClass(Level);
