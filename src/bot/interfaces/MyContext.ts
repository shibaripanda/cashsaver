import { Context, NarrowedContext } from 'telegraf';
// import { SimpleUser } from './User';
import { Update } from '@telegraf/types';
import { UserDocument } from 'src/biznes/user/user.schema';
import { Message } from 'telegraf/types';

export interface MyContext extends Context {
  simpleUserDocument: UserDocument | null;
}

// export type UserContext = NarrowedContext<MyContext, Update.MessageUpdate>;

export type UserContext = NarrowedContext<
  MyContext,
  Update.MessageUpdate & { message: Message.VoiceMessage }
>;

// export type CallbackContext = NarrowedContext<
//   MyContext,
//   UpdateTelegraf.CallbackQueryUpdate & {
//     callbackQuery: CallbackQuery.DataQuery;
//   }
// >;
