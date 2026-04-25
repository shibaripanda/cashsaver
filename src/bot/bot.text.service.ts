import { Injectable } from '@nestjs/common';
import { CheckDocument } from 'src/biznes/check/check.schema';
import { NewCheck } from 'src/openai/interfaces/Expense';
import { AccountForList } from './interfaces/AccountForList';

@Injectable()
export class BotTextService {
  constructor() {}

  textCheckList(cost: number, mounthBudget: number, name: string, checks: CheckDocument[]) {
    const MAX_LENGTH = 4096;

    const escapeHtml = (str: string = ''): string => {
      const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      };
      return str.replace(/[&<>"']/g, (m) => map[m] ?? m);
    };

    const getPrettyTime = (time: Date) => {
      const date = new Date(time);
      return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    // сортировка: от старых к новым
    const sorted = [...checks].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const header = `<b>${escapeHtml(name)}</b>${mounthBudget ? ` (${mounthBudget})` : ''}\n-------\n`;

    const footerBase = (sum: number, hidden: number) =>
      `\n<b>Итого за текущий месяц: ${sum.toFixed(2)}</b>` +
      (hidden > 0 ? `\n<i>...ещё ${hidden} старых чеков</i>` : '');

    const blocks: string[] = [];
    let sum = 0;

    // идём с конца (новые → старые)
    for (let i = sorted.length - 1; i >= 0; i--) {
      const ch = sorted[i];

      const block =
        `⏰ <i>${getPrettyTime(ch.createdAt)}</i>\n` +
        `🧾 ${escapeHtml(ch.info)}\n` +
        `💵 ${ch.cost}\n` +
        `🗑 <tg-spoiler>/delch_${ch._id.toHexString()}</tg-spoiler>\n` +
        `➖➖➖\n\n`;

      const nextSum = sum + ch.cost;
      const hiddenCount = i; // сколько старых останется скрыто

      const footer = footerBase(nextSum, hiddenCount);

      const candidate = header + blocks.join('') + block + footer;

      if (candidate.length > MAX_LENGTH) {
        break;
      }

      blocks.unshift(block); // добавляем в начало (сохраняем порядок)
      sum = nextSum;
    }

    const hidden = sorted.length - blocks.length;

    return header + blocks.join('') + footerBase(sum, hidden);
  }

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

  textMyAccounts(MyAccountListWithChecksSumsAndCounts: AccountForList[], user: { mounthBudget?: number }) {
    const line = '\n▪️▫️▫️';
    const budjet = user.mounthBudget
      ? `Бюджет на месяц: ${user.mounthBudget.toFixed(2)}`
      : 'Бюджет на месяц не установлен';
    const sum = MyAccountListWithChecksSumsAndCounts.reduce((acc, ac) => acc + ac.sum, 0);
    const startText = `Расходы с начала месяцаа: ${sum.toFixed(2)}`;
    return `▪️${startText}${line}\n▪️${budjet}${line}`;
  }

  textMainMenu() {
    return 'Вот';
  }

  textStart() {
    return 'Hello';
  }

  textSuccsessMainBudget(data: number) {
    return `✅ Бюджет обновлен:\n${data}`;
  }

  textSuccsessUpdateBudget(accounts: { account: string; budget: number }[]) {
    return `✅ Бюджет обновлен:\n${accounts.map((ac) => `${ac.account}: ${ac.budget}`).join(', ')}`;
  }

  textSuccsessNewAccount(accounts: string[]) {
    return `✅ Аккаунт(ы) созданы:\n${accounts.join(', ')}`;
  }

  textSuccsessNewCheck(checks: NewCheck[]) {
    return `✅ Чек(и) созданы:\n${checks.map((ch) => '▫️ ' + ch.account + '\n- ' + ch.info + ' 💵 ' + ch.cost + '\n').join(', ')}`;
  }

  textError() {
    return '❌ Ошибка, попробуйте еще раз\n/Start';
  }
}
