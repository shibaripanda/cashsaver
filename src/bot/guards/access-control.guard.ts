import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AppService } from 'src/app/app.service';
import { Context as TelegrafContext } from 'telegraf';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private readonly appService: AppService) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.getArgByIndex<TelegrafContext>(0);
    console.log('AdminGuardAccess');
    const userId = ctx?.from?.id;

    if (!userId) return false;

    const isAllowed = !this.appService.getBlockUsers().includes(userId);
    return isAllowed;
  }
}
