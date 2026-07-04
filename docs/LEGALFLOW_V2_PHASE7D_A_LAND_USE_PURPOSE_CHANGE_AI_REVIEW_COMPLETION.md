# Phase 7D-A Completion – AI rà soát hồ sơ chuyển mục đích sử dụng đất

**Mốc phát hành:** `v2.6.0-land-use-purpose-change-ai-review`  
**Ngày hoàn thành:** 04/07/2026  
**Trạng thái:** Đã triển khai, kiểm thử thành công và nghiệm thu kỹ thuật.

---

## 1. Mục tiêu Phase 7D-A

Phase 7D-A tập trung triển khai chức năng AI chuyên sâu hỗ trợ rà soát toàn diện hồ sơ thủ tục hành chính (TTHC) đối với nghiệp vụ **“Chuyển mục đích sử dụng đất”** trong module **Trợ lý thẩm tra hồ sơ TTHC**.

Các mục tiêu cốt lõi bao gồm:
- **Hỗ trợ chuyên môn sâu:** AI đóng vai trò như một người trợ lý chuyên môn, giúp cán bộ địa chính và cán bộ thẩm tra hồ sơ nhanh chóng đọc, tóm tắt, phân tích cấu trúc hồ sơ và gợi ý nội dung cần kiểm tra.
- **Nhận diện toàn diện nghiệp vụ:** AI hỗ trợ nhận diện loại đất hiện tại, mục đích xin chuyển, diện tích xin chuyển, thành phần hồ sơ đã có/thiếu, rủi ro pháp lý và nội dung cần xác minh thực địa.
- **Khuyến nghị kỹ càng, có căn cứ:** AI đưa ra khuyến nghị chuyên môn cụ thể, gợi ý hướng xử lý và danh sách câu hỏi cần yêu cầu người dân/chủ đầu tư giải trình, kèm các quy định pháp luật cần đối chiếu.
- **Tuân thủ tuyệt đối nguyên tắc "Human-in-the-Loop" (Cán bộ là trung tâm quyết định):**
  - AI **không** kết luận thay cán bộ rằng hồ sơ được hay không được chuyển mục đích sử dụng đất.
  - AI **không** tự động thay đổi trạng thái hồ sơ (`status`) hoặc thay đổi cán bộ thụ lý (`assignedToId`).
  - AI **không** tự ý phát hành văn bản, không tự ký số hay gửi thông báo/email cho người dân.
  - AI **không** tính tiền sử dụng đất trong phase này (chỉ cảnh báo các thông tin cần chuẩn bị cho bước tính nghĩa vụ tài chính sau này).

---

## 2. Phạm vi đã triển khai

Hệ thống đã triển khai hoàn chỉnh một chu trình kín từ tầng backend nghiệp vụ đến giao diện tương tác người dùng:
- **Backend AI Endpoints:** Xây dựng endpoint riêng biệt cho hồ sơ TTHC chuyển mục đích sử dụng đất trong `ProcedureCasesController`.
- **Prompt Builder Chuyên biệt:** Xây dựng phương thức `buildLandUsePurposeChangeReviewPrompt` chuyên nghiệp nghiệp vụ chuyển mục đích sử dụng đất.
- **Output JSON Schema có kiểm soát:** Kiểm soát chặt chẽ cấu trúc đầu ra (JSON schema-enforced) với 12 nhóm nghiệp vụ chuẩn hóa, bảo đảm không bị lỗi vỡ định dạng hay thiếu trường thông tin.
- **Lưu trữ Persistent & Audit Logging:** Lưu kết quả phân tích vào bảng `ProcedureAiAnalysis` và ghi nhận đầy đủ nhật ký hệ thống vào `ProcedureAuditLog`.
- **Frontend Tab "AI rà soát":** Tích hợp giao diện trực quan trên trang chi tiết hồ sơ TTHC (`ProcedureCaseDetail.tsx`), tự động nhận diện loại thủ tục để hiển thị khối kết quả chia nhóm rõ ràng.
- **Thao tác Nghiệp vụ Cán bộ:**
  - Cán bộ có thể chấp nhận/từ chối kết quả AI.
  - Cán bộ có thể chấp nhận và lưu kết quả vào Ghi chú hồ sơ (`ProcedureNote`).
  - Cán bộ có thể chấp nhận và tạo danh sách công việc (`ProcedureChecklistItem`) từ gợi ý AI.
- **Cơ chế Fallback An toàn:** Mock/fallback structured output hoạt động mượt mà khi thiếu AI key hoặc output từ LLM không hợp lệ, bảo đảm không bị lỗi 500 hay gián đoạn hệ thống.
- **Độc lập và bảo toàn luồng cũ:** Giữ nguyên và bảo đảm hoạt động ổn định cho luồng AI rà soát cấp GCN lần đầu đã có từ Phase 7C-B.

---

## 3. Backend đã triển khai

Tầng Backend NestJS được điều chỉnh và mở rộng chặt chẽ:
- **Cập nhật Service & Builder:**
  - Cập nhật `ProcedureAiPromptBuilder` với hàm tạo prompt chuyên sâu cho chuyển mục đích sử dụng đất.
  - Cập nhật `ProcedureAiService` bổ sung logic `reviewLandUsePurposeChange` và cập nhật hàm `acceptAnalysis` hỗ trợ đa thủ tục.
  - Cập nhật controller liên quan (`ProcedureCasesController`).
- **Endpoint mới:**
  `POST /api/procedure-cases/:id/ai/land-use-purpose-change-review`
- **Kiểm soát Phạm vi Nghiệp vụ:**
  - Kiểm tra và chỉ cho phép chạy với hồ sơ thuộc loại có mã: `LAND_USE_PURPOSE_CHANGE` hoặc group: `CHUYEN_MUC_DICH_SDD`.
  - Nếu không đúng loại thủ tục thì trả lỗi rõ ràng (ví dụ: `BadRequestException` với thông báo cụ thể), tuyệt đối không trả lỗi 500 cho giao diện.
- **Thu thập Input toàn diện:**
  Tổng hợp dữ liệu đầu vào từ các mô hình nền tảng:
  - `AdministrativeProcedureCase` (thông tin chung hồ sơ);
  - `ProcedureType` (cấu hình loại thủ tục);
  - `ProcedureDocument` (danh sách tài liệu đã đính kèm);
  - `ProcedureChecklistItem` (danh sách công việc rà soát);
  - `ProcedureNote` (ghi chú thẩm tra trước đó).
- **Lưu trữ & Kiểm toán:**
  - Lưu kết quả rà soát vào `ProcedureAiAnalysis` với loại phân tích tương ứng.
  - Ghi nhật ký vào `ProcedureAuditLog`.
  - **Tuân thủ chuẩn bảo mật JWT:** Dùng đúng ID người dùng đang đăng nhập từ JWT (`req.user.id`). Tuyệt đối không fallback sang tài khoản admin hay cán bộ khác để ghi audit thay.
- **Bảo toàn dữ liệu nghiệp vụ:**
  - Không thay đổi trường `AdministrativeProcedureCase.status`.
  - Không thay đổi trường `assignedToId`.

---

## 4. Frontend đã triển khai

Giao diện người dùng (React / Vite) được điều chỉnh linh hoạt và tuân thủ giới hạn chức năng:
- **Cập nhật API & Types:**
  - Cập nhật `src/lib/procedureCasesApi.ts` với hàm `runLandUsePurposeChangeReview`.
  - Cập nhật `src/types/procedure.ts` bổ sung các định nghĩa kiểu dữ liệu cho `purposeChangeReview`, `analysisType` và các trường nghiệp vụ mới.
- **Trang Chi tiết Hồ sơ (`ProcedureCaseDetail.tsx`):**
  - Tab “AI rà soát” có khả năng tự nhận diện loại thủ tục của hồ sơ đang xem.
  - Với hồ sơ chuyển mục đích sử dụng đất, hiển thị nút chuyên biệt: **“🤖 AI rà soát chuyển mục đích sử dụng đất”**.
  - Với hồ sơ cấp GCN lần đầu, vẫn giữ nguyên nút **“🤖 AI rà soát cấp GCN lần đầu”** và luồng thao tác cũ.
  - Với hồ sơ thuộc các loại thủ tục chưa hỗ trợ, hiển thị thông báo tính năng sẽ được triển khai trong các phase sau.
- **Hiển thị Kết quả theo Nhóm Rõ ràng:**
  Kết quả rà soát AI chuyển mục đích được hiển thị phân mảnh mạch lạc thành các card chức năng:
  1. *Tóm tắt hồ sơ*;
  2. *Người sử dụng đất*;
  3. *Thửa đất*;
  4. *Loại đất hiện tại và mục đích xin chuyển*;
  5. *Thành phần hồ sơ* (tài liệu đã có / thiếu / đề xuất bổ sung);
  6. *Quy hoạch/kế hoạch sử dụng đất/hiện trạng*;
  7. *Nghĩa vụ tài chính cần kiểm tra* (ghi chú *"Chưa tính tiền sử dụng đất trong phase này"*);
  8. *Rủi ro*;
  9. *Khuyến nghị*;
  10. *Câu hỏi cần bổ sung*;
  11. *Checklist gợi ý*.
- **Kiểm soát Nút thao tác (No Forbidden Buttons):**
  - Có nút chấp nhận / lưu ghi chú;
  - Có nút chấp nhận / tạo checklist;
  - Có nút từ chối;
  - **Không có nút xuất Word/PDF** cho chuyển mục đích trong phase này (giao diện hiển thị thông báo ghi chú rõ tính năng xuất phiếu sẽ hỗ trợ ở phase sau);
  - **Không có nút kết luận** được/không được chuyển mục đích;
  - **Không có nút tính tiền** sử dụng đất;
  - **Không có nút phát hành văn bản**.

---

## 5. Output AI đã chuẩn hóa

Cấu trúc JSON trả về từ Trợ lý AI được định dạng, chuẩn hóa và kiểm soát chặt chẽ với các trường thuộc tính:
- `disclaimer`: Thông điệp cảnh báo bắt buộc;
- `analysisType`: Luôn gán giá trị `LAND_USE_PURPOSE_CHANGE_REVIEW`;
- `summary`: Tóm tắt bối cảnh hồ sơ;
- `procedureType`: "Chuyển mục đích sử dụng đất";
- `applicantReview`: Nhận diện thông tin người sử dụng đất và điểm cần xác minh;
- `landParcelReview`: Thông tin thửa đất, diện tích toàn thửa, diện tích xin chuyển;
- `purposeChangeReview`: Phân tích chuyên sâu loại đất hiện tại, mục đích xin chuyển, sự phù hợp quy hoạch/kế hoạch;
- `documentCompletenessReview`: Kiểm tra danh mục tài liệu đã có, tài liệu thiếu, tài liệu cần bổ sung;
- `planningAndCurrentStatusReview`: Nội dung cần đối chiếu quy hoạch, hiện trạng, tranh chấp, ranh giới;
- `financialObligationNotice`: Ghi nhận trạng thái `NOT_CALCULATED_IN_THIS_PHASE` kèm danh sách dữ liệu cần chuẩn bị cho bước tính tiền;
- `legalBasisToCheck`: Danh sách các quy định pháp luật cần cán bộ đối chiếu;
- `riskFlags`: Cảnh báo rủi ro pháp lý lớn;
- `recommendations`: Khuyến nghị hướng xử lý cho cán bộ;
- `recommendedNextQuestions`: Câu hỏi gợi ý yêu cầu giải trình;
- `officerChecklist`: Checklist việc cần làm tại thực địa/hồ sơ;
- `confidenceLevel`: Mức độ tự tin của phân tích (`HIGH` / `MEDIUM` / `LOW`);
- `requiresOfficerVerification`: Luôn gán `true`.

---

## 6. Nguyên tắc pháp lý/an toàn đã bảo đảm

Hệ thống tuân thủ triệt để các nguyên tắc an toàn hành chính và chỉ đạo pháp lý:
- AI chỉ đóng vai trò hỗ trợ rà soát toàn diện, phân tích thông tin hồ sơ;
- AI **không kết luận thay cán bộ** rằng hồ sơ được hay không được chuyển mục đích;
- AI chỉ đưa ra nội dung cần kiểm tra, rủi ro cần lưu ý và khuyến nghị để cán bộ xem xét, quyết định;
- AI **không tự đổi** `AdministrativeProcedureCase.status`;
- AI **không tự đổi** `assignedToId`;
- AI **không tự phát hành văn bản**, không tự ký số, không tự gửi email/văn bản cho công dân;
- AI **không tính tiền sử dụng đất** trong phase này, chỉ cảnh báo dữ liệu cần chuẩn bị cho bước nghĩa vụ tài chính ở Phase 7E;
- Mọi kết quả phân tích hiển thị trên giao diện và trong báo cáo đều gắn nhãn bắt buộc:
  **“BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA”**;
- **Đảm bảo tính chuẩn xác và an toàn trong diễn đạt pháp lý:**
  - Prompt không khẳng định "căn cứ pháp lý mới nhất" hay "căn cứ áp dụng chắc chắn" một cách tuyệt đối;
  - Prompt và output ghi nhận rõ: *"Kết quả AI không thay thế việc cán bộ kiểm tra văn bản pháp luật hiện hành, văn bản sửa đổi/bổ sung và quy trình nội bộ địa phương tại thời điểm xử lý hồ sơ"*;
- Thao tác chấp nhận (`accept`) hoặc từ chối (`reject`) đều được ghi nhận vào nhật ký kiểm toán (`ProcedureAuditLog`);
- Kết quả AI bị từ chối (`REJECTED`) được lưu vết lại trong lịch sử, không bị xóa bỏ khỏi cơ sở dữ liệu.

---

## 7. Căn cứ pháp lý trong prompt

Prompt hướng dẫn Trợ lý AI rà soát dựa trên khung pháp lý hiện hành lĩnh vực đất đai:
- **Luật Đất đai năm 2024** (đặc biệt các Điều 116, 121, 122 quy định về điều kiện, căn cứ chuyển mục đích sử dụng đất);
- **Nghị định 102/2024/NĐ-CP** quy định chi tiết thi hành một số điều của Luật Đất đai;
- **Nghị định 103/2024/NĐ-CP** về tiền sử dụng đất, tiền thuê đất (chỉ được nhắc ở mức cảnh báo nội dung nghĩa vụ tài chính cần kiểm tra, chưa lập bảng tính tiền);
- **Quyết định công bố thủ tục hành chính** lĩnh vực đất đai của Bộ Tài nguyên và Môi trường;
- **Quy hoạch, kế hoạch sử dụng đất** hàng năm cấp huyện đã được phê duyệt;
- **Quy trình nội bộ địa phương** tại thời điểm giải quyết thủ tục (nếu có);
- **Các văn bản sửa đổi, bổ sung, thay thế** (nếu có);
- **Lưu ý định vị pháp lý:** Nêu rõ đây là nhóm căn cứ pháp lý cần cán bộ kiểm tra và đối chiếu, không phải kết luận áp dụng pháp luật chính thức hay tự động thay thế trách nhiệm thẩm định của cơ quan nhà nước có thẩm quyền.

---

## 8. Kết quả test/build

Toàn bộ hệ thống đã trải qua quy trình kiểm thử và kiểm chứng kỹ thuật nghiêm ngặt:
- **Prisma Tools:**
  - `npx prisma generate`: ✔ Hoàn thành (Prisma Client v5.22.0 generated successfully);
  - `npx prisma migrate status`: ✔ Hoàn thành (Database schema is up to date, no pending migrations).
- **Backend Build & Unit Tests:**
  - Backend `npm test`: ✔ **PASSED 100%** (8 suites, 39 tests passed);
  - Backend `npm run build`: ✔ **PASSED** (`nest build` thành công, 0 lỗi TypeScript).
- **Frontend Build:**
  - Frontend `npm run build`: ✔ **PASSED** (`vite build` production bundle thành công, 3174 modules transformed).
- **Kiểm thử thủ công (Manual E2E Testing):**
  - Thực hiện kiểm thử trực tiếp trên môi trường local qua địa chỉ `http://kevindoan-legalflow.local:8080`;
  - Tạo và mở hồ sơ TTHC thuộc loại “Chuyển mục đích sử dụng đất”;
  - Kích hoạt tính năng "AI rà soát chuyển mục đích sử dụng đất", kết quả trả về hiển thị đầy đủ, cấu trúc chia nhóm rõ ràng theo 11 khối card trực quan;
  - Kiểm chứng thao tác Accept & Lưu ghi chú: ✔ Hoạt động chính xác, bản ghi chú được bổ sung vào lịch sử hồ sơ;
  - Kiểm chứng thao tác Accept & Tạo checklist: ✔ Hoạt động chính xác, các mục công việc được tạo thành checklist để cán bộ đánh dấu;
  - Kiểm chứng thao tác Reject: ✔ Hoạt động chính xác, trạng thái chuyển sang bị từ chối và ghi lại vết;
  - Kiểm chứng Audit Log: ✔ Nhật ký hệ thống ghi nhận chính xác thao tác gắn với ID tài khoản cán bộ đang đăng nhập;
  - Kiểm chứng tính bất biến trạng thái: ✔ Trạng thái hồ sơ (`status`) và người thụ lý (`assignedToId`) giữ nguyên, không tự đổi;
  - Kiểm chứng không tính tiền: ✔ Không có bảng tính tiền sử dụng đất, chỉ hiển thị thông báo phase sau;
  - Kiểm chứng bảo toàn luồng cũ: ✔ Luồng AI rà soát cấp GCN lần đầu cũ vẫn hoạt động mượt mà;
  - Kiểm chứng module độc lập: ✔ Module `LegalCase` (quản lý vụ việc/đơn thư cũ) không bị ảnh hưởng.

---

## 9. Lệnh SQL kiểm chứng

Để kiểm tra và xác minh tính chính xác của dữ liệu sinh ra trong Phase 7D-A, quản trị viên có thể sử dụng các câu lệnh truy vấn SQL dưới đây trên cơ sở dữ liệu PostgreSQL:

### A. Kiểm tra bản ghi kết quả AI rà soát Chuyển mục đích sử dụng đất
```sql
SELECT 
  id, 
  "procedureCaseId", 
  "analysisType", 
  status, 
  "confidenceLevel", 
  "createdById", 
  "reviewedById", 
  "createdAt"
FROM "ProcedureAiAnalysis"
WHERE "analysisType" = 'LAND_USE_PURPOSE_CHANGE_REVIEW'
ORDER BY "createdAt" DESC;
```

### B. Kiểm tra nhật ký kiểm toán (Audit Log) cho thao tác rà soát Chuyển mục đích
```sql
SELECT 
  id, 
  "procedureCaseId", 
  "userId", 
  "actionType", 
  details, 
  "createdAt"
FROM "ProcedureAuditLog"
WHERE "actionType" IN (
  'AI_REVIEW_REQUESTED', 
  'AI_REVIEW_ACCEPTED', 
  'AI_REVIEW_REJECTED'
)
ORDER BY "createdAt" DESC;
```

### C. Kiểm tra trạng thái hồ sơ không bị tự động thay đổi
```sql
SELECT 
  id, 
  code, 
  title, 
  status, 
  "assignedToId", 
  "updatedAt"
FROM "AdministrativeProcedureCase"
WHERE id = '<ID_HOSP_HO_SO_TEST>';
```

### D. Kiểm tra ghi chú được tạo tự động khi cán bộ chấp nhận kết quả AI
```sql
SELECT 
  id, 
  "procedureCaseId", 
  content, 
  "createdById", 
  "createdAt"
FROM "ProcedureNote"
WHERE content LIKE '%[AI Rà soát - Chuyển mục đích sử dụng đất]%'
ORDER BY "createdAt" DESC;
```

### E. Kiểm tra checklist công việc được tạo từ gợi ý AI
```sql
SELECT 
  id, 
  "procedureCaseId", 
  title, 
  "isCompleted", 
  "createdAt"
FROM "ProcedureChecklistItem"
WHERE "procedureCaseId" = '<ID_HOSP_HO_SO_TEST>'
ORDER BY "createdAt" DESC;
```

---

## 10. Backup/rollback

Đảm bảo an toàn hệ thống và khả năng khôi phục nguyên trạng theo quy trình chuẩn:
- **Đóng gói mã nguồn (Source Backup):**
  - Tên gói ZIP gợi ý: `legalflow-v2.6.0-land-use-purpose-change-ai-review.zip`;
  - Lưu trữ bản chụp mã nguồn tại mốc tag `v2.6.0-land-use-purpose-change-ai-review`.
- **Sao lưu cơ sở dữ liệu (Database Backup):**
  - Tên file SQL backup gợi ý: `legalflow-db-backup-v2.6.0-land-use-purpose-change-ai-review.sql`;
  - Thực hiện thông qua tiện ích `pg_dump` trước khi triển khai lên môi trường UAT/Production.
- **Quy trình Rollback Mã nguồn:**
  - Nếu xuất hiện sự cố nghiêm trọng, có thể hoàn nguyên mã nguồn về mốc tag trước đó bằng lệnh:
    `git checkout v2.5.7-land-first-certificate-review-export-complete`
- **Quy trình Rollback Cơ sở dữ liệu:**
  - Do Phase 7D-A **không tạo migration mới** (tận dụng hoàn hảo cấu trúc `ProcedureAiAnalysis` đã thiết kế ở Phase 7C-B), cấu trúc schema của database được bảo toàn tuyệt đối.
  - Rollback cơ sở dữ liệu trong phase này thường chỉ áp dụng khi cần dọn dẹp, xóa bỏ các bản ghi test/audit/analysis phát sinh trong quá trình thử nghiệm bằng lệnh DELETE hoặc khôi phục từ file backup `.sql`.

---

## 11. Rủi ro còn lại

Mặc dù tính năng đã hoạt động ổn định và tuân thủ các quy định nghiệp vụ, hệ thống vẫn ghi nhận một số điểm cần lưu ý trong các giai đoạn tiếp theo:
- **Giới hạn mức hỗ trợ:** AI mới thực hiện rà soát chuyển mục đích sử dụng đất ở mức hỗ trợ chuyên môn, phân tích cấu trúc và gợi ý kiểm tra;
- **Phụ thuộc chất lượng dữ liệu đầu vào:** Độ chính xác và tính sâu sắc của khuyến nghị AI phụ thuộc lớn vào sự đầy đủ của thông tin hồ sơ và mô tả tài liệu đầu vào (`inputSnapshot`);
- **Chưa tích hợp OCR tài liệu gốc:** Hiện hệ thống chưa nhận dạng ký tự tự động (OCR) trực tiếp từ file scan bản gốc GCN hoặc Đơn xin chuyển mục đích;
- **Chưa có RAG pháp lý chính thức:** Chưa kết nối với kho tri thức pháp lý tự động cập nhật (Legal Knowledge RAG) để đối chiếu trực tiếp từng câu chữ điều khoản;
- **Chưa tự động đối chiếu bản đồ quy hoạch:** Việc kiểm tra sự phù hợp với quy hoạch/kế hoạch sử dụng đất hàng năm hiện vẫn dựa trên thông tin kê khai và gợi ý cán bộ thẩm định thực địa;
- **Chưa tính nghĩa vụ tài chính:** Chưa thiết lập công thức hay lập bảng tính dự kiến tiền sử dụng đất phải nộp;
- **Chưa xuất phiếu rà soát Word/PDF:** Tính năng xuất file in cho thủ tục chuyển mục đích chưa được kích hoạt trong phase này;
- **Yêu cầu nghiệm thu thực tế:** Cần thực hiện kiểm thử người dùng (UAT) chuyên sâu với cán bộ địa chính và bộ phận một cửa trước khi áp dụng vào môi trường thực tế.

---

## 12. Kết luận

- **Phase 7D-A đã hoàn thành xuất sắc, đúng mục tiêu và phạm vi kỹ thuật đề ra.**
- Hiện tại, LegalFlow đã sở hữu Trợ lý AI rà soát chuyên sâu cho **hai nhóm thủ tục đất đai quan trọng nhất**:
  1. *Cấp Giấy chứng nhận quyền sử dụng đất lần đầu*;
  2. *Chuyển mục đích sử dụng đất*.
- Luồng cấp GCN lần đầu đã được trang bị đầy đủ tính năng xuất phiếu rà soát nội bộ Word/PDF.
- Module TTHC cho thấy kiến trúc vững chắc, tính mở rộng cao và tuyệt đối an toàn với dữ liệu vụ việc cũ.
- Hệ thống đã sẵn sàng để chuyển sang phase tiếp theo ngay sau khi tài liệu completion này được commit và gắn tag.

---

## 13. Đề xuất phase tiếp theo

Dựa trên lộ trình phát triển và nhu cầu thực tế của nghiệp vụ thẩm tra hồ sơ TTHC, đề xuất 4 phương án cho phase tiếp theo để Quý lãnh đạo xem xét và lựa chọn:

1. **Phase 7D-B – Xuất phiếu rà soát chuyển mục đích sử dụng đất Word/PDF:**
   - Xây dựng mẫu phiếu rà soát nội bộ `.docx` và trang in A4 preview chuyên biệt cho thủ tục chuyển mục đích sử dụng đất (tương tự Phase 7C-C).
2. **Phase 7E-A – Thiết kế bảng tính dự kiến nghĩa vụ tài chính/tiền sử dụng đất:**
   - Xây dựng mô hình dữ liệu và công thức tạm tính tiền sử dụng đất, tiền thuê đất khi chuyển mục đích hoặc công nhận quyền sử dụng đất theo Nghị định 103/2024/NĐ-CP.
3. **Phase 8A – Legal Knowledge Versioning & Update Control:**
   - Xây dựng cơ sở dữ liệu quản lý phiên bản văn bản pháp luật, kiểm soát hiệu lực và cho phép cập nhật bộ quy tắc rà soát AI khi có văn bản sửa đổi, bổ sung.
4. **Phase 9A – Notification & Deadline Alert Plan:**
   - Triển khai hệ thống thông báo, cảnh báo hạn xử lý hồ sơ TTHC cho cán bộ thụ lý và lãnh đạo phụ trách, ngăn ngừa trễ hạn giải quyết thủ tục hành chính.

---
*Tài liệu được tạo tự động bởi LegalFlow Engineering Team. Không sửa đổi nội dung thủ công ngoài quy trình phát hành.*
