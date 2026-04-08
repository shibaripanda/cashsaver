import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Context as TelegrafContext } from 'telegraf';

@Injectable()
export class AdminAccessGuard implements CanActivate {
  // constructor(private readonly userService: UserService) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const ctx = context.getArgByIndex<TelegrafContext>(0);
    console.log('AdminGuardAccess');
    // console.log(ctx.from);
    // const userId = ctx?.from?.id;

    // if (!userId) return false;

    // const isAllowed = this.userService.admins.includes(userId);
    return true;
  }
}
