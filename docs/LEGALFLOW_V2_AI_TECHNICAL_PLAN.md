# KẾ HOẠCH KỸ THUẬT CHI TIẾT: LEGALFLOW V2 – AI HỖ TRỢ XỬ LÝ ĐƠN THƯ CẤP XÃ

**Ngày lập:** 27/06/2026  
**Phiên bản:** 2.0.0-PLAN  
**Mục tiêu:** Nâng cấp LegalFlow từ hệ thống quản lý quy trình đơn thư thụ động (v1) thành Nền tảng Trợ lý Thông minh hỗ trợ cán bộ công chức cấp xã ra quyết định nhanh chóng, chính xác và đúng pháp luật (v2).

---

## TUÂN THỦ NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)

> [!CAUTION]
> **NGUYÊN TẮC CON NGƯỜI QUYẾT ĐỊNH (HUMAN-IN-THE-LOOP - HITL)**
> AI trong LegalFlow v2 **tuyệt đối chỉ đóng vai trò hỗ trợ, tư vấn và đề xuất (Advisory Assistant)**. AI **không có quyền tự động ra quyết định hành chính**, không tự động thay đổi trạng thái pháp lý của hồ sơ, và không tự động gửi văn bản cho công dân. Mọi đề xuất của AI (tóm tắt, phân loại, checklist, dự thảo văn bản) đều phải được duyệt, chỉnh sửa và xác nhận bởi cán bộ có thẩm quyền (`STAFF`, `MANAGER`, `ADMIN`).

> [!IMPORTANT]
> **NGUYÊN TẮC MINH BẠCH & TRUY VẾT (FULL AUDITABILITY)**
> Mọi thao tác tương tác với AI (prompt gửi đi, kết quả trả về, thời gian phản hồi, số lượng token tiêu thụ, cán bộ thực hiện, trạng thái chấp nhận/từ chối đề xuất AI) đều được ghi nhận vào nhật ký kiểm toán chuyên biệt (`AiAuditLog`) để đảm bảo tính minh bạch và giám sát trách nhiệm công vụ.

---

## 1. PHÂN TÍCH KIẾN TRÚC HIỆN TẠI (V1 ANALYSIS)

### 1.1. Hạ tầng & Công nghệ hiện hữu
- **Backend:** NestJS v10 (TypeScript) kiến trúc module hóa, sử dụng Prisma ORM.
- **Database:** PostgreSQL 15 chạy trên Docker container (`legalflow_postgres:5432`).
- **Object Storage:** MinIO S3 Docker container (`legalflow_minio:9000`) lưu trữ minh chứng, đơn thư scan.
- **Frontend:** React 18 + Vite + Tailwind CSS + TypeScript (Single Page Application).
- **Phân quyền (RBAC):** 4 vai trò rõ rệt: `ADMIN` (Quản trị), `MANAGER` (Lãnh đạo/Chủ tịch xã), `STAFF` (Cán bộ thụ lý), `VIEWER` (Tra cứu/Giám sát).

### 1.2. Mô hình dữ liệu hiện tại (`schema.prisma`)
- `LegalCase`: Thực thể trung tâm lưu trữ thông tin đơn thư (Mã hồ sơ, người gửi, phân loại `CaseType` [KN, TC, PA...], lĩnh vực `CaseField` [Đất đai, Dân sự...], khu phố `Neighborhood`, hạn xử lý `deadline`, trạng thái `CaseStatus`).
- `LandProfile`: Hồ sơ chuyên sâu về tranh chấp/thủ tục đất đai (loại đất, tình trạng quy hoạch, nghĩa vụ tài chính).
- `CaseNote`, `CaseHistory`, `CaseChecklistItem`: Các bảng theo dõi tiến độ và lịch sử thao tác.
- `AdminAuditLog`: Ghi nhận thao tác quản trị hệ thống (tạo/khóa user, đổi mật khẩu).

---

## 2. ĐỀ XUẤT MODULE AI MỚI TRONG BACKEND NESTJS (`AiModule`)

Để đảm bảo tính linh hoạt, dễ bảo trì và không làm ảnh hưởng đến logic nghiệp vụ v1, đề xuất xây dựng module độc lập **`AiModule`** tại thư mục `legalflow-backend/src/ai/`.

### 2.1. Cấu trúc Module & Thiết kế Kiến trúc

```
legalflow-backend/src/ai/
├── ai.module.ts                 # Module definition
├── ai.controller.ts             # REST API Endpoints cho Frontend gọi AI
├── ai.service.ts                # Orchestrator service xử lý nghiệp vụ AI
├── dto/
│   ├── summarize-petition.dto.ts # DTO cho request tóm tắt
│   ├── classify-petition.dto.ts  # DTO cho request phân loại
│   ├── suggest-checklist.dto.ts  # DTO gợi ý checklist
│   └── draft-response.dto.ts     # DTO soạn thảo văn bản
├── interfaces/
│   └── ai-provider.interface.ts  # Interface chuẩn hóa cho các Provider (Adapter Pattern)
├── providers/
│   ├── gemini.provider.ts        # Tích hợp Google Gemini API (Chính)
│   ├── openai.provider.ts        # Tích hợp OpenAI API (Dự phòng)
│   └── local-llM.provider.ts     # Tích hợp Ollama/vLLM (Cho môi trường On-Premise bảo mật cao)
├── prompts/
│   ├── prompt-builder.service.ts # Quản lý & Injection System Prompts theo Luật Việt Nam
│   └── templates.ts              # Các mẫu Prompt ngữ cảnh hành chính cấp xã
└── guards/
    └── ai-rate-limit.guard.ts    # Kiểm soát tần suất gọi AI tránh spam/chi phí cao
```

### 2.2. Danh sách Endpoints Đề xuất (`AiController`)
Tất cả endpoints đều được bảo vệ bởi `JwtAuthGuard` và `RolesGuard` (Chỉ dành cho `STAFF`, `MANAGER`, `ADMIN`).

| Method | Endpoint | Mô tả chức năng | Output trả về cho Frontend |
| :--- | :--- | :--- | :--- |
| `POST` | `/ai/summarize` | Tóm tắt nội dung đơn thư và trích xuất ý chính | Văn bản tóm tắt gọn (100-150 từ), danh sách nhân vật liên quan, các yêu cầu cốt lõi. |
| `POST` | `/ai/classify` | Phân loại đơn & Lĩnh vực xử lý | Gợi ý `CaseType` (KN/TC/PA), `CaseField`, chỉ số độ tin cậy (Confidence Score %), căn cứ pháp lý giải thích lý do gợi ý. |
| `POST` | `/ai/checklist` | Sinh gợi ý bước kiểm tra xác minh | Danh sách các bước kiểm tra hồ sơ thực tế (Ví dụ: Kiểm tra sổ đỏ, xác minh thực địa khu phố...). |
| `POST` | `/ai/draft` | Soạn thảo văn bản phản hồi/chuyển đơn | Bản dự thảo văn bản hành chính đúng thể thức quy định, dẫn chiếu các điều khoản luật áp dụng. |

### 2.3. Căn cứ Pháp lý Tích hợp vào System Prompt
Prompt Builder sẽ tự động lồng ghép ngữ cảnh pháp lý cấp xã vào lời gọi AI:
- **Luật Tiếp công dân 2013**, **Luật Khiếu nại 2011**, **Luật Tố cáo 2018**.
- **Luật Đất đai 2024** (thẩm quyền hòa giải tranh chấp đất đai cấp xã).
- Thông tư 05/2021/TT-TTCP quy định quy trình xử lý đơn khiếu nại, đơn tố cáo, đơn kiến nghị, phản ánh.

---

## 3. ĐỀ XUẤT THAY ĐỔI DATABASE CẦN THIẾT (PRISMA SCHEMA)

Bổ sung 2 Model mới vào `schema.prisma` và thiết lập quan hệ với `LegalCase`, `User`.

```prisma
// =======================================================
// MODULE AI SUPPORT & AUDIT LOGS (V2)
// =======================================================

enum AiActionType {
  SUMMARIZE
  CLASSIFY
  CHECKLIST
  DRAFT
}

enum AiLogStatus {
  SUCCESS
  ERROR
}

enum AiFeedbackStatus {
  PENDING   // Cán bộ chưa duyệt đề xuất
  ACCEPTED  // Cán bộ chấp nhận nguyên bản đề xuất AI
  REJECTED  // Cán bộ từ chối/bỏ qua đề xuất AI
  MODIFIED  // Cán bộ đã chỉnh sửa lại kết quả của AI trước khi dùng
}

model AiAuditLog {
  id               String           @id @default(uuid())
  caseId           String?
  case             LegalCase?       @relation(fields: [caseId], references: [id], onDelete: SetNull)
  userId           String
  user             User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  actionType       AiActionType     // Loại thao tác AI
  modelName        String           // Tên model (vd: gemini-1.5-pro, gemini-2.5-flash)
  promptTokens     Int?             // Số token đầu vào
  completionTokens Int?             // Số token đầu ra
  latencyMs        Int?             // Thời gian xử lý (ms)
  
  inputPayload     Json             // Dữ liệu/context gửi lên LLM (đã làm mờ thông tin nhạy cảm nếu cần)
  outputPayload    Json             // Kết quả thô LLM trả về
  
  status           AiLogStatus      // SUCCESS hoặc ERROR
  errorMessage     String?          // Chi tiết lỗi nếu call API thất bại
  
  userFeedback     AiFeedbackStatus @default(PENDING) // Đánh giá của cán bộ
  appliedAt        DateTime?        // Thời điểm cán bộ nhấn "Áp dụng"
  
  createdAt        DateTime         @default(now())

  @@index([caseId])
  @@index([userId])
  @@index([actionType])
  @@index([status])
  @@index([createdAt])
}

model AiCaseSuggestion {
  id               String     @id @default(uuid())
  caseId           String     @unique
  case             LegalCase  @relation(fields: [caseId], references: [id], onDelete: Cascade)
  
  suggestedSummary String?    // Tóm tắt do AI gợi ý
  suggestedType    CaseType?  // Loại đơn gợi ý (KN/TC/PA)
  suggestedField   CaseField? // Lĩnh vực gợi ý
  confidenceScore  Float?     // Độ tự tin (0.0 đến 1.0)
  legalRationale   String?    // Giải thích lý do phân loại dựa trên luật
  
  isApplied        Boolean    @default(false) // Đã được cán bộ áp dụng vào hồ sơ chính thức chưa
  lastGeneratedAt  DateTime   @default(now())
  updatedAt        DateTime   @updatedAt

  @@index([isApplied])
}
```

*Lưu ý thay đổi tại model `LegalCase` hiện có:*
```prisma
model LegalCase {
  // ... các field cũ giữ nguyên ...
  aiAuditLogs   AiAuditLog[]
  aiSuggestion  AiCaseSuggestion?
}
```

---

## 4. ĐỀ XUẤT GIAO DIỆN FRONTEND CẦN BỔ SUNG

### 4.1. Trang Tạo Hồ Sơ Mới (`NewCase.tsx`) & Chi Tiết Hồ Sơ (`CaseDetail.tsx`)
- **Tích hợp "Trợ lý AI Phân loại & Tóm tắt" (AI Co-pilot Panel):**
  - Thêm nút `✨ AI Phân tích Đơn` ngay dưới khung nhập nội dung đơn.
  - Khi nhấn, hiển thị Thẻ đề xuất AI (AI Suggestion Card) gồm:
    - **Tóm tắt nhanh:** Đoạn văn bản tóm tắt nội dung cốt lõi.
    - **Gợi ý phân loại:** Nhãn nhấp nháy hiển thị Loại đơn & Lĩnh vực gợi ý kèm theo Badge độ tin cậy (Ví dụ: *Khiếu nại - Đất đai | Độ tin cậy: 94%*).
    - **Căn cứ pháp lý:** Tooltip hoặc vùng text giải thích (Ví dụ: *“Đơn có nội dung phản đối Quyết định thu hồi đất số 123/QĐ-UBND, thuộc thẩm quyền giải quyết khiếu nại lần đầu của UBND cấp xã theo Điều 17 Luật Khiếu nại”*).
  - Hành động của cán bộ: Nút **[Chấp nhận áp dụng]** (tự động điền vào form chính) hoặc **[Bỏ qua]**.

### 4.2. Tab Checklist Xác minh trong Chi tiết Hồ sơ
- Bổ sung nút `✨ AI Tạo Checklist Xác Minh`.
- Dựa vào nội dung vụ việc cụ thể, AI gợi ý danh sách các việc cần làm (Ví dụ vụ tranh chấp ranh giới đất: *1. Kiểm tra trích lục bản đồ địa chính; 2. Mời hai hộ gia đình hòa giải lần 1; 3. Kiểm tra biên bản xác định ranh giới năm 1999*).
- Cán bộ có thể tích chọn các gợi ý phù hợp để thêm nhanh vào danh sách Checklist chính thức của hồ sơ.

### 4.3. Module Soạn thảo Văn bản (`Drafts.tsx`)
- Bổ sung tính năng `✨ Trợ lý Soạn thảo AI` (AI Draft Assistant).
- Cán bộ chọn Loại văn bản cần ra (Ví dụ: *Giấy biên nhận đơn*, *Thông báo chuyển đơn đến thẩm quyền*, *Giấy mời hòa giải đất đai*).
- AI tự động điền thông tin đương sự, tóm tắt sự việc và trích dẫn điều khoản luật vào khung soạn thảo Rich-Text Editor. Cán bộ rà soát, chỉnh sửa câu chữ và trình ký.

### 4.4. Trang Trang Nhật ký Kiểm toán AI (`/ai-audit-logs`) - Dành cho Admin/Manager
- Màn hình quản trị hiển thị bảng thống kê:
  - Lịch sử các lần gọi AI (Thời gian, Cán bộ thực hiện, Mã hồ sơ, Loại tính năng).
  - Chỉ số hiệu quả: Tỷ lệ chấp nhận đề xuất AI (Acceptance Rate), Tổng token tiêu thụ, Thời gian phản hồi trung bình.
  - Khung xem chi tiết Prompt và Response để kiểm tra tính chính xác của AI.

---

## 5. ROADMAP TRIỂN KHAI THEO TỪNG PHASE

Để đảm bảo an toàn tuyệt đối cho hệ thống đang vận hành, kế hoạch triển khai được chia thành 4 giai đoạn tuần tự:

### Phase 1: Nền tảng Kiến trúc & Database (Tuần 1 - 2)
- [ ] Thiết kế và chạy migration Prisma cho bảng `AiAuditLog` và `AiCaseSuggestion`.
- [ ] Khởi tạo `AiModule`, `AiController`, `AiService` trong backend NestJS.
- [ ] Xây dựng Adapter `GeminiProvider` kết nối an toàn với LLM API.
- [ ] Viết middleware ghi nhận Log kiểm toán tự động cho mọi request AI.

### Phase 2: Tính năng Trợ lý Phân loại & Tóm tắt (Tuần 3 - 4)
- [ ] Hoàn thiện endpoint `/ai/summarize` và `/ai/classify` cùng bộ Prompt chuẩn pháp lý.
- [ ] Nâng cấp giao diện `NewCase.tsx` và `CaseDetail.tsx` tích hợp Widget AI Co-pilot.
- [ ] Kiểm thử độ chính xác phân loại trên tập dữ liệu mẫu 50 đơn thư thực tế cấp xã.

### Phase 3: Trợ lý Soạn thảo & Gợi ý Quy trình (Tuần 5 - 6)
- [ ] Hoàn thiện endpoint `/ai/checklist` và `/ai/draft`.
- [ ] Tích hợp tính năng AI tạo Checklist vào tab Nhiệm vụ của hồ sơ.
- [ ] Tích hợp AI Draft Assistant vào module Soạn thảo văn bản (`Drafts.tsx`).

### Phase 4: Quản trị, Bảo mật & Tối ưu hóa (Tuần 7 - 8)
- [ ] Xây dựng màn hình Dashboard kiểm toán AI (`/ai-audit-logs`) cho Lãnh đạo.
- [ ] Tối ưu hóa Rate Limiting, xử lý lỗi Timeout/Fallback khi mạng chậm.
- [ ] Đánh giá bảo mật toàn diện (Data Privacy, ẩn danh hóa thông tin cá nhân trước khi gửi LLM).
- [ ] Nghiệm thu UAT và ban hành Hướng dẫn sử dụng cho cán bộ xã.

---

## BƯỚC TIẾP THEO

Kế hoạch kỹ thuật chi tiết này đã được chuẩn bị xong. Sau khi người dùng phản hồi và **Phê duyệt Kế hoạch (Approve Plan)**, chúng tôi sẽ tiến hành triển khai bước đầu tiên: **Cập nhật Schema Prisma và Khởi tạo AiModule trong Backend**.
