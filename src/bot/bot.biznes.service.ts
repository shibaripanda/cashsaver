import { Injectable } from '@nestjs/common';
import { BotKeyboardService } from './bot.keyboard.service';
import { BotTextService } from './bot.text.service';
import {
  CreateNewAccounts,
  CreateNewCheck,
  Expense,
  UpdateAccountsBudget,
} from 'src/openai/interfaces/Expense';
import { AccountNameAndId } from 'src/openai/interfaces/UserAccounts';
import { AccountService } from 'src/biznes/account/account.service';
import { UserDocument } from 'src/biznes/user/user.schema';
import { CheckService } from 'src/biznes/check/check.service';
import { AccountDocument } from 'src/biznes/account/account.schema';

@Injectable()
export class BotBiznesService {
  constructor(
    private botKeyboardService: BotKeyboardService,
    private botTextService: BotTextService,
    private accountService: AccountService,
    private checkService: CheckService,
  ) {}

  accountWhithCheckList(accountWhithCheck: AccountDocument) {
    const count = accountWhithCheck.checks.reduce(
      (acc, ch) => acc + ch.cost,
      0,
    );

    return {
      text: this.botTextService.textCheckList(
        count,
        accountWhithCheck.mounthBudget,
        accountWhithCheck.name,
        accountWhithCheck.checks,
      ),
      keyboard: this.botKeyboardService.keyboardMenuButOk(),
    };
  }

  async deleteCheck(_id: string, ownerId: string) {
    const res = await this.checkService.deleteCheck(_id, ownerId);
    let text = 'Ошибка при удалении чека';
    if (res.deletedCount === 0 && res.acknowledged) {
      text = 'Чек не найден';
    }
    if (res.deletedCount === 1 && res.acknowledged) {
      text = 'Чек удалён';
    }
    return {
      text: text,
      keyboard: this.botKeyboardService.keyboardMenuButOk(),
    };
  }

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

    if (openAIresponce.step === 2) {
      return await this.createNewCheck(
        user,
        openAIresponce.data as CreateNewCheck,
        userAccounts,
      );
    }

    if (openAIresponce.step === 3) {
      return await this.updateAccountsBudget(
        user,
        openAIresponce.data as UpdateAccountsBudget,
        userAccounts,
      );
    }

    if (openAIresponce.step === 4) {
      return await this.updateMainBudget(user, openAIresponce.data as number);
    }

    return {
      text: 'Error\n/start',
      keyboard: this.botKeyboardService.keyboardEmpty(),
    };
  }

  private async updateAccountsBudget(
    user: UserDocument,
    data: UpdateAccountsBudget,
    userAccounts: AccountNameAndId[],
  ) {
    for (const ac of data) {
      const accountId = userAccounts.find(
        (item) => item.name === ac.account,
      )?._id;
      if (accountId) {
        await this.accountService.updateBudget(accountId, ac.budget);
      }
    }
    return {
      text: this.botTextService.textSuccsessUpdateBudget(data),
      keyboard: this.botKeyboardService.keyboardMenuButOk(),
    };
  }

  private async updateMainBudget(user: UserDocument, data: number) {
    await user.updateOne({ $set: { mounthBudget: data } }).exec();
    return {
      text: this.botTextService.textSuccsessMainBudget(data),
      keyboard: this.botKeyboardService.keyboardMenuButOk(),
    };
  }

  private async createNewCheck(
    user: UserDocument,
    data: CreateNewCheck,
    userAccounts: AccountNameAndId[],
  ) {
    for (const newCheck of data) {
      const accountId = userAccounts.find(
        (item) => item.name === newCheck.account,
      )?._id;
      if (accountId) {
        const createdCheck = await this.checkService.createNewCheck(
          newCheck,
          user._id.toHexString(),
        );
        await this.accountService.addNewCheck(accountId, createdCheck);
      }
    }
    return {
      text: this.botTextService.textSuccsessNewCheck(data),
      keyboard: this.botKeyboardService.keyboardMenuButOk(),
    };
  }

  private async createNewAccounts(user: UserDocument, data: CreateNewAccounts) {
    const newAccounts = await this.accountService.createNewAccounts(
      data,
      user._id.toHexString(),
    );
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
