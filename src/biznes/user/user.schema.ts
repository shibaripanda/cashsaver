import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AccountDocument } from '../account/account.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  telegram_id!: number;

  @Prop()
  username!: string;

  @Prop()
  language_code!: string;

  @Prop()
  lastMessageId!: number;

  @Prop()
  mounthBudget!: number;

  @Prop({ default: 0 })
  use!: number;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Account', autopopulate: true }],
    required: true,
    default: [],
  })
  accounts!: AccountDocument[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.index({ telegram_id: 1 });
