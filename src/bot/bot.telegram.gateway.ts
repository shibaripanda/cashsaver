// import { UseGuards } from '@nestjs/common';
// import { CallbackQuery, Message } from '@telegraf/types';
import { Action, Command, Ctx, Hears, On, Start, Update } from 'nestjs-telegraf';
// import { AdminAccessGuard } from './guards/access-control.guard';
import { ConfigService } from '@nestjs/config';
import { BotService } from './bot.service';
import { CallbackContext, UserContext } from './interfaces/MyContext';
import { UseGuards } from '@nestjs/common';
import { AccessGuard } from './guards/access-control.guard';
import { BotTextService } from './bot.text.service';
import { UserService } from 'src/biznes/user/user.service';
import { BotKeyboardService } from './bot.keyboard.service';
import { BotBiznesService } from './bot.biznes.service';
import { CallbackQuery } from 'node_modules/telegraf/typings/core/types/typegram';
import { AccountService } from 'src/biznes/account/account.service';
import mongoose from 'mongoose';
import { AppService } from 'src/app/app.service';

@Update()
export class TelegramGateway {
  constructor(
    private appService: AppService,
    private botService: BotService,
    private botKeyboardService: BotKeyboardService,
    private botTextService: BotTextService,
    private userService: UserService,
    private botBiznesService: BotBiznesService,
    private accountService: AccountService,
    private config: ConfigService,
  ) {}

  @UseGuards(AccessGuard)
  @Start()
  async start(@Ctx() ctx: UserContext) {
    console.log('@Start');
    await ctx.sendChatAction('typing');

    console.log(ctx.simpleUserDocument);

    const MyAccountListWithChecksSumsAndCounts =
      await this.userService.getMyAccountListWithChecksSumsAndCountsCurrentMounth(ctx.simpleUserDocument._id);
    if (!MyAccountListWithChecksSumsAndCounts) return;
    const text = this.botTextService.textMyAccounts(MyAccountListWithChecksSumsAndCounts, ctx.simpleUserDocument);
    const keyboard = this.botKeyboardService.keyboardMyAccounts(MyAccountListWithChecksSumsAndCounts);
    await this.botService.sendMessageReply(ctx, text, keyboard);
  }

  @Command('enter')
  @UseGuards(AccessGuard)
  async getAuthLink(@Ctx() ctx: UserContext) {
    await ctx.reply(this.appService.getAuthLink(ctx.from.id)).catch((e) => {
      console.log(e);
    });
  }

  @UseGuards(AccessGuard)
  @Action(/^myAcc:(.+)$/)
  async buyByMeStartReg(@Ctx() ctx: CallbackContext) {
    const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
    const match = callbackQuery.data.match(/^myAcc:(.+)$/);
    await ctx.answerCbQuery();
    if (!match) return;
    await ctx.sendChatAction('typing');
    const accountWithChecks = await this.accountService.getAccountWithChecks(new mongoose.Types.ObjectId(match[1]));
    if (!accountWithChecks) return;
    const { text, keyboard } = this.botBiznesService.accountWhithCheckList(accountWithChecks);

    await this.botService.sendMessageReplyAction(ctx, text, keyboard);
  }

  @UseGuards(AccessGuard)
  @Action(/^disabled_zero_checks:(.+)$/)
  async disabledButton(@Ctx() ctx: CallbackContext) {
    const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
    const match = callbackQuery.data.match(/^disabled_zero_checks:(.+)$/);
    if (!match) return;
    await ctx.answerCbQuery(`Нет чеков в "${match[1]}"`, { show_alert: true });
  }

  @UseGuards(AccessGuard)
  @Action('myAccounts')
  async myAccounts(@Ctx() ctx: UserContext) {
    console.log('myAccounts');
    await ctx.answerCbQuery();
    await ctx.sendChatAction('typing');
    const MyAccountListWithChecksSumsAndCounts =
      await this.userService.getMyAccountListWithChecksSumsAndCountsCurrentMounth(ctx.simpleUserDocument._id);
    if (!MyAccountListWithChecksSumsAndCounts) return;
    const text = this.botTextService.textMyAccounts(MyAccountListWithChecksSumsAndCounts, ctx.simpleUserDocument);
    const keyboard = this.botKeyboardService.keyboardMyAccounts(MyAccountListWithChecksSumsAndCounts);
    await this.botService.sendMessageReply(ctx, text, keyboard);
  }

  @UseGuards(AccessGuard)
  @Hears(/^\/delch_(.+)$/i)
  async onDelete(@Ctx() ctx: UserContext) {
    const text1 = ctx.message.text;
    const match = text1.match(/^\/delch_(.+)$/i);
    if (!match) return;
    const _id = match[1];
    const { text, keyboard } = await this.botBiznesService.deleteCheck(_id, ctx.simpleUserDocument._id.toHexString());
    await this.botService.sendMessageReply(ctx, text, keyboard);
  }

  @UseGuards(AccessGuard)
  @On('text')
  async onText(@Ctx() ctx: UserContext) {
    await ctx.sendChatAction('typing');
    const message = ctx.message;
    const maxLengthTextMessage = Number(this.config.get<string>('MAX_LENGTH_TEXT_MESSAGE')!);
    console.log('DURATION:', message.text.length, '/', maxLengthTextMessage);

    const userAccounts = await this.userService.getAccountNames(ctx.simpleUserDocument._id);
    if (!userAccounts) return;
    if (message.text.length > maxLengthTextMessage) {
      await this.botService.sendMessageReply(ctx, `kdkd\nMax length: ${maxLengthTextMessage}`);
      return;
    }
    const res = await this.botService.textMessageProcessing(message.text, userAccounts);
    console.log(res);
    const { text, keyboard } = await this.botBiznesService.biznesStep(ctx.simpleUserDocument, res, userAccounts);
    await this.botService.sendMessageReply(ctx, text, keyboard);
  }

  @UseGuards(AccessGuard)
  @On('voice')
  async onVoice(@Ctx() ctx: UserContext) {
    await ctx.sendChatAction('typing');
    const voice = ctx.message['voice'];
    const maxLengthVoiceMessage = Number(this.config.get<string>('MAX_LENGTH_VOICE_MESSAGE_SECONDS')!);
    console.log('DURATION:', voice.duration, '/', maxLengthVoiceMessage);

    const userAccounts = await this.userService.getAccountNames(ctx.simpleUserDocument._id);
    if (!userAccounts) return;
    if (voice.duration > maxLengthVoiceMessage) {
      await this.botService.sendMessageReply(
        ctx,
        `Alert, too long voice message\nMax length: ${maxLengthVoiceMessage} seconds`,
      );
      return;
    }
    const res = await this.botService.voiceMessageProcessing(voice.file_id, userAccounts);
    const { text, keyboard } = await this.botBiznesService.biznesStep(ctx.simpleUserDocument, res, userAccounts);
    await this.botService.sendMessageReply(ctx, text, keyboard);
  }

  // @On('photo')
  // async onPhoto(@Ctx() ctx: UserTelegrafContext) {
  //   const message = ctx.message as Message.PhotoMessage;

  //   // const link = await ctx.telegram.getFileLink(message.photo[0].file_id);
  //   // const res = await fetch(link.href);
  //   // const buffer = Buffer.from(await res.arrayBuffer());

  //   const user = await this.botService.getUserSimpleAccounts(ctx.from);
  //   if (!user) return;

  //   const res = await this.botService.photoMessageProcessing(
  //     message.photo[0].file_id,
  //     user,
  //   );

  //   const { text, keyboard } = await this.botBiznesService.biznesStep(
  //     res,
  //     user,
  //   );
  //   await this.botService.sendMessageReply(ctx, text, keyboard);
  // }
}
