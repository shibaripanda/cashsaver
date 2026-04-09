import { Types } from 'mongoose';

export interface AccountForList {
  name: string;
  _id: Types.ObjectId;
  sum: number;
  count: number;
}
