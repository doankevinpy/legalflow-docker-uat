import { Injectable, Logger } from '@nestjs/common';
import { CaseType, CaseField } from '@prisma/client';
import {
  IAiProvider,
  AiCompletionResponse,
  AiClassificationResponse,
  AiChecklistResponse,
  AiDraftResponse,
} from '../interfaces/ai-provider.interface';

@Injectable()
export class GeminiProvider implements IAiProvider {
  private readonly logger = new Logger(GeminiProvider.name);
  private readonly apiKey: string;
  private readonly model: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.model = process.env.GEMINI_MODEL || 'gemini-1.5-pro';
  }

  private isMockMode(): boolean {
    return (
      !this.apiKey ||
      this.apiKey === 'mock_gemini_key_for_local_dev' ||
      this.apiKey === 'your_google_gemini_api_key_here'
    );
  }

  async generateText(systemPrompt: string, userPrompt: string): Promise<AiCompletionResponse> {
    const startTime = Date.now();

    if (this.isMockMode()) {
      this.logger.log('Gemini API key not configured or set to mock. Returning simulated completion.');
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate latency
      return {
        content: `[MOCK AI RESPONSE] Phản hồi mô phỏng dựa trên nội dung: "${userPrompt.slice(0, 50)}..."`,
        promptTokens: 120,
        completionTokens: 45,
        latencyMs: Date.now() - startTime,
        modelName: `${this.model}-mock`,
      };
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const promptTokens = data?.usageMetadata?.promptTokenCount || 0;
      const completionTokens = data?.usageMetadata?.candidatesTokenCount || 0;

      return {
        content,
        promptTokens,
        completionTokens,
        latencyMs: Date.now() - startTime,
        modelName: this.model,
      };
    } catch (error: any) {
      this.logger.error(`Failed to call Gemini API: ${error.message}`, error.stack);
      throw error;
    }
  }

  async summarize(text: string): Promise<AiCompletionResponse> {
    const startTime = Date.now();
    if (this.isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        content: `[MOCK TÓM TẮT] Đơn thư phản ánh vấn đề liên quan đến quy trình giải quyết thủ tục hành chính. Công dân yêu cầu cơ quan có thẩm quyền cấp xã kiểm tra rà soát và trả lời bằng văn bản theo đúng thời hạn quy định của Luật Tiếp công dân.`,
        promptTokens: 150,
        completionTokens: 55,
        latencyMs: Date.now() - startTime,
        modelName: `${this.model}-mock`,
      };
    }

    const systemPrompt = `Bạn là chuyên gia pháp lý hành chính cấp xã. Hãy tóm tắt nội dung đơn thư một cách ngắn gọn, súc tích (dưới 150 từ), nêu rõ đối tượng, sự việc chính và yêu cầu cốt lõi.`;
    return this.generateText(systemPrompt, text);
  }

  async classify(text: string): Promise<AiClassificationResponse> {
    const startTime = Date.now();
    if (this.isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        content: 'Mock classification generated',
        suggestedType: CaseType.KN,
        suggestedField: CaseField.DAT_DAI,
        confidenceScore: 0.92,
        legalRationale: `Căn cứ theo Điều 17 Luật Khiếu nại 2011 và thẩm quyền giải quyết tranh chấp đất đai lần đầu tại UBND cấp xã quy định tại Luật Đất đai 2024.`,
        promptTokens: 200,
        completionTokens: 80,
        latencyMs: Date.now() - startTime,
        modelName: `${this.model}-mock`,
      };
    }

    const systemPrompt = `Bạn là AI hỗ trợ phân loại đơn thư cấp xã theo pháp luật Việt Nam. 
Hãy phân tích nội dung và trả về JSON hợp lệ với định dạng:
{
  "suggestedType": "KN" | "TC" | "PA" | "KNG" | "TVPL" | "KHAC",
  "suggestedField": "DAT_DAI" | "DAN_SU" | "LAO_DONG" | "HON_NHAN_GIA_DINH" | "DOANH_NGHIEP" | "HANH_CHINH" | "KHAC",
  "confidenceScore": số từ 0.0 đến 1.0,
  "legalRationale": "Giải thích lý do ngắn gọn dựa trên điều luật"
}`;

    const rawResponse = await this.generateText(systemPrompt, text);
    try {
      const jsonStr = rawResponse.content.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      return {
        ...rawResponse,
        suggestedType: parsed.suggestedType || CaseType.PA,
        suggestedField: parsed.suggestedField || CaseField.KHAC,
        confidenceScore: parsed.confidenceScore || 0.8,
        legalRationale: parsed.legalRationale || 'Phân loại tự động dựa trên từ khóa chính trong đơn.',
      };
    } catch {
      // Fallback if parsing fails
      return {
        ...rawResponse,
        suggestedType: CaseType.PA,
        suggestedField: CaseField.KHAC,
        confidenceScore: 0.7,
        legalRationale: 'Hệ thống gợi ý phân loại phản ánh kiến nghị do không parse được định dạng JSON chuẩn.',
      };
    }
  }

  async suggestChecklist(text: string): Promise<AiChecklistResponse> {
    const startTime = Date.now();
    const mockGroups = {
      tasks: [
        '[AI - Việc cần làm] Thẩm tra hiện trạng ranh giới khu đất tranh chấp tại thực địa',
        '[AI - Việc cần làm] Lập biên bản làm việc ban đầu với người có đơn khiếu nại',
      ],
      documents: [
        '[AI - Tài liệu] Kiểm tra Giấy chứng nhận quyền sử dụng đất và trích lục bản đồ địa chính cũ',
        '[AI - Tài liệu] Sổ mục kê và sổ địa chính lưu trữ tại UBND xã',
      ],
      coordination: [
        '[AI - Phối hợp] Cán bộ Địa chính - Xây dựng xã',
        '[AI - Phối hợp] Trưởng thôn/khu phố và Tổ hòa giải cơ sở',
      ],
      deadlines: [
        '[AI - Thời hạn] Tổ chức hòa giải tranh chấp đất đai tại UBND xã không quá 45 ngày kể từ ngày nhận đơn',
      ],
      risks: [
        '[AI - Rủi ro] Nguy cơ phát sinh mâu thuẫn gay gắt, khiếu nại vượt cấp nếu chậm trễ giải quyết',
        '[AI - Rủi ro] Các bên tự ý xây dựng, thay đổi hiện trạng đất trong quá trình thụ lý',
      ],
      nextSteps: [
        '[AI - Bước tiếp theo] Phát hành giấy mời các bên liên quan lên UBND xã tiến hành làm việc và kiểm tra thực địa',
      ],
    };
    const allMockItems = Object.values(mockGroups).flat();

    if (this.isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 450));
      return {
        content: 'Mock checklist generated',
        items: allMockItems,
        checklistGroups: mockGroups,
        promptTokens: 180,
        completionTokens: 70,
        latencyMs: Date.now() - startTime,
        modelName: `${this.model}-mock`,
      };
    }

    const systemPrompt = `Bạn là trợ lý thụ lý hồ sơ cấp xã. Hãy đưa ra gợi ý quy trình xử lý đơn thư dưới dạng JSON gồm 6 nhóm mảng chuỗi (chuỗi không cần chứa tiền tố): "tasks" (Việc cần làm), "documents" (Tài liệu cần kiểm tra), "coordination" (Bộ phận/cán bộ phối hợp), "deadlines" (Thời hạn lưu ý), "risks" (Rủi ro nghiệp vụ/pháp lý), "nextSteps" (Đề xuất bước tiếp theo). Trả về format JSON: { "tasks": ["..."], "documents": ["..."], "coordination": ["..."], "deadlines": ["..."], "risks": ["..."], "nextSteps": ["..."] }`;
    const rawResponse = await this.generateText(systemPrompt, text);
    try {
      const jsonStr = rawResponse.content.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(jsonStr);

      const ensurePrefix = (arr: any[], prefix: string) =>
        Array.isArray(arr)
          ? arr.map(i => {
              const str = String(i).trim();
              return str.startsWith(prefix) ? str : `${prefix} ${str}`;
            })
          : [];

      const checklistGroups = {
        tasks: ensurePrefix(parsed.tasks, '[AI - Việc cần làm]'),
        documents: ensurePrefix(parsed.documents, '[AI - Tài liệu]'),
        coordination: ensurePrefix(parsed.coordination, '[AI - Phối hợp]'),
        deadlines: ensurePrefix(parsed.deadlines, '[AI - Thời hạn]'),
        risks: ensurePrefix(parsed.risks, '[AI - Rủi ro]'),
        nextSteps: ensurePrefix(parsed.nextSteps, '[AI - Bước tiếp theo]'),
      };
      const items = Object.values(checklistGroups).flat();

      return {
        ...rawResponse,
        items: items.length > 0 ? items : allMockItems,
        checklistGroups: items.length > 0 ? checklistGroups : mockGroups,
      };
    } catch {
      return {
        ...rawResponse,
        items: allMockItems,
        checklistGroups: mockGroups,
      };
    }
  }

  async draftResponse(petitionContext: Record<string, any>, draftType: string): Promise<AiDraftResponse> {
    const startTime = Date.now();
    const warningLabel = "--- BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA. CÁN BỘ PHẢI KIỂM TRA, CHỈNH SỬA VÀ CHỊU TRÁCH NHIỆM TRƯỚC KHI SỬ DỤNG. ---\n\n";
    const customNote = petitionContext.customInstructions ? `\n\n[Ghi chú / Hướng dẫn thêm: ${petitionContext.customInstructions}]` : '';

    const getDraftTitle = (type: string) => {
      switch (type) {
        case 'PHIEU_XU_LY': return 'Phiếu xử lý đơn';
        case 'GIAY_MOI_LAM_VIEC': return 'Giấy mời làm việc/đối thoại';
        case 'THONG_BAO_THU_LY': return 'Thông báo thụ lý';
        case 'THONG_BAO_KHONG_THU_LY': return 'Thông báo không thụ lý';
        case 'VAN_BAN_CHUYEN_DON': return 'Văn bản chuyển đơn';
        case 'TRA_LOI_CONG_DAN_DU_THAO': return 'Trả lời công dân';
        default: return `Dự thảo: ${type}`;
      }
    };

    if (this.isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      let draftTitle = getDraftTitle(draftType);
      let draftContent = `${warningLabel}Nội dung bản nháp cho ${draftType}...`;
      let legalReferences = ['Luật Tiếp công dân 2013', 'Luật Đất đai 2024'];

      if (draftType === 'PHIEU_XU_LY') {
        draftContent = `${warningLabel}CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nPHIẾU ĐỀ XUẤT XỬ LÝ ĐƠN\n\n1. Thông tin tiếp nhận:\n- Mã hồ sơ: ${petitionContext.caseCode || 'N/A'}\n- Người nộp đơn: ${petitionContext.senderName || 'Công dân'}\n- Tóm tắt nội dung: ${petitionContext.summary || 'Đơn khiếu nại / kiến nghị phản ánh'}\n\n2. Đề xuất thụ lý và phân công:\n- Đơn thuộc thẩm quyền giải quyết của UBND cấp xã.\n- Đề xuất thụ lý giải quyết và giao công chức Địa chính - Tư pháp tiến hành thẩm tra thực tế hiện trạng.${customNote}\n\n3. Ý kiến phê duyệt của Lãnh đạo:\n....................................................................................`;
        legalReferences = ['Luật Khiếu nại 2011', 'Luật Đất đai 2024', 'Nghị định 124/2020/NĐ-CP'];
      } else if (draftType === 'GIAY_MOI_LAM_VIEC') {
        draftContent = `${warningLabel}CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nGIẤY MỜI LÀM VIỆC\n\nKính gửi: Ông/Bà ${petitionContext.senderName || 'Người có quyền lợi, nghĩa vụ liên quan'}\n\nUBND phường/xã trân trọng kính mời Ông/Bà đến làm việc để đối thoại và làm rõ nội dung đơn thư kiến nghị/tranh chấp:\n\n1. Thời gian làm việc: 08 giờ 30 phút, ngày ... tháng ... năm 2026\n2. Địa điểm: Phòng Tiếp công dân / Hội trường UBND phường/xã\n3. Thành phần tham dự: Lãnh đạo UBND xã, Công chức Địa chính, Trưởng thôn và các bên liên quan.\n4. Nội dung: Làm rõ ranh giới đất đai và hòa giải tranh chấp.${customNote}\n\nĐề nghị Ông/Bà mang theo CMND/CCCD và các giấy tờ, hồ sơ đất đai bản gốc để đối chiếu.`;
        legalReferences = ['Luật Đất đai 2024', 'Luật Hòa giải ở cơ sở 2013'];
      } else if (draftType === 'THONG_BAO_THU_LY') {
        draftContent = `${warningLabel}CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nTHÔNG BÁO\nVề việc thụ lý giải quyết đơn thư\n\nKính gửi: Ông/Bà ${petitionContext.senderName || 'Công dân'}\n\nUBND phường/xã thông báo đã tiếp nhận đơn thư với mã hồ sơ ${petitionContext.caseCode || 'N/A'}, nội dung: ${petitionContext.summary || 'Kiến nghị phản ánh'}.\n\nSau khi xem xét nội dung đơn, UBND phường/xã thông báo vụ việc đã đủ điều kiện thụ lý giải quyết theo quy định.\n\n[Cán bộ bổ sung số thông báo, ngày tháng ban hành]\n[Cán bộ bổ sung thời hạn giải quyết theo luật định]\n[Cán bộ bổ sung bộ phận/công chức được giao xác minh]${customNote}\n\nTrân trọng thông báo đến Ông/Bà được biết.`;
        legalReferences = ['Luật Khiếu nại 2011', 'Luật Tố cáo 2018', 'Luật Tiếp công dân 2013'];
      } else if (draftType === 'THONG_BAO_KHONG_THU_LY') {
        draftContent = `${warningLabel}CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nTHÔNG BÁO\nVề việc không thụ lý giải quyết đơn thư\n\nKính gửi: Ông/Bà ${petitionContext.senderName || 'Công dân'}\n\nUBND phường/xã đã tiếp nhận đơn thư mã số ${petitionContext.caseCode || 'N/A'}, nội dung: ${petitionContext.summary || 'Kiến nghị phản ánh'}.\n\nQua kiểm tra và thẩm định, UBND phường/xã thông báo không thụ lý giải quyết đơn thư nêu trên.\n\n[Cán bộ bổ sung số thông báo, ngày tháng ban hành]\n[Cán bộ bổ sung lý do chi tiết từ chối thụ lý (ví dụ: hết thời hiệu, không đủ điều kiện...)]\n[Cán bộ bổ sung căn cứ pháp lý cụ thể]${customNote}\n\nTrân trọng thông báo đến Ông/Bà được biết.`;
        legalReferences = ['Luật Khiếu nại 2011', 'Luật Tố cáo 2018'];
      } else if (draftType === 'VAN_BAN_CHUYEN_DON') {
        draftContent = `${warningLabel}CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nCONG VĂN\nVề việc chuyển đơn thư của công dân\n\nKính gửi: [Cán bộ bổ sung tên cơ quan có thẩm quyền giải quyết]\nĐồng kính gửi: Ông/Bà ${petitionContext.senderName || 'Công dân'} (để biết)\n\nUBND phường/xã tiếp nhận đơn của Ông/Bà ${petitionContext.senderName || 'Công dân'}, mã hồ sơ ${petitionContext.caseCode || 'N/A'}, trình bày về việc: ${petitionContext.summary || 'Kiến nghị phản ánh'}.\n\nCăn cứ quy định pháp luật, nội dung đơn thư không thuộc thẩm quyền giải quyết của UBND phường/xã. UBND phường/xã chuyển đơn thư nêu trên đến Quý cơ quan để xem xét, giải quyết theo thẩm quyền.\n\n[Cán bộ bổ sung số công văn, ngày tháng ban hành]\n[Cán bộ bổ sung căn cứ pháp lý về thẩm quyền]\n[Cán bộ bổ sung đề nghị thông báo kết quả giải quyết]${customNote}`;
        legalReferences = ['Luật Tiếp công dân 2013', 'Thông tư 05/2021/TT-TTCP'];
      } else if (draftType === 'TRA_LOI_CONG_DAN_DU_THAO') {
        draftContent = `${warningLabel}CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nCONG VĂN\nVề việc trả lời đơn kiến nghị, phản ánh của công dân\n\nKính gửi: Ông/Bà ${petitionContext.senderName || 'Công dân'}\n\nUBND phường/xã đã tiếp nhận và nghiên cứu nội dung đơn thư mã số ${petitionContext.caseCode || 'N/A'}, nội dung: ${petitionContext.summary || 'Kiến nghị phản ánh'}.\n\nSau khi kiểm tra xác minh thực tế, UBND phường/xã xin trả lời và giải thích như sau:\n\n[Cán bộ bổ sung số công văn, ngày tháng ban hành]\n[Cán bộ bổ sung kết quả xác minh thực tế tại địa phương]\n[Cán bộ bổ sung căn cứ pháp lý và hướng dẫn giải quyết]${customNote}\n\nUBND phường/xã trả lời để Ông/Bà được biết và thực hiện.`;
        legalReferences = ['Luật Tiếp công dân 2013', 'Luật Đất đai 2024'];
      }

      return {
        content: draftContent,
        draftTitle,
        draftContent,
        legalReferences,
        promptTokens: 250,
        completionTokens: 150,
        latencyMs: Date.now() - startTime,
        modelName: `${this.model}-mock`,
      };
    }

    const systemPrompt = `Bạn là Trợ lý soạn thảo văn bản hành chính UBND cấp xã. Hãy soạn thảo dự thảo văn bản "${draftType}" (${getDraftTitle(draftType)}) dựa trên thông tin hồ sơ. Bắt buộc tuân thủ nguyên tắc an toàn AI: sử dụng ngôn ngữ tư vấn, gợi ý, không dùng từ ngữ khẳng định tuyệt đối hoặc kết luận thay thế thẩm quyền của cán bộ/cơ quan nhà nước. Bắt buộc thêm dòng chữ nhãn cảnh báo ở đầu: "${warningLabel.trim()}". Nếu thông tin hồ sơ chưa đủ để kết luận thẩm quyền hoặc căn cứ pháp lý cụ thể, bắt buộc ghi các vùng giữ chỗ rõ ràng dưới dạng "[Cán bộ bổ sung...]". Trả về JSON format: { "draftTitle": "...", "draftContent": "...", "legalReferences": ["Luật..."] }`;
    const rawResponse = await this.generateText(systemPrompt, JSON.stringify(petitionContext));
    try {
      const jsonStr = rawResponse.content.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      return {
        ...rawResponse,
        draftTitle: parsed.draftTitle || getDraftTitle(draftType),
        draftContent: parsed.draftContent || `${warningLabel}${rawResponse.content}`,
        legalReferences: Array.isArray(parsed.legalReferences) ? parsed.legalReferences : [],
      };
    } catch {
      return {
        ...rawResponse,
        draftTitle: getDraftTitle(draftType),
        draftContent: `${warningLabel}${rawResponse.content}`,
        legalReferences: ['Luật Tiếp công dân 2013'],
      };
    }
  }
}
