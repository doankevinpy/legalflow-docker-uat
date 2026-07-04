import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { AdministrativeProceduresService } from './administrative-procedures.service';
import { ProcedureAiService } from './ai/procedure-ai.service';
import { ProcedureAiPromptBuilder } from './ai/procedure-ai-prompt.builder';
import { ProcedureTypesController } from './procedure-types.controller';
import { ProcedureCasesController } from './procedure-cases.controller';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [ProcedureTypesController, ProcedureCasesController],
  providers: [AdministrativeProceduresService, ProcedureAiService, ProcedureAiPromptBuilder],
  exports: [AdministrativeProceduresService, ProcedureAiService],
})
export class AdministrativeProceduresModule {}
