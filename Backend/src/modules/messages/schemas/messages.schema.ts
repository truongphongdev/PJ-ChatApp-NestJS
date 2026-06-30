import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  SYSTEM = 'system',
}

@Schema({ _id: false })
export class Attachment {
  @Prop({ required: true })
  url!: string;

  @Prop()
  file_name?: string;

  @Prop()
  file_size?: number;

  @Prop()
  mime_type?: string;
}

@Schema({ _id: false })
export class Reaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id!: Types.ObjectId;

  @Prop({ required: true })
  emoji!: string;

  @Prop({ default: () => new Date() })
  created_at!: Date;
}

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Message {
  @Prop({
    type: Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true,
  })
  conversation_id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender_id!: Types.ObjectId;

  @Prop({ type: String, enum: MessageType, default: MessageType.TEXT })
  message_type!: MessageType;

  @Prop()
  content?: string;

  @Prop({ type: [Attachment], default: [] })
  attachments!: Attachment[];

  @Prop({ type: [Reaction], default: [] })
  reactions!: Reaction[];

  @Prop({ default: false })
  is_edited!: boolean;

  @Prop({ default: false })
  is_deleted!: boolean;

  @Prop()
  deleted_at?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  reply_to_message_id?: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// Bắt buộc cho phân trang load tin nhắn cũ (cursor-based theo created_at/_id)
MessageSchema.index({ conversation_id: 1, created_at: -1 });
