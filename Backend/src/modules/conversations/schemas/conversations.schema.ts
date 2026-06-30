import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConversationDocument = Conversation & Document;

export enum ParticipantRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  SYSTEM = 'system',
}

@Schema({ _id: false })
export class Participant {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id!: Types.ObjectId;

  @Prop({
    type: String,
    enum: ParticipantRole,
    default: ParticipantRole.MEMBER,
  })
  role!: ParticipantRole;

  @Prop({ default: () => new Date() })
  joined_at!: Date;

  @Prop({ default: false })
  muted!: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  last_read_message_id?: Types.ObjectId;
}

@Schema({ _id: false })
export class LastMessage {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  sender_id!: Types.ObjectId;

  @Prop()
  content!: string;

  @Prop({ type: String, enum: MessageType })
  message_type!: MessageType;

  @Prop()
  created_at!: Date;
}

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Conversation {
  @Prop()
  name?: string; // null nếu là chat 1-1, FE tự lấy tên đối phương

  @Prop({ required: true, default: false })
  is_group!: boolean;

  @Prop()
  avatar_url?: string;

  @Prop({ type: [Participant], default: [] })
  participants!: Participant[];

  @Prop({ type: LastMessage })
  last_message?: LastMessage;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

// Lấy danh sách hội thoại của 1 user
ConversationSchema.index({ 'participants.user_id': 1 });
