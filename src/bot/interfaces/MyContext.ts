import { Context, NarrowedContext } from 'telegraf';
import { Update } from '@telegraf/types';
import { UserDocument } from 'src/biznes/user/user.schema';
import { Message } from 'telegraf/types';

export interface MyContext extends Context {
  simpleUserDocument: UserDocument;
}

// export type UserContext = NarrowedContext<MyContext, Update.MessageUpdate>;

// export type UserTextContext = NarrowedContext<
//   MyContext,
//   Update.MessageUpdate & { message: Message.TextMessage }
// >;

export type UserContext = NarrowedContext<
  MyContext,
  Update.MessageUpdate & { message: Message.VoiceMessage } & {
    message: Message.TextMessage;
  }
>;

// export type CallbackContext = NarrowedContext<
//   MyContext,
//   Update.CallbackQueryUpdate & {
//     callbackQuery: CallbackQuery.DataQuery;
//   }
// >;
