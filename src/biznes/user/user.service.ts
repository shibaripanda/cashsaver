import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { AccountService } from '../account/account.service';
import { CheckService } from '../check/check.service';
import type { User as TelegramUser } from '@telegraf/types';

// import { User as TelegramUser } from 'telegraf';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private accountService: AccountService,
    private checkService: CheckService,
  ) {}

  // async getAccountWithChecks(value: GetAccountWithChecks) {
  //   const res = await this.accountService.getAccountWithChecks(
  //     value.account_id,
  //   );
  //   // return res?.accounts.map((ac) => ({
  //   //   name: ac.name,
  //   //   _id: ac._id,
  //   //   sum: ac.checks.reduce((acc, ch) => acc + ch.cost, 0),
  //   //   count: ac.checks.length,
  //   // }));
  //   return res;
  // }

  // async updateLastMessageId(t_Id: number, lastMessageId: number) {
  //   await this.userModel.updateOne({ t_Id }, { lastMessageId });
  // }

  // async getUserSimpleAccounts(user: TelegramUser) {
  //   if (!user) return null;

  //   const res = await this.userModel
  //     .findOne({ t_Id: user.id }, { accounts: 1 })
  //     .populate({
  //       path: 'accounts',
  //       // populate: { path: 'checks' },
  //     })
  //     .lean()
  //     .exec();
  //   return res;
  // }

  // async getMyAccounts(user: TelegramUser) {
  //   if (!user) return null;

  //   const res = await this.userModel
  //     .findOne({ t_Id: user.id }, { accounts: 1 })
  //     .populate({
  //       path: 'accounts',
  //       populate: { path: 'checks' },
  //     })
  //     .lean()
  //     .exec();
  //   return res?.accounts.map((ac) => ({
  //     name: ac.name,
  //     _id: ac._id,
  //     sum: ac.checks.reduce((acc, ch) => acc + ch.cost, 0),
  //     count: ac.checks.length,
  //   }));
  // }

  // async getUserId(user: TelegramUser): Promise<{ _id: Types.ObjectId } | null> {
  //   if (!user) return null;

  //   const ex = await this.userModel
  //     .findOne({ t_Id: user.id }, { _id: 1 })
  //     .lean()
  //     .exec();
  //   if (ex) {
  //     return ex;
  //   }
  //   const newUser = await this.createNewUser(user);
  //   return { _id: newUser._id };
  // }

  // async createNewCheck(userId: Types.ObjectId, checks: NewCheck[]) {
  //   for (const check of checks) {
  //     const newCheck = await this.checkService.createNewCheck(check);
  //     if (!newCheck) return { status: false };
  //     const res = await this.accountService.addNewCheck(
  //       check.account_id,
  //       newCheck,
  //     );
  //     if (res.modifiedCount < 0) return { status: false };
  //   }
  //   return { status: true };
  // }

  // async createNewCategory(userId: Types.ObjectId, newAccounts: string[]) {
  //   const news = await this.accountService.createNewAccounts(newAccounts);
  //   if (!news.length) return { status: false };
  //   const res = await this.userModel.updateOne(
  //     { _id: userId },
  //     {
  //       $addToSet: {
  //         accounts: {
  //           $each: news.map((account) => account._id),
  //         },
  //       },
  //     },
  //   );
  //   return {
  //     status: res.modifiedCount > 0,
  //     // data: news.map((account) => ({ _id: account._id, name: account.name })),
  //   };
  // }

  // async getNewOrExistUser(user: TelegramUser): Promise<User | null> {
  //   if (!user) return null;

  //   const ex = await this.userModel
  //     .findOne({ t_Id: user.id })
  //     .populate({
  //       path: 'accounts',
  //       populate: { path: 'checks' },
  //     })
  //     .lean()
  //     .exec();
  //   if (ex) {
  //     await this.updateUser(user, ex);
  //     return ex;
  //   }
  //   return await this.createNewUser(user);
  // }

  async getNewOrExistSimpleUser(
    telegramUser: TelegramUser,
  ): Promise<UserDocument | null> {
    console.log('ddddd');
    const ex = await this.userModel
      .findOne(
        { telegram_id: telegramUser.id },
        { __v: 0, accounts: 0, updatedAt: 0, createdAt: 0 },
      )
      // .lean()
      .exec();
    if (ex) {
      return ex;
    }
    return await this.createNewUser(telegramUser);
  }

  // private async updateUser(user: TelegramUser, ex: UserDocument) {
  //   if (
  //     ex.t_username !== user.username ||
  //     ex.language_code !== user.language_code
  //   ) {
  //     await this.userModel.updateOne(
  //       { _id: ex._id },
  //       { t_username: user.username, language_code: user.language_code },
  //     );
  //   }
  // }

  private async createNewUser(user: TelegramUser): Promise<UserDocument> {
    // const zeroAccount = await this.accountService.createTargetAccount();
    const created = new this.userModel({
      telegram_id: user.id,
      // t_username: user.username ?? '',
      language_code: user.language_code,
      // accounts: [zeroAccount],
    });
    console.log('ssss');
    return created.save();
  }
}
