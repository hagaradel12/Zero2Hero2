import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Users } from'../users/users.schema';

export type UserCodeDocument = HydratedDocument<UserCode>;

@Schema({ timestamps: true })
export class UserCode {
  @Prop({ type: Types.ObjectId, ref: Users.name, required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  roomId: string;

  @Prop({type: String, required: true , default: ''})
  code: string;
}

export const UserCodeSchema = SchemaFactory.createForClass(UserCode);
