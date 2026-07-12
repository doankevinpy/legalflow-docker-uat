# LEGALFLOW V2 - PHASE 12B
# FINANCIAL OBLIGATION DATA MODEL & API PLAN COMPLETION REPORT

**Proposed RC Tag:** `v2.12.1-financial-obligation-data-model-api-plan`  
**Baseline hiện tại:** `v2.12.0-financial-obligation-support-design`  
**Ngày hoàn thành:** 12/07/2026  
**Phạm vi:** Kế hoạch Triển khai Mô hình Dữ liệu, Đặc tả Hợp đồng API, Ma trận Phân quyền RBAC, Kiểm toán Bất biến và Kịch bản Kiểm thử cho Module "Hỗ trợ nghĩa vụ tài chính" (`Financial Obligation Data Model & API Implementation Technical Blueprint Pack`).

---

## 1. Scope Completed

Văn bản này xác nhận hoàn thành chuẩn chỉnh toàn bộ phạm vi lập Kế hoạch Kỹ thuật và Đặc tả Mô hình Dữ liệu (`Data Model & API Plan Blueprint`) thuộc **Phase 12B: Financial Obligation Data Model & API Implementation Plan**:
- **Data Model & API Plan:** Kế hoạch triển khai kỹ thuật tổng thể, xác lập 6 mục tiêu chuẩn bị nền tảng trước lập trình (`Schema, API, RBAC, Audit, Validation, Test Plan`), niêm yết Nguyên tắc An toàn Cốt lõi và định hình lộ trình phát triển kỹ thuật 6 giai đoạn (`Phase 12A..12F`).
- **Schema Draft & Migration Impact:** Phác thảo chi tiết cấu trúc mã nguồn DDL Prisma dự kiến cho 5 bảng (`FinancialObligationAssessment`, `FinancialObligationItem`, `TaxNoticeRecord`, `PaymentEvidenceRecord`, `FinancialObligationAuditLog`), 9 kiểu dữ liệu liệt kê (`Enums`), ma trận giảm thiểu 5 rủi ro di trú (`Migration Risk Assessment`) và cam kết bằng văn bản về tình trạng không sửa schema trong Phase 12B.
- **API Contract Spec:** Đặc tả chuẩn giao thức REST cho 12 endpoint rà soát, chiết tính, tải thông báo thuế và nghiệm thu chứng từ; thiết lập 6 quy tắc giao tiếp bắt buộc cấm AI tạo số tiền chính thức; chuẩn hóa mảng `safetyWarnings` trong mọi JSON response và ban hành bảng 7 mã lỗi ngoại lệ nghiệp vụ (`Error Handling Matrix`).
- **RBAC, Audit & Safety Spec:** Xây dựng ma trận phân quyền 10 tác vụ trên 4 vai trò (`STAFF`, `MANAGER`, `ADMIN`, `AI System`); thiết lập 7 giới hạn cấm tuyệt đối của AI System; chuẩn hóa cấu trúc payload cho 9 sự kiện nhật ký kiểm toán bất biến; và lập biểu đồ luồng 6 tuần tự rào chắn khóa hoàn thành (`Completion Blocking Rules Chain`).
- **Test Plan:** Quy hoạch bộ kịch bản kiểm thử toàn diện gồm 12 test cases tự động Backend (`Jest/Supertest`), 9 test cases tự động Frontend UI/UX (`Playwright`), 6 mẫu hồ sơ nghiệm thu thực tiễn (`UAT Samples`) và 6 tiêu chí nghiệm thu tối thượng bảo chứng sự kiểm soát của con người.
- **Safety Confirmation:** Lập cam kết xác nhận tuân thủ trọn vẹn 17 ràng buộc giới hạn tuyệt đối của Phase 12B, bảo vệ nguyên trạng mã nguồn và cơ sở dữ liệu production.

---

## 2. Files Created

Toàn bộ tài liệu kế hoạch mô hình dữ liệu, phác thảo schema, hợp đồng API, phân quyền kiểm toán và kịch bản kiểm thử Phase 12B đã được tạo mới chính thức tại Thư mục `docs/`:
1. [docs/LEGALFLOW_V2_PHASE12B_FINANCIAL_OBLIGATION_DATA_MODEL_API_PLAN.md](file:///C:/Users/Admin/legalflow-docker-uat/docs/LEGALFLOW_V2_PHASE12B_FINANCIAL_OBLIGATION_DATA_MODEL_API_PLAN.md): Kế hoạch triển khai kỹ thuật tổng thể, 6 mục tiêu chuẩn bị, nguyên tắc an toàn cốt lõi và lộ trình Phase 12A..12F.
2. [docs/LEGALFLOW_V2_PHASE12B_SCHEMA_DRAFT_AND_MIGRATION_IMPACT.md](file:///C:/Users/Admin/legalflow-docker-uat/docs/LEGALFLOW_V2_PHASE12B_SCHEMA_DRAFT_AND_MIGRATION_IMPACT.md): Phác thảo mã nguồn DDL Prisma 5 bảng mới (`Assessment`, `Item`, `TaxNotice`, `PaymentEvidence`, `AuditLog`), 9 Enums chuẩn và ma trận quản trị rủi ro di trú.
3. [docs/LEGALFLOW_V2_PHASE12B_API_CONTRACT_SPEC.md](file:///C:/Users/Admin/legalflow-docker-uat/docs/LEGALFLOW_V2_PHASE12B_API_CONTRACT_SPEC.md): Hợp đồng REST 12 endpoint, cấu trúc JSON response chuẩn hóa mảng `safetyWarnings` và bảng 7 mã lỗi nghiệp vụ.
4. [docs/LEGALFLOW_V2_PHASE12B_RBAC_AUDIT_SAFETY_SPEC.md](file:///C:/Users/Admin/legalflow-docker-uat/docs/LEGALFLOW_V2_PHASE12B_RBAC_AUDIT_SAFETY_SPEC.md): Ma trận quyền 10 tác vụ, 7 lệnh cấm tuyệt đối của AI System, 9 sự kiện nhật ký kiểm toán và chuỗi 6 rào chắn khóa hoàn thành.
5. [docs/LEGALFLOW_V2_PHASE12B_FINANCIAL_OBLIGATION_TEST_PLAN.md](file:///C:/Users/Admin/legalflow-docker-uat/docs/LEGALFLOW_V2_PHASE12B_FINANCIAL_OBLIGATION_TEST_PLAN.md): Kế hoạch kiểm thử với 12 test cases Backend, 9 test cases Frontend, 6 mẫu hồ sơ UAT thực tiễn và 6 tiêu chí nghiệm thu tối thượng.

---

## 3. Safety Confirmation

Xin cam kết và khẳng định tuân thủ tuyệt đối 100% các nguyên tắc bảo vệ an toàn và phân định thẩm quyền của hệ thống LegalFlow V2 trong suốt quá trình lập kế hoạch kỹ thuật tại Phase 12B:

- [x] **Chỉ tạo/cập nhật tài liệu trong `docs`:** Toàn bộ 5 tệp đặc tả kỹ thuật tạo mới nằm gọn trong `docs/`, giữ sạch root và các thư mục khác.
- [x] **Không sửa Backend Code (`nest-api`):** Giữ nguyên nguyên trạng 100% mã nguồn backend (`Zero code modification`).
- [x] **Không sửa Frontend Code (`vite-ui`):** Giữ nguyên nguyên trạng 100% mã nguồn frontend (`Zero code modification`).
- [x] **Không sửa Prisma Schema (`schema.prisma`):** Bảo toàn nguyên trạng cấu trúc cơ sở dữ liệu hiện có (`No schema modification`). Toàn bộ DDL trong File 2 chỉ là bản nháp thiết kế (`Draft Blueprint`).
- [x] **Không tạo hay thực thi Migration:** Không sinh ra bất kỳ file migration mới nào trong `prisma/migrations/`.
- [x] **Không chỉnh sửa cấu trúc hay nội dung `.env`:** Bảo toàn tuyệt đối các biến môi trường và thông tin kết nối hệ thống.
- [x] **Không Reset hay Restore Database:** Không thực thi bất kỳ lệnh khôi phục hay đặt lại trạng thái cơ sở dữ liệu đang vận hành.
- [x] **Không Seed DB (`prisma db seed`):** Không chạy lệnh tạo dữ liệu tự động làm ảnh hưởng dữ liệu thực tế.
- [x] **Không tính số tiền chính thức (`No Official Amount Calculation`):** Kế hoạch API quy định rõ cấm AI hoặc các hàm tự động gán giá trị vào `officialTotalAmount`. Số tiền chính thức chỉ do con người (`STAFF/MANAGER`) nhập từ Thông báo của Cơ quan Thuế.
- [x] **Không phát hành thông báo thuế (`No Tax Notice Issuance`):** Hợp đồng API không có bất kỳ endpoint nào phục vụ việc phát hành, ký duyệt hay in "Thông báo nộp tiền chính thức" thay Cơ quan Thuế.
- [x] **Không thay thế cơ quan thuế (`No Replacement of Tax Authority`):** Đặc tả khẳng định Cơ quan Thuế là chủ thể duy nhất có thẩm quyền ban hành văn bản xác định số tiền chính thức phải nộp.
- [x] **Không tự đánh dấu hồ sơ đã hoàn thành nghĩa vụ tài chính (`No Auto Complete`):** Kế hoạch API thiết lập chuỗi rào chắn chặn chốt (`mark-completed endpoint guardrails`), cấm tự động chuyển trạng thái nếu thiếu chứng từ hoặc thiếu chữ ký xác nhận của Cán bộ.
- [x] **Không tự gửi email/SMS/Zalo cho công dân (`No Direct Citizen Messaging`):** Không thiết kế endpoint hay webhook ngầm tự động gửi tin nhắn số tiền dự kiến cho người dân.
- [x] **Không ghi password/token/secret:** Toàn bộ tài liệu đặc tả kỹ thuật 100% sạch, không chứa credential hay thông tin nhạy cảm (`PII`).
- [x] **Không commit/tag thay chủ dự án:** Chỉ chuẩn bị sẵn sàng 5 file tài liệu trong working tree, không tự ý chạy `git commit` hay `git tag`.
- [x] **AI chỉ hỗ trợ rà soát, gợi ý, nhắc thiếu thông tin; cán bộ phải kiểm tra:** Thiết kế RBAC xác lập AI chỉ đóng vai trò trợ lý gợi ý (`Suggestion Only`); toàn bộ trách nhiệm kiểm tra đối chiếu chứng từ thực tế thuộc về cán bộ chuyên môn thụ lý hồ sơ.

---

## 4. Proposed Tag

**`v2.12.1-financial-obligation-data-model-api-plan`**

---

## 5. Recommended Next Phase

Căn cứ vào việc hoàn tất trọn vẹn Kế hoạch Kỹ thuật và Đặc tả Mô hình Dữ liệu / API cho Module "Hỗ trợ nghĩa vụ tài chính" tại Phase 12B, lộ trình tiếp theo được khuyến nghị chuyển sang bước lập trình và thực hiện thay đổi kỹ thuật thực tế:

### `Phase 12C: Backend Financial Obligation Foundation Implementation`
*(Chính thức bổ sung 5 bảng DDL và 9 Enums vào `schema.prisma`, chạy lệnh sinh migration mới (`add_financial_obligations`), thiết lập các DTO/Class-Validator, Interceptor cảnh báo pháp lý tự động và lập trình 12 REST API endpoints tại `legalflow-backend` theo đúng các bản đặc tả kỹ thuật đã chốt tại Phase 12B).*
