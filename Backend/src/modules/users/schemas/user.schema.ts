import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  // auth

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email!: string;

  @Prop({ select: false })
  password?: string;

  @Prop({
    type: { googleId: { type: String, default: null } },
    _id: false,
  })
  socialLink!: {
    googleId: String | null;
  };

  // Information

  @Prop({ required: true, trim: true })
  username!: string;

  @Prop({ default: 'https://cdn.example.com/default-avatar.png' })
  avatarUrl!: string;

  @Prop({ default: '', maxLength: 150 })
  bio!: string;

  // status

  @Prop({ default: false })
  isOnline!: boolean;

  @Prop({ default: null })
  lastSeen!: Date;

  // friend
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  friends!: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
