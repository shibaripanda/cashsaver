import { Global, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GlobalConfigModule } from 'src/globalConfig/globalConfig.module';
import { BotModule } from 'src/bot/bot.module';
import { UserModule } from 'src/biznes/user/user.module';
import { AccountModule } from 'src/biznes/account/account.module';
import { CheckModule } from 'src/biznes/check/check.module';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OpenaiModule } from 'src/openai/openai.module';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { WebModule } from 'src/web/web.module';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_TOKEN')!,
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')!,
        signOptions: {
          expiresIn: configService.get<string>('LIFI_TIME_TOKEN')! as StringValue,
        },
      }),
    }),
    WebModule,
    GlobalConfigModule,
    BotModule,
    UserModule,
    AccountModule,
    CheckModule,
    OpenaiModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
  exports: [AppService],
})
export class AppModule {}
