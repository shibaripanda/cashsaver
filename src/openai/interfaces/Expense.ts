export interface Expense {
  step: number;
  data: CreateNewAccounts | CreateNewCheck;
}

export type CreateNewAccounts = string[];
export type CreateNewCheck = NewCheck[];

export interface NewCheck {
  account: string;
  info: string;
  cost: number;
  _id: string;
}
