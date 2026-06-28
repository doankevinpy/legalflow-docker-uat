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
    let promptText = dto.text;
    if (!promptText && dto.caseId) {
      const c = await this.prisma.legalCase.findUnique({ where: { id: dto.caseId } });
      if (c) {
        promptText = `Loại đơn: ${c.type}, Lĩnh vực: ${c.field}, Tóm tắt: ${c.summary}, Yêu cầu: ${c.request}`;
      }
    }
    if (!promptText) {
      promptText = `Loại đơn: ${dto.type || 'N/A'}, Lĩnh vực: ${dto.field || 'N/A'}, Tóm tắt: ${dto.summary || 'N/A'}, Yêu cầu: ${dto.request || 'N/A'}`;
    }
    const inputPayload = this.promptBuilder.prepareInput(promptText);
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
    let contextObj: Record<string, any> = dto.petitionContext || {};
    if (dto.caseId && (!dto.petitionContext || Object.keys(dto.petitionContext).length === 0)) {
      const c = await this.prisma.legalCase.findUnique({ where: { id: dto.caseId } });
      if (c) {
        contextObj = {
          ...contextObj,
          caseCode: c.caseCode,
          summary: c.summary,
          request: c.request,
          type: c.type,
          field: c.field,
          senderName: c.senderName,
        };
      }
    }
    if (dto.customInstructions) {
      contextObj.customInstructions = dto.customInstructions;
    }
    const preparedContext = JSON.parse(this.promptBuilder.prepareInput(contextObj));
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
    const isAccepted = dto.feedback === AiFeedbackStatus.ACCEPTED;

    if (dto.feedbackType === 'DRAFT') {
      await this.prisma.aiAuditLog.updateMany({
        where: {
          caseId: dto.caseId,
          actionType: AiActionType.DRAFT,
          userFeedback: AiFeedbackStatus.PENDING,
        },
        data: {
          userFeedback: dto.feedback,
          appliedAt: isAccepted ? new Date() : null,
        },
      });

      let caseUpdated = false;
      if (isAccepted && dto.draftContent) {
        let noteContent = dto.draftContent.trim();
        let prefix = '[AI Dự thảo - Văn bản nháp]';
        if (dto.draftType === 'PHIEU_XU_LY') {
          prefix = '[AI Dự thảo - Phiếu xử lý đơn]';
        } else if (dto.draftType === 'GIAY_MOI_LAM_VIEC') {
          prefix = '[AI Dự thảo - Giấy mời làm việc]';
        } else if (dto.draftType === 'THONG_BAO_THU_LY') {
          prefix = '[AI Dự thảo - Thông báo thụ lý]';
        } else if (dto.draftType === 'THONG_BAO_KHONG_THU_LY') {
          prefix = '[AI Dự thảo - Thông báo không thụ lý]';
        } else if (dto.draftType === 'VAN_BAN_CHUYEN_DON') {
          prefix = '[AI Dự thảo - Văn bản chuyển đơn]';
        } else if (dto.draftType === 'TRA_LOI_CONG_DAN_DU_THAO') {
          prefix = '[AI Dự thảo - Trả lời công dân]';
        } else if (dto.draftTitle && dto.draftTitle.toLowerCase().includes('phiếu')) {
          prefix = '[AI Dự thảo - Phiếu xử lý đơn]';
        } else if (dto.draftTitle && dto.draftTitle.toLowerCase().includes('mời')) {
          prefix = '[AI Dự thảo - Giấy mời làm việc]';
        } else if (dto.draftTitle) {
          prefix = `[AI Dự thảo - ${dto.draftTitle}]`;
        }

        if (!noteContent.startsWith('[AI Dự thảo - ')) {
          noteContent = `${prefix}\n\n${noteContent}`;
        }

        await this.prisma.caseNote.create({
          data: {
            caseId: dto.caseId,
            userId,
            content: noteContent,
          },
        });
        caseUpdated = true;
      }

      return {
        success: true,
        caseId: dto.caseId,
        feedback: dto.feedback,
        caseUpdated,
      };
    }

    if (dto.feedbackType === 'CHECKLIST') {
      await this.prisma.aiAuditLog.updateMany({
        where: {
          caseId: dto.caseId,
          actionType: AiActionType.CHECKLIST,
          userFeedback: AiFeedbackStatus.PENDING,
        },
        data: {
          userFeedback: dto.feedback,
          appliedAt: isAccepted ? new Date() : null,
        },
      });

      let caseUpdated = false;
      if (isAccepted && dto.checklistItems && dto.checklistItems.length > 0) {
        const existingItems = await this.prisma.caseChecklistItem.findMany({
          where: { caseId: dto.caseId },
          select: { title: true },
        });
        const existingTitles = new Set(existingItems.map(i => i.title.trim()));

        const itemsToCreate = dto.checklistItems
          .map(item => item.trim())
          .filter(title => title.length > 0 && !existingTitles.has(title));

        if (itemsToCreate.length > 0) {
          await this.prisma.caseChecklistItem.createMany({
            data: itemsToCreate.map(title => ({
              caseId: dto.caseId,
              title,
              isCompleted: false,
            })),
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

    const suggestion = await this.prisma.aiCaseSuggestion.findUnique({
      where: { caseId: dto.caseId },
    });

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
