import { Module } from '@nestjs/common';
import { LegalKnowledgeController } from './legal-knowledge.controller';
import { LegalKnowledgeService } from './legal-knowledge.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LegalKnowledgeController],
  providers: [LegalKnowledgeService],
  exports: [LegalKnowledgeService],
})
export class LegalKnowledgeModule {}
