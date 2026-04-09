import { Types } from 'mongoose';

export interface AccountNameAndId {
  name: string;
  _id: Types.ObjectId;
}
