import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { PromptBuilderService } from './prompts/prompt-builder.service';
import { GeminiProvider } from './providers/gemini.provider';
import { AI_PROVIDER_TOKEN } from './interfaces/ai-provider.interface';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AiController],
  providers: [
    AiService,
    PromptBuilderService,
    {
      provide: AI_PROVIDER_TOKEN,
      useClass: GeminiProvider,
    },
  ],
  exports: [AiService, PromptBuilderService, AI_PROVIDER_TOKEN],
})
export class AiModule {}
