import { Test, TestingModule } from '@nestjs/testing';
import { PromptBuilderService } from './prompt-builder.service';

describe('PromptBuilderService', () => {
  let service: PromptBuilderService;

  beforeEach(async () => {
    process.env.AI_ANONYMIZE_DATA = 'true';
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromptBuilderService],
    }).compile();

    service = module.get<PromptBuilderService>(PromptBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should anonymize sensitive information in string inputs', () => {
    const rawText = 'Công dân Nguyễn Văn A có SĐT 0912345678, CCCD 001099123456, email test@domain.com khiếu nại.';
    const prepared = service.prepareInput(rawText);

    expect(prepared).toContain('[SĐT_ĐÃ_ẨN]');
    expect(prepared).toContain('[CCCD_ĐÃ_ẨN]');
    expect(prepared).toContain('[EMAIL_ĐÃ_ẨN]');
    expect(prepared).not.toContain('0912345678');
    expect(prepared).not.toContain('001099123456');
    expect(prepared).not.toContain('test@domain.com');
  });

  it('should anonymize object payloads', () => {
    const rawPayload = {
      senderName: 'Nguyễn Văn A',
      phone: '0987654321',
      details: {
        email: 'user@example.vn',
      },
    };
    const prepared = service.prepareInput(rawPayload);

    expect(prepared).toContain('[SĐT_ĐÃ_ẨN]');
    expect(prepared).toContain('[EMAIL_ĐÃ_ẨN]');
    expect(prepared).not.toContain('0987654321');
  });

  it('should generate valid system prompts', () => {
    const sumPrompt = service.buildSummarizePrompt();
    expect(sumPrompt).toContain('UBND cấp xã');

    const classifyPrompt = service.buildClassifyPrompt();
    expect(classifyPrompt).toContain('suggestedType');
  });
});
