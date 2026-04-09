import { MiddlewareFn } from 'telegraf';
import { ModuleRef } from '@nestjs/core';
import { UserService } from 'src/biznes/user/user.service';
import { UserContext } from '../interfaces/MyContext';

export const accessControlMiddleware = (): MiddlewareFn<UserContext> => {
  return async (ctx: UserContext, next) => {
    if (!ctx.from || ctx.from.is_bot) return;

    console.log('accessControlMiddleware');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const moduleRef: ModuleRef = ctx.state.moduleRef;

    const userService = moduleRef.get(UserService, { strict: false });
    const simpleUser = await userService.getNewOrExistSimpleUser(ctx.from);

    if (!simpleUser) return;

    simpleUser.use += 1;
    await simpleUser.save();
    ctx.simpleUserDocument = simpleUser;

    // console.log(ctx.simpleUserDocument);

    await next();
  };
};
