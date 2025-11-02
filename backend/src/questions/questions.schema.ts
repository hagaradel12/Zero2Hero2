import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Level } from '../levels/levels.schema';
import { Users } from '../users/users.schema';

export type QuestionDocument = Question & Document;

@Schema({ timestamps: true })
export class Question {
  // 🔗 Parent level
  @Prop({ type: Types.ObjectId, ref: Level.name, required: true })
  level: Types.ObjectId;

  // 🧩 Basic info
  @Prop({ required: true })
  order: number; // Question order within the level

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  storyIntro: string; // ✨ Short story shown before the challenge

  @Prop({ required: true })
  task: string; // The actual challenge text

  // 💎 Reward
  @Prop({ type: Number, default: 100 })
  xpReward: number;

  // 🧠 Supported language
  @Prop({ type: String, enum: ['python', 'java'], default: 'python' })
  language: 'python' | 'java';


  // 🧮 Expected output (for auto-check)
  @Prop({ type: String })
  expectedOutput: string;

  // 📊 Student submissions
  @Prop({
    type: [
      {
        userId: { type: Types.ObjectId, ref: Users.name },
        code: String,
        score: Number,
        passed: Boolean,
        feedback: String, // personalized feedback from AI agent
        date: { type: Date, default: Date.now },
        usedHints: { type: Number, default: 0 },
      },
    ],
    default: [],
  })
  submissions: {
    userId: Types.ObjectId;
    code: string;
    score: number;
    passed: boolean;
    feedback: string;
    date: Date;
  }[];

  // 🔒 Locking logic
  @Prop({ type: Boolean, default: true })
  isLocked: boolean;

  // 🧱 XP needed to unlock
  @Prop({ type: Number, default: 85 })
  unlockThreshold: number;


}

export const QuestionSchema = SchemaFactory.createForClass(Question);
