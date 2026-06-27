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
    },
    aiCaseSuggestion: {
      upsert: jest.fn().mockResolvedValue({ id: 'sug-1' }),
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
});
