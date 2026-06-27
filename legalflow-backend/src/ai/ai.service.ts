import { Injectable, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PromptBuilderService } from './prompts/prompt-builder.service';
import {
  AI_PROVIDER_TOKEN,
  AiCompletionResponse,
  AiClassificationResponse,
  AiChecklistResponse,
  AiDraftResponse,
} from './interfaces/ai-provider.interface';
import type { IAiProvider } from './interfaces/ai-provider.interface';
import { SummarizePetitionDto } from './dto/summarize-petition.dto';
import { ClassifyPetitionDto } from './dto/classify-petition.dto';
import { SuggestChecklistDto } from './dto/suggest-checklist.dto';
import { DraftResponseDto } from './dto/draft-response.dto';
import { AiFeedbackDto } from './dto/ai-feedback.dto';
import { AiActionType, AiLogStatus, AiFeedbackStatus } from '@prisma/client';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly promptBuilder: PromptBuilderService,
    @Inject(AI_PROVIDER_TOKEN) private readonly aiProvider: IAiProvider,
  ) {}

  private async logAudit(
    userId: string,
    actionType: AiActionType,
    modelName: string,
    inputPayload: any,
    outputPayload: any,
    status: AiLogStatus,
    latencyMs?: number,
    promptTokens?: number,
    completionTokens?: number,
    errorMessage?: string,
    caseId?: string,
  ) {
    try {
      await this.prisma.aiAuditLog.create({
        data: {
          userId,
          caseId: caseId || null,
          actionType,
          modelName,
          promptTokens: promptTokens || 0,
          completionTokens: completionTokens || 0,
          latencyMs: latencyMs || 0,
          inputPayload,
          outputPayload,
          status,
          errorMessage: errorMessage || null,
          userFeedback: AiFeedbackStatus.PENDING,
        },
      });
    } catch (err: any) {
      this.logger.error(`Failed to create AiAuditLog: ${err.message}`, err.stack);
    }
  }

  async summarize(dto: SummarizePetitionDto, userId: string): Promise<AiCompletionResponse> {
    const inputPayload = this.promptBuilder.prepareInput(dto.text);
    const startTime = Date.now();

    try {
      const response = await this.aiProvider.summarize(inputPayload);

      await this.logAudit(
        userId,
        AiActionType.SUMMARIZE,
        response.modelName,
        { text: inputPayload },
        response,
        AiLogStatus.SUCCESS,
        response.latencyMs || Date.now() - startTime,
        response.promptTokens,
        response.completionTokens,
        undefined,
        dto.caseId,
      );

      if (dto.caseId) {
        await this.prisma.aiCaseSuggestion.upsert({
          where: { caseId: dto.caseId },
          create: {
            caseId: dto.caseId,
            suggestedSummary: response.content,
          },
          update: {
            suggestedSummary: response.content,
            lastGeneratedAt: new Date(),
          },
        });
      }

      return response;
    } catch (error: any) {
      await this.logAudit(
        userId,
        AiActionType.SUMMARIZE,
        'unknown',
        { text: inputPayload },
        { error: error.message },
        AiLogStatus.ERROR,
        Date.now() - startTime,
        0,
        0,
        error.message,
        dto.caseId,
      );
      throw error;
    }
  }

  async classify(dto: ClassifyPetitionDto, userId: string): Promise<AiClassificationResponse> {
    const inputPayload = this.promptBuilder.prepareInput(dto.text);
    const startTime = Date.now();

    try {
      const response = await this.aiProvider.classify(inputPayload);

      await this.logAudit(
        userId,
        AiActionType.CLASSIFY,
        response.modelName,
        { text: inputPayload },
        response,
        AiLogStatus.SUCCESS,
        response.latencyMs || Date.now() - startTime,
        response.promptTokens,
        response.completionTokens,
        undefined,
        dto.caseId,
      );

      if (dto.caseId) {
        await this.prisma.aiCaseSuggestion.upsert({
          where: { caseId: dto.caseId },
          create: {
            caseId: dto.caseId,
            suggestedType: response.suggestedType,
            suggestedField: response.suggestedField,
            confidenceScore: response.confidenceScore,
            legalRationale: response.legalRationale,
          },
          update: {
            suggestedType: response.suggestedType,
            suggestedField: response.suggestedField,
            confidenceScore: response.confidenceScore,
            legalRationale: response.legalRationale,
            lastGeneratedAt: new Date(),
          },
        });
      }

      return response;
    } catch (error: any) {
      await this.logAudit(
        userId,
        AiActionType.CLASSIFY,
        'unknown',
        { text: inputPayload },
        { error: error.message },
        AiLogStatus.ERROR,
        Date.now() - startTime,
        0,
        0,
        error.message,
        dto.caseId,
      );
      throw error;
    }
  }

  async suggestChecklist(dto: SuggestChecklistDto, userId: string): Promise<AiChecklistResponse> {
    const inputPayload = this.promptBuilder.prepareInput(dto.text);
    const startTime = Date.now();

    try {
      const response = await this.aiProvider.suggestChecklist(inputPayload);

      await this.logAudit(
        userId,
        AiActionType.CHECKLIST,
        response.modelName,
        { text: inputPayload },
        response,
        AiLogStatus.SUCCESS,
        response.latencyMs || Date.now() - startTime,
        response.promptTokens,
        response.completionTokens,
        undefined,
        dto.caseId,
      );

      return response;
    } catch (error: any) {
      await this.logAudit(
        userId,
        AiActionType.CHECKLIST,
        'unknown',
        { text: inputPayload },
        { error: error.message },
        AiLogStatus.ERROR,
        Date.now() - startTime,
        0,
        0,
        error.message,
        dto.caseId,
      );
      throw error;
    }
  }

  async draftResponse(dto: DraftResponseDto, userId: string): Promise<AiDraftResponse> {
    const preparedContext = JSON.parse(this.promptBuilder.prepareInput(dto.petitionContext));
    const startTime = Date.now();

    try {
      const response = await this.aiProvider.draftResponse(preparedContext, dto.draftType);

      await this.logAudit(
        userId,
        AiActionType.DRAFT,
        response.modelName,
        { draftType: dto.draftType, context: preparedContext },
        response,
        AiLogStatus.SUCCESS,
        response.latencyMs || Date.now() - startTime,
        response.promptTokens,
        response.completionTokens,
        undefined,
        dto.caseId,
      );

      return response;
    } catch (error: any) {
      await this.logAudit(
        userId,
        AiActionType.DRAFT,
        'unknown',
        { draftType: dto.draftType, context: preparedContext },
        { error: error.message },
        AiLogStatus.ERROR,
        Date.now() - startTime,
        0,
        0,
        error.message,
        dto.caseId,
      );
      throw error;
    }
  }

  async submitFeedback(dto: AiFeedbackDto, userId: string) {
    const suggestion = await this.prisma.aiCaseSuggestion.findUnique({
      where: { caseId: dto.caseId },
    });

    const isAccepted = dto.feedback === AiFeedbackStatus.ACCEPTED;
    const shouldApply = isAccepted && !!dto.applyToCase;

    if (suggestion) {
      await this.prisma.aiCaseSuggestion.update({
        where: { caseId: dto.caseId },
        data: {
          isApplied: shouldApply ? true : false,
          updatedAt: new Date(),
        },
      });
    }

    await this.prisma.aiAuditLog.updateMany({
      where: {
        caseId: dto.caseId,
        userFeedback: AiFeedbackStatus.PENDING,
      },
      data: {
        userFeedback: dto.feedback,
        appliedAt: shouldApply ? new Date() : null,
      },
    });

    let caseUpdated = false;
    if (shouldApply && suggestion) {
      const updateData: any = {};
      if (suggestion.suggestedType) updateData.type = suggestion.suggestedType;
      if (suggestion.suggestedField) updateData.field = suggestion.suggestedField;
      if (suggestion.suggestedSummary) updateData.summary = suggestion.suggestedSummary;

      if (Object.keys(updateData).length > 0) {
        await this.prisma.legalCase.update({
          where: { id: dto.caseId },
          data: updateData,
        });
        caseUpdated = true;
      }
    }

    return {
      success: true,
      caseId: dto.caseId,
      feedback: dto.feedback,
      caseUpdated,
    };
  }
}
