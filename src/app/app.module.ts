import { Global, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GlobalConfigModule } from 'src/globalConfig/globalConfig.module';
import { BotModule } from 'src/bot/bot.module';
import { UserModule } from 'src/biznes/user/user.module';
import { AccountModule } from 'src/biznes/account/account.module';
import { CheckModule } from 'src/biznes/check/check.module';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_TOKEN')!,
      }),
      inject: [ConfigService],
    }),
    GlobalConfigModule,
    BotModule,
    UserModule,
    AccountModule,
    CheckModule,
  ],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
