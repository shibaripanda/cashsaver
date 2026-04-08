import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CheckDocument } from '../check/check.schema';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true })
  name!: string;

  @Prop({ default: 0 })
  count!: number;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Check', autopopulate: true }],
    required: true,
    default: [],
  })
  checks!: CheckDocument[];
}

export const AccountSchema = SchemaFactory.createForClass(Account);

// UserSchema.index({ subscriptionExpiresAt: 1, status: 1 });
