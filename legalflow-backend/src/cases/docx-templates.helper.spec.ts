import { identifyTemplateGroup, buildDocxDocument } from './docx-templates.helper';
import { getAgencyConfig, AgencyConfig } from '../config/agency.config';
import { Packer } from 'docx';

describe('DocxTemplatesHelper & AgencyConfig', () => {
  it('should identify INTERNAL_NOTE for Phiếu xử lý đơn', () => {
    const content = '[AI Dự thảo - Phiếu xử lý đơn]\n\nNội dung phiếu xử lý...';
    const res = identifyTemplateGroup(content);
    expect(res.templateGroup).toBe('INTERNAL_NOTE');
    expect(res.draftTitle).toBe('PHIẾU XỬ LÝ ĐƠN');
  });

  it('should identify NAMED_DOC for Giấy mời làm việc, Thông báo thụ lý, Thông báo không thụ lý', () => {
    const drafts = [
      '[AI Dự thảo - Giấy mời làm việc]\n\nKính gửi...',
      '[AI Dự thảo - Thông báo thụ lý]\n\nThông báo...',
      '[AI Dự thảo - Thông báo không thụ lý]\n\nThông báo...',
    ];
    for (const d of drafts) {
      const res = identifyTemplateGroup(d);
      expect(res.templateGroup).toBe('NAMED_DOC');
    }
  });

  it('should identify OFFICIAL_LETTER for Văn bản chuyển đơn, Trả lời công dân', () => {
    const drafts = [
      '[AI Dự thảo - Văn bản chuyển đơn]\n\nKính gửi...',
      '[AI Dự thảo - Trả lời công dân dự thảo]\n\nKính gửi...',
    ];
    for (const d of drafts) {
      const res = identifyTemplateGroup(d);
      expect(res.templateGroup).toBe('OFFICIAL_LETTER');
    }
  });

  it('should successfully build Word document buffers for all 6 draft types with default fallback', async () => {
    const testCases = [
      '[AI Dự thảo - Phiếu xử lý đơn]\n\n1. Thông tin tiếp nhận\n[Cán bộ bổ sung ý kiến]',
      '[AI Dự thảo - Giấy mời làm việc]\n\nKính gửi Ông A\n[Cán bộ bổ sung địa điểm]',
      '[AI Dự thảo - Thông báo thụ lý]\n\nĐã tiếp nhận đơn [Cán bộ bổ sung số ngày]',
      '[AI Dự thảo - Thông báo không thụ lý]\n\nTừ chối thụ lý vì hết thời hiệu',
      '[AI Dự thảo - Văn bản chuyển đơn]\n\nChuyển đơn đến UBND huyện',
      '[AI Dự thảo - Trả lời công dân dự thảo]\n\nTrả lời nội dung khiếu nại',
    ];

    for (const content of testCases) {
      const { templateGroup, draftTitle, draftBody } = identifyTemplateGroup(content);
      const doc = buildDocxDocument(templateGroup, draftTitle, draftBody);
      const buffer = await Packer.toBuffer(doc);
      expect(buffer).toBeDefined();
      expect(buffer.length).toBeGreaterThan(0);
    }
  });

  it('should apply agency configuration when provided', async () => {
    const mockConfig: AgencyConfig = {
      parentName: 'UBND HUYỆN TEST',
      name: 'UBND XÃ TEST',
      location: 'Xã Test',
      signerTitle: 'TM. ỦY BAN NHÂN DÂN\nCHỦ TỊCH',
      signerName: 'Nguyễn Văn Test',
      defaultRecipients: ['- Như trên;', '- Lưu: VT.'],
      docSymbolPrefix: '/UBND-T',
      isConfigured: true,
      missingFields: [],
    };

    const content = '[AI Dự thảo - Giấy mời làm việc]\n\nNội dung mời...';
    const { templateGroup, draftTitle, draftBody } = identifyTemplateGroup(content);
    const doc = buildDocxDocument(templateGroup, draftTitle, draftBody, mockConfig);
    const buffer = await Packer.toBuffer(doc);
    expect(buffer).toBeDefined();
    expect(buffer.length).toBeGreaterThan(0);
  });

  it('should fallback to placeholders when configuration is missing or empty', async () => {
    const emptyConfig: AgencyConfig = {
      parentName: undefined,
      name: '',
      location: undefined,
      signerTitle: '',
      signerName: '',
      defaultRecipients: undefined,
      docSymbolPrefix: '',
      isConfigured: false,
      missingFields: [
        'AGENCY_PARENT_NAME',
        'AGENCY_NAME',
        'AGENCY_LOCATION',
        'AGENCY_SIGNER_TITLE',
        'AGENCY_SIGNER_NAME',
        'AGENCY_DEFAULT_RECIPIENTS',
        'AGENCY_DOCUMENT_SYMBOL_PREFIX',
      ],
    };

    const content = '[AI Dự thảo - Văn bản chuyển đơn]\n\nNội dung chuyển...';
    const { templateGroup, draftTitle, draftBody } = identifyTemplateGroup(content);
    const doc = buildDocxDocument(templateGroup, draftTitle, draftBody, emptyConfig);
    const buffer = await Packer.toBuffer(doc);
    expect(buffer).toBeDefined();
    expect(buffer.length).toBeGreaterThan(0);
  });
});
