import { Injectable } from '@nestjs/common';
import { InlineKeyboardButton } from '@telegraf/types';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { CallbackContext, UserContext } from './interfaces/MyContext';
// import { Types } from 'mongoose';
import { AccountNameAndId } from 'src/openai/interfaces/UserAccounts';
import { Expense } from 'src/openai/interfaces/Expense';
import { OpenaiVoiceService } from 'src/openai/openai.voice.service';
import axios, { AxiosResponse } from 'axios';
// import {
//   InlineKeyboardButton,
//   User as tUser,
// } from 'telegraf/typings/core/types/typegram';
// import { OpenaiVoiceService } from '../openai/openai.voice.service';
// import { TelegramUser } from './interfaces/TelegramUser';

@Injectable()
export class BotService {
  constructor(
    @InjectBot() private bot: Telegraf,
    private openaiVoiceService: OpenaiVoiceService,
  ) {}

  // async getAccountWithChecks(telegramUser: tUser, account_id: string) {
  //   const data = await this.kafkaService.kafkaRequest('getAccountWithChecks', {
  //     ...telegramUser,
  //     account_id,
  //   });
  //   return data.accountWithChecks;
  // }

  // async photoMessageProcessing(
  //   photoFile_id: string,
  //   user: ServerUser,
  // ): Promise<Expense> {
  //   const link = await this.getFileLink(photoFile_id);
  //   const photoBuffer = await this.getVoiceBuffer(photoFile_id);
  //   const res = await this.openaiVoiceService.photoOpenAIProcessing(
  //     photoBuffer,
  //     user,
  //     link,
  //   );
  //   return res;
  // }

  async textMessageProcessing(
    text: string,
    userAccounts: AccountNameAndId[],
  ): Promise<Expense> {
    const res = await this.openaiVoiceService.textOpenAIProcessing(
      text,
      userAccounts,
    );
    return res;
  }

  async voiceMessageProcessing(
    voiceFile_id: string,
    userAccounts: AccountNameAndId[],
  ): Promise<Expense> {
    const voiceBuffer = await this.getVoiceBuffer(voiceFile_id);
    const res = await this.openaiVoiceService.voiceOpenAIProcessing(
      voiceBuffer,
      userAccounts,
    );
    return res;
  }

  // async getUserSimpleAccounts(telegramUser: tUser) {
  //   const data = await this.kafkaService.kafkaRequest(
  //     'getUserSimpleAccounts',
  //     telegramUser,
  //   );
  //   return data.user;
  // }

  // async getMyAccounts(telegramUser: tUser) {
  //   const data = await this.kafkaService.kafkaRequest(
  //     'getMyAccounts',
  //     telegramUser,
  //   );
  //   return data.accounts;
  // }

  // async getUserId(telegramUser: tUser) {
  //   const data = await this.kafkaService.kafkaRequest(
  //     'getUserIdByTelegramUser',
  //     telegramUser,
  //   );
  //   return data.user;
  // }

  // async getSimpleUser(telegramUser: TelegramUser) {
  //   // const data = await this.kafkaService.kafkaRequest(
  //   //   'getSimpleUserByTelegramUser',
  //   //   telegramUser,
  //   // );
  //   // return data.user;
  // }

  // async getUser(telegramUser: tUser) {
  //   const data = await this.kafkaService.kafkaRequest(
  //     'getUserByTelegramUser',
  //     telegramUser,
  //   );
  //   return data.user;
  // }

  async sendMessageReplyAction(
    ctx: CallbackContext,
    text: string,
    keyboard?: InlineKeyboardButton[][],
  ): Promise<void> {
    const mes = await this.bot.telegram.sendMessage(ctx.from.id, text, {
      reply_markup: keyboard && { inline_keyboard: keyboard },
      parse_mode: 'HTML',
    });
    await this.deleteOrUpdateMessage(
      ctx.from.id,
      ctx.simpleUserDocument.lastMessageId,
    );
    await ctx.simpleUserDocument
      .updateOne({ lastMessageId: mes.message_id })
      .exec();
  }

  async sendMessageReply(
    ctx: UserContext,
    text: string,
    keyboard?: InlineKeyboardButton[][],
  ): Promise<void> {
    const mes = await this.bot.telegram.sendMessage(ctx.from.id, text, {
      reply_markup: keyboard && { inline_keyboard: keyboard },
      parse_mode: 'HTML',
    });
    await this.deleteOrUpdateMessage(
      ctx.from.id,
      ctx.simpleUserDocument.lastMessageId,
    );
    await ctx.simpleUserDocument
      .updateOne({ lastMessageId: mes.message_id })
      .exec();
  }

  private async deleteOrUpdateMessage(chatId: number, message_id: number) {
    try {
      if (!message_id) return;
      await this.bot.telegram.editMessageReplyMarkup(chatId, message_id, '', {
        inline_keyboard: [],
      });
    } catch {
      await this.bot.telegram.editMessageText(chatId, message_id, '', '...');
    }
  }

  private async getVoiceBuffer(file_id: string) {
    const flink = await this.getFileLink(file_id);
    return await this.getBuffer(flink);
  }

  private async getFileLink(file_id: string) {
    const fileLink = await this.bot.telegram.getFileLink(file_id);
    return fileLink.href;
  }

  private async getBuffer(link: string): Promise<Buffer> {
    const response: AxiosResponse<ArrayBuffer> = await axios.get(link, {
      responseType: 'arraybuffer',
    });

    return Buffer.from(response.data);
  }
}
