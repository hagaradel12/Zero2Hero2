import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ timestamps: true })
export class Room extends Document {
  @Prop({ type: String })
  declare _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Clue' }], default: [] })
  clues: Types.ObjectId[];

  @Prop({ default: 0 })
  totalQuestions: number;

  @Prop({ type: String, default: null })
  nextRoomId: string | null;

  @Prop({ default: true })
  isLocked: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);