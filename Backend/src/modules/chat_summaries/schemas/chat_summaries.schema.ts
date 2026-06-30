import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatSummaryDocument = ChatSummary & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class ChatSummary {
  @Prop({
    type: Types.ObjectId,
    ref: 'Conversation',
    required: true,
    unique: true, // mỗi conversation chỉ có 1 summary "rolling", update đè lên
    index: true,
  })
  conversation_id!: Types.ObjectId;

  @Prop({ required: true })
  summary_text!: string;

  @Prop({ default: 0 })
  message_count_summarized!: number;

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  last_summarized_message_id?: Types.ObjectId;

  @Prop()
  model_used?: string; // tên model AI dùng để tóm tắt
}

export const ChatSummarySchema = SchemaFactory.createForClass(ChatSummary);
