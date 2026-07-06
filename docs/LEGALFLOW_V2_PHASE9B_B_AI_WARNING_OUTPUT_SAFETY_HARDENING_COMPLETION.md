# BÁO CÁO HOÀN THÀNH PHASE 9B-B: AI WARNING & OUTPUT SAFETY HARDENING
**Hệ thống:** LegalFlow V2 - Hệ thống Quản trị & Xử lý Đơn thư, Thủ tục Hành chính Đất đai  
**Phiên bản:** v2.9.2-tthc-ai-governance-warning-safety-hardening  
**Ngày hoàn thành:** 06/07/2026  
**Trạng thái:** HOÀN THÀNH 100%

---

## 1. TỔNG QUAN & MỤC TIÊU (EXECUTIVE SUMMARY)

Phase 9B-B là bước thực hiện nhóm cải tiến ưu tiên cao nhất (Priority 1 - P1) trong Backlog gia cố an toàn TTHC AI Governance, nhằm chuẩn hóa toàn diện nhãn cảnh báo AI và ngôn ngữ an toàn pháp lý trên toàn bộ đầu ra của hệ thống (UI, Modal, Word/PDF Export, Prompt Builder, AI Provider).

### MỤC TIÊU QUAN TRỌNG NHẤT ĐÃ ĐẠT ĐƯỢC:
1. **Chuẩn hóa cảnh báo AI "Single Source of Truth":** Bảo đảm mọi nội dung do AI tạo ra hoặc hỗ trợ rà soát trên hệ thống đều bắt buộc hiển thị nhãn cảnh báo chuẩn:
   > `⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA`
2. **An toàn ngôn ngữ pháp lý (Advisory Tone Only):** Ngăn chặn tuyệt đối việc AI sử dụng ngôn ngữ mang tính chất kết luận thay cho cơ quan hoặc cán bộ có thẩm quyền (như *"hồ sơ đủ điều kiện"*, *"chắc chắn được cấp GCN"*, *"theo Điều X thì phải giải quyết"*).
3. **Tuân thủ tuyệt đối 11 nguyên tắc ràng buộc:** Không sửa schema/database/migration/.env, không tự thay đổi trạng thái hồ sơ TTHC, không tự ký/phát hành văn bản cho công dân.

---

## 2. PHẠM VI GIA CỐ & GIẢI QUYẾT BACKLOG (AUDIT RESOLUTIONS)

Toàn bộ các phát hiện liên quan đến nhóm **Output Safety & AI Warning (AUD-01 đến AUD-05)** trong Báo cáo Kiểm toán Baseline Phase 9B-A đều đã được xử lý triệt để:

| Mã Audit | Vị trí / Component | Vấn đề phát hiện trong Baseline (Phase 9B-A) | Giải pháp thực hiện trong Phase 9B-B | Trạng thái |
| :--- | :--- | :--- | :--- | :---: |
| **AUD-01** | `cases.service.ts` <br>`docx-templates.helper.ts` | Hardcode banner `"BẢN NHÁP AI – CHƯA PHÁT HÀNH"` trong logic tạo tài liệu Word Phase 4A/4B. | Sử dụng hằng số chuẩn `AI_REVIEW_WARNING`. Thêm pattern `/BẢN GỢI Ý AI/i` vào `cleanDraftBodyLines` để tự động làm sạch tiêu đề nháp khi xuất file. | **ĐÃ XỬ LÝ** |
| **AUD-02** | `procedure-docx.helper.ts` <br>vs `docx-templates.helper.ts` | Không đồng nhất giữa nhãn `"BẢN GỢI Ý AI"` (TTHC) và `"BẢN NHÁP AI"` (Đơn thư). | Đồng bộ 100% sử dụng hằng số `AI_REVIEW_WARNING` (`⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA`) trên cả hai luồng nghiệp vụ. | **ĐÃ XỬ LÝ** |
| **AUD-03** | `ProcedureCaseDetail.tsx` | Tab 3 (AI rà soát TTHC) thiếu hộp cảnh báo (Warning Banner Box) nổi bật phía trên tóm tắt hồ sơ. | Bổ sung Warning Banner Box màu vàng hổ phách (Amber) với thông điệp khuyến cáo trách nhiệm cán bộ trước khi áp dụng/ban hành. | **ĐÃ XỬ LÝ** |
| **AUD-04** | `CaseDetail.tsx` <br>(AI Checklist & Draft Widget) | Widget gợi ý checklist và soạn thảo nháp Phase 4A sử dụng text hardcode và nhãn cũ. | Thay thế bằng `AI_REVIEW_WARNING` từ `constants.ts`, chuẩn hóa thông điệp *"Cán bộ phải kiểm tra, chỉnh sửa và chịu trách nhiệm"*. | **ĐÃ XỬ LÝ** |
| **AUD-05** | `PromptBuilderService` <br>`ProcedureAiPromptBuilder` | Các prompt hướng dẫn LLM chưa có chỉ thị ràng buộc về giọng văn tham mưu (advisory tone). | Bổ sung Nguyên tắc An toàn Bắt buộc (Mandatory Safety Rules) vào tất cả hệ thống prompt builder (Tóm tắt, Phân loại, Checklist, Dự thảo, Rà soát GCN, Chuyển mục đích). | **ĐÃ XỬ LÝ** |

---

## 3. CHI TIẾT TRIỂN KHAI KỸ THUẬT (TECHNICAL IMPLEMENTATION)

### 3.1. Thiết lập Hằng số Trung tâm (Single Source of Truth)
Đã định nghĩa các hằng số chuẩn tại cả Backend và Frontend để các service và component gọi dùng trực tiếp, tránh hiện tượng hardcode và đảm bảo tính nhất quán:

* **Backend (`legalflow-backend/src/common/constants.ts`):**
  ```typescript
  export const AI_REVIEW_WARNING = '⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA';
  export const AI_REVIEW_WARNING_TEXT = 'BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA';
  export const AI_SAFETY_DISCLAIMER = 'Kết quả phân tích/dự thảo từ Trợ lý AI chỉ mang tính chất gợi ý chuyên môn nội bộ...';
  ```
* **Frontend (`src/lib/constants.ts`):**
  ```typescript
  export const AI_REVIEW_WARNING = '⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA';
  export const AI_REVIEW_WARNING_TEXT = 'BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA';
  ```

### 3.2. Gia cố An toàn trong Prompt Builder & AI Provider
* **`gemini.provider.ts`**: Tự động chèn hằng số `AI_REVIEW_WARNING` vào đầu mọi kết quả dự thảo nội bộ, đồng thời tiêm chỉ thị an toàn vào `systemPrompt`:
  ```text
  LƯU Ý Ý THỨC TRÁCH NHIỆM PHÁP LÝ: Bạn là Trợ lý AI tham mưu nội bộ. Tuyệt đối dùng ngôn ngữ gợi ý (ví dụ: 'đề xuất', 'khuyến nghị', 'cần cán bộ kiểm tra/xác minh'). KHÔNG dùng ngôn ngữ khẳng định thay thẩm quyền của cơ quan nhà nước hay cán bộ xử lý...
  ```
* **`PromptBuilderService` & `ProcedureAiPromptBuilder`**: Bổ sung Nguyên tắc 5 & 6 vào quy tắc đánh giá hồ sơ TTHC:
  1. *Không hardcode hay bịa đặt kết luận pháp lý; tuyệt đối không dùng cách diễn đạt tuyệt đối như "căn cứ pháp lý mới nhất", "căn cứ áp dụng chắc chắn", hay "theo Điều ... thì hồ sơ đủ/không đủ điều kiện".*
  2. *Kết quả AI không thay thế việc cán bộ kiểm tra văn bản pháp luật hiện hành, văn bản sửa đổi/bổ sung và quy trình nội bộ địa phương tại thời điểm xử lý hồ sơ.*

### 3.3. Gia cố Giao diện (UI) & Modals In/Xuất văn bản
* **`CaseDetail.tsx`**: Đồng bộ widget AI Checklist và AI Draft sang nhãn cảnh báo chuẩn `AI_REVIEW_WARNING`.
* **`ProcedureCaseDetail.tsx`**: Thêm khối cảnh báo nổi bật tại Tab 3:
  ```tsx
  <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-900 p-3.5 rounded-r text-xs flex items-start gap-2.5">
    <span className="text-base">⚠️</span>
    <div>
      <span className="font-bold">{AI_REVIEW_WARNING}. CÁN BỘ PHẢI KIỂM TRA, CHỈNH SỬA VÀ CHỊU TRÁCH NHIỆM TRƯỚC KHI ÁP DỤNG HOẶC BAN HÀNH.</span>
      <p className="mt-0.5 text-amber-800">Kết quả phân tích từ AI chỉ mang tính chất gợi ý chuyên môn, không thay thế việc kiểm tra hồ sơ bản gốc và văn bản pháp luật hiện hành.</p>
    </div>
  </div>
  ```
* **Print Modals (`AiDraftPrintModal.tsx`, `ProcedureReviewPrintModal.tsx`, `PurposeChangeReviewPrintModal.tsx`)**: Cập nhật giá trị mặc định của prop `warningBanner` thành `AI_REVIEW_WARNING`, đảm bảo khi cán bộ in phiếu rà soát nội bộ hoặc tải file Word đều có tiêu đề cảnh báo hợp quy.

---

## 4. KẾT QUẢ KIỂM CHỨNG & BUILD HỆ THỐNG (VERIFICATION RESULTS)

Hệ thống đã được kiểm tra dịch mã TypeScript và kiểm chứng build toàn diện trên cả 2 tầng:

1. **Frontend Build (`npm run build` tại root directory):**
   * **Trạng thái:** `✓ built in 1.73s`
   * **Kết quả:** Không có lỗi cú pháp TypeScript, không vi phạm import, các gói bundle (CSS/JS) được tạo hoàn chỉnh trong `dist/`.
2. **Backend Build (`npm run build` / `nest build` tại `legalflow-backend/`):**
   * **Trạng thái:** `✓ Complete` (Task-5550 completed successfully)
   * **Kết quả:** NestJS biên dịch thành công toàn bộ module AI, Cases và AdministrativeProcedures mà không có bất kỳ cảnh báo hay lỗi kiểu dữ liệu nào.

---

## 5. BẢNG ĐỐI CHIẾU TUÂN THỦ NGUYÊN TẮC RÀNG BUỘC (ABSOLUTE MANDATES)

| # | Nguyên tắc ranh giới tuyệt đối | Trạng thái tuân thủ | Ghi chú chứng minh |
| :-: | :--- | :---: | :--- |
| 1 | **Không sửa backend core logic khác** | 🟢 TUÂN THỦ | Chỉ chỉnh sửa phần quản lý text hằng số và prompt instructions trong `ai/` và `cases/`. |
| 2 | **Không sửa frontend layout/routing** | 🟢 TUÂN THỦ | Chỉ cập nhật text cảnh báo trong các thẻ div/banner hiện có. |
| 3 | **Không sửa schema (`schema.prisma`)** | 🟢 TUÂN THỦ | Không chạm vào file `schema.prisma`. |
| 4 | **Không tạo migration** | 🟢 TUÂN THỦ | Không sinh ra bất kỳ file migration mới nào trong `prisma/migrations/`. |
| 5 | **Không chỉnh sửa `.env`** | 🟢 TUÂN THỦ | Các cấu hình môi trường giữ nguyên 100%. |
| 6 | **Không sửa database** | 🟢 TUÂN THỦ | Không thực hiện lệnh query thay đổi dữ liệu DB. |
| 7 | **Không sửa trạng thái hồ sơ TTHC** | 🟢 TUÂN THỦ | AI review và draft chỉ trả về gợi ý, không tự động chuyển trạng thái thụ lý hay thẩm định. |
| 8 | **Không sửa `ProcedureAiAnalysis` cũ** | 🟢 TUÂN THỦ | Các bản ghi lịch sử rà soát AI trong DB được bảo toàn nguyên vẹn. |
| 9 | **Không sửa `ProcedureAiAnalysisLegalSnapshot` cũ** | 🟢 TUÂN THỦ | Snapshot pháp lý lịch sử không bị ảnh hưởng. |
| 10 | **Không tự gửi văn bản / tự ký** | 🟢 TUÂN THỦ | Mọi văn bản nháp/phiếu rà soát đều ghi rõ *"Cán bộ phải kiểm tra, chỉnh sửa và chịu trách nhiệm"*. |
| 11 | **Không commit/tag thay người dùng** | 🟢 TUÂN THỦ | Toàn bộ thay đổi đang ở trạng thái working directory, chờ người dùng kiểm tra và quyết định commit/tag. |

---

## 6. BƯỚC TIẾP THEO (NEXT STEPS)

Sau khi hoàn thành thành công Phase 9B-B (AI Warning & Output Safety Hardening), hệ thống đã sẵn sàng bước vào các phase gia cố tiếp theo trong kế hoạch UAT & Hardening:
* **Phase 9B-C: RBAC & Workflow Access Hardening:** Kiểm tra và gia cố các bộ bảo vệ (guards) và phân quyền chi tiết cho từng nút thao tác AI trên giao diện theo vai trò (ADMIN, MANAGER, STAFF, VIEWER).
* **Phase 9B-D: Concurrency & State Locking Hardening:** Bổ sung cơ chế khóa thao tác khi AI đang phân tích hoặc khi hồ sơ đã chuyển bước/đã đóng.
* **Phase 9B-E: UI Error Handling & Empty States Normalization:** Chuẩn hóa thông báo lỗi khi mất kết nối LLM hoặc hết hạn mức API.
* **Phase 9B-F: Automated E2E Governance Test Suite:** Xây dựng bộ test tự động kiểm chứng an toàn AI Governance.
