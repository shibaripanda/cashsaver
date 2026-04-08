import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CheckDocument = HydratedDocument<Check>;

@Schema({ timestamps: true })
export class Check {
  @Prop()
  info!: string;

  @Prop()
  cost!: number;
}

export const CheckSchema = SchemaFactory.createForClass(Check);

// UserSchema.index({ subscriptionExpiresAt: 1, status: 1 });
