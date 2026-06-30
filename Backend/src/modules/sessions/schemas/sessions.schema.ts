import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: false },
})
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user_id!: Types.ObjectId;

  @Prop({ required: true, unique: true, select: false })
  refresh_token_hash!: string;

  @Prop()
  device_info?: string; // user-agent, tên thiết bị

  @Prop()
  ip_address?: string;

  @Prop({ default: false })
  is_revoked!: boolean;

  @Prop({ required: true })
  expires_at!: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

// TTL index: Mongo tự xóa document khi quá expires_at (dọn rác session hết hạn)
SessionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
