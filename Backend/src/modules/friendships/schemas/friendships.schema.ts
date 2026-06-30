import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FriendshipDocument = Friendship & Document;

export enum FriendshipStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  BLOCKED = 'blocked',
}

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Friendship {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  requester_id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  recipient_id!: Types.ObjectId;

  @Prop({
    type: String,
    enum: FriendshipStatus,
    default: FriendshipStatus.PENDING,
  })
  status!: FriendshipStatus;
}

export const FriendshipSchema = SchemaFactory.createForClass(Friendship);

// Tránh gửi trùng request giữa 2 người
FriendshipSchema.index({ requester_id: 1, recipient_id: 1 }, { unique: true });

// Query nhanh "danh sách lời mời đang chờ" của 1 user
FriendshipSchema.index({ recipient_id: 1, status: 1 });
