import { Injectable } from '@nestjs/common';
// import { Check } from './interfaces/User';
// import { Check1 } from '../openai/openai.voice.service';

@Injectable()
export class BotTextService {
  constructor() {}

  // textCheckList(cost: number, name: string, checks: Check[]) {
  //   const MAX_LENGTH = 4096;

  //   const escapeHtml = (str: string = ''): string => {
  //     const map: Record<string, string> = {
  //       '&': '&amp;',
  //       '<': '&lt;',
  //       '>': '&gt;',
  //       '"': '&quot;',
  //       "'": '&#039;',
  //     };
  //     return str.replace(/[&<>"']/g, (m) => map[m] ?? m);
  //   };

  //   const getPrettyTime = (time: Date) => {
  //     const date = new Date(time);
  //     return date.toLocaleString('ru-RU', {
  //       day: '2-digit',
  //       month: '2-digit',
  //       year: 'numeric',
  //       hour: '2-digit',
  //       minute: '2-digit',
  //     });
  //   };

  //   // сортировка: от старых к новым
  //   const sorted = [...checks].sort(
  //     (a, b) =>
  //       new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  //   );

  //   const header = `<b>${escapeHtml(name)}</b>\n-------\n`;

  //   const footerBase = (sum: number, hidden: number) =>
  //     `\n<b>Итого за текущий месяц: ${sum}</b>` +
  //     (hidden > 0 ? `\n<i>...ещё ${hidden} старых чеков</i>` : '');

  //   const blocks: string[] = [];
  //   let sum = 0;

  //   // идём с конца (новые → старые)
  //   for (let i = sorted.length - 1; i >= 0; i--) {
  //     const ch = sorted[i];

  //     const block =
  //       `⏰ <i>${getPrettyTime(ch.createdAt)}</i>\n` +
  //       `🧾 ${escapeHtml(ch.info)}\n` +
  //       `💵 ${ch.cost}\n` +
  //       `➖➖➖\n\n`;

  //     const nextSum = sum + ch.cost;
  //     const hiddenCount = i; // сколько старых останется скрыто

  //     const footer = footerBase(nextSum, hiddenCount);

  //     const candidate = header + blocks.join('') + block + footer;

  //     if (candidate.length > MAX_LENGTH) {
  //       break;
  //     }

  //     blocks.unshift(block); // добавляем в начало (сохраняем порядок)
  //     sum = nextSum;
  //   }

  //   const hidden = sorted.length - blocks.length;

  //   return header + blocks.join('') + footerBase(sum, hidden);
  // }

  // textCheckList(cost: number, name: string, checks: Check[]) {
  //   const getPrettyTime = (time: Date) => {
  //     const date = new Date(time);

  //     const formatted = date.toLocaleString('ru-RU', {
  //       day: '2-digit',
  //       month: '2-digit',
  //       year: 'numeric',
  //       hour: '2-digit',
  //       minute: '2-digit',
  //     });
  //     return formatted;
  //   };

  //   const cheksList = checks.map(
  //     (ch) =>
  //       `⏰ <i>${getPrettyTime(ch.createdAt)}</i>` +
  //       '\n🧾 ' +
  //       ch.info +
  //       '\n💵 ' +
  //       ch.cost +
  //       '\n➖➖➖\n',
  //   );
  //   return `<b>${name} (${cost})</b>` + '\n-------\n' + cheksList.join('\n');
  // }

  textAfterVoice(res) {
    console.log(res);
    return 'ответ';
  }

  textMyAccounts() {
    return 'Мои аккаунты';
  }

  textMainMenu() {
    return 'Вот';
  }

  textStart() {
    return 'Hello';
  }

  textSuccsessNewAccount(accounts: string[]) {
    return `✅ Аккаунт(ы) созданы:\n${accounts.join(', ')}`;
  }

  // textSuccsessNewCheck(checks: Check1[]) {
  //   return `✅ Чек(и) созданы:\n${checks.map((ch) => '▫️ ' + ch.account + '\n- ' + ch.info + ' 💵 ' + ch.cost + '\n').join(', ')}`;
  // }

  textError() {
    return '❌ Ошибка, попробуйте еще раз\n/Start';
  }
}
