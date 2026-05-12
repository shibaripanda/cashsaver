import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';
import { AccountService } from '../account/account.service';
import { CheckService } from '../check/check.service';
import type { User as TelegramUser } from '@telegraf/types';
import { AccountForList } from 'src/bot/interfaces/AccountForList';
import { AccountNameAndId } from 'src/openai/interfaces/UserAccounts';
import { Account } from '../account/account.schema';
// import { Types } from 'telegraf';

// import { User as TelegramUser } from 'telegraf';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private accountService: AccountService,
    private checkService: CheckService,
  ) {}

  async getAllDataByMounth(telegram_id: number, mounth: number): Promise<Account[] | []> {
    const year = new Date().getFullYear();

    const startOfMonth = new Date(year, mounth, 1, 0, 0, 0, 0);

    const endOfMonth = new Date(year, mounth + 1, 1, 0, 0, 0, 0);

    const res = await this.userModel
      .findOne({ telegram_id }, { accounts: 1 })
      .populate({
        path: 'accounts',
        populate: {
          path: 'checks',
          match: {
            createdAt: {
              $gte: startOfMonth,
              $lt: endOfMonth,
            },
          },
        },
      })
      .lean()
      .exec();

    if (!res) return [];

    return res.accounts;
  }

  // async getAllDataByMounth({ telegram_id, mounth }: { telegram_id: number; mounth: number; }): Promise<Account[] | []> {
  //   const startOfMonth = new Date();
  //   startOfMonth.setDate(1);
  //   startOfMonth.setHours(0, 0, 0, 0);

  //   const endOfMonth = new Date();
  //   endOfMonth.setMonth(mounth + 1);
  //   endOfMonth.setDate(1);
  //   endOfMonth.setHours(0, 0, 0, 0);

  //   const res = await this.userModel
  //     .findOne({ telegram_id }, { accounts: 1 })
  //     .populate({
  //       path: 'accounts',
  //       populate: {
  //         path: 'checks',
  //         match: {
  //           createdAt: {
  //             $gte: startOfMonth,
  //             $lt: endOfMonth,
  //           },
  //         },
  //       },
  //     })
  //     .lean()
  //     .exec();
  //   if (!res) return [];
  //   return res.accounts;
  // }

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

  async getAccountNames(_id: Types.ObjectId): Promise<AccountNameAndId[] | false> {
    const res = await this.userModel
      .findById(_id, { accounts: 1 })
      .populate({
        path: 'accounts',
      })
      .lean()
      .exec();
    if (!res) return false;
    return res.accounts.map((ac) => ({ name: ac.name, _id: ac._id }));
  }

  async getMyAccountListWithChecksSumsAndCountsCurrentMounth(_id: Types.ObjectId): Promise<AccountForList[] | []> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(1);
    endOfMonth.setHours(0, 0, 0, 0);

    const res = await this.userModel
      .findById(_id, { accounts: 1 })
      .populate({
        path: 'accounts',
        populate: {
          path: 'checks',
          match: {
            createdAt: {
              $gte: startOfMonth,
              $lt: endOfMonth,
            },
          },
        },
      })
      .lean()
      .exec();
    if (!res) return [];
    return res.accounts.map((ac) => ({
      name: ac.name,
      _id: ac._id,
      sum: ac.checks.reduce((acc, ch) => acc + ch.cost, 0),
      count: ac.checks.length,
    }));
  }

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

  async getNewOrExistSimpleUser(telegramUser: TelegramUser): Promise<UserDocument | null> {
    const ex = await this.userModel
      .findOne({ telegram_id: telegramUser.id }, { __v: 0, accounts: 0, updatedAt: 0, createdAt: 0 })
      .exec();
    if (ex) {
      return ex;
    }
    return await this.createNewUser(telegramUser);
  }

  private async createNewUser(user: TelegramUser): Promise<UserDocument> {
    const created = new this.userModel({
      telegram_id: user.id,
      language_code: user.language_code,
    });
    const startAccounts = await this.accountService.createStartAccounts(
      ['Еда', 'Еда вне дома', 'Транспорт', 'Развлечения', 'Здоровье', 'Одежда', 'Коммуналка', 'Другое'],
      created._id.toHexString(),
    );
    created.accounts = startAccounts;
    return created.save();
  }
}
