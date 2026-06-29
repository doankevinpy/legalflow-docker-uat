import { identifyTemplateGroup, buildDocxDocument } from './docx-templates.helper';
import { Packer } from 'docx';

describe('DocxTemplatesHelper', () => {
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

  it('should successfully build Word document buffers for all 6 draft types', async () => {
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
});
