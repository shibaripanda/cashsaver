import { Module } from '@nestjs/common';
import { OpenAIProvider } from './openai.provider';
import { OpenaiVoiceService } from './openai.voice.service';

@Module({
  imports: [],
  providers: [OpenAIProvider, OpenaiVoiceService],
  exports: [OpenaiVoiceService],
})
export class OpenaiModule {}
