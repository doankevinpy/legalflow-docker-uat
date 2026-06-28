import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { PromptBuilderService } from './prompts/prompt-builder.service';
import { AI_PROVIDER_TOKEN } from './interfaces/ai-provider.interface';
import { CaseType, CaseField } from '@prisma/client';

describe('AiService', () => {
  let service: AiService;
  let prisma: PrismaService;
  let provider: any;

  const mockPrismaService = {
    aiAuditLog: {
      create: jest.fn().mockResolvedValue({ id: 'log-1' }),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    aiCaseSuggestion: {
      upsert: jest.fn().mockResolvedValue({ id: 'sug-1' }),
      findUnique: jest.fn(),
      update: jest.fn().mockResolvedValue({ id: 'sug-1' }),
    },
    legalCase: {
      update: jest.fn().mockResolvedValue({ id: 'case-1' }),
      findUnique: jest.fn().mockResolvedValue({ id: 'case-1', type: 'KN', field: 'DAT_DAI', summary: 'test', request: 'test' }),
    },
    caseChecklistItem: {
      findMany: jest.fn().mockResolvedValue([]),
      createMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    caseNote: {
      create: jest.fn().mockResolvedValue({ id: 'note-1' }),
    },
  };


  const mockAiProvider = {
    summarize: jest.fn(),
    classify: jest.fn(),
    suggestChecklist: jest.fn(),
    draftResponse: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        PromptBuilderService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AI_PROVIDER_TOKEN, useValue: mockAiProvider },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    prisma = module.get<PrismaService>(PrismaService);
    provider = module.get(AI_PROVIDER_TOKEN);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should summarize and log audit', async () => {
    mockAiProvider.summarize.mockResolvedValue({
      content: 'Tóm tắt đơn thành công',
      modelName: 'gemini-test',
      promptTokens: 10,
      completionTokens: 20,
    });

    const res = await service.summarize({ text: 'Đơn khiếu nại đất đai', caseId: 'case-1' }, 'user-1');

    expect(res.content).toEqual('Tóm tắt đơn thành công');
    expect(mockPrismaService.aiAuditLog.create).toHaveBeenCalled();
    expect(mockPrismaService.aiCaseSuggestion.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { caseId: 'case-1' } }),
    );
  });

  it('should classify and log audit', async () => {
    mockAiProvider.classify.mockResolvedValue({
      content: 'Classify result',
      suggestedType: CaseType.KN,
      suggestedField: CaseField.DAT_DAI,
      confidenceScore: 0.95,
      legalRationale: 'Luật Đất đai',
      modelName: 'gemini-test',
    });

    const res = await service.classify({ text: 'Tranh chấp đất đai' }, 'user-1');

    expect(res.suggestedType).toEqual(CaseType.KN);
    expect(mockPrismaService.aiAuditLog.create).toHaveBeenCalled();
    expect(mockPrismaService.aiCaseSuggestion.upsert).not.toHaveBeenCalled(); // No caseId provided
  });

  it('should submit feedback ACCEPTED with applyToCase=true without modifying status and updating isApplied=true', async () => {
    mockPrismaService.aiCaseSuggestion.findUnique.mockResolvedValue({
      caseId: 'case-1',
      suggestedType: CaseType.KN,
      suggestedField: CaseField.DAT_DAI,
      suggestedSummary: 'Tóm tắt gợi ý',
    });

    const res = await service.submitFeedback(
      {
        caseId: 'case-1',
        feedback: 'ACCEPTED' as any,
        applyToCase: true,
      },
      'user-1',
    );

    expect(res.success).toBe(true);
    expect(res.caseUpdated).toBe(true);
    expect(mockPrismaService.aiCaseSuggestion.update).toHaveBeenCalledWith({
      where: { caseId: 'case-1' },
      data: expect.objectContaining({ isApplied: true }),
    });
    expect(mockPrismaService.legalCase.update).toHaveBeenCalledWith({
      where: { id: 'case-1' },
      data: {
        type: CaseType.KN,
        field: CaseField.DAT_DAI,
        summary: 'Tóm tắt gợi ý',
      },
    });
    const updateArgs = mockPrismaService.legalCase.update.mock.calls[0][0];
    expect(updateArgs.data).not.toHaveProperty('status');
  });

  it('should not update legalCase when applyToCase=false', async () => {
    mockPrismaService.aiCaseSuggestion.findUnique.mockResolvedValue({
      caseId: 'case-1',
      suggestedType: CaseType.KN,
    });

    const res = await service.submitFeedback(
      {
        caseId: 'case-1',
        feedback: 'ACCEPTED' as any,
        applyToCase: false,
      },
      'user-1',
    );

    expect(res.success).toBe(true);
    expect(res.caseUpdated).toBe(false);
    expect(mockPrismaService.legalCase.update).not.toHaveBeenCalled();
    expect(mockPrismaService.aiCaseSuggestion.update).toHaveBeenCalledWith({
      where: { caseId: 'case-1' },
      data: expect.objectContaining({ isApplied: false }),
    });
  });

  it('should not update legalCase when REJECTED', async () => {
    mockPrismaService.aiCaseSuggestion.findUnique.mockResolvedValue({
      caseId: 'case-1',
      suggestedType: CaseType.KN,
    });

    const res = await service.submitFeedback(
      {
        caseId: 'case-1',
        feedback: 'REJECTED' as any,
        applyToCase: true,
      },
      'user-1',
    );

    expect(res.success).toBe(true);
    expect(res.caseUpdated).toBe(false);
    expect(mockPrismaService.legalCase.update).not.toHaveBeenCalled();
    expect(mockPrismaService.aiCaseSuggestion.update).toHaveBeenCalledWith({
      where: { caseId: 'case-1' },
      data: expect.objectContaining({ isApplied: false }),
    });
  });

  it('should create case checklist items when feedbackType is CHECKLIST and ACCEPTED', async () => {
    mockPrismaService.caseChecklistItem.findMany.mockResolvedValue([]);
    const res = await service.submitFeedback(
      {
        caseId: 'case-1',
        feedback: 'ACCEPTED' as any,
        feedbackType: 'CHECKLIST',
        checklistItems: ['[AI - Việc cần làm] Bước 1'],
      },
      'user-1',
    );

    expect(res.success).toBe(true);
    expect(res.caseUpdated).toBe(true);
    expect(mockPrismaService.caseChecklistItem.createMany).toHaveBeenCalledWith({
      data: [{ caseId: 'case-1', title: '[AI - Việc cần làm] Bước 1', isCompleted: false }],
    });
    expect(mockPrismaService.legalCase.update).not.toHaveBeenCalled();
  });

  it('should generate draft response and log audit', async () => {
    const mockDraftRes = {
      content: 'draft content',
      draftTitle: 'Phiếu xử lý đơn',
      draftContent: 'draft content',
      legalReferences: ['Luật 1'],
      modelName: 'gemini-test',
    };
    (mockAiProvider.draftResponse as jest.Mock).mockResolvedValue(mockDraftRes);

    const res = await service.draftResponse({ caseId: 'case-1', draftType: 'PHIEU_XU_LY' }, 'user-1');
    expect(res).toEqual(mockDraftRes);
    expect(mockPrismaService.aiAuditLog.create).toHaveBeenCalled();
  });

  it('should submit feedback DRAFT ACCEPTED and create CaseNote', async () => {
    const res = await service.submitFeedback(
      {
        caseId: 'case-1',
        feedback: 'ACCEPTED' as any,
        feedbackType: 'DRAFT',
        draftType: 'PHIEU_XU_LY',
        draftTitle: 'Phiếu xử lý đơn',
        draftContent: 'Nội dung bản nháp...',
      },
      'user-1',
    );

    expect(res.success).toBe(true);
    expect(res.caseUpdated).toBe(true);
    expect(mockPrismaService.caseNote.create).toHaveBeenCalledWith({
      data: {
        caseId: 'case-1',
        userId: 'user-1',
        content: '[AI Dự thảo - Phiếu xử lý đơn]\n\nNội dung bản nháp...',
      },
    });
    expect(mockPrismaService.legalCase.update).not.toHaveBeenCalled();
  });

  it('should submit feedback DRAFT ACCEPTED for THONG_BAO_THU_LY with correct prefix', async () => {
    const res = await service.submitFeedback(
      {
        caseId: 'case-1',
        feedback: 'ACCEPTED' as any,
        feedbackType: 'DRAFT',
        draftType: 'THONG_BAO_THU_LY',
        draftTitle: 'Thông báo thụ lý',
        draftContent: 'Nội dung thông báo thụ lý...',
      },
      'user-1',
    );

    expect(res.success).toBe(true);
    expect(res.caseUpdated).toBe(true);
    expect(mockPrismaService.caseNote.create).toHaveBeenCalledWith({
      data: {
        caseId: 'case-1',
        userId: 'user-1',
        content: '[AI Dự thảo - Thông báo thụ lý]\n\nNội dung thông báo thụ lý...',
      },
    });
    expect(mockPrismaService.legalCase.update).not.toHaveBeenCalled();
  });

  it('should submit feedback DRAFT ACCEPTED for VAN_BAN_CHUYEN_DON with correct prefix', async () => {
    const res = await service.submitFeedback(
      {
        caseId: 'case-1',
        feedback: 'ACCEPTED' as any,
        feedbackType: 'DRAFT',
        draftType: 'VAN_BAN_CHUYEN_DON',
        draftTitle: 'Văn bản chuyển đơn',
        draftContent: 'Nội dung chuyển đơn...',
      },
      'user-1',
    );

    expect(res.success).toBe(true);
    expect(res.caseUpdated).toBe(true);
    expect(mockPrismaService.caseNote.create).toHaveBeenCalledWith({
      data: {
        caseId: 'case-1',
        userId: 'user-1',
        content: '[AI Dự thảo - Văn bản chuyển đơn]\n\nNội dung chuyển đơn...',
      },
    });
    expect(mockPrismaService.legalCase.update).not.toHaveBeenCalled();
  });

  it('should submit feedback DRAFT REJECTED without creating CaseNote or updating status', async () => {
    mockPrismaService.caseNote.create.mockClear();
    mockPrismaService.legalCase.update.mockClear();

    const res = await service.submitFeedback(
      {
        caseId: 'case-1',
        feedback: 'REJECTED' as any,
        feedbackType: 'DRAFT',
        draftType: 'TRA_LOI_CONG_DAN_DU_THAO',
      },
      'user-1',
    );

    expect(res.success).toBe(true);
    expect(res.caseUpdated).toBe(false);
    expect(mockPrismaService.caseNote.create).not.toHaveBeenCalled();
    expect(mockPrismaService.legalCase.update).not.toHaveBeenCalled();
  });
});

