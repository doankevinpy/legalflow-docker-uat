# Phase 8D Completion – Integrate Legal Snapshot into AI Review Output

**Mốc phiên bản (Commit/Tag):** `v2.7.5-ai-legal-snapshot-integration`  
**Dự án:** LegalFlow v2 – Trợ lý AI thẩm tra hồ sơ thủ tục hành chính & Quản lý tri thức pháp lý  
**Ngày hoàn thành:** 04/07/2026  

---

## 1. Mục tiêu Phase 8D

Phase 8D được triển khai nhằm mục tiêu tạo lập cơ chế **tích hợp và lưu vết toàn vẹn bối cảnh căn cứ pháp lý (Legal Snapshot Integration)** vào kết quả AI rà soát hồ sơ thủ tục hành chính (Cấp GCN lần đầu và Chuyển mục đích sử dụng đất). Cụ thể:

* **Tích hợp snapshot căn cứ pháp lý vào kết quả AI rà soát hồ sơ:** Khi trợ lý AI thực hiện phân tích và sinh báo cáo rà soát cho một hồ sơ TTHC, hệ thống phải ghi nhận chính xác nhóm văn bản pháp luật, phiên bản thủ tục, phiên bản prompt và phiên bản checklist đang hiệu lực tại thời điểm đó.
* **Lưu lại phiên bản chi tiết tại thời điểm AI tạo kết quả:** Hệ thống lưu trữ các định danh và mã phiên bản của văn bản pháp lý (`knowledgeBaseVersion`, `legalDocumentIds`), phiên bản thủ tục (`procedureTypeVersion`), phiên bản prompt AI (`promptVersion`) và phiên bản checklist (`checklistVersion`).
* **Bảo đảm khả năng truy xuất ngược (Auditability):** Khi pháp luật thay đổi, các nghị định/thông tư cũ hết hiệu lực hoặc được thay thế/sửa đổi trong tương lai, hệ thống vẫn giữ nguyên lịch sử kiểm toán, cho phép cán bộ và cơ quan thanh tra truy xuất chính xác kết quả AI cũ đã dựa trên căn cứ pháp lý nào để tham mưu xử lý.
* **Hiển thị trực quan cho cán bộ kiểm chứng:** Cán bộ địa chính và chuyên viên thụ lý có thể nhìn thấy rõ ràng toàn bộ thông tin legal snapshot trực tiếp trên giao diện UI (Tab "AI rà soát"), trong phiếu rà soát Word (.docx) tải về và trên bản xem trước/in PDF (Print Preview).

---

## 2. Phạm vi đã triển khai

Trong Phase 8D, hệ thống đã hoàn thành chuẩn xác các hạng mục thuộc phạm vi triển khai theo kế hoạch và thực tế kiến trúc:

* **Tận dụng tối đa bảng `ProcedureAiAnalysisLegalSnapshot`:** Sử dụng bảng snapshot đã được kiến tạo nền tảng từ Phase 8B (`v2.7.2`), liên kết 1-1 với từng bản ghi kết quả `ProcedureAiAnalysis`.
* **Không tạo migration mới:** Do cấu trúc schema của bảng `ProcedureAiAnalysisLegalSnapshot` tại Phase 8B đã được thiết kế chuẩn xác và đầy đủ các trường liên kết ngoại (Foreign Keys), thực tế triển khai Phase 8D không cần tạo thêm bất kỳ migration nào, giữ nguyên sự ổn định cho cơ sở dữ liệu.
* **Bổ sung logic truy xuất bối cảnh pháp lý hiệu lực (Active Legal Context):** Xây dựng cơ chế tự động phân giải và tổng hợp các bộ từ điển, phiên bản thủ tục, prompt và checklist có trạng thái `ACTIVE` phù hợp với từng nghiệp vụ.
* **Tạo snapshot tự động cho luồng Cấp GCN lần đầu:** Khi cán bộ bấm nút chạy AI rà soát hồ sơ Cấp GCN quyền sử dụng đất lần đầu (`LAND_FIRST_CERTIFICATE_REVIEW`), hệ thống tự động sinh và lưu bản ghi legal snapshot đi kèm.
* **Tạo snapshot tự động cho luồng Chuyển mục đích sử dụng đất:** Khi cán bộ bấm nút chạy AI rà soát hồ sơ Chuyển mục đích sử dụng đất (`LAND_USE_PURPOSE_CHANGE_REVIEW`), hệ thống thực hiện quy trình chụp bối cảnh pháp lý tương tự.
* **Gắn `legalKnowledgeMetadata` vào `outputPayload`:** Bổ sung cấu trúc dữ liệu metadata pháp lý trực tiếp vào payload JSON trả về từ trợ lý AI, giúp Frontend và các công cụ báo cáo đọc dữ liệu nhanh chóng mà không cần query chéo phức tạp.
* **Thêm endpoint read-only lấy snapshot:** Cung cấp API chuyên biệt cho phép tra cứu chi tiết bản ghi legal snapshot và các đối tượng liên kết theo ID kết quả phân tích AI.
* **Hiển thị legal snapshot trên UI Tab AI rà soát:** Cập nhật giao diện chi tiết hồ sơ, bổ sung khối hiển thị chuyên sâu về quản trị phiên bản pháp lý AI.
* **Hiển thị legal snapshot trong phiếu Word và bản in PDF:** Tích hợp thông tin bối cảnh pháp lý vào văn bản xuất ra phục vụ rà soát nội bộ và lưu trữ hồ sơ.
* **Xử lý an toàn tương thích ngược (Backward Compatibility):** Đảm bảo các kết quả rà soát AI cũ (được tạo trước Phase 8D, chưa có bản ghi snapshot hoặc metadata) vẫn hiển thị bình thường trên UI và Word/PDF, tự động fallback về thông tin mặc định, tuyệt đối không gây lỗi crash ứng dụng.

---

## 3. Backend đã triển khai

Tầng Backend được nâng cấp chuyên sâu tại module thủ tục hành chính (`AdministrativeProceduresModule`) và kho tri thức pháp lý (`LegalKnowledgeModule`):

* **Cập nhật `LegalKnowledgeService` (`src/legal-knowledge/legal-knowledge.service.ts`):**
  * Triển khai hàm `resolveActiveLegalContext(procedureCode, analysisType)`: Thực hiện truy vấn cơ sở dữ liệu để tìm kiếm các bản ghi đang hiệu lực:
    * `ProcedureTypeVersion` với `status: 'ACTIVE'`.
    * `AiPromptVersion` với `status: 'ACTIVE'` ứng với loại phân tích AI.
    * `ChecklistVersion` với `status: 'ACTIVE'` ứng với mã thủ tục.
    * Danh sách các `LegalDocument` có trạng thái `ACTIVE` thuộc lĩnh vực đất đai.
  * Cung cấp logic fallback an toàn: Nếu môi trường chưa được cấu hình phiên bản `ACTIVE`, hệ thống tự động trả về bộ mã nhận diện mặc định (`LAND_KB_V1_2026`, `Luật Đất đai 2024`, `NĐ 101/2024/NĐ-CP`, `NĐ 102/2024/NĐ-CP`) để đảm bảo quy trình AI không bị gián đoạn.

* **Cập nhật `ProcedureAiService` (`src/administrative-procedures/ai/procedure-ai.service.ts`):**
  * Inject `LegalKnowledgeService` vào constructor của `ProcedureAiService`.
  * Tại phương thức `reviewLandFirstCertificate` và `reviewLandUsePurposeChange`:
    1. Gọi `resolveActiveLegalContext` trước khi gọi prompt builder.
    2. Gắn thông tin `legalKnowledgeMetadata` vào `outputPayload` của kết quả AI, bao gồm: `knowledgeBaseVersion`, `procedureTypeVersion`, `promptVersion`, `checklistVersion`, và `legalDocumentCodes`.
    3. Sau khi khởi tạo thành công bản ghi `ProcedureAiAnalysis` trong database, tự động gọi hàm `createLegalSnapshot(analysisId, legalContext)`.
  * Triển khai hàm `createLegalSnapshot`: Sử dụng `prisma.procedureAiAnalysisLegalSnapshot.create` để ghi nhận liên kết giữa kết quả AI và các phiên bản pháp lý, đồng thời lưu trữ mảng ID văn bản vào trường `legalDocumentIds` và dữ liệu thô vào `snapshotPayload`.
  * Bổ sung phương thức `getAnalysisLegalSnapshot(analysisId)`: Truy vấn bản ghi snapshot cùng toàn bộ quan hệ (`procedureTypeVersion`, `promptVersion`, `checklistVersion`).

* **Cập nhật `AdministrativeProceduresModule` (`src/administrative-procedures/administrative-procedures.module.ts`):**
  * Import `LegalKnowledgeModule` vào danh sách `imports` để cung cấp `LegalKnowledgeService` cho các service nội bộ.

* **Cập nhật `ProcedureCasesController` (`src/administrative-procedures/procedure-cases.controller.ts`):**
  * Bổ sung endpoint read-only bảo mật bằng JWT Auth và RBAC:
    `GET /api/procedure-cases/:id/ai-analyses/:analysisId/legal-snapshot`
  * Trả về dữ liệu snapshot chi tiết cho Frontend.

* **Ghi nhận Nhật ký Kiểm toán (Audit Logging):**
  * Hệ thống tự động ghi vết vào `ProcedureAuditLog` với action type `AI_LEGAL_SNAPSHOT_CREATED` mỗi khi một snapshot pháp lý được tạo lập, bảo đảm tính minh bạch tuyệt đối.

---

## 4. Frontend đã triển khai

Giao diện người dùng được cập nhật đồng bộ để hiển thị khối thông tin quản trị tri thức pháp lý:

* **Cập nhật TypeScript Interfaces (`src/types/procedure.ts`):**
  * Bổ sung trường tùy chọn `legalSnapshot?: any;` vào interface `ProcedureAiAnalysis` để lưu trữ dữ liệu snapshot khi tra cứu chi tiết.

* **Cập nhật API Client (`src/lib/procedureCasesApi.ts`):**
  * Bổ sung phương thức `getAiAnalysisLegalSnapshot(caseId, analysisId)` gọi đến endpoint lấy snapshot của Backend.

* **Cập nhật Trang Chi tiết Hồ sơ (`src/pages/ProcedureCaseDetail.tsx`):**
  * Tại Tab "AI rà soát", bên dưới khối "G. Khuyến nghị Chuyên môn & Gợi ý bước xử lý", bổ sung **Section H: Căn cứ Pháp lý & Quản trị Phiên bản AI (Legal Snapshot)**.
  * Khối giao diện được thiết kế với khung viền màu vàng hổ phách (amber), biểu tượng `🏛️`, hiển thị lưới 4 cột thông tin quản trị:
    * **Knowledge Base:** Mã bộ dữ liệu pháp lý (ví dụ: `LAND_KB_V1_2026`).
    * **Procedure Version:** Phiên bản quy trình thủ tục đang áp dụng.
    * **Prompt Version:** Phiên bản system prompt AI đã phân tích hồ sơ.
    * **Checklist Version:** Phiên bản danh mục kiểm tra nghiệp vụ.
  * Hiển thị danh sách các nhãn (tags) văn bản pháp luật áp dụng trong phiên bản rà soát (ví dụ: *Luật Đất đai 2024*, *NĐ 101/2024/NĐ-CP*, *NĐ 102/2024/NĐ-CP*).
  * Tích hợp hộp cảnh báo pháp lý nổi bật ngay bên dưới bảng phiên bản, nhắc nhở trách nhiệm cán bộ.
  * **Xử lý an toàn dữ liệu cũ:** Triển khai cơ chế đánh giá fallback an toàn (`snapshot || metadata || defaults`). Đối với các hồ sơ phân tích cũ chưa có snapshot trong DB, hệ thống tự động hiển thị các giá trị nhận dạng chuẩn mà không phát sinh lỗi hay làm vỡ bố cục trang.

---

## 5. Word/PDF đã cập nhật

Công cụ xuất phiếu rà soát nội bộ và xem trước in ấn được cải tiến để lồng ghép thông tin kiểm toán pháp lý:

* **Cập nhật Trình tạo Word (`src/administrative-procedures/ai/procedure-docx.helper.ts`):**
  * Xây dựng hàm hỗ trợ `createLegalSnapshotSection(analysis, payload, createSubHeader)`: Tạo ra các đoạn văn bản (Paragraph) chuẩn định dạng Word .docx hiển thị khối chi tiết về Phiên bản hệ thống, Bộ dữ liệu KB, Prompt AI, Checklist và Danh sách văn bản pháp luật căn cứ.
  * Tích hợp gọi `createLegalSnapshotSection` vào 2 hàm xây dựng tài liệu chính:
    * `buildLandFirstCertReviewDocx`: Khối Legal Snapshot được đặt tại Mục II (Tóm tắt phân tích từ trợ lý AI), ngay dưới dòng hiển thị thời điểm phân tích.
    * `buildLandUsePurposeChangeReviewDocx`: Khối Legal Snapshot được tích hợp tương tự tại Mục II của phiếu rà soát chuyển mục đích.
  * Bảo đảm giữ nguyên toàn bộ cấu trúc 11 mục (đối với Cấp GCN) và 13 mục (đối với Chuyển mục đích), không làm xô lệch định dạng hay ảnh hưởng đến các khối kiểm tra nghiệp vụ bên dưới.

* **Cập nhật Modal Xem trước/In PDF (`ProcedureReviewPrintModal.tsx` & `PurposeChangeReviewPrintModal.tsx`):**
  * Tại Mục II của cả hai modal in ấn, bổ sung khối hiển thị:
    `🏛️ CĂN CỨ PHÁP LÝ & PHIÊN BẢN HỆ THỐNG (LEGAL SNAPSHOT)`
  * Hiển thị bảng lưới 2x2 chứa các thông số phiên bản KB, Thủ tục, Prompt, Checklist cùng danh sách văn bản luật áp dụng.
  * Tích hợp dòng ghi chú pháp lý in nghiêng tự động chuyển đổi sang định dạng in chuẩn A4:
    > **⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA:** Căn cứ pháp lý hiển thị là phiên bản dữ liệu hệ thống ghi nhận tại thời điểm AI rà soát; cán bộ phải kiểm tra văn bản pháp luật hiện hành, văn bản sửa đổi/bổ sung/thay thế nếu có, quy hoạch/kế hoạch sử dụng đất và quy trình nội bộ địa phương tại thời điểm xử lý hồ sơ.

---

## 6. Nguyên tắc an toàn đã bảo đảm

Toàn bộ quá trình thiết kế và triển khai Phase 8D tuân thủ triệt để các kỷ luật an toàn pháp lý và nguyên tắc **Human-in-the-Loop**:

1. **Snapshot là dữ liệu truy xuất lịch sử, không phải kết luận pháp lý:** Bản ghi snapshot chỉ có giá trị ghi nhận trạng thái hệ thống tại thời điểm phân tích nhằm mục đích kiểm toán nội bộ, không có giá trị thay thế quyết định hành chính hay lời khẳng định pháp lý của cơ quan nhà nước.
2. **AI không khẳng định đây là căn cứ pháp lý mới nhất/đầy đủ:** Trợ lý AI chỉ dựa trên tập tri thức pháp lý được định danh trong phiên bản active, không tự ý tuyên bố văn bản là mới nhất hay có hiệu lực cao nhất mà không qua thẩm định của con người.
3. **Cảnh báo trách nhiệm thẩm tra hiện hành:** Cả 3 môi trường giao diện (UI web, file Word tải về, bản in PDF preview) đều hiển thị rõ ràng lời nhắc: *"Cán bộ phải kiểm tra văn bản pháp luật hiện hành, văn bản sửa đổi/bổ sung/thay thế nếu có, quy hoạch/kế hoạch sử dụng đất và quy trình nội bộ địa phương tại thời điểm xử lý hồ sơ."*
4. **Cảnh báo nhẹ khi thiếu Legal Context Active:** Nếu hệ thống chưa được cấu hình hoặc seed đầy đủ phiên bản active, UI và Word/PDF tự động fallback hiển thị thông tin mặc định kèm ghi chú lưu ý, bảo đảm ứng dụng luôn vận hành ổn định.
5. **Không tự động can thiệp nghiệp vụ hành chính:**
   * Không tự động thay đổi trạng thái hồ sơ TTHC (`status`).
   * Không tự động thay đổi cán bộ thụ lý (`assignedToId`).
   * Không tự động phát hành văn bản hay chứng nhận pháp lý cho công dân.
   * Không thực hiện ký số hay đóng dấu điện tử.
   * Không tự động gửi email, SMS hay thông báo Zalo cho người dân hoặc lãnh đạo.
   * Không tự động tính toán số tiền thuế, tiền sử dụng đất hay nghĩa vụ tài chính cụ thể.
6. **Không cho AI tự cập nhật luật:** Trợ lý AI chỉ đóng vai trò người tiêu thụ (consumer) dữ liệu snapshot read-only, tuyệt đối không có quyền gọi các API chỉnh sửa, thêm mới hay kích hoạt phiên bản văn bản pháp lý trong `LegalKnowledgeModule`.

---

## 7. Kết quả test/build

Hệ thống đã trải qua quy trình kiểm thử và biên dịch toàn diện, xác nhận chất lượng kỹ thuật cao nhất:

* **Prisma Client Generation (`npx prisma generate`):** Thực hiện thành công, đồng bộ đầy đủ các model và quan hệ snapshot vào client library.
* **Kiểm tra trạng thái Migration (`npx prisma migrate status`):** Xác nhận cơ sở dữ liệu hoàn toàn đồng bộ với schema (`Database schema is up to date!`), không phát sinh migration lệch lạc.
* **Backend Unit Tests (`npm test`):**
  * Đạt **100% PASS** cho toàn bộ **10 test suites** với **56 automated unit tests**.
  * Các test case trong `procedure-ai.service.spec.ts` và `legal-knowledge.service.spec.ts` đã kiểm chứng chính xác logic phân giải legal context, tạo bản ghi snapshot và cấu trúc truy vấn `include` phức tạp.
* **Backend Production Build (`npm run build`):** Biên dịch NestJS thành công, không có bất kỳ lỗi cú pháp hay cảnh báo TypeScript nào (0 compilation errors).
* **Frontend Production Build (`npm run build`):** Chạy `tsc -b && vite build` hoàn tất tốt đẹp, tạo ra bundle tối ưu cho môi trường production.
* **Kiểm thử thủ công chuyên sâu (Manual Verification):**
  * **Luồng Cấp GCN lần đầu:** Chạy AI rà soát hồ sơ mới → Kiểm tra DB thấy tạo thành công bản ghi `ProcedureAiAnalysisLegalSnapshot` → Mở UI Tab AI rà soát thấy hiển thị đầy đủ Section H (KB Version, Procedure Version, Prompt Version, Checklist Version, danh sách luật) → Tải file Word (`.docx`) và mở bản in PDF thấy khối Legal Snapshot hiển thị chuẩn xác, trang dặn dò pháp lý rõ ràng.
  * **Luồng Chuyển mục đích sử dụng đất:** Chạy AI rà soát cho hồ sơ chuyển mục đích → Xác nhận snapshot sinh tự động trong DB → UI, Word và PDF đều hiển thị thông tin kiểm toán pháp lý chuyên biệt, không xảy ra xung đột với các vùng dữ liệu quy hoạch/tài chính.
  * **Kho căn cứ pháp lý & Kết quả cũ:** Kiểm tra tab "Snapshot AI" trong Kho căn cứ pháp lý hiển thị danh sách snapshot liên kết đầy đủ với hồ sơ. Mở lại các kết quả rà soát AI cũ (chưa có snapshot) xác nhận UI không lỗi, khối Section H tự động chuyển sang trạng thái hiển thị thông tin mặc định an toàn.
  * **Kiểm chứng tính nguyên vẹn nghiệp vụ:** Xác nhận trạng thái hồ sơ và cán bộ thụ lý vẫn giữ nguyên như trước khi chạy AI.

---

## 8. SQL kiểm chứng

Các câu lệnh SQL chuẩn phục vụ quản trị viên, chuyên viên thẩm tra và đội ngũ audit kiểm tra trực tiếp trên cơ sở dữ liệu PostgreSQL/Prisma:

### 1. Kiểm tra danh sách Legal Snapshot đã sinh kèm thông tin hồ sơ và kết quả AI
```sql
SELECT 
  s.id AS snapshot_id,
  c."caseCode",
  c."applicantName",
  a."analysisType",
  a."confidenceLevel",
  s."knowledgeBaseVersion",
  ptv."version" AS procedure_version,
  apv."version" AS prompt_version,
  cv."version" AS checklist_version,
  s."legalDocumentIds",
  s."createdAt"
FROM "ProcedureAiAnalysisLegalSnapshot" s
JOIN "ProcedureAiAnalysis" a ON s."procedureAiAnalysisId" = a.id
JOIN "AdministrativeProcedureCase" c ON a."procedureCaseId" = c.id
LEFT JOIN "ProcedureTypeVersion" ptv ON s."procedureTypeVersionId" = ptv.id
LEFT JOIN "AiPromptVersion" apv ON s."promptVersionId" = apv.id
LEFT JOIN "ChecklistVersion" cv ON s."checklistVersionId" = cv.id
ORDER BY s."createdAt" DESC;
```

### 2. Kiểm tra metadata pháp lý được gắn trong payload của kết quả AI
```sql
SELECT 
  id AS analysis_id,
  "analysisType",
  "status",
  "outputPayload"->'legalKnowledgeMetadata' AS legal_metadata,
  "outputPayload"->'summary' AS ai_summary,
  "createdAt"
FROM "ProcedureAiAnalysis"
ORDER BY "createdAt" DESC
LIMIT 10;
```

### 3. Kiểm tra Nhật ký kiểm toán (Audit Logs) cho thao tác sinh Snapshot AI
```sql
SELECT 
  l.id AS log_id,
  c."caseCode",
  l."actionType",
  l."entityType",
  l."entityId",
  l."userId",
  l."createdAt"
FROM "ProcedureAuditLog" l
LEFT JOIN "AdministrativeProcedureCase" c ON l."procedureCaseId" = c.id
WHERE l."actionType" = 'AI_LEGAL_SNAPSHOT_CREATED'
ORDER BY l."createdAt" DESC;
```

### 4. Kiểm chứng nguyên tắc an toàn (Trạng thái và Cán bộ thụ lý hồ sơ không bị AI tự động thay đổi)
```sql
SELECT 
  id,
  "caseCode",
  "applicantName",
  "status",
  "assignedToId",
  "updatedAt"
FROM "AdministrativeProcedureCase"
WHERE id IN (
  SELECT DISTINCT "procedureCaseId" FROM "ProcedureAiAnalysis"
);
```

---

## 9. Backup/Rollback

Để bảo đảm an toàn vận hành tuyệt đối, quy trình sao lưu và phục hồi cho Phase 8D được quy định chi tiết:

* **Đóng gói mã nguồn (Source Code Backup):**
  * Toàn bộ mã nguồn hoàn thiện của Phase 8D được đóng gói tại mốc:  
    `legalflow-v2.7.5-ai-legal-snapshot-integration.zip`
* **Sao lưu cơ sở dữ liệu (Database Backup):**
  * File dump toàn bộ cơ sở dữ liệu trước và sau khi triển khai Phase 8D được lưu trữ tại:  
    `legalflow-db-backup-v2.7.5-ai-legal-snapshot-integration.sql`
* **Quy trình Phục hồi Mã nguồn (Source Rollback):**
  * Trường hợp phát sinh sự cố hệ thống cần khôi phục về trạng thái trước khi tích hợp Legal Snapshot, thực hiện lệnh Git checkout về tag hoàn thành Phase 8C:  
    `git checkout v2.7.4-legal-knowledge-readonly-ui-complete`
* **Quy trình Phục hồi Dữ liệu (Database Rollback):**
  * Nếu cần loại bỏ toàn bộ dữ liệu snapshot và audit log đã sinh trong quá trình thử nghiệm Phase 8D, thực hiện lệnh SQL dọn dẹp sạch sẽ (lưu ý không ảnh hưởng đến hồ sơ TTHC gốc):
    ```sql
    DELETE FROM "ProcedureAuditLog" WHERE "actionType" = 'AI_LEGAL_SNAPSHOT_CREATED';
    DELETE FROM "ProcedureAiAnalysisLegalSnapshot";
    ```
  * Hoặc khôi phục toàn bộ database từ file dump:  
    `psql -U postgres -d legalflow_uat < legalflow-db-backup-v2.7.5-ai-legal-snapshot-integration.sql`

---

## 10. Rủi ro còn lại & Khuyến nghị

Mặc dù Phase 8D đã hoàn thành xuất sắc các mục tiêu kỹ thuật, hệ thống vẫn ghi nhận một số rủi ro thực tế và điểm hạn chế cần lưu ý cho các giai đoạn kế tiếp:

1. **Phụ thuộc vào dữ liệu Seed/Foundation:** Hiện tại logic phân giải bối cảnh pháp lý active (`resolveActiveLegalContext`) đang dựa trên nền tảng dữ liệu được seed ban đầu. Khi có văn bản luật mới ban hành hoặc quy định địa phương thay đổi, cần có cán bộ chuyên môn kiểm tra và cập nhật trạng thái trong database.
2. **Chưa có giao diện quản trị UI CRUD cho phiên bản pháp lý:** Hệ thống hiện tại chỉ có giao diện Read-only UI (Phase 8C). Việc thêm mới, chỉnh sửa, phê duyệt hay kích hoạt (`ACTIVATE`/`ARCHIVE`) các phiên bản luật, prompt và checklist hiện vẫn phải thực hiện qua script hoặc thao tác DB trực tiếp.
3. **Chưa có bộ phân tích tác động cập nhật luật (Legal Update Impact Analysis):** Khi một văn bản pháp lý mới được kích hoạt thay thế văn bản cũ, hệ thống chưa có công cụ tự động quét và đánh giá tác động lên các hồ sơ đang xử lý dở dang (`IN_REVIEW`) hay các prompt AI hiện tại.
4. **Chưa tích hợp OCR/RAG nâng cao:** Quá trình AI rà soát hiện dựa trên tóm tắt văn bản hồ sơ và system prompt versioned; chưa có khả năng trích xuất toàn văn bản scan (OCR) và tra cứu ngữ nghĩa sâu (RAG) trên kho tài liệu pháp lý đầy đủ.
5. **Chưa có cảnh báo tự động quá hạn rà soát kho pháp lý:** Hệ thống chưa có scheduler/cron job tự động gửi cảnh báo nhắc nhở admin định kỳ rà soát lại hiệu lực của các văn bản pháp luật hay checklist đang active.
6. **Chưa có công thức tính toán phiên bản hóa cho nghĩa vụ tài chính:** Khi rà soát hồ sơ có liên quan đến tiền sử dụng đất hay thuế, hệ thống chưa có cơ chế quản lý phiên bản bảng giá đất hoặc công thức tính tiền theo từng giai đoạn.
7. **Yêu cầu UAT nghiệp vụ thực tế:** Trước khi đưa chức năng ra vận hành chính thức tại các Bộ phận Tiếp nhận và Trả kết quả (Một cửa), cần thực hiện các đợt kiểm thử chấp nhận người dùng (UAT) chi tiết với sự tham gia của các cán bộ địa chính chuyên sâu.

---

## 11. Kết luận

Phase 8D đã được triển khai hoàn tất và nghiệm thu toàn diện, đánh dấu bước hoàn thiện quan trọng trong kiến trúc Quản lý Tri thức Pháp lý của LegalFlow v2.

Đến thời điểm hiện tại, LegalFlow đã sở hữu một **chuỗi liên kết kiểm toán khép kín và vững chắc**:
* **Legal Knowledge Schema (Phase 8B):** Nền tảng dữ liệu cấu trúc quản lý phiên bản luật, thủ tục, prompt và checklist.
* **Legal Knowledge Read-only UI (Phase 8C):** Giao diện tra cứu minh bạch cho cán bộ chuyên môn và quản trị viên.
* **AI Review & Legal Snapshot (Phase 8D):** Trợ lý AI rà soát hồ sơ tự động gắn kết với snapshot bối cảnh pháp lý hiệu lực tại thời điểm xử lý.
* **Word/PDF Export Integration:** Báo cáo rà soát nội bộ đầy đủ thông tin kiểm toán pháp lý, sẵn sàng lưu hồ sơ và trình thẩm tra.

Hệ thống hoạt động ổn định, bảo đảm an toàn pháp lý cao nhất theo nguyên tắc Human-in-the-Loop và sẵn sàng bước vào các phase phát triển tiếp theo.

---

## 12. Đề xuất phase tiếp theo

Để tiếp tục hoàn thiện hệ sinh thái LegalFlow v2, xin đề xuất 3 lựa chọn cho mốc phát triển kế tiếp tùy theo ưu tiên của dự án:

### Lựa chọn 1: Phase 8E – Legal Update Impact Analysis (Quản lý tác động cập nhật pháp lý)
* **Mục tiêu:** Xây dựng công cụ phân tích tự động khi có một văn bản pháp luật mới (hoặc quy trình thủ tục mới) được ban hành và kích hoạt.
* **Giá trị:** Hệ thống sẽ tự động quét các hồ sơ TTHC đang trong trạng thái xử lý (`IN_REVIEW`, `SUPPLEMENT_REQUIRED`), đánh giá xem sự thay đổi pháp lý có làm ảnh hưởng đến tính hợp lệ của hồ sơ hay không, đồng thời gợi ý cán bộ rà soát lại kết quả AI cũ.

### Lựa chọn 2: Phase 7E-A – Thiết kế bảng tính dự kiến nghĩa vụ tài chính / tiền sử dụng đất
* **Mục tiêu:** Mở rộng luồng rà soát hồ sơ chuyển mục đích sử dụng đất và cấp GCN bằng việc thiết kế công cụ hỗ trợ tính toán sơ bộ nghĩa vụ tài chính (tiền sử dụng đất, lệ phí trước bạ) dựa trên Bảng giá đất và quy định hiện hành.
* **Giá trị:** Giúp cán bộ thụ lý có bảng tính dự kiến minh bạch, hỗ trợ đối chiếu với thông báo của cơ quan thuế, đồng thời tích hợp lưu vết phiên bản bảng giá đất vào Legal Snapshot.

### Lựa chọn 3: Phase 9A – Notification & Deadline Alert Plan (Kế hoạch quản lý thông báo và cảnh báo hạn xử lý)
* **Mục tiêu:** Thiết kế hệ thống thông báo nội bộ và cảnh báo tiến độ giải quyết hồ sơ TTHC cho cán bộ thụ lý và lãnh đạo phụ trách.
* **Giá trị:** Cảnh báo các hồ sơ sắp đến hạn giải quyết (`dueDate`), nhắc nhở cán bộ kiểm tra các kết quả AI rà soát đang chờ duyệt (`PENDING`), giúp nâng cao chỉ số cải cách hành chính và tránh trễ hạn hồ sơ.
