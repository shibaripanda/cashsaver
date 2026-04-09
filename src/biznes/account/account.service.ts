import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account, AccountDocument } from './account.schema';
import { Model } from 'mongoose';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  // async getAccountWithChecks(_id: Types.ObjectId) {
  //   console.log(_id);

  //   const startOfMonth = new Date();
  //   startOfMonth.setDate(1);
  //   startOfMonth.setHours(0, 0, 0, 0);

  //   const endOfMonth = new Date();
  //   endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  //   endOfMonth.setDate(1);
  //   endOfMonth.setHours(0, 0, 0, 0);

  //   const res = await this.accountModel
  //     .findById(_id)
  //     .populate({
  //       path: 'checks',
  //       match: {
  //         createdAt: {
  //           $gte: startOfMonth,
  //           $lt: endOfMonth,
  //         },
  //       },
  //     })
  //     .lean()
  //     .exec();
  //   // const res = await this.accountModel
  //   //   .findById(_id)
  //   //   .populate({
  //   //     path: 'checks',
  //   //   })
  //   //   .lean()
  //   //   .exec();
  //   // console.log(res);
  //   return res;
  // }

  // async addNewCheck(account_Id: Types.ObjectId, newCheck: CheckDocument) {
  //   const res = await this.accountModel.updateOne(
  //     { _id: account_Id },
  //     {
  //       $addToSet: {
  //         checks: newCheck._id,
  //       },
  //     },
  //   );
  //   return res;
  // }

  async createNewAccounts(newAccounts: string[]) {
    return await this.accountModel.insertMany(
      newAccounts.map((name) => ({ name })),
    );
  }

  async createStartAccounts(startAccounts: string[]) {
    return await this.accountModel.insertMany(
      startAccounts.map((name) => ({ name })),
    );
  }
}
