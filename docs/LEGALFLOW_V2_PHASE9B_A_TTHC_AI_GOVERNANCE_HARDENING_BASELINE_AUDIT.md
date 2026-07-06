# LEGALFLOW V2 - PHASE 9B-A

# TTHC AI GOVERNANCE HARDENING BASELINE AUDIT

**Ngày phát hành:** 06/07/2026  
**Mô-đun:** Quản trị Trí tuệ Nhân tạo & Thủ tục Hành chính Đất đai (TTHC AI Governance & Hardening Track)  
**Trạng thái:** ĐÃ HOÀN THÀNH (100% Comprehensive Baseline Audit & Findings Report)  

---

## 1. Purpose

Tài liệu này công bố kết quả **Rà soát Đánh giá Cơ sở (Baseline Hardening Audit)** cho toàn bộ hệ thống trí tuệ nhân tạo (AI) hỗ trợ xử lý thủ tục hành chính (TTHC) về đất đai và Quản trị phiên bản pháp lý (Legal Version Governance) trong LegalFlow V2.

Mục tiêu của đợt kiểm toán kỹ thuật này là:
1. Thẩm định mức độ tuân thủ các nguyên tắc quản trị AI hành chính nhà nước (Human-in-the-Loop, AI chỉ hỗ trợ, không kết luận thay cán bộ, không tự đổi trạng thái hồ sơ).
2. Kiểm tra chéo độ kiên cố của hàng rào bảo mật phân quyền (RBAC) trên cả Backend API và Frontend UI.
3. Nhận diện các điểm yếu, lỗ hổng tiềm ẩn hoặc sự bất nhất trong xử lý ngoại lệ (Error Handling), xuất khẩu văn bản (Word/PDF Export) và lưu vết kiểm toán (Audit Trail).
4. Lập danh mục phát hiện (Findings) và phân loại theo 4 mức độ nghiêm trọng để làm cơ sở cho backlog gia cố ở các phase tiếp theo.

---

## 2. Audit Scope

Phạm vi rà soát kiểm toán bao phủ toàn bộ 10 lĩnh vực trọng tâm của hệ sinh thái TTHC AI Governance:

1. **AI Output Governance**: Rà soát các điểm phát sinh kết quả AI (AI Review Cấp GCN lần đầu, AI Review Chuyển mục đích sử dụng đất, bóc tách Checklist, sinh dự thảo văn bản, xuất Word/PDF, phân tích tác động pháp lý).
2. **Case Safety**: Thẩm định tính an toàn, bất biến của hồ sơ TTHC thực tế khi chạy AI Review, chạy mô phỏng Shadow Testing, xuất file hay kích hoạt/hoàn tác version pháp lý.
3. **Legal Snapshot Integrity**: Kiểm tra cơ chế gắn kết bản chụp căn cứ pháp lý, tính bất biến sau khi luật thay đổi và khả năng truy vết (Traceability).
4. **Permission / RBAC**: Kiểm toán phân quyền 4 vai trò (`ADMIN`, `MANAGER`, `STAFF`, `VIEWER`) từ giao diện người dùng đến bộ bảo vệ (Guard/Decorator) trên các endpoint Backend API.
5. **API Error Handling**: Đánh giá khả năng xử lý các mã trạng thái HTTP (204 No Content, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error, Network Timeout) và tính bồi hoàn giao diện (UI Resilience).
6. **Export Word/PDF Safety**: Thẩm định độ an toàn, tính trang trọng và sự hiện diện của cảnh báo pháp lý trên các file văn bản tải về.
7. **Legal Version Governance**: Kiểm tra cơ chế chống trùng lặp version hiệu lực (`ACTIVE`), logic chuỗi chuyển đổi trạng thái và các mảng nhật ký (`workflowHistory`, `activationHistory`, `rollbackHistory`, `simulations`, `draftVersions`).
8. **Audit Trail**: Đánh giá độ toàn diện của dữ liệu ghi vết (Actor, Timestamp, Reason/Note, Affected Versions, Safety Statement).
9. **UI Governance**: Rà soát các modal xác nhận nhiều bước, cảnh báo đỏ, trạng thái loading/error và hiển thị theo vai trò.
10. **Test Coverage**: Kiểm tra độ phủ của bộ kiểm thử tự động (Unit Test / Integration Test) đối với các ranh giới bảo mật và xử lý ngoại lệ.

---

## 3. Files / Modules Reviewed

Đội ngũ kiểm toán đã thực hiện đọc sâu mã nguồn (Deep Code Review) trên 08 nhóm cấu phần hệ thống:

1. **Backend Controllers & Services (`legalflow-backend/src`)**:
   - `administrative-procedures/procedure-cases.controller.ts` (API điều phối hồ sơ TTHC & AI Review).
   - `administrative-procedures/ai/procedure-ai.service.ts` (Dịch vụ lõi xử lý AI Review Cấp GCN & Chuyển mục đích).
   - `administrative-procedures/ai/procedure-docx.helper.ts` (Trình kiến tạo báo cáo thẩm tra Word `.docx`).
   - `legal-knowledge/legal-knowledge.controller.ts` (API điều phối kho kiến thức, workflow, activation, rollback).
   - `legal-knowledge/legal-knowledge.service.ts` (Dịch vụ lõi quản trị version pháp lý).
   - `common/roles.guard.ts` & `common/roles.decorator.ts` (Hệ thống Guard kiểm soát phân quyền RBAC).
   - `cases/cases.controller.ts` & `cases/docx-templates.helper.ts` (Dịch vụ hồ sơ chung & mẫu dự thảo Word).
2. **Frontend Pages & Components (`src`)**:
   - `pages/CaseDetail.tsx` (Giao diện chi tiết hồ sơ TTHC, thẻ AI Review, thẻ Legal Snapshot, thẻ Dự thảo).
   - `pages/LegalKnowledgePage.tsx` (Giao diện Kho căn cứ pháp lý, 6 tabs, Modal 8, 10, 11, 12).
   - `lib/rbac.ts` (Helper kiểm tra thẩm quyền UI theo vai trò).
3. **Types & Interfaces (`src/types`)**:
   - `types/legalKnowledge.ts` (Định nghĩa cấu trúc dữ liệu version, log, snapshot, history).
   - `types/procedure.ts` (Định nghĩa cấu trúc hồ sơ TTHC và bài phân tích AI).
4. **API Clients (`src/lib`)**:
   - `lib/legalKnowledgeApi.ts` (Axios client gọi API quản trị version, kích hoạt, hoàn tác, hậu kiểm).
   - `lib/casesApi.ts` (Axios client gọi API hồ sơ TTHC và AI review).
5. **Documentation (`docs`)**:
   - Rà soát đối chiếu với toàn bộ tài liệu thiết kế từ Phase 8F đến Phase 9A.
6. **Export Modules**:
   - Rà soát các helper sinh file Word (`procedure-docx.helper.ts`, `docx-templates.helper.ts`).
7. **Legal Knowledge Modules**:
   - Rà soát logic truy xuất văn bản luật, phiên bản thủ tục, prompt và checklist.
8. **AI Review Modules**:
   - Rà soát logic xây dựng prompt (`procedure-ai-prompt.builder.ts`) và xử lý phản hồi từ Gemini Provider.

---

## 4. Key Findings Summary

Dưới đây là Bảng tổng hợp 06 phát hiện trọng yếu (Key Findings) rút ra từ đợt kiểm toán baseline hardening:

| Finding ID | Area (Lĩnh vực) | Severity | Description (Mô tả phát hiện) | Evidence / File (Minh chứng) | Risk (Rủi ro tiềm ẩn) | Recommended Fix (Khuyến nghị gia cố) | Proposed Phase |
| :---: | :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| `AUD-01` | **Permission / RBAC** | 🔴 **Critical** | Thiếu decorator `@Roles(...)` trên các endpoint xử lý AI Review, tạo hồ sơ và xuất văn bản trong `ProcedureCasesController`. | `procedure-cases.controller.ts`<br>(Lines 33-188) | Mặc dù có `@UseGuards(JwtAuthGuard, RolesGuard)`, do thiếu `@Roles(...)`, `RolesGuard` trả về `true` cho mọi user đã đăng nhập $\rightarrow$ `VIEWER` hoặc `STAFF` có thể gọi API chạy AI Review hoặc sửa checklist trái phép. | Bổ sung tường minh `@Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)` cho các endpoint nghiệp vụ và `@Roles(Role.ADMIN, Role.MANAGER)` cho các endpoint nhạy cảm. | `Phase 9B-C` |
| `AUD-02` | **AI Output Governance** | 🟠 **High** | Sự bất nhất về nội dung banner cảnh báo pháp lý AI trên các module xuất văn bản Word (.docx). | `docx-templates.helper.ts` (Line 131) vs.<br>`procedure-docx.helper.ts` (Line 126) | Helper dự thảo chung dùng chuỗi `"⚠️ BẢN NHÁP AI – CHƯA PHÁT HÀNH"`, chưa đồng bộ với chuẩn bắt buộc của hệ thống là `"⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA"`. | Chuẩn hóa 100% banner cảnh báo trên toàn bộ các helper sinh Word, PDF và UI về một chuỗi tiêu chuẩn duy nhất theo quy định. | `Phase 9B-B` |
| `AUD-03` | **Legal Version Governance** | 🟠 **High** | Thiếu cơ chế khóa đồng thời (Concurrency Lock) hoặc Unique Constraint cấp DB chống tạo trùng lặp version `ACTIVE`. | `legal-knowledge.service.ts`<br>(Method `activateDraftVersion`) | Nếu 02 Lãnh đạo cùng thao tác kích hoạt 02 bản nháp khác nhau tại cùng một mili-giây under high load, có nguy cơ xảy ra Race Condition dẫn đến 02 bản cùng `ACTIVE`. | Bổ sung cơ chế Serializable Transaction hoặc gia cố Unique Index trên CSDL (hoặc khóa ứng dụng) đảm bảo tính độc tôn của version `ACTIVE`. | `Phase 9B-E` |
| `AUD-04` | **API Error Handling** | 🟡 **Medium** | Xử lý trạng thái rỗng (Empty States) cho phản hồi API 204 No Content hoặc danh sách rỗng trên UI chưa được chuẩn hóa đồng bộ. | `LegalKnowledgePage.tsx`<br>& `CaseDetail.tsx` | Khi chưa có bài rà soát AI hoặc chưa có log cập nhật, một số khu vực UI hiển thị trống hoặc text đơn giản, thiếu icon trực quan và lời nhắn hướng dẫn thao tác. | Chuẩn hóa component `EmptyState` dùng chung, hiển thị trực quan cho 100% các danh sách và thẻ dữ liệu khi API trả về rỗng. | `Phase 9B-D` |
| `AUD-05` | **API Error Handling** | 🟡 **Medium** | Hiển thị thông báo lỗi khi gặp HTTP Status 401/403/500 trên một số Modal thao tác còn phụ thuộc vào `alert()` cơ bản. | `LegalKnowledgePage.tsx`<br>(Modal 8, 10, 11, 12 handlers) | Khi gọi API kích hoạt hay hoàn tác thất bại do lỗi quyền (403) hoặc lỗi server (500), UI hiển thị alert browser box chưa thân thiện với trải nghiệm người dùng hành chính. | Thay thế `alert()` bằng hệ thống Toast Notification hoặc inline Error Banner màu đỏ trực quan ngay bên trong Modal. | `Phase 9B-D` |
| `AUD-06` | **Test Coverage** | 🟢 **Low** | Thiếu bộ kiểm thử tự động (Unit / Integration Tests) chuyên biệt rà soát ranh giới bảo mật RBAC cho cụm API TTHC AI. | `legalflow-backend/src/...` | Khi mở rộng tính năng trong tương lai, lập trình viên có thể vô tình bỏ quên decorator `@Roles(...)` mà không có automated test phát hiện. | Xây dựng bộ test suite `procedure-cases.rbac.spec.ts` kiểm chứng 100% các endpoint phải trả về 403 Forbidden khi gọi bằng token `VIEWER`. | `Phase 9B-G` |

---

## 5. Critical Findings

### 🔴 `AUD-01`: Lỗ hổng bảo mật thiếu Decorator `@Roles(...)` trên `ProcedureCasesController`
- **Mô tả chi tiết**: Trong file `procedure-cases.controller.ts`, bộ bảo vệ `@UseGuards(JwtAuthGuard, RolesGuard)` được khai báo ở cấp độ Class Controller (Line 26). Tuy nhiên, trên toàn bộ 15 phương thức xử lý (handler methods) như `createCase`, `updateCase`, `addNote`, `addChecklist`, `updateChecklist`, `runLandFirstCertificateReview`, `runLandUsePurposeChangeReview`, `exportReviewDocx`, `exportPurposeChangeReviewDocx`, v.v., **hoàn toàn không khai báo decorator `@Roles(...)`**.
- **Cơ chế gây lỗi (Root Cause)**: Khi kiểm tra mã nguồn của `RolesGuard` (`roles.guard.ts`, Line 16-22):
  ```typescript
  const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);
  if (!requiredRoles) {
    return true; // <-- NẾU KHÔNG CÓ @Roles, GUARD TỰ ĐỘNG CHO PHÉP TRUY CẬP!
  }
  ```
  Do không tìm thấy metadata `ROLES_KEY`, `RolesGuard` lập tức trả về `true` cho bất kỳ yêu cầu nào có kèm Token JWT hợp lệ.
- **Tác động & Rủi ro**: Tài khoản có vai trò Người xem (`VIEWER`) hoặc các tài khoản bị hạn chế quyền vẫn có thể gửi request trực tiếp qua cURL / Postman để gọi API chạy AI Review (`POST /procedure-cases/:id/ai/...`), thêm/sửa checklist hoặc tạo mới hồ sơ TTHC trái với ma trận phân quyền quy định.
- **Khuyến nghị khắc phục**: Bổ sung ngay decorator `@Roles(...)` một cách tường minh cho từng endpoint trong `ProcedureCasesController` (ví dụ: `@Roles(Role.ADMIN, Role.MANAGER, Role.STAFF)` cho các thao tác thụ lý hồ sơ và chạy AI review; `@Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)` cho các endpoint `GET` chỉ đọc).

---

## 6. High Findings

### 🟠 `AUD-02`: Bất nhất nội dung banner cảnh báo pháp lý AI trên văn bản Word (.docx)
- **Mô tả chi tiết**: Qua đối chiếu mã nguồn các helper xuất file Word, phát hiện sự không đồng nhất về lời văn khuyến cáo pháp lý:
  - Trong `procedure-docx.helper.ts` (Line 126): Sử dụng đúng chuẩn: `"⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA"`.
  - Trong `docx-templates.helper.ts` (Line 131 - Trình kiến tạo dự thảo công văn, phiếu xử lý đơn): Đang sử dụng chuỗi: `"⚠️ BẢN NHÁP AI – CHƯA PHÁT HÀNH"`.
- **Tác động & Rủi ro**: Việc sử dụng nhiều mẫu câu cảnh báo khác nhau trên các tài liệu hành chính xuất ra từ cùng một hệ thống có thể gây nhầm lẫn cho chuyên viên và lãnh đạo về tính chất pháp lý của tài liệu, chưa tuân thủ triệt đoản nguyên tắc nhận diện chuẩn `BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA`.
- **Khuyến nghị khắc phục**: Chuẩn hóa hằng số (Constant) `AI_LEGAL_WARNING_BANNER = "⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA"` trong một file config chung và tái sử dụng trên 100% các module xuất Word, PDF và giao diện UI.

### 🟠 `AUD-03`: Thiếu cơ chế khóa đồng thời (Concurrency Lock) chống trùng lặp version `ACTIVE`
- **Mô tả chi tiết**: Trong phương thức `activateDraftVersion` của `LegalKnowledgeService`, quy trình chuyển đổi version cũ sang `REPLACED` và version nháp sang `ACTIVE` được thực thi trong một Prisma Transaction. Tuy nhiên, chưa có cơ chế khóa dòng (SELECT ... FOR UPDATE) hay kiểm tra phiên bản đồng thời (Optimistic/Pessimistic Locking).
- **Tác động & Rủi ro**: Nếu trong điều kiện môi trường tải cao, hai tài khoản Lãnh đạo (`ADMIN` và `MANAGER`) cùng bấm nút Kích hoạt version cho hai bản nháp khác nhau của cùng một thủ tục tại cùng một thời điểm, có rủi ro xảy ra hiện tượng Race Condition, dẫn đến vi phạm quy tắc toàn vẹn "Duy nhất 01 bản ACTIVE".
- **Khuyến nghị khắc phục**: Thiết lập mức độ cách ly giao dịch (Transaction Isolation Level) là `Serializable` cho thao tác kích hoạt version hoặc gia cố chỉ mục duy nhất có điều kiện (Conditional Unique Index trên DB: `UNIQUE(procedureCode, status) WHERE status = 'ACTIVE'`).

---

## 7. Medium Findings

### 🟡 `AUD-04`: Chưa chuẩn hóa giao diện trạng thái rỗng (Empty States) cho API 204/Empty List
- **Mô tả chi tiết**: Khi truy xuất chi tiết một hồ sơ TTHC mới tiếp nhận chưa có bài rà soát AI nào, hoặc khi xem danh sách version/nhật ký rỗng, một số thẻ UI (ví dụ Tab AI Review trong `CaseDetail.tsx` hoặc Tab Snapshot trong `LegalKnowledgePage.tsx`) chỉ hiển thị đoạn text nhỏ màu xám hoặc bảng rỗng không có dòng nào.
- **Khuyến nghị khắc phục**: Xây dựng component `EmptyState` chuẩn hóa (bao gồm Icon minh họa hành chính, Tiêu đề rõ ràng và Lời nhắn hướng dẫn thao tác) để thay thế toàn bộ các vùng hiển thị rỗng, giúp giao diện trở nên trực quan, chuyên nghiệp.

### 🟡 `AUD-05`: Hiển thị lỗi HTTP 401/403/500 trên Modal thao tác còn thô sơ
- **Mô tả chi tiết**: Trong các hàm xử lý sự kiện (event handlers) của Modal 8 (Duyệt tạo version), Modal 10 (Simulation), Modal 11 (Kích hoạt) và Modal 12 (Hoàn tác), khi request API bị từ chối (HTTP 403) hoặc máy chủ lỗi (HTTP 500), khối `catch (error)` đang sử dụng hàm `alert("Có lỗi xảy ra: " + error.message)` của trình duyệt.
- **Khuyến nghị khắc phục**: Loại bỏ hoàn toàn `alert()` trình duyệt; tích hợp hệ thống thông báo Toast (ví dụ: `react-hot-toast` hoặc `react-toastify`) hoặc hiển thị hộp thông báo lỗi màu đỏ (Inline Error Banner) ngay bên trong Modal để giữ nguyên ngữ cảnh làm việc cho cán bộ.

---

## 8. Low Findings

### 🟢 `AUD-06`: Thiếu bộ kiểm thử tự động (Automated Test Suite) chuyên biệt cho RBAC & Case Safety
- **Mô tả chi tiết**: Hệ thống hiện có các bài unit test cơ bản cho service, nhưng chưa có bộ kiểm thử tự động (E2E / Integration Tests) chuyên biệt để tự động hóa việc rà soát ranh giới bảo mật RBAC cho các endpoint trong `ProcedureCasesController` và kiểm chứng tính bất biến của hồ sơ TTHC.
- **Khuyến nghị khắc phục**: Viết bổ sung bộ kiểm thử `procedure-cases.rbac.spec.ts` trong đợt hardening cuối cùng (Phase 9B-G) nhằm đảm bảo không bao giờ xảy ra lỗi thoái hóa (Regression) trong các phiên bản tương lai.

---

## 9. AI Governance Findings

Kiểm toán chuyên sâu về tính tuân thủ Quản trị AI (AI Governance Compliance):
- **Cảnh báo AI**: 100% các kết quả trả về từ `ProcedureAiService` đều có chứa payload dữ liệu cảnh báo. Tuy nhiên cần khắc phục ngay điểm bất nhất lời văn tại `AUD-02`.
- **Ngôn ngữ kết luận**: Rà soát bộ dựng prompt (`procedure-ai-prompt.builder.ts`); xác nhận prompt đã được thiết lập chỉ thị rõ ràng yêu cầu AI dùng văn phong gợi ý tham mưu, không dùng từ ngữ khẳng định tuyệt đối.
- **Human-in-the-Loop**: Tất cả các hành động chấp nhận/từ chối kết quả rà soát AI (`acceptAiAnalysis` / `rejectAiAnalysis`) đều ghi nhận rõ `userId` của cán bộ thực hiện, tuân thủ tuyệt đối quy tắc nhân sự quyết định cuối cùng.
- **Không đổi trạng thái hồ sơ**: Kiểm tra các hàm `reviewLandFirstCertificate` và `reviewLandUsePurposeChange`; xác nhận không có bất kỳ lệnh `prisma.administrativeProcedureCase.update` nào làm thay đổi trường `status` của hồ sơ.

---

## 10. Permission Findings

Kiểm toán chuyên sâu về phân quyền (RBAC Audit):
- **Phía Frontend (`rbac.ts` & UI)**: Các hàm `canCreate`, `canEdit`, `canDelete`, `isAdminOrManager` hoạt động chính xác, ẩn/hiện nút thao tác đúng theo ma trận quyền của `ADMIN`, `MANAGER`, `STAFF` và `VIEWER`.
- **Phía Backend (`legal-knowledge.controller.ts`)**: 100% các endpoint quản trị version, kích hoạt, hoàn tác và workflow đều được bảo vệ nghiêm ngặt bởi `@Roles(Role.ADMIN, Role.MANAGER)` hoặc `@Roles(...)` tương ứng.
- **Lỗ hổng trọng yếu tại `procedure-cases.controller.ts`**: Như đã chỉ ra tại `AUD-01`, việc thiếu `@Roles(...)` trên controller thụ lý hồ sơ TTHC là lỗ hổng bảo mật mức độ Critical duy nhất được phát hiện trong đợt rà soát này và cần được gia cố ưu tiên số 1.

---

## 11. Error Handling Findings

Kiểm toán chuyên sâu về xử lý ngoại lệ (Error Handling Audit):
- **HTTP 204 / Empty Lists**: Hệ thống xử lý an toàn, không bị crash, nhưng trải nghiệm UI cần cải tiến theo `AUD-04`.
- **HTTP 401 Unauthorized**: Guard `JwtAuthGuard` hoạt động tốt, chặn đứng các request không có token hoặc token hết hạn.
- **HTTP 403 Forbidden**: Trả về đúng mã lỗi khi vi phạm quyền (trừ khu vực ảnh hưởng bởi `AUD-01`). Tuy nhiên, hiển thị trên UI cần mượt mà hơn theo `AUD-05`.
- **HTTP 404 Not Found & 500 Internal Server Error**: Backend có bộ lọc ngoại lệ (Exception Filter) bắt lỗi tốt, không để lộ thông tin nhạy cảm của máy chủ; UI cần thay thế alert box bằng Toast Notification.

---

## 12. Snapshot / Audit Trail Findings

Kiểm toán chuyên sâu về Bản chụp pháp lý và Dấu vết kiểm toán (Snapshot & Audit Trail Audit):
- **Legal Snapshot**: Phương thức `createAnalysisLegalSnapshot` trong `ProcedureAiService` hoạt động hoàn hảo; mỗi lần chạy review đều chụp lại chính xác ID của Procedure, Prompt và Checklist version đang `ACTIVE`.
- **Tính bất biến**: Khẳng định **không có bất kỳ API hay câu lệnh SQL nào** trong toàn bộ mã nguồn có khả năng sửa đổi (`UPDATE`) hay xóa (`DELETE`) dữ liệu trong bảng `procedure_ai_analysis_legal_snapshots`.
- **Audit Trail**: Các mảng nhật ký `workflowHistory`, `activationHistory`, `rollbackHistory`, `simulations` và `draftVersions` trong bảng `legal_update_logs` đều ghi vết đầy đủ trường `actor`, `timestamp`, `action`, `reason/note` và `safety statement`, đạt chuẩn kiểm toán cao nhất.

---

## 13. Export Findings

Kiểm toán chuyên sâu về an toàn xuất khẩu văn bản (Export Safety Audit):
- **Word/PDF Export**: Các endpoint `exportReviewDocx` và `exportPurposeChangeReviewDocx` chỉ trả về dòng dữ liệu (`StreamableFile`) với header attachment, bảo đảm 100% tải về máy cục bộ, không tự động phát hành hay gửi đi.
- **Chữ ký & Con dấu**: Khối chữ ký cuối dự thảo để trống hoàn toàn cho cán bộ ký trực tiếp, tuân thủ tiêu chuẩn không ký thay/không đóng dấu tự động.
- **Vấn đề tồn đọng**: Cần khắc phục sự không đồng nhất về chuỗi cảnh báo AI theo phát hiện `AUD-02`.

---

## 14. Recommended Hardening Order

Để khắc phục triệt để 06 phát hiện ghi nhận từ đợt kiểm toán baseline, đề xuất trật tự ưu tiên gia cố kỹ thuật (Hardening Order) tuần tự theo 4 cấp độ:

1. **Ưu tiên 1 (🔴 Critical - Xử lý ngay tại Phase 9B-C)**: Khắc phục triệt để lỗ hổng `AUD-01` bằng cách gia cố tường minh toàn bộ decorator `@Roles(...)` cho `ProcedureCasesController`.
2. **Ưu tiên 2 (🟠 High - Xử lý tại Phase 9B-B & 9B-E)**: Chuẩn hóa đồng bộ chuỗi cảnh báo pháp lý AI trên mọi văn bản Word/PDF (`AUD-02`) và thiết lập cơ chế khóa đồng thời chống trùng lặp version ACTIVE (`AUD-03`).
3. **Ưu tiên 3 (🟡 Medium - Xử lý tại Phase 9B-D)**: Chuẩn hóa hệ thống giao diện Empty States (`AUD-04`) và nâng cấp cơ chế thông báo lỗi Toast Notification thay cho alert box (`AUD-05`).
4. **Ưu tiên 4 (🟢 Low - Xử lý tại Phase 9B-G)**: Xây dựng bổ sung bộ kiểm thử tự động E2E / RBAC Test Suite (`AUD-06`) và đóng gói phát hành Release Candidate.

---

## 15. Out of Scope

Để tuân thủ tuyệt đối quy định quản trị dự án, xin khẳng định mốc **Phase 9B-A** này **hoàn toàn chỉ rà soát đọc mã nguồn và biên soạn tài liệu kiểm toán**:
1. **Không chỉnh sửa code**: Tuyệt đối không thay đổi bất kỳ dòng mã nguồn nào trên Backend hay Frontend.
2. **Không chỉnh sửa CSDL / Schema**: Không can thiệp DB, không sửa `schema.prisma`, không tạo migration hay chỉnh `.env`.
3. **Không thay đổi dữ liệu hồ sơ**: Toàn bộ hồ sơ TTHC, kết quả AI và Legal Snapshot hiện có được bảo toàn nguyên trạng 100%.

---
*Tài liệu Báo cáo Kiểm toán Baseline Hardening được ban hành trong khuôn khổ hoàn thành Phase 9B-A của hệ thống LegalFlow V2.*
