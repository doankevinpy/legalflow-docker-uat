# LEGALFLOW V2 - PHASE 12A
# FINANCIAL OBLIGATION SUPPORT DESIGN COMPLETION REPORT

**Proposed RC Tag:** `v2.12.0-financial-obligation-support-design`  
**Baseline hiện tại:** `v2.11.21-pilot-batch-evidence-completion`  
**Ngày hoàn thành:** 12/07/2026  
**Phạm vi:** Thiết kế An toàn Nghiệp vụ, Quy trình Làm việc, Mô hình Dữ liệu Dự kiến và Đặc tả UI/UX cho Module "Hỗ trợ nghĩa vụ tài chính" (`Financial Obligation Support Module Safety & Functional Design Pack`).

---

## 1. Scope Completed

Văn bản này xác nhận hoàn thành chuẩn chỉnh toàn bộ phạm vi xây dựng Bộ tài liệu Thiết kế An toàn và Nghiệp vụ (`Safety & Functional Design Pack`) thuộc **Phase 12A: Financial Obligation Support Module - Safety & Functional Design**:
- **Design Plan:** Thiết lập kế hoạch tổng thể module Hỗ trợ nghĩa vụ tài chính cho hồ sơ đất đai, xác lập 8 mục tiêu cốt lõi, danh mục hành vi bị cấm tuyệt đối (`Out of scope prohibitions`), niêm yết Banner cảnh báo an toàn bắt buộc và định hình lộ trình triển khai 6 giai đoạn (`Phase 12A..12F`).
- **Requirements:** Ban hành ma trận phân quyền 6 vai trò (`STAFF`, `MANAGER`, `ADMIN`, `AI System`, `Tax Authority`, `Citizen`) nhấn mạnh giới hạn của AI (chỉ gợi ý, không kết luận chính thức, không phát hành thông báo, không đánh dấu hoàn thành); phân loại 6 nhóm hồ sơ đất đai hỗ trợ; chuẩn hóa 12 nhóm trường dữ liệu đầu vào; định nghĩa 8 loại đầu ra nghiệp vụ và quy định 4 cụm từ cảnh báo bắt buộc.
- **Workflow:** Thiết lập quy trình thụ lý 13 bước tuần tự từ Một cửa, rà soát AI, liên thông Thuế tới đối chiếu chứng từ nộp tiền; xây dựng Mô hình trạng thái 13 mức (`State Model`); ban hành 6 rào chắn tuyệt đối (`Absolute Blocking Rules`) khóa hoàn thành nếu chưa có thông báo/chứng từ hợp lệ hay chỉ có kết quả AI; và lập danh mục 9 sự kiện nhật ký kiểm toán (`Audit Trail`).
- **Data Model Draft:** Phác thảo kiến trúc thực thể khái niệm (`Conceptual Schema`) gồm 5 thực thể chính (`FinancialObligationAssessment`, `FinancialObligationItem`, `TaxNoticeRecord`, `PaymentEvidenceRecord`, `FinancialObligationAuditLog`) và quy định 5 nguyên tắc kiến trúc bất khả xâm phạm bảo đảm tách biệt tuyệt đối giữa số tiền dự kiến (`estimatedAmount`) và số tiền chính thức (`officialAmount`).
- **UI/UX Spec:** Đặc tả giao diện tab “Nghĩa vụ tài chính” tại 3 vị trí chiến lược, cấu trúc 10 phân vùng chức năng rõ rệt, thiết lập ma trận nút bấm được phép vs. bị cấm (`No Issue Tax Notice button`, `No Auto Complete button`), chuẩn hóa 5 trạng thái rỗng (`Empty States`) và quy định màu sắc hiển thị nhãn cảnh báo `DỰ KIẾN`.
- **Safety Confirmation:** Lập cam kết xác nhận tuân thủ trọn vẹn 19 ràng buộc giới hạn tuyệt đối của Phase 12A, bảo vệ nguyên trạng mã nguồn và cơ sở dữ liệu.

---

## 2. Files Created

Toàn bộ tài liệu kế hoạch thiết kế, yêu cầu nghiệp vụ, quy trình, mô hình dữ liệu dự kiến và đặc tả giao diện Phase 12A đã được tạo mới chính thức tại Thư mục `docs/`:
1. [docs/LEGALFLOW_V2_PHASE12A_FINANCIAL_OBLIGATION_SUPPORT_DESIGN_PLAN.md](file:///C:/Users/Admin/legalflow-docker-uat/docs/LEGALFLOW_V2_PHASE12A_FINANCIAL_OBLIGATION_SUPPORT_DESIGN_PLAN.md): Kế hoạch thiết kế module Hỗ trợ nghĩa vụ tài chính, 8 mục tiêu, giới hạn cấm tuyệt đối, Banner cảnh báo và lộ trình Phase 12A..12F.
2. [docs/LEGALFLOW_V2_PHASE12A_FINANCIAL_OBLIGATION_REQUIREMENTS.md](file:///C:/Users/Admin/legalflow-docker-uat/docs/LEGALFLOW_V2_PHASE12A_FINANCIAL_OBLIGATION_REQUIREMENTS.md): Ma trận quyền 6 vai trò (giới hạn AI System), 6 loại hồ sơ đất đai, 12 nhóm đầu vào chuẩn, 8 loại đầu ra và 4 cụm từ cảnh báo bắt buộc.
3. [docs/LEGALFLOW_V2_PHASE12A_FINANCIAL_OBLIGATION_WORKFLOW.md](file:///C:/Users/Admin/legalflow-docker-uat/docs/LEGALFLOW_V2_PHASE12A_FINANCIAL_OBLIGATION_WORKFLOW.md): Quy trình nghiệp vụ 13 bước, mô hình trạng thái 13 mức, 6 rào chắn khóa hoàn thành và 9 sự kiện nhật ký kiểm toán.
4. [docs/LEGALFLOW_V2_PHASE12A_FINANCIAL_OBLIGATION_DATA_MODEL_DRAFT.md](file:///C:/Users/Admin/legalflow-docker-uat/docs/LEGALFLOW_V2_PHASE12A_FINANCIAL_OBLIGATION_DATA_MODEL_DRAFT.md): Kiến trúc khái niệm 5 thực thể dữ liệu (`Assessment`, `Item`, `TaxNotice`, `PaymentEvidence`, `AuditLog`) và 5 nguyên tắc tách biệt con số dự kiến/chính thức.
5. [docs/LEGALFLOW_V2_PHASE12A_FINANCIAL_OBLIGATION_UI_UX_SPEC.md](file:///C:/Users/Admin/legalflow-docker-uat/docs/LEGALFLOW_V2_PHASE12A_FINANCIAL_OBLIGATION_UI_UX_SPEC.md): Đặc tả giao diện 10 phân vùng, ma trận nút bấm được phép vs. bị cấm (`No Issue Tax Notice`), 5 trạng thái rỗng và nhãn hiển thị `⚠️ DỰ KIẾN`.

---

## 3. Safety Confirmation

Xin cam kết và khẳng định tuân thủ tuyệt đối 100% các nguyên tắc bảo vệ an toàn và phân định thẩm quyền của hệ thống LegalFlow V2 trong suốt quá trình triển khai Phase 12A:

- [x] **Chỉ tạo/cập nhật tài liệu trong `docs`:** Toàn bộ 5 tệp thiết kế tạo mới nằm gọn trong `docs/`, giữ sạch root và các thư mục khác.
- [x] **Không sửa Backend (`nest-api`):** Giữ nguyên nguyên trạng 100% mã nguồn backend (`Zero code modification`).
- [x] **Không sửa Frontend (`vite-ui`):** Giữ nguyên nguyên trạng 100% mã nguồn frontend (`Zero code modification`).
- [x] **Không sửa Prisma Schema (`schema.prisma`):** Bảo toàn nguyên trạng cấu trúc cơ sở dữ liệu hiện có (`No schema modification`).
- [x] **Không tạo hay thực thi Migration:** Không sinh ra bất kỳ file migration mới nào trong `prisma/migrations/`.
- [x] **Không chỉnh sửa cấu trúc hay nội dung `.env`:** Bảo toàn tuyệt đối các biến môi trường và thông tin kết nối hệ thống.
- [x] **Không Seed DB (`prisma db seed`):** Không chạy lệnh tạo dữ liệu tự động làm ảnh hưởng dữ liệu thực tế.
- [x] **Không reset hay restore Database:** Không thực thi bất kỳ lệnh khôi phục hay đặt lại trạng thái cơ sở dữ liệu đang vận hành.
- [x] **Không tự tạo dữ liệu thật:** Không sinh ra hay ghi chép giả định bất kỳ dữ liệu nghĩa vụ tài chính hay thông báo thuế thật nào vào DB.
- [x] **Không tự tính số tiền chính thức (`No Self-Calculation of Official Amount`):** Thiết kế khẳng định các con số do AI hay hệ thống tính ra chỉ là dự kiến (`Estimated`), không được tự gán thành số chính thức (`Official Amount`).
- [x] **Không tự miễn/giảm nghĩa vụ tài chính (`No Auto Exemption`):** Hệ thống không tự ý áp dụng miễn hay giảm thuế tiền sử dụng đất nếu không có Quyết định phê duyệt chính thức do Lãnh đạo xác nhận.
- [x] **Không phát hành thông báo thuế (`No Tax Notice Issuance`):** Thiết kế cấm tuyệt đối nút bấm hay chức năng in/gửi thông báo nộp tiền chính thức cho công dân từ hệ thống.
- [x] **Không thay thế cơ quan thuế (`No Replacement of Tax Authority`):** Khẳng định cơ quan thuế là chủ thể duy nhất có thẩm quyền xác định số tiền chính thức phải nộp.
- [x] **Không tự đánh dấu hồ sơ đã hoàn thành nghĩa vụ tài chính (`No Auto Complete`):** Hệ thống cấm tự động chuyển trạng thái `Completed` nếu cán bộ (`STAFF`) và Lãnh đạo (`MANAGER`) chưa đối chiếu chứng từ nộp tiền thực tế.
- [x] **Không tự gửi email/SMS/Zalo cho công dân (`No Direct Citizen Messaging`):** Không kết nối tự động gửi thông báo số tiền dự kiến hay kết quả cho công dân.
- [x] **Không ghi password/token/secret:** Toàn bộ tài liệu thiết kế 100% sạch, không chứa credential hay thông tin nhạy cảm (`PII`).
- [x] **Không commit/tag thay chủ dự án:** Chỉ chuẩn bị sẵn sàng 5 file tài liệu trong working tree, không tự ý chạy `git commit` hay `git tag`.
- [x] **AI chỉ hỗ trợ rà soát, gợi ý, nhắc thiếu thông tin; cán bộ phải kiểm tra:** Trách nhiệm kiểm tra, đối chiếu căn cứ pháp lý, bảng giá đất và chứng từ thực tế thuộc hoàn toàn về cán bộ chuyên môn thụ lý hồ sơ.

---

## 4. Proposed Tag

**`v2.12.0-financial-obligation-support-design`**

---

## 5. Recommended Next Phase

Căn cứ vào việc hoàn tất trọn vẹn Bộ tài liệu Thiết kế An toàn và Nghiệp vụ Module "Hỗ trợ nghĩa vụ tài chính" tại Phase 12A, lộ trình tiếp theo được khuyến nghị chuyển sang bước chuẩn bị mô hình kỹ thuật chi tiết:

### `Phase 12B: Financial Obligation Data Model & API Implementation Plan`
*(Xây dựng kế hoạch triển khai chi tiết cấu trúc mô hình dữ liệu Prisma, các chỉ mục (`indexes`), ràng buộc toàn vẹn khóa ngoại và chuẩn hóa hợp đồng giao tiếp API (`API Contracts / DTOs / DTO Validations`) cho Module Hỗ trợ nghĩa vụ tài chính trước khi bước vào lập trình Backend tại Phase 12C).*
