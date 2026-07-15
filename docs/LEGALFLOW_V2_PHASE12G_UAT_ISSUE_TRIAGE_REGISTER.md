# Sổ Đăng Ký Phân Loại Lỗi và Phát Hiện UAT Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12G
## Phase 12G: Financial Obligation UAT Issue Triage Register

> [!IMPORTANT]
> **NGUYÊN TẮC PHÂN LOẠI LỖI & PHÁT HIỆN (TRIAGE RULES):**
> Sổ đăng ký này ghi nhận toàn bộ các rào cản kỹ thuật, thiếu hụt dữ liệu mẫu và các điểm cần cải tiến UI/UX được phát hiện trong quá trình rà soát UAT Phase 12G.
> * **Mức độ nghiêm trọng (Severity):** `Critical` (Vi phạm an toàn/pháp lý/chốt chặn) | `High` (Sai luồng nghiệp vụ/mất audit log/chặn UAT) | `Medium` (Lỗi UI/API gây khó thao tác) | `Low` (Lỗi wording/bố cục nhỏ) | `Note` (Góp ý cải tiến/Đề xuất bổ sung).
> * **Tác động an toàn (Safety Impact):** `Blocks UAT` | `Blocks Release` | `Requires Fix Before Pilot` | `Warning Only` | `No Safety Impact`.
> * **Giai đoạn mục tiêu (Target Phase):** Ưu tiên chỉ định vào `Phase 12H: UAT Issue Fixes & Stabilization` hoặc `Backlog`.

---

## Bảng Đăng Ký Phân Loại Lỗi và Phát Hiện (Issue Triage Register Table)

| Issue ID | Related Test ID | Severity | Area | Description | Expected Behavior | Actual Behavior | Safety Impact | Proposed Fix | Owner | Target Phase | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FO-ISSUE-01** | `FO-TST-01` đến `FO-TST-06`, `FO-TST-10` đến `FO-TST-13`, `FO-TST-17` đến `FO-TST-19` | `High` | `Data / Environment` | Thiếu dữ liệu bộ 8 hồ sơ kiểm thử mẫu (`FO-UAT-01` đến `FO-UAT-08`) trong cơ sở dữ liệu UAT (`legalflow_prod`), dẫn đến chặn việc thực thi UAT tương tác live trên UI. | Hệ thống UAT có sẵn bộ hồ sơ kiểm thử chuẩn (`FO-UAT-01` đến `FO-UAT-08`) trong các bảng `AdministrativeProcedureCase`, `financial_obligation_assessments` để Kiểm thử viên thao tác ngay mà không cần nhập tay từ đầu. | Các bảng dữ liệu thuộc phân hệ Nghĩa vụ tài chính hiện đang trống (`0 rows`). Thiếu kịch bản seed hoặc công cụ tạo nhanh case mẫu trên UAT. | `Blocks UAT` | Xây dựng công cụ mô phỏng tạo hồ sơ kiểm thử UAT an toàn (ví dụ: `seed-uat-fo-cases.ts` hoặc script khởi tạo mock data isolated) tại Phase 12H, tuân thủ nguyên tắc không can thiệp dữ liệu thật. | Dev / DevOps | `Phase 12H: UAT Issue Fixes & Stabilization` (`Phase 12H: Demo Data Preparation Plan`) | `OPEN` | Phát hiện quan trọng nhất giải thích lý do 14 bài kiểm thử tương tác bị ghi nhận trạng thái `BLOCKED - SAMPLE DATA NOT AVAILABLE`. |
| **FO-ISSUE-02** | `FO-TST-13`, `FO-TST-15` | `Note` | `UI / Workflow` | Trường hợp hồ sơ thuộc diện miễn thuế/không phát sinh nghĩa vụ tài chính (`FO-UAT-06` - cờ `isExempt = true`), cần làm rõ hiển thị trên UI khi không yêu cầu `PaymentEvidence`. | Khi Cán bộ đánh dấu hồ sơ được miễn nộp tiền (`EXEMPTED`), UI hiển thị rõ lý do miễn giảm, bắt buộc đính kèm văn bản xác nhận miễn thuế và cần sự đồng thuận (`officerVerify` / `managerVerify`) trước khi cho phép bấm hoàn thành. | Hiện tại logic `completeAssessment` đã cho phép bỏ qua `paymentEvidenceRecords` nếu `isExempt = true`. Tuy nhiên, phần giao diện checklist nên làm nổi bật nhãn "ĐƯỢC MIỄN NỘP TIỀN" bằng màu xanh dương thay vì ẩn đi hoặc hiện màu xám để dễ theo dõi. | `Warning Only` | Cập nhật component `MissingInfoChecklist.tsx` và `FinancialObligationStatusCard.tsx` để hiển thị huy hiệu (Badge) rõ ràng: `MIỄN NỘP TIỀN THUẾ / EXEMPTED` kèm yêu cầu ghi chú lý do. | Frontend Dev | `Phase 12H: UAT Issue Fixes & Stabilization` | `OPEN` | Góp ý cải tiến trải nghiệm kiểm soát viên và tránh nhầm lẫn với hồ sơ chưa nộp tiền (`PENDING`). |
| **FO-ISSUE-03** | `FO-TST-18` | `Low` | `UI / Audit Trail` | Bảng Nhật ký kiểm toán (`FinancialObligationAuditLogPanel.tsx`) hiện hiển thị chi tiết các `action` và `previousState`/`newState` dưới dạng JSON stringified hoặc chuỗi sự kiện. | Cán bộ thụ lý và Lãnh đạo có thể đọc nhật ký sự kiện bằng ngôn ngữ tiếng Việt tự nhiên, dễ hiểu (ví dụ: "Cán bộ Nguyễn Văn A đã tải lên Thông báo thuế số 123/TBT trị giá 50.000.000 VNĐ" thay vì hiển thị raw action `UPLOAD_TAX_NOTICE`). | Panel đã hiển thị đầy đủ danh sách theo thời gian, tuy nhiên các chi tiết `previousState`/`newState` đôi khi có chuỗi JSON kỹ thuật gây khó đọc đối với người dùng nghiệp vụ. | `No Safety Impact` | Bổ sung helper function `formatAuditLogMessage(log)` trong `utils/` hoặc trực tiếp trong component để chuyển hóa các mã code `action` và JSON payload thành văn bản tiếng Việt chuẩn nghiệp vụ hành chính. | Frontend Dev | `Phase 12H: UAT Issue Fixes & Stabilization` | `OPEN` | Nâng cao chất lượng báo cáo kiểm toán dành cho lãnh đạo rà soát. |
| **FO-ISSUE-04** | `FO-TST-02` | `Note` | `UI / Safety Banner` | Safety Banner trên `FinancialObligationPanel.tsx` có nội dung cảnh báo rất chi tiết và an toàn, tuy nhiên chiếm khoảng cách chiều cao khá lớn trên màn hình độ phân giải nhỏ (laptop 13-14 inch). | Safety Banner giữ nguyên độ nổi bật (màu sắc, biểu tượng cảnh báo) nhưng có thể thiết kế gọn gàng hơn (Compact Mode) hoặc cho phép thu gọn một phần văn bản giải thích chi tiết (giữ lại câu cảnh báo cốt lõi 100% hiển thị). | Banner hiện tại hiển thị đầy đủ 4-5 dòng văn bản cảnh báo cố định trên top của tab Nghĩa vụ tài chính. | `Warning Only` | Tối ưu hóa layout CSS (`p-3 text-sm` thay vì `p-4 text-base`) hoặc thiết kế dạng Accordion/Collapsible banner (với câu cảnh báo chính luôn ghim cố định không thể đóng `sticky top-0`). | UI/UX Dev | `Backlog` (hoặc `Phase 12H`) | `OPEN` | Đảm bảo tính cân bằng giữa an toàn pháp lý tối đa và trải nghiệm làm việc không bị ngợp thông tin của Cán bộ. |
| **FO-ISSUE-05** | `FO-TST-11`, `FO-TST-19` | `Note` | `Backend / Error Handling` | Khi Cán bộ tải lên file PDF chứng từ có kích thước quá lớn (vượt giới hạn cấu hình của MinIO/Caddy), thông báo lỗi trả về có thể là lỗi HTTP 413 (Payload Too Large) từ web server thay vì thông báo lỗi nghiệp vụ từ NestJS. | Hệ thống bắt lỗi kích thước file ngay tại Frontend trước khi upload (`PaymentEvidencePanel.tsx`), hiển thị cảnh báo: "Dung lượng tệp tin vượt quá mức cho phép (Tối đa 10MB). Vui lòng nén file trước khi tải lên." | Hiện tại các input file `accept=".pdf,.jpg,.png"` đã hoạt động, nhưng nên bổ sung hàm kiểm tra `file.size > MAX_FILE_SIZE` trước khi gọi `axios.post` để tối ưu hóa băng thông mạng và phản hồi tức thì. | `No Safety Impact` | Thêm logic validation `if (file.size > 10 * 1024 * 1024)` trong các hàm `handleFileUpload` thuộc `TaxNoticePanel.tsx` và `PaymentEvidencePanel.tsx`. | Frontend Dev | `Phase 12H: UAT Issue Fixes & Stabilization` | `OPEN` | Cải tiến độ ổn định (Resilience) khi vận hành thực tế ở Chi cục. |

---

## Tổng kết Đánh giá Phân loại Lỗi (Issue Summary & Triage Metrics)
* **Tổng số ghi nhận (Total Issues Logged):** `5` ghi nhận.
* **Mức độ Critical (Safety Violations):** `0` (Tuyệt đối không phát hiện lỗ hổng an toàn hay vi phạm ranh giới pháp lý nào).
* **Mức độ High (Blocking Issues):** `1` (`FO-ISSUE-01` - Thiếu dữ liệu mô phỏng case mẫu để chạy UAT interactive).
* **Mức độ Medium:** `0`.
* **Mức độ Low:** `1` (`FO-ISSUE-03` - Tối ưu hiển thị ngôn ngữ nhật ký kiểm toán).
* **Mức độ Note (Enhancement Suggestions):** `3` (`FO-ISSUE-02`, `FO-ISSUE-04`, `FO-ISSUE-05`).

### Tác động An toàn (Safety Impact Breakdown):
* **Blocks UAT:** `1` (`FO-ISSUE-01`).
* **Blocks Release:** `0`.
* **Requires Fix Before Pilot:** `0`.
* **Warning Only:** `2` (`FO-ISSUE-02`, `FO-ISSUE-04`).
* **No Safety Impact:** `2` (`FO-ISSUE-03`, `FO-ISSUE-05`).

> [!TIP]
> **KẾ HOẠCH HÀNH ĐỘNG PHASE 12H (TRIAGE ROADMAP):**
> Nhờ việc **không phát hiện lỗi Critical nào vi phạm 14 nguyên tắc an toàn**, module Nghĩa vụ tài chính được đánh giá là **có nền tảng kiến trúc rất vững chắc**.
> Mục tiêu trọng tâm duy nhất của `Phase 12H` là giải quyết `FO-ISSUE-01` thông qua Kế hoạch chuẩn bị dữ liệu mẫu UAT (`Demo Data Preparation Plan`), kết hợp tinh chỉnh nhỏ các góp ý UX (`FO-ISSUE-02`, `FO-ISSUE-03`, `FO-ISSUE-05`) để tiến tới nghiệm thu Pilot chính thức.
