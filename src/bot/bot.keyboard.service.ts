import { Injectable } from '@nestjs/common';
import { AccountForList } from './interfaces/AccountForList';
// import { Account1 } from '@app/openai/openai.voice.service';
// import { NewAccountControl } from '../kafka/kafka.service';

@Injectable()
export class BotKeyboardService {
  constructor() {}

  // keyboardCreateAccounts(accounts: NewAccountControl[]) {
  //   const res = accounts.map((ac) => [
  //     {
  //       text: '❌ ' + ac.name,
  //       callback_data: `delId_${ac._id}`,
  //       style: 'danger',
  //     },
  //   ]);
  //   return res.concat(this.keyboardMenuButOk());
  // }

  keyboardEmpty() {
    return [[], []];
  }

  keyboardMyAccounts(myAccounts: AccountForList[]) {
    const shotName = (ac: AccountForList) => {
      if (ac['count'] === 0) return ac.name;
      return ac.name + ' 💵 ' + ac['sum'].toFixed(2) + ` (${ac['count']})`;
    };
    const disableIfNoChecks = (ac: AccountForList) => {
      if (ac['count'] === 0) {
        return 'disabled_zero_checks:' + ac.name;
      }
      return `myAcc:${ac._id.toString()}`;
    };
    const res = myAccounts.map((ac) => [
      {
        text: shotName(ac),
        callback_data: disableIfNoChecks(ac),
      },
    ]);
    return res.concat(this.keyboardMenuBut());
  }

  // keyboardMainMenu() {
  //   const buttons = [
  //     { t: 'Мои аккаунты', c: 'myAccounts', s: 'success' },
  //     // { t: 'Расходы за сегодня', c: 'myAccounts', s: 'primary' },
  //     // { t: 'Расходы за 7 дней', c: 'myMoney_7', s: 'primary' },
  //     // { t: 'Расходы за 30 дней', c: 'myMoney_30', s: 'primary' },
  //   ];
  //   return buttons.map((b) => [{ text: b.t, callback_data: b.c, style: b.s }]);
  //   // return [
  //   //   [
  //   //     {
  //   //       text: `Мои аккаунты`,
  //   //       callback_data: 'myAccounts',
  //   //       style: 'success',
  //   //     },
  //   //   ],
  //   //   [
  //   //     {
  //   //       text: `Расходы за сегодня`,
  //   //       callback_data: 'money_1',
  //   //       style: 'danger',
  //   //     },
  //   //   ],
  //   //   [
  //   //     {
  //   //       text: `Расходы за 7 дней`,
  //   //       callback_data: 'money_7',
  //   //       style: 'primary',
  //   //     },
  //   //   ],
  //   //   [
  //   //     {
  //   //       text: `Расходы за 30 дней`,
  //   //       callback_data: 'money_30',
  //   //     },
  //   //   ],
  //   //   [{ text: `Расходы за 180 дней`, callback_data: 'money_180' }],
  //   //   [{ text: `Расходы за 365 дней`, callback_data: 'money_365' }],
  //   // ];
  // }

  keyboardMenuButOk() {
    return [
      [
        {
          text: `Хорошо`,
          callback_data: 'myAccounts',
          style: 'success',
        },
      ],
    ];
  }

  keyboardMenuBut() {
    return [
      [
        {
          text: `Обновить`,
          callback_data: 'myAccounts',
          style: 'success',
        },
      ],
    ];
  }
}
