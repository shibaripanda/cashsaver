import { Types } from 'mongoose';

export interface Expense {
  step: number;
  data: CreateNewAccounts | CreateNewCheck | number | UpdateAccountsBudget;
}

export type CreateNewAccounts = string[];

export type UpdateAccountsBudget = { account: string; budget: number }[];

export interface NewCheck {
  account: string;
  info: string;
  cost: number;
  account_id?: Types.ObjectId;
}

export type CreateNewCheck = NewCheck[];
