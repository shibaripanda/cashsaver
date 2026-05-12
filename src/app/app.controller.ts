import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  // UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
// import { BotService } from 'src/bot/bot.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    // private botService: BotService,
  ) {}

  @Get('access/:token')
  async checkToken(@Param('token') startToken: string) {
    console.log(startToken);
    const res = await this.appService.validateToken(startToken);
    console.log(res);
    if (!res) {
      throw new ForbiddenException('Недействительный токен');
    }
    return { token: res.token };
  }
}
