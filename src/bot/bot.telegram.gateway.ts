// import { UseGuards } from '@nestjs/common';
// import { CallbackQuery, Message } from '@telegraf/types';
import { Action, Ctx, On, Start, Update } from 'nestjs-telegraf';
// import { AdminAccessGuard } from './guards/access-control.guard';
import { ConfigService } from '@nestjs/config';
import { BotService } from './bot.service';
import { UserContext } from './interfaces/MyContext';
import { UseGuards } from '@nestjs/common';
import { AccessGuard } from './guards/access-control.guard';
import { BotTextService } from './bot.text.service';
import { UserService } from 'src/biznes/user/user.service';
import { BotKeyboardService } from './bot.keyboard.service';
import { BotBiznesService } from './bot.biznes.service';

@Update()
export class TelegramGateway {
  constructor(
    private botService: BotService,
    private botKeyboardService: BotKeyboardService,
    private botTextService: BotTextService,
    private userService: UserService,
    private botBiznesService: BotBiznesService,
    private config: ConfigService,
  ) {}

  @UseGuards(AccessGuard)
  @Start()
  async start(@Ctx() ctx: UserContext) {
    console.log('@Start');
    await ctx.sendChatAction('typing');

    console.log(ctx.simpleUserDocument);

    const MyAccountListWithChecksSumsAndCounts =
      await this.userService.getMyAccountListWithChecksSumsAndCounts(
        ctx.simpleUserDocument._id,
      );
    if (!MyAccountListWithChecksSumsAndCounts) return;
    const text = this.botTextService.textStart();
    const keyboard = this.botKeyboardService.keyboardMyAccounts(
      MyAccountListWithChecksSumsAndCounts,
    );
    await this.botService.sendMessageReply(ctx, text, keyboard);
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

  @Action('disabled_zero_checks')
  async disabledButton(@Ctx() ctx: UserContext) {
    await ctx.answerCbQuery('Нет чеков', { show_alert: true });
  }

  @Action('myAccounts')
  async myAccounts(@Ctx() ctx: UserContext) {
    console.log('myAccounts');
    await ctx.answerCbQuery();
    await ctx.sendChatAction('typing');
    const MyAccountListWithChecksSumsAndCounts =
      await this.userService.getMyAccountListWithChecksSumsAndCounts(
        ctx.simpleUserDocument._id,
      );
    if (!MyAccountListWithChecksSumsAndCounts) return;
    const text = this.botTextService.textStart();
    const keyboard = this.botKeyboardService.keyboardMyAccounts(
      MyAccountListWithChecksSumsAndCounts,
    );
    await this.botService.sendMessageReply(ctx, text, keyboard);
  }

  // @Action('mainMenu')
  // async mainMenu(@Ctx() ctx: UserTelegrafContext) {
  //   console.log('mainMenu');
  //   await ctx.answerCbQuery();
  //   await ctx.sendChatAction('typing');
  //   const text = this.botTextService.textMainMenu();
  //   const keyboard = this.botKeyboardService.keyboardMainMenu();
  //   await this.botService.sendMessageReply(ctx, text, keyboard);
  // }

  @On('text')
  async onText(@Ctx() ctx: UserContext) {
    await ctx.sendChatAction('typing');
    const message = ctx.message;
    const maxLengthTextMessage = Number(
      this.config.get<string>('MAX_LENGTH_TEXT_MESSAGE')!,
    );
    console.log('DURATION:', message.text.length, '/', maxLengthTextMessage);

    const userAccounts = await this.userService.getAccountNames(
      ctx.simpleUserDocument._id,
    );
    if (!userAccounts) return;
    if (message.text.length > maxLengthTextMessage) {
      await this.botService.sendMessageReply(
        ctx,
        `kdkd\nMax length: ${maxLengthTextMessage}`,
      );
      return;
    }
    const res = await this.botService.textMessageProcessing(
      message.text,
      userAccounts,
    );
    const { text, keyboard } = await this.botBiznesService.biznesStep(
      ctx.simpleUserDocument,
      res,
      userAccounts,
    );
    await this.botService.sendMessageReply(ctx, text, keyboard);
  }

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
