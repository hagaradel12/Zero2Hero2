import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Level } from "../levels/levels.schema";

export type UserDocument = HydratedDocument<Users>;

@Schema({ timestamps: true })
export class Users {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: "user" })
  role: string;

  // 🧭 Current level reference
  @Prop({ type: Types.ObjectId, ref: Level.name, default: null })
  currentLevel: Types.ObjectId | null;

  // 💎 XP points
  @Prop({ type: Number, default: 0 })
  xp: number;

  // 🧠 Solved questions (IDs or unique identifiers)
  @Prop({ type: [String], default: [] })
  solvedQuestions: string[];

  // 🔥 Streak system
  @Prop({ type: Number, default: 0 })
  streak: number;

  @Prop({ type: Date, default: null })
  lastActiveDate: Date | null;

  @Prop({ type: Number, default: 50 })
  Hints: number;

  @Prop({ type: Number, default: 0 })
  currentQuestionIndex: number;

  // ========================================
  // ✅ NEW: GAME STATE FIELDS
  // ========================================
  @Prop({ type: String, default: 'IntroScene' })
  currentScene: string;

  @Prop({ type: String, default: 'lvl1' })
  currentLevelId: string; // Scene identifier like "lvl2", "lvl3"

  @Prop({ type: Object, default: {} })
  completedQuestions: {
    [levelId: string]: number[];
  };

  @Prop({ type: Date, default: Date.now })
  gameStateLastUpdated: Date;
}

export const UsersSchema = SchemaFactory.createForClass(Users);