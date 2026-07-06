# LEGALFLOW V2 - PHASE 9B-A

# TTHC AI GOVERNANCE HARDENING BACKLOG

**Ngày phát hành:** 06/07/2026  
**Mô-đun:** Quản trị Trí tuệ Nhân tạo & Thủ tục Hành chính Đất đai (TTHC AI Governance & Hardening Track)  
**Trạng thái:** ĐÃ HOÀN THÀNH (100% Actionable Hardening Backlog & Phase Roadmap)  

---

## 1. Purpose

Tài liệu này thiết lập **Danh mục Công việc Gia cố Kỹ thuật Ưu tiên (Actionable Hardening Backlog)** cho toàn bộ hệ thống trí tuệ nhân tạo (AI) hỗ trợ xử lý thủ tục hành chính (TTHC) và Quản trị phiên bản pháp lý trong LegalFlow V2, dựa trên các kết quả phát hiện từ đợt rà soát đánh giá cơ sở (Baseline Audit - Phase 9B-A).

Mục đích cốt lõi của danh mục backlog là:
1. Quy hoạch chi tiết 06 hạng mục gia cố kỹ thuật theo đúng trật tự ưu tiên rủi ro từ cao xuống thấp (Critical $\rightarrow$ High $\rightarrow$ Medium $\rightarrow$ Low).
2. Xác định rõ ràng các tệp tin chịu tác động (Affected Files) và Tiêu chí nghiệm thu (Acceptance Criteria) cho từng hạng mục công việc.
3. Phân rã lộ trình triển khai thành 06 tiểu giai đoạn (Phases 9B-B đến 9B-G), tạo đường găng chuẩn mực để đưa hệ thống tiến đến trạng thái Sẵn sàng Phát hành chính thức (Production Release Candidate - RC1).

---

## 2. Backlog Overview

Tổng hợp toàn bộ Danh mục công việc gia cố kỹ thuật theo 04 cấp độ nghiêm trọng (Severity Overview):

| Cấp độ Nghiêm trọng (Severity) | Số lượng Hạng mục (Issue Count) | Tỷ trọng | Mục tiêu Khắc phục (Resolution Target) | Giai đoạn Triển khai Đề xuất |
| :--- | :---: | :---: | :--- | :---: |
| 🔴 **Critical (Nghiêm trọng tối cao)** | **01** | 16.7% | Bắt buộc xử lý triệt để ngay trước các thao tác UAT tiếp theo | `Phase 9B-C` |
| 🟠 **High (Nghiêm trọng cao)** | **02** | 33.3% | Khắc phục hoàn tất trong các đợt Hardening chính của sprint | `Phase 9B-B` & `Phase 9B-E` |
| 🟡 **Medium (Mức độ trung bình)** | **02** | 33.3% | Tối ưu hóa trải nghiệm UI/UX và tính bồi hoàn giao diện | `Phase 9B-D` |
| 🟢 **Low (Mức độ thấp / Cải tiến)** | **01** | 16.7% | Hoàn thiện bộ kiểm thử tự động và đóng gói phát hành | `Phase 9B-G` |
| **TỔNG CỘNG (TOTAL BACKLOG)** | **06** | **100%** | **Kiên cố hóa toàn diện 100% hệ sinh thái TTHC AI Governance** | **Phases 9B-B $\rightarrow$ 9B-G** |

---

## 3. Critical Backlog

Danh mục gia cố mức độ nghiêm trọng tối cao (**🔴 Critical Priority**):

| ID | Title (Tên hạng mục gia cố) | Description (Mô tả công việc chi tiết) | Affected Files (Tệp tin tác động) | Acceptance Criteria (Tiêu chí nghiệm thu hoàn thành) | Suggested Phase |
| :---: | :--- | :--- | :--- | :--- | :---: |
| `AUD-01` | **Gia cố Bảo mật Phân quyền `@Roles` cho `ProcedureCasesController`** | Bổ sung tường minh decorator `@Roles(...)` trên toàn bộ 15 phương thức trong `ProcedureCasesController` để khóa kín lỗ hổng `RolesGuard` trả về `true` khi thiếu metadata. Đảm bảo phân tách rõ ràng quyền thụ lý/review (`ADMIN`, `MANAGER`, `STAFF`) và quyền chỉ đọc (`VIEWER`). | `legalflow-backend/src/administrative-procedures/procedure-cases.controller.ts` | 1. 100% các endpoint trong `ProcedureCasesController` có decorator `@Roles(...)` tường minh.<br>2. Gửi request `POST /procedure-cases/:id/ai/land-first-certificate-review` bằng token của `VIEWER` $\rightarrow$ Backend từ chối với HTTP Status **403 Forbidden**.<br>3. Tài khoản `STAFF` vẫn chạy AI Review và cập nhật checklist bình thường.<br>4. Không làm thay đổi schema hay CSDL. | `Phase 9B-C` |

---

## 4. High Backlog

Danh mục gia cố mức độ nghiêm trọng cao (**🟠 High Priority**):

| ID | Title (Tên hạng mục gia cố) | Description (Mô tả công việc chi tiết) | Affected Files (Tệp tin tác động) | Acceptance Criteria (Tiêu chí nghiệm thu hoàn thành) | Suggested Phase |
| :---: | :--- | :--- | :--- | :--- | :---: |
| `AUD-02` | **Chuẩn hóa Đồng bộ Banner Cảnh báo AI trên toàn bộ Output Word/PDF** | Đồng bộ hóa toàn bộ chuỗi khuyến cáo pháp lý trong các trình kiến tạo văn bản Word (`.docx`) và PDF (`.pdf`) về một chuẩn duy nhất theo quy định: `"⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA"`. Thay thế chuỗi cũ `"BẢN NHÁP AI - CHƯA PHÁT HÀNH"` trong helper dự thảo công văn. | `legalflow-backend/src/cases/docx-templates.helper.ts` (Line 131)<br>`legalflow-backend/src/administrative-procedures/ai/procedure-docx.helper.ts` | 1. Tải về file Word dự thảo công văn và file báo cáo thẩm tra AI $\rightarrow$ Cả hai đều hiển thị chính xác chuỗi: `"⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA"`.<br>2. Layout bảng biểu cảnh báo viền vàng/đỏ chuẩn mực, không lỗi font Unicode.<br>3. Khối chữ ký cuối văn bản để trống hoàn toàn cho cán bộ ký trực tiếp. | `Phase 9B-B` & `Phase 9B-F` |
| `AUD-03` | **Gia cố Cơ chế Khóa Đồng thời chống trùng lặp Version `ACTIVE`** | Thiết lập mức độ cách ly giao dịch (Isolation Level) `Serializable` hoặc gia cố kiểm tra đồng thời (Concurrency Check / locking) trong hàm `activateDraftVersion` để ngăn chặn tuyệt đối tình trạng 02 Lãnh đạo cùng bấm kích hoạt gây ra 02 bản cùng `ACTIVE`. | `legalflow-backend/src/legal-knowledge/legal-knowledge.service.ts` | 1. Thực thi kịch bản tải cao (stress test) gửi 02 request kích hoạt đồng thời vào cùng một thủ tục $\rightarrow$ Hệ thống chỉ cho phép 01 giao dịch thành công, giao dịch còn lại trả về lỗi xung đột an toàn.<br>2. Câu lệnh SQL kiểm tra `count(*) WHERE status = 'ACTIVE'` luôn trả về $\le 1$ cho mỗi mã thủ tục.<br>3. Không làm thay đổi schema Prisma. | `Phase 9B-E` |

---

## 5. Medium Backlog

Danh mục gia cố mức độ trung bình (**🟡 Medium Priority**):

| ID | Title (Tên hạng mục gia cố) | Description (Mô tả công việc chi tiết) | Affected Files (Tệp tin tác động) | Acceptance Criteria (Tiêu chí nghiệm thu hoàn thành) | Suggested Phase |
| :---: | :--- | :--- | :--- | :--- | :---: |
| `AUD-04` | **Chuẩn hóa Giao diện Trạng thái Rỗng (Empty States) cho API 204/Empty** | Xây dựng và tích hợp component `EmptyState` chuẩn hóa (kèm Icon minh họa, Tiêu đề và Lời nhắn hướng dẫn) cho tất cả các danh sách và thẻ dữ liệu khi API trả về rỗng (chưa có bài rà soát AI, chưa có log, chưa có snapshot), xóa bỏ hoàn toàn giao diện bảng rỗng gây hiểu lầm. | `src/pages/CaseDetail.tsx`<br>`src/pages/LegalKnowledgePage.tsx`<br>`src/components/common/EmptyState.tsx` (New/Modify) | 1. Mở một hồ sơ TTHC mới chưa có bài rà soát AI $\rightarrow$ Hiển thị khối UI rỗng trực quan với lời nhắn hướng dẫn bấm "Chạy AI Review".<br>2. Mở Tab Lịch sử cập nhật rỗng $\rightarrow$ Hiển thị icon và hướng dẫn tạo nhật ký mới.<br>3. Giao diện trang nhã, không bị sai lệch layout. | `Phase 9B-D` |
| `AUD-05` | **Nâng cấp Hiển thị Lỗi 401/403/500 trên Modal bằng Toast/Inline Banner** | Loại bỏ hoàn toàn các hộp thoại `alert()` cơ bản của trình duyệt trong các sự kiện Modal 8, 10, 11, 12. Thay thế bằng hệ thống Toast Notification hiện đại hoặc Inline Error Banner màu đỏ ngay bên trong Modal để báo lỗi quyền (403) hay lỗi server (500). | `src/pages/LegalKnowledgePage.tsx`<br>`src/components/common/Toast.tsx` | 1. Khi Lãnh đạo nhập sai confirmation text hoặc gặp lỗi mạng khi kích hoạt $\rightarrow$ Hiển thị Banner lỗi màu đỏ bên trong modal hoặc Toast góc màn hình.<br>2. Không bị bật popup `alert()` trình duyệt.<br>3. Modal không bị crash hoặc đóng đột ngột khi gặp sự cố API. | `Phase 9B-D` |

---

## 6. Low Backlog

Danh mục gia cố mức độ thấp / Cải tiến chất lượng (**🟢 Low Priority**):

| ID | Title (Tên hạng mục gia cố) | Description (Mô tả công việc chi tiết) | Affected Files (Tệp tin tác động) | Acceptance Criteria (Tiêu chí nghiệm thu hoàn thành) | Suggested Phase |
| :---: | :--- | :--- | :--- | :--- | :---: |
| `AUD-06` | **Xây dựng Bộ Kiểm thử Tự động E2E / RBAC Test Suite cho AI TTHC** | Viết bổ sung bộ kiểm thử tự động `procedure-cases.rbac.spec.ts` kiểm chứng ranh giới bảo mật cho 15 endpoint của `ProcedureCasesController`. Khẳng định tự động hóa 100% các test case về quyền truy cập và an toàn hồ sơ TTHC. | `legalflow-backend/test/procedure-cases.rbac.spec.ts` (New)<br>`legalflow-backend/test/...` | 1. Chạy bộ lệnh `npm run test:e2e` trên Backend đạt kết quả 100% PASS.<br>2. Bài test tự động xác nhận token `VIEWER` bị trả về 403 Forbidden trên các endpoint xử lý AI và thụ lý hồ sơ.<br>3. Bài test xác nhận chạy AI review không làm đổi trạng thái `status` của hồ sơ TTHC trong DB. | `Phase 9B-G` |

---

## 7. Suggested Phase Breakdown

Để bảo đảm lộ trình triển khai khoa học, không gây xáo trộn kiến trúc và kiểm soát rủi ro tuyệt đối, đề xuất phân rã giai đoạn gia cố kỹ thuật tiếp theo thành **06 tiểu giai đoạn liên hoàn**:

```
[Phase 9B-B: AI Warning & Output Safety Hardening] (Chuẩn hóa Banner cảnh báo AI)
                           │
                           ▼
[Phase 9B-C: Permission & Endpoint Guard Hardening] (Gia cố @Roles cho Case Controller)
                           │
                           ▼
[Phase 9B-D: API Error Handling & UI Empty State Hardening] (UI Resilience & Toast)
                           │
                           ▼
[Phase 9B-E: Snapshot / Audit Trail & Concurrency Hardening] (Khóa đồng thời ACTIVE)
                           │
                           ▼
[Phase 9B-F: Export Safety Hardening] (Hoàn thiện Word/PDF Layout & Chữ ký)
                           │
                           ▼
[Phase 9B-G: Final UAT Fixes & Release Candidate] (E2E Test Suite & Đóng gói RC1)
```

1. **`Phase 9B-B: AI Warning & Output Safety Hardening`**:
   - Tập trung xử lý hạng mục `AUD-02`.
   - Chuẩn hóa chuỗi cảnh báo pháp lý AI `"⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA"` trên toàn bộ hệ thống.
2. **`Phase 9B-C: Permission & Endpoint Guard Hardening`**:
   - Tập trung xử lý hạng mục số 1 `AUD-01` (Critical).
   - Gia cố toàn bộ decorator `@Roles(...)` cho `ProcedureCasesController`, bịt kín lỗ hổng vượt quyền của `VIEWER`.
3. **`Phase 9B-D: API Error Handling & UI Empty State Hardening`**:
   - Tập trung xử lý các hạng mục `AUD-04` và `AUD-05`.
   - Chuẩn hóa component `EmptyState` và nâng cấp cơ chế thông báo lỗi Toast / Inline Banner trên các Modal quản trị.
4. **`Phase 9B-E: Snapshot / Audit Trail & Concurrency Hardening`**:
   - Tập trung xử lý hạng mục `AUD-03`.
   - Thiết lập cơ chế chống trùng lặp version `ACTIVE` dưới điều kiện tải cao, bảo toàn bất biến Legal Snapshot.
5. **`Phase 9B-F: Export Safety Hardening`**:
   - Rà soát kiểm chứng lần cuối chất lượng xuất file Word (`.docx`) và PDF (`.pdf`), bảo đảm layout trang trọng, không lỗi font Unicode và để trống khối chữ ký.
6. **`Phase 9B-G: Final UAT Fixes & Release Candidate`**:
   - Tập trung xử lý hạng mục `AUD-06`.
   - Hoàn thiện bộ kiểm thử tự động E2E RBAC Test Suite, chạy kiểm thử hồi quy toàn diện và đóng gói gắn thẻ phát hành **`v2.9.0-RC1`** (Release Candidate 1).

---

## 8. Acceptance Criteria for Phase 9B Implementation

Toàn bộ chiến dịch gia cố kỹ thuật **Phase 9B** (từ 9B-B đến 9B-G) chỉ được nghiệm thu hoàn thành khi thỏa mãn đồng thời **06 Tiêu chí Nghiệm thu Tối cao (Master Acceptance Criteria)** sau:

1. **Không còn lỗ hổng Critical**: Lỗ hổng bảo mật thiếu `@Roles` (`AUD-01`) được gia cố hoàn hảo; 100% endpoint nhạy cảm đều từ chối request trái phép với HTTP 403 Forbidden.
2. **Toàn bộ lỗi High được xử lý triệt để**: Sự bất nhất về banner cảnh báo AI (`AUD-02`) và rủi ro trùng lặp version ACTIVE (`AUD-03`) được khắc phục 100%, không cần áp dụng giải pháp tạm thời (mitigation).
3. **Build & Test Pass 100%**: Các lệnh kiểm tra dịch build (`npm run build`) trên cả Backend và Frontend đều thành công không lỗi; bộ kiểm thử tự động E2E RBAC chạy đạt tỷ lệ PASS 100%.
4. **Không thay đổi Schema CSDL (No Schema Changes unless justified)**: Tuyệt đối không chỉnh sửa file `schema.prisma`, không tạo mới hay chạy migration, bảo toàn nguyên vẹn cấu trúc bảng hiện tại.
5. **Không làm biến đổi hồ sơ TTHC (No Case Mutation outside intended flows)**: Đảm bảo 100% các thao tác chạy AI Review, Simulation, Kích hoạt hay Hoàn tác không bao giờ tự động thay đổi trạng thái `status` hay dữ liệu thực tế của hồ sơ TTHC và Legal Snapshot cũ.
6. **Cảnh báo AI hiện diện tuyệt đối trên mọi Output (AI Warning present across outputs)**: 100% các báo cáo rà soát trên UI, file Word tải về và file PDF tải về đều hiển thị nổi bật khuyến cáo pháp lý bắt buộc: `"⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA"`.

---
*Tài liệu Danh mục Gia cố Kỹ thuật (Hardening Backlog) được ban hành trong khuôn khổ hoàn thành Phase 9B-A của hệ thống LegalFlow V2.*
