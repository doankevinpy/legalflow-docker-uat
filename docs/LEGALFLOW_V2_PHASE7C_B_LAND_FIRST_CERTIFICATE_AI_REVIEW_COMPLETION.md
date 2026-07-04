# Phase 7C-B Completion – AI rà soát cấp Giấy chứng nhận quyền sử dụng đất lần đầu

**Mốc phát hành:** `v2.5.4-land-first-certificate-ai-review`  
**Ngày hoàn thành:** 04/07/2026  
**Trạng thái:** Đã triển khai, debug, kiểm thử thành công và nghiệm thu kỹ thuật.

---

## 1. Mục tiêu Phase 7C-B

Phase 7C-B tập trung triển khai chức năng AI chuyên sâu hỗ trợ rà soát toàn diện hồ sơ thủ tục hành chính (TTHC) đối với nghiệp vụ **“Cấp Giấy chứng nhận quyền sử dụng đất lần đầu”** trong module **Trợ lý thẩm tra hồ sơ TTHC**.

Các mục tiêu cốt lõi bao gồm:
- **Hỗ trợ chuyên môn sâu:** AI đóng vai trò như một người trợ lý ảo chuyên nghiệp, giúp cán bộ địa chính và cán bộ thẩm tra hồ sơ nhanh chóng đọc, tóm tắt, phân tích cấu trúc hồ sơ và nhận diện thành phần tài liệu.
- **Khuyến nghị kỹ càng, có căn cứ:** AI không nói chung chung mà đưa ra các phân tích chi tiết, nhận diện rủi ro pháp lý, đối chiếu các mốc thời gian sử dụng đất và gợi ý nội dung cần kiểm tra thực địa/xác minh thực tế kèm căn cứ pháp lý cụ thể.
- **Tuân thủ tuyệt đối nguyên tắc "Human-in-the-Loop" (Cán bộ là trung tâm quyết định):**
  - AI **không** kết luận thay cán bộ rằng hồ sơ đủ điều kiện hay không đủ điều kiện.
  - AI **không** tự động thay đổi trạng thái hồ sơ (`status`) hoặc thay đổi cán bộ thụ lý (`assignedToId`).
  - AI **không** tự ý phát hành văn bản, không tự ký số hay gửi thông báo/email cho người dân.
  - AI **chưa** lập bảng tính hay tính toán số tiền sử dụng đất/nghĩa vụ tài chính thực tế trong phase này (chỉ cảnh báo các điểm rủi ro cần kiểm tra về mốc thời gian và căn cứ tính tiền).

---

## 2. Phạm vi đã triển khai

Hệ thống đã triển khai hoàn chỉnh một chu trình kín từ tầng dữ liệu, backend nghiệp vụ đến giao diện tương tác người dùng:
- **Backend AI Endpoints:** Xây dựng cụm RESTful API dành riêng cho nghiệp vụ rà soát hồ sơ TTHC cấp GCN lần đầu trong `AdministrativeProceduresModule`.
- **Prompt Builder Chuyên biệt:** Xây dựng `ProcedureAiPromptBuilder` với prompt được thiết kế tối ưu hóa cho nghiệp vụ đất đai (đọc thông tin chủ sử dụng, thửa đất, nguồn gốc, quy hoạch, tranh chấp).
- **Control JSON Schema:** Kiểm soát chặt chẽ cấu trúc đầu ra (JSON schema-enforced) từ LLM (Google Gemini), đảm bảo kết quả luôn trả về đúng định dạng 7 nhóm phân tích, không bị vỡ cấu trúc hay lỗi parse.
- **Lưu trữ Persistent:** Lưu toàn bộ kết quả phân tích, bản chụp dữ liệu đầu vào (`inputSnapshot`) và cấu trúc đầu ra (`outputPayload`) vào bảng mới `ProcedureAiAnalysis` trong cơ sở dữ liệu.
- **Kiểm toán Chặt chẽ (Audit Logging):** Ghi nhật ký đầy đủ vào bảng `ProcedureAuditLog` đối với mọi thao tác: tạo yêu cầu rà soát AI, chấp nhận (accept) hoặc từ chối (reject) kết quả.
- **Frontend Tab "AI rà soát":** Tích hợp giao diện trực quan ngay trên trang chi tiết hồ sơ TTHC (`ProcedureCaseDetail.tsx`), hiển thị kết quả phân tích theo 7 nhóm card rõ ràng.
- **Thao tác Nghiệp vụ Cán bộ:**
  - **Chấp nhận & Lưu ý kiến:** Chấp nhận kết quả AI và tự động chuyển hóa tóm tắt, khuyến nghị thành một bản ghi chú thẩm tra (`ProcedureNote`) để lưu trong hồ sơ.
  - **Chấp nhận & Tạo checklist:** Tự động chuyển các mục kiểm tra cán bộ do AI đề xuất vào danh sách công việc cần rà soát (`ProcedureChecklistItem`).
  - **Từ chối (Reject):** Ghi nhận trạng thái từ chối kết quả AI với minh bạch lịch sử, không xóa dữ liệu cũ.
- **Cơ chế Fallback An toàn:** Tự động chuyển sang cấu trúc Structured Mock Fallback chuẩn nghiệp vụ khi môi trường thiếu API Key live hoặc gặp sự cố kết nối LLM, đảm bảo hệ thống không bao giờ bị gián đoạn hay trả lỗi 500 cho người dùng.

---

## 3. Cơ sở dữ liệu & Migration

Cấu trúc cơ sở dữ liệu đã được mở rộng thông qua migration chính thức, tuân thủ nghiêm ngặt tính độc lập và an toàn dữ liệu:
- **Model mới:** `ProcedureAiAnalysis` (lưu trữ lịch sử, kết quả phân tích AI, độ tin cậy, thông tin cán bộ tạo/duyệt).
- **Enum mới:**
  - `ProcedureAiAnalysisType`: Xác định loại nghiệp vụ phân tích (bao gồm `LAND_FIRST_CERTIFICATE_REVIEW`).
  - `ProcedureAiAnalysisStatus`: Quản lý vòng đời kết quả AI (`PENDING`, `ACCEPTED`, `REJECTED`, `EXPIRED`).
- **Migration:** Đã áp dụng thành công migration `20260703141004_add_procedure_ai_analysis`.
- **Cam kết bảo toàn dữ liệu (Zero Side-Effects):**
  - Migration **chỉ thêm** bảng và enum mới phục vụ lưu kết quả AI cho module TTHC.
  - **Không** sửa, **không** xóa hay can thiệp vào bảng `LegalCase` (module Đơn thư/Vụ việc cũ).
  - **Không** sửa, **không** xóa các bảng `CaseNote`, `CaseHistory`, `CaseChecklistItem`, `CaseDocument`, `AiAuditLog`.
  - **Không** sửa đổi hay làm ảnh hưởng đến cấu trúc nền tảng TTHC đã tạo ở Phase 7C-A (`AdministrativeProcedureCase`, `ProcedureType`, `ProcedureDocument`,...).

---

## 4. Backend đã triển khai

Tầng Backend NestJS được thiết kế mô-đun hóa, bảo mật và chuẩn xác:
- **Các class/service cốt lõi:**
  - `ProcedureAiPromptBuilder`: Chịu trách nhiệm tổng hợp thông tin đơn đăng ký, tài liệu đính kèm, lịch sử giải quyết để xây dựng System Prompt và User Prompt chuẩn mực cho LLM.
  - `ProcedureAiService`: Xử lý logic nghiệp vụ, gọi AI Provider, phân giải tài khoản người dùng, chuẩn hóa dữ liệu đầu ra và tương tác với Prisma DB.
- **Cập nhật Module/Controller:** Tích hợp `ProcedureAiService` vào `AdministrativeProceduresModule` và `ProcedureCasesController`.
- **Danh sách Endpoints chính thức:**
  - `POST /api/procedure-cases/:id/ai/land-first-certificate-review`: Kích hoạt AI rà soát chuyên sâu hồ sơ cấp GCN lần đầu.
  - `GET /api/procedure-cases/:id/ai-analyses`: Lấy danh sách lịch sử các lần rà soát AI của hồ sơ.
  - `POST /api/procedure-cases/:id/ai-analyses/:analysisId/accept`: Cán bộ duyệt chấp nhận kết quả AI (tùy chọn kèm tạo ghi chú hoặc tạo checklist).
  - `POST /api/procedure-cases/:id/ai-analyses/:analysisId/reject`: Cán bộ từ chối kết quả AI.
- **Kiểm soát Phạm vi Nghiệp vụ:** Hệ thống kiểm tra chặt chẽ, chỉ cho phép kích hoạt chức năng này đối với hồ sơ có `procedureType.code === 'LAND_FIRST_CERTIFICATE'` hoặc `procedureType.group === 'CAP_GCN_LAN_DAU'`. Các loại thủ tục khác sẽ bị từ chối với thông điệp lỗi rõ ràng.
- **Safe JSON Parsing & Normalization:** Đầu ra từ AI được lọc bằng regex để tách chuỗi JSON hợp lệ, tự động hợp nhất (merge/normalize) với schema mặc định để bảo đảm luôn đủ 7 nhóm thuộc tính, không bao giờ bị lỗi `TypeError` hay thiếu field trên giao diện.
- **Xử lý User Context & Audit chuẩn JWT:**
  - Lấy chính xác ID người dùng từ token JWT đăng nhập (`req?.user?.id || req?.user?.userId`).
  - Hàm `resolveUserId` kiểm tra xác thực: nếu không nhận được `userId` hợp lệ hoặc người dùng không tồn tại trong DB, lập tức trả lỗi `BadRequestException('Không xác định được người dùng đang thao tác')`.
  - **Tuyệt đối không fallback** sang tài khoản admin hay một cán bộ bất kỳ khác trong hệ thống để ghi nhật ký thay.
  - Mọi hành động (Create, Accept, Reject) đều được ghi nhận đầy đủ vào bảng `ProcedureAuditLog` với `userId` chính chủ.

---

## 5. Frontend đã triển khai

Giao diện người dùng (React / Vite / TailwindCSS) được nâng cấp chuyên nghiệp, mạch lạc và tuân thủ định hướng nghiệp vụ:
- **Cập nhật API & Types:**
  - `src/types/procedure.ts`: Bổ sung định nghĩa kiểu dữ liệu cho `ProcedureAiAnalysis`, cấu trúc `outputPayload` 7 nhóm, kiểu trạng thái và tham số tùy chọn cho Accept/Reject.
  - `src/lib/procedureCasesApi.ts`: Bổ sung các phương thức gọi API tới cụm endpoint AI rà soát TTHC.
- **Trang Chi tiết Hồ sơ (`ProcedureCaseDetail.tsx`):**
  - **Banner Cảnh báo Bắt buộc:** Tích hợp banner nổi bật ngay đầu tab AI rà soát với nội dung: **“⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA. Kết quả phân tích từ Trợ lý AI chỉ mang tính chất tham khảo chuyên môn. Cán bộ thụ lý chịu trách nhiệm kiểm tra thực tế, đối chiếu bản gốc tài liệu và thẩm định theo quy định pháp luật.”**
  - **Kiểm soát Nút kích hoạt:** Nút **“🤖 AI rà soát cấp GCN lần đầu”** chỉ hiển thị và cho phép thao tác khi hồ sơ thuộc đúng thủ tục Cấp GCN lần đầu.
  - **Hiển thị Kết quả theo 7 Nhóm Trực quan:**
    1. **Tóm tắt hồ sơ:** Thông tin tổng quan, mã hồ sơ, chủ thể, trạng thái tiếp nhận.
    2. **Thông tin người sử dụng đất:** Họ tên, tình trạng xác minh CCCD/mã định danh, địa chỉ liên hệ và nội dung cần kiểm tra nhân thân.
    3. **Thông tin thửa đất:** Số thửa, tờ bản đồ, diện tích, vị trí, loại đất, tình trạng ranh giới và điểm cần đối chiếu thực địa.
    4. **Nguồn gốc & Thời điểm sử dụng đất:** Nguồn gốc kê khai, thời điểm bắt đầu sử dụng, cảnh báo rủi ro lịch sử (giấy tờ viết tay, mốc 1993/2004/2014) và nội dung cần thẩm tra.
    5. **Thành phần hồ sơ:** Phân loại rõ ràng 3 cột: Tài liệu đã đính kèm, Tài liệu thiếu/cần đối chiếu, Tài liệu đề xuất yêu cầu bổ sung.
    6. **Quy hoạch / Tranh chấp / Hiện trạng & Nghĩa vụ tài chính:** Các điểm cần rà soát về quy hoạch, tranh chấp địa phương, vi phạm hành lang công trình và ghi chú cảnh báo tài chính.
    7. **Khuyến nghị & Căn cứ:** Hướng giải quyết cho cán bộ, gợi ý câu hỏi hỏi người dân giải trình và danh sách căn cứ pháp lý áp dụng (Luật Đất đai 2024, NĐ 101/2024, NĐ 102/2024).
- **Các Nút Thao tác Chuẩn mực:**
  - Nút **“✅ Chấp nhận & Lưu ý kiến vào Ghi chú”**: Chấp nhận kết quả và tự động chép tóm tắt, khuyến nghị vào tab Ghi chú của hồ sơ.
  - Nút **“📋 Chấp nhận & Tạo checklist gợi ý”**: Chấp nhận kết quả và tự động tạo các việc cần làm cho cán bộ vào tab Checklist.
  - Nút **“❌ Từ chối kết quả này”**: Từ chối bản rà soát AI nếu không đạt yêu cầu.
- **Kiểm soát Không gian Chức năng (No Forbidden Actions):**
  - **Không có** nút hay chức năng kết luận đủ điều kiện / không đủ điều kiện.
  - **Không có** nút lập bảng tính tiền sử dụng đất hay chốt thuế.
  - **Không có** nút phát hành văn bản hay ký số tờ trình.

---

## 6. Sự cố đã phát hiện và xử lý (Troubleshooting Report)

Trong quá trình kiểm thử tích hợp thực tế tại môi trường local, hệ thống đã phát hiện và khắc phục triệt để một sự cố quan trọng:
- **Mô tả lỗi ban đầu:** Khi vào hồ sơ TTHC loại Cấp GCN lần đầu và bấm nút “AI rà soát cấp GCN lần đầu”, giao diện báo lỗi `Internal server error` (HTTP 500) và không hiển thị kết quả phân tích.
- **Nguyên nhân gốc rễ:** 
  - Trong bộ xác thực `JwtStrategy.validate()`, object trả về cho request được cấu trúc là `{ id, email, role }`.
  - Tại `ProcedureCasesController`, các endpoint đang truy xuất ID người dùng thông qua thuộc tính `req.user.userId`. Do thuộc tính này không tồn tại, giá trị nhận được là `undefined`.
- **Hậu quả:** Khi giá trị `undefined` được truyền vào `ProcedureAiService` để tạo bản ghi `ProcedureAiAnalysis` (trường bắt buộc `createdById`) và ghi nhật ký `ProcedureAuditLog` (trường bắt buộc `userId`), Prisma ORM ném lỗi vi phạm schema validation / constraint, làm backend văng lỗi 500.
- **Cách thức khắc phục triệt để:**
  - **Chuẩn hóa truy xuất JWT User:** Sửa toàn bộ controller sang phương thức truy xuất an toàn `req?.user?.id || req?.user?.userId`.
  - **Kiểm tra User Context nghiêm ngặt:** Cập nhật hàm `resolveUserId` trong `ProcedureAiService`, từ chối thao tác và trả lỗi `BadRequestException` nếu không có ID người dùng hợp lệ.
  - **Bảo đảm không Fallback sai lệch:** Loại bỏ hoàn toàn cơ chế tự động lấy tài khoản admin hay người dùng khác để thay thế, bảo đảm tính trung thực của nhật ký kiểm toán.
  - **Chuẩn hóa dữ liệu JSON (Payload Normalization):** Bổ sung cơ chế hợp nhất object đầu ra từ AI với khung mặc định, bảo đảm không bao giờ xảy ra lỗi thiếu field khi frontend render.
- **Kết quả sau khắc phục:** Endpoint `POST /api/procedure-cases/:id/ai/land-first-certificate-review` hoạt động mượt mà, trả về HTTP 201 Created, kết quả chia nhóm hiển thị hoàn hảo trên giao diện và ghi audit log chính xác.

---

## 7. Nguyên tắc an toàn đã bảo đảm

Hệ thống LegalFlow v2.5.4 cam kết tuân thủ 100% các nguyên tắc an toàn pháp lý và kiến trúc hành chính đã định hướng:
1. **AI là Trợ lý Chuyên môn:** AI chỉ hỗ trợ rà soát toàn diện, đọc hiểu tài liệu, chỉ ra điểm thiếu sót và đối chiếu quy định.
2. **Không Quyết định Thay Cán bộ:** AI tuyệt đối không đưa ra kết luận hồ sơ đủ điều kiện hay không đủ điều kiện. Cán bộ thụ lý là người duy nhất có quyền thẩm định và kết luận.
3. **Khuyến nghị Kỹ càng & Có Căn cứ:** Mọi cảnh báo rủi ro hay ý kiến gợi ý đều gắn liền với các điều khoản của Luật Đất đai 2024 và Nghị định hướng dẫn thi hành.
4. **Bảo toàn Trạng thái Hồ sơ:** AI không được phép và không có khả năng tự động thay đổi trạng thái xử lý (`status`) hay chuyển giao hồ sơ (`assignedToId`).
5. **Không Tự ý Phát hành Văn bản:** AI không tự tạo tờ trình chính thức, không tự ký số và không tự động gửi email/thông báo cho công dân.
6. **Chưa Tính tiền Sử dụng đất:** Phase này giới hạn ở mức độ nhận diện rủi ro mốc thời gian và căn cứ tính tiền, chưa thực hiện lập bảng tính tài chính.
7. **Minh bạch Nhãn Cảnh báo:** Mọi kết quả hiển thị đều đi kèm thông điệp nhắc nhở trách nhiệm kiểm tra thực tế của cán bộ.
8. **Kiểm toán Toàn vẹn:** Mọi thao tác tạo mới, chấp nhận hay từ chối kết quả AI đều được ghi chép vào `ProcedureAuditLog` với dấu vết thời gian và ID người dùng đăng nhập.
9. **Lưu trữ Lịch sử Khách quan:** Kết quả AI bị từ chối (`REJECTED`) vẫn được lưu giữ trong cơ sở dữ liệu phục vụ thanh tra, kiểm tra, tuyệt đối không bị xóa bỏ.

---

## 8. Kết quả Test / Build

Toàn bộ bộ kiểm thử tự động và build quy trình sản xuất (Production Build) đều đã được thực thi và đạt kết quả thành công 100%:
- **`npx prisma generate`**: ✔ Đã tạo thành công Prisma Client (v7.8.0) với schema mới nhất.
- **`npx prisma migrate status`**: ✔ `Database schema is up to date!` (Ghi nhận đầy đủ 5 migrations của hệ thống).
- **`npm test` (Backend Unit Tests)**: ✔ `Test Suites: 8 passed, 8 total` & `Tests: 39 passed, 39 total` (Thời gian thực thi ~6.4s, không có lỗi regression).
- **`npm run build` (Backend NestJS Build)**: ✔ `nest build` hoàn thành không có lỗi cú pháp hay lỗi kiểu dữ liệu TypeScript.
- **`npm run build` (Frontend Vite Build)**: ✔ `tsc -b && vite build` hoàn thành, đóng gói thành công các module client cho production.
- **Kiểm chứng Thủ công trên Giao diện (`http://kevindoan-legalflow.local:8080`)**:
  - ✔ Mở hồ sơ TTHC loại Cấp GCN lần đầu -> Tab "AI rà soát" hiển thị banner cảnh báo đúng quy chuẩn.
  - ✔ Bấm nút chạy AI review -> Trả về kết quả phân tích trực quan chia thành 7 nhóm card A-G đầy đủ thông tin.
  - ✔ Bấm "Chấp nhận & Lưu ý kiến vào Ghi chú" -> Trạng thái AI chuyển sang `Đã chấp nhận`, tự động tạo 1 bản ghi chú mới trong tab Ghi chú.
  - ✔ Bấm "Chấp nhận & Tạo checklist gợi ý" -> Tự động thêm 5 mục kiểm tra cán bộ vào tab Checklist.
  - ✔ Bấm "Từ chối" -> Trạng thái chuyển sang `Đã từ chối`, dữ liệu vẫn được bảo lưu hiển thị rõ ràng.
  - ✔ Kiểm tra các hồ sơ Đơn thư/Vụ việc thuộc module `LegalCase` cũ -> Hoạt động bình thường, không bị ảnh hưởng.

---

## 9. Lệnh SQL kiểm chứng

Cán bộ quản trị cơ sở dữ liệu (DBA) hoặc kiểm thử viên có thể sử dụng các lệnh SQL dưới đây trong PostgreSQL để kiểm chứng độc lập tính chính xác của hệ thống:

### Kiểm tra danh sách kết quả rà soát AI đã tạo cho hồ sơ TTHC
```sql
SELECT 
    id, 
    procedure_case_id, 
    analysis_type, 
    confidence_level, 
    status, 
    created_by_id, 
    reviewed_by_id, 
    created_at 
FROM procedure_ai_analyses 
ORDER BY created_at DESC;
```

### Kiểm tra nhật ký kiểm toán (Audit Log) cho các thao tác AI rà soát
```sql
SELECT 
    id, 
    procedure_case_id, 
    user_id, 
    action_type, 
    entity_type, 
    entity_id, 
    created_at 
FROM procedure_audit_logs 
WHERE action_type IN ('CREATE_AI_ANALYSIS', 'ACCEPT_AI_ANALYSIS', 'REJECT_AI_ANALYSIS')
ORDER BY created_at DESC;
```

### Kiểm chứng trạng thái hồ sơ TTHC tuyệt đối KHÔNG bị tự động thay đổi
```sql
SELECT 
    id, 
    case_code, 
    status, 
    assigned_to_id, 
    updated_at 
FROM administrative_procedure_cases 
WHERE id = '<ID_HOSP_HO_SO_TEST>';
```

### Kiểm tra Ghi chú thẩm tra tự động sinh ra khi Cán bộ chọn Accept & Save Note
```sql
SELECT 
    id, 
    procedure_case_id, 
    user_id, 
    note_type, 
    content, 
    created_at 
FROM procedure_notes 
WHERE note_type = 'OFFICER_REVIEW' 
ORDER BY created_at DESC;
```

### Kiểm tra Checklist công việc tự động sinh ra khi Cán bộ chọn Accept & Apply Checklist
```sql
SELECT 
    id, 
    procedure_case_id, 
    checklist_group, 
    title, 
    is_completed, 
    is_ai_suggested, 
    created_at 
FROM procedure_checklist_items 
WHERE is_ai_suggested = true 
ORDER BY created_at DESC;
```

---

## 10. Backup & Rollback Kỹ thuật

Để bảo đảm an toàn tối đa cho hệ thống thực tế (UAT/Production), phương án sao lưu và phục hồi được xác định như sau:
- **Gói mã nguồn ZIP (Source Backup):** `legalflow-v2.5.4-land-first-certificate-ai-review.zip` (Lưu trữ toàn bộ mã nguồn tại thời điểm hoàn thành Phase 7C-B).
- **Bản sao lưu Cơ sở dữ liệu (DB Backup):** `legalflow-db-backup-v2.5.4-land-first-certificate-ai-review.sql` (Bản dump toàn bộ database PostgreSQL kèm cấu trúc bảng `ProcedureAiAnalysis`).
- **Quy trình Rollback Mã nguồn (Source Rollback):**
  - Trong trường hợp cần quay lui code về mốc nền tảng Phase 7C-A, thực hiện lệnh Git: `git checkout v2.5.3-procedure-core-foundation-complete` hoặc giải nén gói ZIP của mốc trước đó.
  - *Lưu ý quan trọng:* Nếu chỉ quay lui mã nguồn về Phase 7C-A, bảng `procedure_ai_analyses` trong database vẫn được giữ nguyên (không gây lỗi cho ứng dụng cũ vì module cũ không query đến bảng này).
- **Quy trình Rollback Cơ sở dữ liệu (DB Rollback):**
  - Nếu cần khôi phục toàn bộ trạng thái database về trước khi chạy Phase 7C-B, thực hiện restore từ file dump `.sql` của mốc trước: `psql -U postgres -d legalflow_prod -f legalflow-db-backup-v2.5.3.sql`.
  - Hoặc chạy lệnh revert migration của Prisma (trong môi trường development): `npx prisma migrate resolve --rolled-back "20260703141004_add_procedure_ai_analysis"`.

---

## 11. Rủi ro còn lại & Khuyến nghị Thận trọng

Mặc dù Phase 7C-B đã hoàn thành xuất sắc các mục tiêu kỹ thuật, hệ thống vẫn ghi nhận một số rủi ro thực tế cần lưu ý cho các giai đoạn tiếp theo:
1. **Phạm vi thủ tục còn hẹp:** Hiện tại AI mới chỉ được huấn luyện prompt và chuyên sâu cho một nhóm thủ tục duy nhất là **Cấp GCN quyền sử dụng đất lần đầu**. Các thủ tục chuyển mục đích, tách/gộp thửa, hay đăng ký biến động chưa được áp dụng AI review.
2. **Phụ thuộc chất lượng dữ liệu đầu vào:** AI phân tích dựa trên thông tin tóm tắt và danh sách tên tài liệu do người dùng/cán bộ kê khai trong hệ thống (`inputSnapshot`). Nếu dữ liệu nhập vào sơ sài hoặc sai lệch, khuyến nghị của AI sẽ bị ảnh hưởng.
3. **Chưa có OCR & Nhận diện hình ảnh bản đồ:** Hệ thống hiện chưa tự động đọc trực tiếp nội dung văn bản quét (file PDF scan/ảnh chụp sổ đỏ cũ, trích lục bản đồ). Việc đối chiếu hình ảnh ranh giới và tọa độ thực địa vẫn hoàn toàn do con người thực hiện.
4. **Chưa kết nối RAG / Cơ sở dữ liệu Quy hoạch:** AI hiện tự động suy luận dựa trên kiến thức pháp luật được nhúng trong prompt và mô hình ngôn ngữ lớn, chưa kết nối trực tiếp với cổng thông tin quy hoạch sử dụng đất cấp huyện hay cơ sở dữ liệu địa chính quốc gia (VBDLIS/MPLIS).
5. **Yêu cầu UAT Chuyên môn:** Cần tổ chức các buổi kiểm thử người dùng (UAT) thực tế với các cán bộ địa chính xã/phường và văn phòng đăng ký đất đai để tinh chỉnh giọng văn, độ sâu của khuyến nghị cho sát với thực tế thụ lý hồ sơ tại địa phương.

---

## 12. Kết luận

Phase 7C-B đã hoàn thành toàn diện, chính xác và tuân thủ kỷ luật kỹ thuật cao nhất. LegalFlow chính thức sở hữu bước tiến quan trọng đầu tiên trong việc ứng dụng Trợ lý AI chuyên sâu vào nghiệp vụ thẩm tra hồ sơ thủ tục hành chính đất đai. 

Kiến trúc giải pháp bảo đảm tính mở, bền vững, an toàn pháp lý tuyệt đối và sẵn sàng làm nền tảng vững chắc để mở rộng sang các loại thủ tục phức tạp hơn trong các giai đoạn tiếp theo.

---

## 13. Đề xuất Phase tiếp theo

Sau khi hoàn tất commit và tag mốc `v2.5.4-land-first-certificate-ai-review`, định hướng phát triển tiếp theo được đề xuất theo 3 lựa chọn ưu tiên:

1. **Lựa chọn 1 (Ưu tiên cao - Hoàn thiện trải nghiệm): Phase 7C-C – Xuất phiếu rà soát cấp GCN lần đầu ra văn bản Word / PDF**
   - *Mục tiêu:* Tự động hóa việc kết xuất kết quả rà soát AI (đã được cán bộ duyệt/chỉnh sửa) thành Bảng kiểm tra / Phiếu thẩm tra hồ sơ theo mẫu chuẩn hành chính (File .docx / .pdf), phục vụ in ấn và đính kèm vào hồ sơ trình ký ban lãnh đạo.
2. **Lựa chọn 2 (Mở rộng ngang): Phase 7D-A – AI rà soát hồ sơ Chuyển mục đích sử dụng đất**
   - *Mục tiêu:* Xây dựng Prompt Builder chuyên biệt và cấu trúc phân tích AI cho thủ tục chuyển mục đích sử dụng đất (đối chiếu kế hoạch sử dụng đất hàng năm của cấp huyện, sự phù hợp quy hoạch xây dựng).
3. **Lựa chọn 3 (Mở rộng sâu - Tài chính): Phase 7E-A – Thiết kế Mô-đun & Bảng tính dự kiến Nghĩa vụ tài chính / Tiền sử dụng đất**
   - *Mục tiêu:* Thiết kế schema, bảng giá đất đai, hệ số điều chỉnh ($K$) và công thức tính toán dự kiến tiền sử dụng đất cho hồ sơ cấp GCN lần đầu và chuyển mục đích sử dụng đất theo Luật Đất đai 2024.
