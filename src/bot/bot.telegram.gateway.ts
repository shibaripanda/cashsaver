// import { UseGuards } from '@nestjs/common';
// import { CallbackQuery, Message } from '@telegraf/types';
import { Ctx, Start, Update } from 'nestjs-telegraf';
// import { AdminAccessGuard } from './guards/access-control.guard';
import { ConfigService } from '@nestjs/config';
import { BotService } from './bot.service';
import { UserContext } from './interfaces/MyContext';
import { UseGuards } from '@nestjs/common';
import { AccessGuard } from './guards/access-control.guard';

@Update()
export class TelegramGateway {
  constructor(
    private botService: BotService,
    // private botKeyboardService: BotKeyboardService,
    // private botTextService: BotTextService,
    // private botBiznesService: BotBiznesService,
    private config: ConfigService,
  ) {}

  @UseGuards(AccessGuard)
  @Start()
  async start(@Ctx() ctx: UserContext) {
    console.log('@Start');
    await ctx.sendChatAction('typing');

    console.log(ctx.simpleUserDocument);

    // const user = await this.botService.getUser(ctx.from);
    // const simpleUser = await this.botService.getSimpleUser(ctx.from);
    // const userId = await this.botService.getUserId(ctx.from);

    // console.log('UserId', userId);
    // console.log('SimpleUser', simpleUser);
    // console.log('User', user);

    // const keyboard = this.botKeyboardService.keyboardStart();
    // const text = this.botTextService.textStart();
    // await this.botService.sendMessageReply(ctx, text, keyboard);
  }

  // @Action(/^myAcc:(.+)$/)
  // async buyByMeStartReg(@Ctx() ctx: CallbackContext) {
  //   const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
  //   const match = callbackQuery.data.match(/^myAcc:(.+)$/);
  //   if (!match) {
  //     await ctx.answerCbQuery('Ошибка', { show_alert: true });
  //     return;
  //   }
  //   await ctx.answerCbQuery();
  //   await ctx.sendChatAction('typing');
  //   console.log('myAcc:', match[1]);
  //   const accountWithChecks = await this.botService.getAccountWithChecks(
  //     ctx.from,
  //     match[1],
  //   );
  //   console.log(accountWithChecks);
  //   if (!accountWithChecks) return;
  //   const { text, keyboard } =
  //     this.botBiznesService.accountWhithCheckList(accountWithChecks);

  //   await this.botService.sendMessageReplyAction(ctx, text, keyboard);
  // }

  // @Action('myAccounts')
  // async myAccounts(@Ctx() ctx: UserTelegrafContext) {
  //   console.log('myAccounts');
  //   await ctx.answerCbQuery();
  //   await ctx.sendChatAction('typing');
  //   const myAccounts = await this.botService.getMyAccounts(ctx.from);
  //   if (!myAccounts) return;
  //   const { text, keyboard } = this.botBiznesService.myAccounts(myAccounts);
  //   await this.botService.sendMessageReply(ctx, text, keyboard);
  // }

  // @Action('mainMenu')
  // async mainMenu(@Ctx() ctx: UserTelegrafContext) {
  //   console.log('mainMenu');
  //   await ctx.answerCbQuery();
  //   await ctx.sendChatAction('typing');
  //   const text = this.botTextService.textMainMenu();
  //   const keyboard = this.botKeyboardService.keyboardMainMenu();
  //   await this.botService.sendMessageReply(ctx, text, keyboard);
  // }

  // @On('text')
  // async onText(@Ctx() ctx: UserTelegrafContext) {
  //   await ctx.sendChatAction('typing');
  //   const message = ctx.message as Message.TextMessage;
  //   const maxLengthTextMessage = Number(
  //     this.config.get<string>('MAX_LENGTH_TEXT_MESSAGE')!,
  //   );
  //   console.log('DURATION:', message.text.length, '/', maxLengthTextMessage);

  //   const user = await this.botService.getUserSimpleAccounts(ctx.from);
  //   if (!user) return;
  //   if (message.text.length > maxLengthTextMessage) {
  //     await this.botService.sendMessageReply(
  //       ctx,
  //       `Alert, too long text message\nMax length: ${maxLengthTextMessage}`,
  //     );
  //     return;
  //   }
  //   const res = await this.botService.textMessageProcessing(message.text, user);
  //   const { text, keyboard } = await this.botBiznesService.biznesStep(
  //     res,
  //     user,
  //   );
  //   await this.botService.sendMessageReply(ctx, text, keyboard);
  // }

  // @On('voice')
  // async onVoice(@Ctx() ctx: UserTelegrafContext) {
  //   await ctx.sendChatAction('typing');
  //   const voice = ctx.message['voice'];
  //   const maxLengthVoiceMessage = Number(
  //     this.config.get<string>('MAX_LENGTH_VOICE_MESSAGE_SECONDS')!,
  //   );
  //   console.log('DURATION:', voice.duration, '/', maxLengthVoiceMessage);

  //   const user = await this.botService.getUserSimpleAccounts(ctx.from);
  //   if (!user) return;
  //   if (voice.duration > maxLengthVoiceMessage) {
  //     await this.botService.sendMessageReply(
  //       ctx,
  //       `Alert, too long voice message\nMax length: ${maxLengthVoiceMessage} seconds`,
  //     );
  //     return;
  //   }
  //   const res = await this.botService.voiceMessageProcessing(
  //     voice.file_id,
  //     user,
  //   );
  //   const { text, keyboard } = await this.botBiznesService.biznesStep(
  //     res,
  //     user,
  //   );
  //   await this.botService.sendMessageReply(ctx, text, keyboard);
  // }

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
