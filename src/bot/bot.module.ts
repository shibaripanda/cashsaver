import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { TelegrafModule } from 'nestjs-telegraf';
import { accessControlMiddleware } from './middlewares/access-control.middleware';
// import { Context } from 'telegraf';
// import { Update } from 'telegraf/types';
import { UserContext } from './interfaces/MyContext';
import { UserModule } from 'src/biznes/user/user.module';
import { TelegramGateway } from './bot.telegram.gateway';
import { BotLifecycleService } from './bot.lifecycle.service';
import { BotService } from './bot.service';
import { BotTextService } from './bot.text.service';
import { BotKeyboardService } from './bot.keyboard.service';
import { AccountModule } from 'src/biznes/account/account.module';
import { CheckModule } from 'src/biznes/check/check.module';
import { BotBiznesService } from './bot.biznes.service';
import { OpenaiModule } from 'src/openai/openai.module';
// import { Update } from '@telegraf/types';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [],
      inject: [ConfigService, ModuleRef],
      useFactory: (config: ConfigService, moduleRef: ModuleRef) => ({
        token: config.get<string>('BOT_TOKEN')!,
        dropPendingUpdates: true,
        middlewares: [
          (ctx: UserContext, next) => {
            ctx.state.moduleRef = moduleRef;
            return accessControlMiddleware()(ctx, next);
          },
        ],
      }),
    }),
    UserModule,
    AccountModule,
    CheckModule,
    OpenaiModule,
  ],
  providers: [
    TelegramGateway,
    BotLifecycleService,
    BotService,
    BotTextService,
    BotKeyboardService,
    BotBiznesService,
  ],
  exports: [],
})
export class BotModule {}
