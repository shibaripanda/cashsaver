import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
// import { writeFile, unlink } from 'fs/promises';
// import { tmpdir } from 'os';
// import { join } from 'path';
// import { createReadStream } from 'fs';
import { AccountNameAndId } from './interfaces/UserAccounts';
import { Expense } from './interfaces/Expense';

@Injectable()
export class OpenaiVoiceService {
  constructor(@Inject('OPENAI_CLIENT') private readonly openai: OpenAI) {}

  //   private async transcribe(audioBuffer: Buffer) {
  //     const filePath = join(tmpdir(), `voice-${Date.now()}.ogg`);
  //     await writeFile(filePath, audioBuffer);

  //     try {
  //       const stream = createReadStream(filePath);

  //       const transcription = await this.openai.audio.transcriptions.create({
  //         file: stream,
  //         model: 'gpt-4o-transcribe',
  //       });

  //       return transcription.text;
  //     } finally {
  //       await unlink(filePath).catch(() => {});
  //     }
  //   }

  //   private async describeImage(
  //     imageBuffer: Buffer,
  //     link: string,
  //   ): Promise<string> {
  //     // const base64 = imageBuffer.toString('base64');

  //     const res = await this.openai.responses.create({
  //       model: 'gpt-4.1',
  //       input: [
  //         {
  //           role: 'user',
  //           content: [
  //             {
  //               type: 'input_text',
  //               text: `
  // Извлеки весь текст с этого чека максимально точно.
  // Ничего не анализируй.
  // Верни только текст.
  // `,
  //             },
  //             {
  //               type: 'input_image',
  //               image_url: link,
  //               detail: 'high',
  //             },
  //           ],
  //         },
  //       ],
  //     });

  //     return res.output_text;
  //   }

  private async openaiReqest(request: string, content: string) {
    const res = await this.openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        {
          role: 'system',
          content: request,
        },
        { role: 'user', content: content },
      ],
      temperature: 0,
    });
    const jsonText = res.choices?.[0]?.message?.content ?? '{}';
    return JSON.parse(jsonText) as Expense;
  }

  private async choosingNextStep(
    text: string,
    accounts: string[],
  ): Promise<Expense> {
    const res = await this.openaiReqest(
      `Ты — строго детерминированный классификатор намерения пользователя финансового ассистента.

ТВОЯ ЗАДАЧА
Определи намерение пользователя и верни строго один JSON-объект.

ОБЩИЕ ПРАВИЛА
- Отвечай только JSON
- Никакого текста вне JSON
- Ничего не придумывай
- Интерпретируй только явно указанные данные
- Если уверенность < 90% → {"step":0,"data":null}
- Если валидных данных нет → {"step":0,"data":null}

НОРМАЛИЗАЦИЯ ВХОДА
Перед анализом:
- используй язык на котором говорит пользователь
- исправь ошибки распознавания речи
- исправь опечатки
- убери мусорные слова
- приведи слова к базовой форме

СПИСОК СУЩЕСТВУЮЩИХ КАТЕГОРИЙ
${JSON.stringify(accounts)}

ВЫБОР ШАГА

Step 1 — создать категории  
если пользователь хочет добавить / создать категории

Step 2 — добавить расход  
если пользователь сообщает о трате денег

Step 3 — узнать сумму расходов  
если пользователь спрашивает сколько потратил

Step 4 — удалить категории  
если пользователь хочет удалить категории

Step 5 — узнать баланс  
если пользователь спрашивает баланс / остаток

Step 0 — непонятно  
если намерение нельзя определить однозначно

ПРАВИЛА КАТЕГОРИЙ

Для Step 1:
- можно использовать новые категории
- нельзя возвращать категории уже существующие
- удалить дубликаты
- с большой буквы все категории
- если после фильтрации список пуст → step 0

Для Step 2–4:
- использовать можно только категории из списка
- категории вне списка игнорировать
- если после фильтрации не осталось категорий → step 0
- если категория не указана явно → step 0

ОГРАНИЧЕНИЯ ДАННЫХ
Запрещено возвращать:
- пустые строки
- строки из пробелов
- пустые массивы
- массивы с пустыми значениями
- null внутри массивов

ТРЕБОВАНИЯ К ПОЛЯМ
- строки минимум 2 символа
- cost только число
- cost > 0
- account должно полностью совпадать с категорией из списка

ФОРМАТЫ ОТВЕТА

Step 1
{"step":1,"data": ["категория"]}

Step 2
{"step":2,"data":{"newChecks": [{"account":"категория","info":"описание","cost":100.50}]}}

Step 3
{"step":3,"data":{"account":["категория"]}}

Step 4
{"step":4,"data":{"account":["категория"]}}

Step 5
{"step":5,"data":null}

Step 0
{"step":0,"data":null}

ФИНАЛЬНАЯ ПРОВЕРКА
Перед отправкой ответа проверь:
- JSON валиден
- нет пустых значений
- структура соответствует формату шага
- есть данные если step ≠ 0

Если хоть одно условие нарушено → вернуть {"step":0,"data":null}`,
      text,
    );
    return res;
  }

  // async photoOpenAIProcessing(
  //   photoBuffer: Buffer,
  //   user: ServerUser,
  //   link: string,
  // ) {
  //   const text = await this.describeImage(photoBuffer, link);
  //   console.log(text);
  //   const accounts = user.accounts.map((a) => a.name);
  //   const res = await this.choosingNextStep(text, accounts);
  //   return res;
  // }

  async textOpenAIProcessing(text: string, userAccounts: AccountNameAndId[]) {
    const accounts = userAccounts.map((a) => a.name);
    const res = await this.choosingNextStep(text, accounts);
    return res;
  }

  // async voiceOpenAIProcessing(voiceBuffer: Buffer, user: ServerUser) {
  //   const text = await this.transcribe(voiceBuffer);
  //   const accounts = user.accounts.map((a) => a.name);
  //   const res = await this.choosingNextStep(text, accounts);
  //   return res;
  // }
}
