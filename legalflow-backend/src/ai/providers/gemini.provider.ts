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
    if (this.isMockMode()) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      return {
        content: 'Mock draft generated',
        draftTitle: `DỰ THẢO: ${draftType.toUpperCase()}`,
        draftContent: `Kính gửi: Ông/Bà ${petitionContext.senderName || 'Công dân'}\n\nUBND phường/xã đã tiếp nhận đơn của Ông/Bà về việc: ${petitionContext.summary || 'thủ tục hành chính'}.\nCăn cứ quy định hiện hành, UBND xin thông báo đã tiếp nhận và đang tiến hành xử lý hồ sơ theo đúng trình tự pháp luật.\n\nTrân trọng.`,
        legalReferences: ['Luật Tiếp công dân 2013', 'Nghị định 64/2014/NĐ-CP'],
        promptTokens: 250,
        completionTokens: 110,
        latencyMs: Date.now() - startTime,
        modelName: `${this.model}-mock`,
      };
    }

    const systemPrompt = `Bạn là Trợ lý soạn thảo văn bản hành chính UBND cấp xã. Hãy soạn thảo dự thảo văn bản "${draftType}" dựa trên thông tin hồ sơ. Trả về JSON format: { "draftTitle": "...", "draftContent": "...", "legalReferences": ["Luật..."] }`;
    const rawResponse = await this.generateText(systemPrompt, JSON.stringify(petitionContext));
    try {
      const jsonStr = rawResponse.content.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      return {
        ...rawResponse,
        draftTitle: parsed.draftTitle || `Văn bản phản hồi hồ sơ`,
        draftContent: parsed.draftContent || rawResponse.content,
        legalReferences: Array.isArray(parsed.legalReferences) ? parsed.legalReferences : [],
      };
    } catch {
      return {
        ...rawResponse,
        draftTitle: `Dự thảo văn bản phản hồi`,
        draftContent: rawResponse.content,
        legalReferences: ['Luật Tiếp công dân 2013'],
      };
    }
  }
}
