import { Injectable } from '@nestjs/common';
import { BotKeyboardService } from './bot.keyboard.service';
import { BotTextService } from './bot.text.service';
import {
  CreateNewAccounts,
  CreateNewCheck,
  Expense,
} from 'src/openai/interfaces/Expense';
import { AccountNameAndId } from 'src/openai/interfaces/UserAccounts';
import { Types } from 'mongoose';
import { AccountService } from 'src/biznes/account/account.service';
import { UserDocument } from 'src/biznes/user/user.schema';

@Injectable()
export class BotBiznesService {
  constructor(
    private botKeyboardService: BotKeyboardService,
    private botTextService: BotTextService,
    private accountService: AccountService,
  ) {}

  // accountWhithCheckList(accountWhithCheck: Account) {
  //   const count = accountWhithCheck.checks.reduce(
  //     (acc, ch) => acc + ch.cost,
  //     0,
  //   );

  //   return {
  //     text: this.botTextService.textCheckList(
  //       count,
  //       accountWhithCheck.name,
  //       accountWhithCheck.checks,
  //     ),
  //     keyboard: this.botKeyboardService.keyboardMenuButOk(),
  //   };
  // }

  // myAccounts(myAccounts: Account1[]) {
  //   return {
  //     text: this.botTextService.textMyAccounts(),
  //     keyboard: this.botKeyboardService.keyboardMyAccounts(myAccounts),
  //   };
  // }

  async biznesStep(
    user: UserDocument,
    openAIresponce: Expense,
    userAccounts: AccountNameAndId[],
  ) {
    if (openAIresponce.step === 1) {
      return await this.createNewAccounts(
        user,
        openAIresponce.data as CreateNewAccounts,
      );
    }

    // if (openAIresponce.step === 2) {
    //   return await this.createnewCheck(
    //     openAIresponce.data as CreateNewCheck,
    //     userAccounts,
    //   );
    // }

    return {
      text: 'Error\n/start',
      keyboard: this.botKeyboardService.keyboardEmpty(),
    };
  }

  // private async createnewCheck(
  //   data: CreateNewCheck,
  //   userAccounts: AccountNameAndId[],
  // ) {
  //   console.log(data, userAccounts);
  //   const stringToIds = data.newChecks.map((ch) => ({
  //     ...ch,
  //     account_id: userAccounts.find((item) => item.name === ch.account)?._id,
  //   }));
  //   return {
  //     text: this.botTextService.textSuccsessNewCheck(data.newChecks),
  //     keyboard: this.botKeyboardService.keyboardMenuBut(),
  //   };
  // }

  private async createNewAccounts(user: UserDocument, data: CreateNewAccounts) {
    const newAccounts = await this.accountService.createNewAccounts(data);
    for (const account of newAccounts) {
      await user.updateOne({ $addToSet: { accounts: account } }).exec();
    }
    await user.save();
    return {
      text: this.botTextService.textSuccsessNewAccount(data),
      keyboard: this.botKeyboardService.keyboardMenuButOk(),
    };
  }
}
