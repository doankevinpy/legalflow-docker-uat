import { Injectable } from '@nestjs/common';
import { anonymizeText, anonymizePayload } from '../utils/anonymizer.util';

@Injectable()
export class PromptBuilderService {
  private readonly shouldAnonymize: boolean;

  constructor() {
    this.shouldAnonymize = process.env.AI_ANONYMIZE_DATA !== 'false'; // Default true
  }

  prepareInput(input: string | Record<string, any>): string {
    if (typeof input === 'string') {
      return this.shouldAnonymize ? anonymizeText(input) : input;
    }
    const processed = this.shouldAnonymize ? anonymizePayload(input) : input;
    return JSON.stringify(processed, null, 2);
  }

  buildSummarizePrompt(): string {
    return `Bạn là chuyên gia pháp lý hành chính đang công tác tại UBND cấp xã/phường.
Nhiệm vụ của bạn là đọc đơn phản ánh/khiếu nại/tố cáo của công dân và tóm tắt lại các ý chính.
Quy tắc:
1. Tóm tắt súc tích trong khoảng 100 - 150 từ.
2. Nêu rõ: Đương sự/Người phản ánh, Nội dung vụ việc cốt lõi, Yêu cầu cụ thể đối với cơ quan nhà nước.
3. Giữ thái độ khách quan, chuẩn mực hành chính công.`;
  }

  buildClassifyPrompt(): string {
    return `Bạn là hệ thống AI phân loại đơn thư công dân theo pháp luật hành chính Việt Nam (Luật Tiếp công dân 2013, Luật Khiếu nại 2011, Luật Tố cáo 2018, Luật Đất đai 2024).
Phân loại đơn thư thành định dạng JSON với các trường:
- suggestedType: "KN" (Khiếu nại), "TC" (Tố cáo), "PA" (Phản ánh), "KNG" (Kiến nghị), "TVPL" (Tư vấn pháp lý), hoặc "KHAC".
- suggestedField: "DAT_DAI" (Đất đai), "DAN_SU" (Dân sự), "LAO_DONG" (Lao động), "HON_NHAN_GIA_DINH" (Hôn nhân gia đình), "DOANH_NGHIEP" (Doanh nghiệp), "HANH_CHINH" (Hành chính), hoặc "KHAC".
- confidenceScore: số thập phân từ 0.0 đến 1.0 đánh giá mức độ tự tin.
- legalRationale: Trích dẫn hoặc giải thích ngắn gọn lý do phân loại (dưới 50 từ).`;
  }

  buildChecklistPrompt(): string {
    return `Bạn là chuyên viên thụ lý hồ sơ hành chính UBND cấp xã. Dựa vào nội dung vụ việc được cung cấp, hãy đề xuất danh sách các bước xác minh thực tế, kiểm tra hồ sơ và quy trình thủ tục cần làm để giải quyết vụ việc theo quy định pháp luật. Trả về format JSON: { "items": ["Bước 1...", "Bước 2..."] }`;
  }

  buildDraftPrompt(draftType: string): string {
    return `Bạn là chuyên viên soạn thảo văn bản hành chính UBND cấp xã. Hãy soạn thảo văn bản phản hồi công dân thuộc thể loại: "${draftType}".
Văn bản cần tuân thủ thể thức hành chính chuẩn (Nghị định 30/2020/NĐ-CP về công tác văn thư). Trả về JSON format: { "draftTitle": "...", "draftContent": "...", "legalReferences": ["Luật..."] }`;
  }
}
