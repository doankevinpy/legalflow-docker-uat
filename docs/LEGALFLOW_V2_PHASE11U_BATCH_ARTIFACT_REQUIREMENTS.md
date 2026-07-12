# LEGALFLOW V2 - PHASE 11U
# BATCH ARTIFACT REQUIREMENTS

## 1. Purpose

Tài liệu này quy định Chuẩn mực Kỹ thuật và Yêu cầu Bắt buộc đối với các Tệp đối tượng dữ liệu Lô (`Batch Artifact Requirements`) được thiết lập tại Phase 11U nhằm hướng dẫn người dùng và cơ quan quản lý nhà nước cung cấp các tệp manifest, tệp dữ liệu, mã băm SHA256 và bằng chứng phê duyệt cho Lô Pilot `BATCH-2024-001` một cách chuẩn chỉnh tuyệt đối.  
Việc tuân thủ 100% các tiêu chuẩn về đặt tên, tính toàn vẹn, nguyên tắc sinh mã băm và lưu trữ tài liệu trong quy định này là điều kiện tiên quyết (`Prerequisite Gate`) trước khi Lô dữ liệu mẫu số 01 được đưa vào rà soát sẵn sàng thực thi nạp tại **Phase 11V**.

## 2. Minimum Required Artifact List Before Phase 11V

Để Lô ứng viên Pilot `BATCH-2024-001` đủ điều kiện trình lên phiên rà soát thực thi nạp (`Execution Readiness Gate`) tại Phase 11V, 8 đối tượng tài liệu bằng chứng (`Artifacts`) sau buộc phải hiện diện đầy đủ, hợp lệ trong hệ thống:
1. **`manifest-batch-2024-001.json` (hoặc file manifest tương đương):** Tệp cấu trúc tổng hợp JSON ghi nhận siêu dữ liệu lô, số lượng bản ghi (`totalRecords: 1`), danh sách ID và thông số niêm phong (`TEMPLATE ONLY - DO NOT IMPORT` nếu là bản mẫu hướng dẫn).
2. **`BATCH-2024-001.csv` hoặc `BATCH-2024-001.json`:** Tệp dữ liệu thực tế chứa 29 cột thông tin chuẩn hóa của bản ghi Quy trình nội bộ SOP `888/QĐ-UBND` Tỉnh X (`REG-2024-005`).
3. **File hoặc tài liệu nguồn chính thức cho `REG-2024-005`:** Tệp toàn văn PDF/Word của Quyết định `888/QĐ-UBND` kèm URL liên kết về Cổng TTĐT chính thức (`sotnmt.tinhx.gov.vn`).
4. **Approval evidence thật:** Phiếu ký duyệt hoặc biên bản xác nhận đồng ý nạp (`Approved`) có chữ ký của Cán bộ rà soát (`Reviewer`) và Lãnh đạo Vụ Pháp chế (`Approver`).
5. **SHA256 tính từ file thật:** Chuỗi mã băm SHA256 hợp lệ 64 ký tự hex được sinh ra trực tiếp từ tệp manifest/CSV thực tế.
6. **Validation dry-run result:** Nhật ký hoặc biên bản kết quả gọi API `POST /import/validate` trả về trạng thái `Valid: 100%`, `Errors: 0`.
7. **Import reason:** Lý do nghiệp vụ hợp lệ và chính đáng để thi hành nạp Lô Pilot (`Controlled pilot import for BATCH-2024-001 after evidence completion and approval verification`).
8. **Confirmation text:** Cam kết hiểu rõ quy định rào chắn an toàn hệ thống (`I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION`).

## 3. Naming Convention Rules

Các tệp dữ liệu và manifest phải tuân thủ nghiêm ngặt quy tắc đặt tên chuẩn hóa (`Naming Convention Rules`):
- **Cú pháp manifest file:** `manifest-batch-YYYY-NNN.json` (Ví dụ: `manifest-batch-2024-001.json`).
- **Cú pháp batch data file:** `BATCH-YYYY-NNN.csv` hoặc `BATCH-YYYY-NNN.json` (Ví dụ: `BATCH-2024-001.csv`).
- **Cú pháp chữ ký/biên bản phê duyệt:** `approval-batch-YYYY-NNN.pdf` hoặc tích hợp vào tài liệu markdown quản trị `LEGALFLOW_V2_PHASE11V_APPROVER_SIGNOFF.md`.
- *Quy định cấm:* Cấm đặt tên chung chung như `data.csv`, `test.json`, `batch.csv` hoặc chứa ký tự đặc biệt/khoảng trắng làm ảnh hưởng luồng đọc tin tự động.

## 4. File Integrity & Schema Rules

Tệp dữ liệu cung cấp phải bảo đảm tính toàn vẹn tuyệt đối (`File Integrity & Schema Compliance`):
- **Mã hóa và định dạng (`Encoding`):** Bắt buộc sử dụng định dạng `UTF-8 without BOM` để tránh lỗi ký tự phẩy/kép trên các hệ thống Unix/Linux/Docker.
- **Kích thước tệp (`File Size Constraints`):** Tệp manifest và tệp CSV không được phép là tệp rỗng (`Zero-byte file`). Kích thước tối thiểu cho một tệp lô hợp lệ chứa 1 bản ghi 29 cột phải từ `1.5 KB` đến `500 KB`.
- **Độ chuẩn hóa cột (`29-Column Schema`):** Bản ghi `REG-2024-005` bên trong tệp dữ liệu phải đầy đủ 29 cột theo chuẩn `LegalKnowledgeService` (từ `code`, `title`, `documentNumber`, `issuingAuthority`, `effectiveDate`, `category`, `subCategory`, tới `tags`, `metadata`, `status`...). Không được thiếu cột bắt buộc (`code`, `title`).

## 5. Hash Generation Rules (`SHA256 Validation Standard`)

Quy tắc tính toán và kiểm chứng mã băm SHA256 là tường lửa niêm phong chống gian lận (`Anti-Tampering Hash Rules`):
- **Công cụ tính băm chuẩn (`Authorized Hash Tools`):** Cán bộ kỹ thuật chỉ được sử dụng lệnh hệ thống chính thức để sinh mã băm:
  - Trên Windows PowerShell: `Get-FileHash -Path .\docs\manifest-batch-2024-001.json -Algorithm SHA256 | Select-Object Hash`
  - Trên Linux/Mac/Docker: `sha256sum docs/manifest-batch-2024-001.json`
- **Quy định cấm mã băm rỗng (`Zero-byte Hash Prohibition`):** Cấm tuyệt đối việc sử dụng hoặc tham chiếu mã băm `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` (mã băm chuẩn của chuỗi rỗng `""`). Bất kỳ tệp nào có mã băm này đều bị coi là tệp rỗng/bị khuyết và bị từ chối tự động.
- **Tính duy nhất (`Hash Uniqueness`):** Mã băm SHA256 phải được tính toán mới và ghi nhận chính xác cho từng phiên bản tệp manifest. Nếu tệp manifest có 1 ký tự thay đổi, mã băm SHA256 mới phải được sinh lại và trình Lãnh đạo ký nháy lại từ đầu.

## 6. Storage & Security Rules

- **Vị trí lưu trữ hợp pháp (`Authorized Storage Locations`):** Các tệp manifest và lô dữ liệu phải được lưu trữ khoa học, minh bạch tại Thư mục `docs/` hoặc `data/` trong kho chứa mã nguồn (`Repository`).
- **Khóa chỉ đọc (`Read-only Lock`):** Sau khi được người dùng cung cấp và Lãnh đạo ký duyệt, tệp manifest chuyển sang trạng thái bất khả xâm phạm (`Locked Status`). Nghiêm cấm mọi hành vi chỉnh sửa thủ công (`manual edit`) lên tệp đã khóa.
- **Bảo mật tuyệt đối (`Zero Credential / PII Policy`):** Toàn bộ tệp bằng chứng, siêu dữ liệu hay log kiểm tra tuyệt đối không được chứa mật khẩu, API key, token kết nối (`Credentials`) hay thông tin cá nhân nhạy cảm (`PII`).

## 7. Approval Evidence Rules & Standard Import Inputs

Bằng chứng phê duyệt là văn bản pháp lý ràng buộc trách nhiệm cao nhất trước khi nạp:
- **Nguyên tắc khớp nối băm (`Hash-linked Approval Rule`):** Chữ ký của `Reviewer` (`SOP Officer D`) và `Approver` (`Manager Approver`) bắt buộc phải tuyên bố rõ ràng: *"Tôi đồng ý phê chuẩn Lô 01 với đúng tệp manifest có mã băm SHA256 là [Chuỗi 64 ký tự hex hợp lệ]."*
- **Cam kết cờ an toàn (`No Auto-Active Confirmation`):** Phiếu phê duyệt phải ghi nhận rõ việc nạp dữ liệu không làm thay đổi hay tự động kích hoạt phiên bản đang thi hành (`ACTIVE`) trên cơ sở dữ liệu.

Để bảo đảm sự thống nhất trên toàn hệ thống trong các phiên kiểm tra và nhập liệu, mọi biểu mẫu chuẩn bị nạp phải tuân thủ nghiêm ngặt 2 tham số đầu vào chuẩn hóa sau:

### Standard Confirmation Text
> ```text
> I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION
> ```

### Standard Import Reason
> ```text
> Controlled pilot import for BATCH-2024-001 after evidence completion and approval verification
> ```

---
*Ghi chú hướng dẫn cho Người dùng/Cơ quan (`Guidance Note for Intake`): Nếu quý đơn vị cần tham khảo cấu trúc tệp mẫu trước khi sinh tệp thật, vui lòng tham khảo các biểu mẫu cấu trúc tại Thư mục `docs/` mang nhãn cảnh báo:* `TEMPLATE ONLY - DO NOT IMPORT`.
