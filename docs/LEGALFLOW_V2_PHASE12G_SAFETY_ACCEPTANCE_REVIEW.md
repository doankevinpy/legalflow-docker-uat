# Báo Cáo Đánh Giá và Nghiệm Thu An Toàn Pháp Lý - Giai Đoạn 12G
## Phase 12G: Financial Obligation Safety Acceptance Review

> [!CAUTION]
> **KẾT LUẬN NGHIỆM THU AN TOÀN (FINAL SAFETY ACCEPTANCE DECISION):**
> **`SAFETY REVIEW BLOCKED`**
> *(Lý do chặn đánh giá nghiệm thu trọn vẹn: Thiếu dữ liệu mô phỏng case kiểm thử mẫu `FO-UAT-01` đến `FO-UAT-08` trong cơ sở dữ liệu UAT để thực hiện các bài test tương tác nghiệp vụ thực tế)*.
> Mặc dù kết quả rà soát kiến trúc tĩnh (Static & Architectural Safety Review) bên dưới cho thấy hệ thống **đáp ứng 100% các tiêu chí an toàn pháp lý tuyệt đối**, nghiệm thu an toàn chính thức cho Pilot vẫn cần phải tạm giữ ở trạng thái `BLOCKED` cho đến khi bộ dữ liệu mẫu được chuẩn bị và thực thi kiểm chứng hoàn chỉnh tại Phase 12H.

---

## 1. Rà soát Safety Banner (Safety Banner Review)
* **Quy chuẩn kiểm tra:** Giao diện phân hệ Nghĩa vụ tài chính phải luôn hiển thị biểu ngữ cảnh báo rõ ràng, không được che giấu hay cho phép người dùng tắt vĩnh viễn (dismiss permanently).
* **Kết quả rà soát kiến trúc:** **ĐẠT (PASS)**.
* **Chi tiết kỹ thuật:** Component `FinancialObligationSafetyBanner.tsx` được nhúng trực tiếp ở phần đầu (`top section`) của `FinancialObligationPanel.tsx`. Văn bản cảnh báo được nhấn mạnh bằng khung viền vàng/cam và biểu tượng cảnh báo rõ ràng:
  *"CẢNH BÁO AN TOÀN PHÁP LÝ: Số liệu tính toán từ AI và bảng chiết tính chỉ có tính chất THAM KHẢO và DỰ KIẾN để hỗ trợ Cán bộ rà soát. Số tiền nộp thuế chính thức BẮT BUỘC phải căn cứ vào Thông báo nộp tiền do Cơ quan Thuế có thẩm quyền phát hành."*

---

## 2. Rà soát Số tiền Dự kiến vs Số tiền Chính thức (Estimate vs Official Amount Review)
* **Quy chuẩn kiểm tra:** Bản chiết tính dự kiến (`generateDraft` / `AiDraft`) tuyệt đối không được tự động ghi nhận vào trường dữ liệu chính thức (`officialAmount` / `officialTotalAmount`).
* **Kết quả rà soát kiến trúc:** **ĐẠT (PASS)**.
* **Chi tiết kỹ thuật:**
  - Trong tầng `Prisma Schema` và `financial-obligations.service.ts`, cấu trúc dữ liệu tách biệt rõ ràng giữa hai bộ trường: `estimatedAmount` vs `officialAmount`.
  - Hàm `generateDraft(...)` chỉ có quyền thao tác trên `estimatedAmount` và hiển thị nhãn **`DỰ KIẾN - CHƯA PHẢI SỐ TIỀN CHÍNH THỨC`**.
  - Trường `officialAmount` duy nhất chỉ được cập nhật thông qua luồng nghiệp vụ Cập nhật Thông báo thuế chính thức (`addTaxNotice`), nơi Cán bộ thụ lý trực tiếp nhập số tiền căn cứ từ văn bản giấy hợp pháp của Chi cục Thuế. AI không có quyền truy cập ghi (write access) vào các trường official này.

---

## 3. Rà soát Chức năng Phát hành Thông báo Thuế (Tax Notice Issuance Review)
* **Quy chuẩn kiểm tra:** Hệ thống tuyệt đối không được cung cấp tính năng, nút bấm hay API "Phát hành thông báo thuế" thay thế thẩm quyền của Cơ quan Thuế.
* **Kết quả rà soát kiến trúc:** **ĐẠT (PASS)**.
* **Chi tiết kỹ thuật:**
  - Rà soát toàn bộ controller (`financial-obligations.controller.ts`) và dịch vụ backend: không tồn tại bất kỳ endpoint nào tạo hoặc ký phát hành văn bản thông báo thuế (`issuance`).
  - Phân hệ chỉ hoạt động theo cơ chế **Tiếp nhận & Ghi nhận (Intake & Record)** thông qua `TaxNoticePanel.tsx`. Cán bộ tải lên bản scan/PDF Thông báo thuế do Chi cục Thuế ký và phát hành bên ngoài hệ thống.

---

## 4. Rà soát Chốt chặn Hoàn thành Hồ sơ (Completion Blocking Review)
* **Quy chuẩn kiểm tra:** Hệ thống không cho phép chuyển trạng thái nghĩa vụ tài chính sang `COMPLETED` nếu thiếu Thông báo nộp tiền, thiếu Chứng từ thanh toán hoặc chưa có sự xác nhận đối chiếu của Cán bộ thụ lý.
* **Kết quả rà soát kiến trúc:** **ĐẠT (PASS - DUAL GUARDED)**.
* **Chi tiết kỹ thuật:** Chốt chặn an toàn được thực thi ở cả 2 lớp (Frontend + Backend):
  1. **Lớp Giao diện (Frontend Guard):** Component `MissingInfoChecklist.tsx` kiểm tra thời gian thực các cờ trạng thái. Nếu bất kỳ điều kiện nào (Thông báo thuế, Chứng từ nộp tiền, `isOfficerVerified`) chưa đạt, nút **Đánh dấu hoàn thành nghĩa vụ tài chính** bị khóa (`disabled`).
  2. **Lớp Nghiệp vụ (Backend API Guard):** Hàm `completeAssessment(...)` trong `financial-obligations.service.ts` kiểm tra nghiêm ngặt:
     - `if (!assessment.taxNoticeRecords.length && !assessment.isExempt) throw new BadRequestException(...)`
     - `if (!assessment.paymentEvidenceRecords.length && !assessment.isExempt) throw new BadRequestException(...)`
     - `if (!assessment.isOfficerVerified) throw new BadRequestException("Cán bộ thụ lý chưa xác nhận thẩm định...")`
     Do đó, ngay cả khi người dùng cố tình gửi request qua Postman hoặc console, backend vẫn từ chối bảo vệ an toàn tuyệt đối.

---

## 5. Rà soát Nhật ký Kiểm toán (Audit Log Review)
* **Quy chuẩn kiểm tra:** Mọi thao tác quan trọng liên quan đến dữ liệu nghĩa vụ tài chính phải được ghi vào nhật ký kiểm toán không thể chỉnh sửa (`read-only`).
* **Kết quả rà soát kiến trúc:** **ĐẠT (PASS)**.
* **Chi tiết kỹ thuật:**
  - Bảng `financial_obligation_audit_logs` được thiết kế chỉ có thao tác `CREATE` và `READ`.
  - Không tồn tại bất kỳ API `PUT`, `PATCH` hay `DELETE` nào đối với bảng nhật ký này trong `financial-obligations.controller.ts`.
  - Mọi sự kiện thay đổi (`CREATE_ASSESSMENT`, `GENERATE_DRAFT`, `ADD_TAX_NOTICE`, `ADD_PAYMENT_EVIDENCE`, `OFFICER_VERIFY`, `MANAGER_VERIFY`, `COMPLETE_ASSESSMENT`) đều tự động trigger ghi log định danh rõ `userId`, `timestamp`, và `payload diff`.

---

## 6. Rà soát Cơ chế Thông báo cho Công dân (Citizen Notification Review)
* **Quy chuẩn kiểm tra:** Hệ thống không tự động gửi email, SMS hay thông báo qua ứng dụng OTT (Zalo, Viber...) cho công dân về số tiền nộp thuế hoặc yêu cầu thanh toán.
* **Kết quả rà soát kiến trúc:** **ĐẠT (PASS)**.
* **Chi tiết kỹ thuật:**
  - Rà soát `financial-obligations.module.ts`: không inject hay import bất kỳ `NotificationModule`, `SmsService`, hay `EmailService` nào.
  - Các sự kiện của phân hệ chỉ lưu trữ trạng thái nội bộ phục vụ công tác chuyên môn của Cán bộ một cửa và Cán bộ thụ lý. Việc liên lạc với công dân tuân theo quy trình giao nhận kết quả/thông báo truyền thống của cơ quan hành chính nhà nước.

---

## 7. Rà soát Trách nhiệm Cán bộ Thụ lý (Officer Responsibility Review)
* **Quy chuẩn kiểm tra:** Đảm bảo nguyên tắc con người quyết định cuối cùng (Human-in-the-Loop), AI chỉ đóng vai trò trợ lý hỗ trợ.
* **Kết quả rà soát kiến trúc:** **ĐẠT (PASS)**.
* **Chi tiết kỹ thuật:**
  - Mọi kết quả phân tích hay chiết tính từ AI đều yêu cầu sự xác nhận và kiểm tra đối chiếu bằng mắt của Cán bộ (`OfficerVerificationPanel.tsx`).
  - Nút bấm `[Xác nhận đối chiếu chứng từ gốc hợp lệ]` đòi hỏi Cán bộ phải kiểm tra hồ sơ giấy thật trước khi xác nhận trên hệ thống. Trách nhiệm pháp lý thuộc về cán bộ thực thi nhiệm vụ theo đúng quy chế vận hành.

---

## 8. Các Rủi ro An toàn Còn lại (Remaining Safety Risks)
Do hệ thống đã được hardening rất kỹ lưỡng tại Phase 12E và 12F, **không phát hiện rủi ro vi phạm kiến trúc cốt lõi**. Tuy nhiên, rủi ro vận hành (Operational Risks) sau đây cần được quản lý:
1. **Rủi ro Nhập liệu sai thủ công (Manual Entry Risk):** Khi Cán bộ nhập tay số tiền từ bản PDF Thông báo nộp tiền của Chi cục Thuế vào trường `taxNoticeAmount`, có thể xảy ra lỗi gõ nhầm chữ số (ví dụ: `15,000,000` thành `150,000,000`).
   - *Biện pháp giảm thiểu:* UI đã có hiển thị định dạng phân cách hàng nghìn (`toLocaleString`) và cần rà soát cẩn thận trước khi bấm `officerVerify`.
2. **Rủi ro Thiếu dữ liệu kiểm thử (Test Execution Blocking Risk):** Việc chưa có dữ liệu 8 hồ sơ mẫu trong DB khiến việc kiểm tra E2E trên giao diện live bị trì hoãn.
   - *Biện pháp giảm thiểu:* Giải quyết triệt để tại Phase 12H trước khi cấp quyền mở rộng Pilot.

---

## Kết luận Đánh giá (Conclusion)
Dựa trên yêu cầu bắt buộc của quy trình kiểm thử giai đoạn 12G đối với tình trạng dữ liệu mô phỏng, Hội đồng đánh giá nghiệm thu thống nhất kết luận:

**`SAFETY REVIEW BLOCKED`**

*(Hệ thống đã đạt 100% tiêu chuẩn kiến trúc an toàn pháp lý tĩnh, chuyển tiếp sang Phase 12H để hoàn thiện bộ dữ liệu mẫu và kiểm chứng nghiệm thu tương tác cuối cùng trước khi phát hành Release Candidate)*.
