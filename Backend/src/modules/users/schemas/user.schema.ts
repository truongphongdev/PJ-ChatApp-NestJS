import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ _id: false })
export class OAuthProvider {
  @Prop({ required: true })
  provider!: string; // "google" | "github"

  @Prop({ required: true })
  provider_user_id!: string;

  @Prop()
  email!: string;

  @Prop({ default: () => new Date() })
  linked_at!: Date;
}

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class User {
  @Prop({ required: true, unique: true, index: true, trim: true })
  username!: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  email!: string;

  // null nếu user chỉ đăng nhập qua OAuth
  @Prop({ select: false })
  password!: string;

  @Prop({ required: true, trim: true })
  full_name!: string;

  @Prop()
  phone?: string;

  @Prop()
  avatar_url?: string;

  // OAuth
  @Prop({ type: [OAuthProvider], default: [] })
  oauth_providers!: OAuthProvider[];

  // Trạng thái & presence
  @Prop({ default: false })
  is_online!: boolean;

  @Prop()
  last_seen?: Date;

  // Email verification / reset password
  @Prop({ default: false })
  email_verified!: boolean;

  @Prop({ select: false })
  reset_password_otp?: string; // mã OTP, nên hash trước khi lưu

  @Prop()
  reset_password_expires?: Date;

  // AI gợi ý kết bạn
  @Prop({ type: [Number], default: [] })
  interests_embedding!: number[];

  @Prop({ type: [String], default: [] })
  interests_text!: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Index bổ sung nếu cần query theo provider_user_id (vd: tìm user theo Google id)
UserSchema.index({
  'oauth_providers.provider': 1,
  'oauth_providers.provider_user_id': 1,
});
