import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Level } from "../levels/levels.schema"; // adjust the import path

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
  streak: number; // consecutive days of activity

  @Prop({ type: Date, default: null })
  lastActiveDate: Date | null; // used to calculate streak continuity

  @Prop({type: Number, default:50})
  Hints: number;

  @Prop({ type: Number, default: 0 })
  currentQuestionIndex: number;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
