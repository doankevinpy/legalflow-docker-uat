# Quy Trình Chuẩn (SOP) Tiếp Nhận & Xác Minh Bằng Chứng Pháp Lý Mở Rộng (`Evidence Intake & Verification SOP`) Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12R
## Phase 12R: Evidence Intake and Verification Standard Operating Procedure (SOP)

> [!CAUTION]
> **TÚYÊN BỐ CẤM ĐƯA DỮ LIỆU NHẠY CẢM VÀO GIT (`GIT REPOSITORY HYGIENE MANDATE`):**
> Nghiêm cấm tuyệt đối hành vi commit bản scan văn bản thật, tệp chứa chữ ký đỏ, dữ liệu cá nhân (CCCD, tên thật), tài liệu mật, password, token hoặc tệp nguồn nhạy cảm vào Git Repository. Git chỉ lưu trữ các tệp **METADATA ĐÃ LÀM SẠCH (Sanitized Metadata)**. Toàn bộ tệp chứa bằng chứng pháp lý thật phải được lưu trữ tại kho lưu trữ ngoại tuyến hoặc hệ thống văn thư an toàn được cấp phép.

---

## 1. Hướng Dẫn Tiếp Nhận Văn Bản Ký Thật (`Evidence Intake Pipeline`)
1. **Tiếp nhận ngoại tuyến:** Khi cơ quan Thuế hoặc Hội đồng Thẩm định ký duyệt văn bản giấy, bản gốc được lưu tại Văn thư của Đơn vị Một cửa. Bản scan (PDF) được đẩy vào kho lưu trữ bảo mật chung của cơ quan.
2. **Nơi lưu trữ (Ngoài Git):** Toàn bộ file PDF được lưu trữ tại hệ thống Quản lý Văn bản nội bộ (VD: `SharePoint / Voffice`) với quyền truy cập giới hạn.
3. **Mã hóa Bằng chứng (`Evidence ID`):** Mỗi bằng chứng mới được nhận một mã theo cấu trúc `EVID-[Loại]-[Năm]-[Số thứ tự]` (VD: `EVID-AGREEMENT-2026-001`).

## 2. Quy Trình Trích Xuất & Kiểm Tra Tính Hợp Lệ (`Validation & Metadata Extraction`)
Quản trị viên / Tech Lead thực hiện các bước kiểm tra (dựa trên bản gốc/scan ngoại tuyến) trước khi cập nhật metadata:
* **Kiểm tra phiên bản (`Version Check`):** Văn bản có phải là bản dự thảo hay bản ban hành chính thức cuối cùng?
* **Kiểm tra chủ thể ký (`Signatory Check`):** Chữ ký có đúng thẩm quyền của Lãnh đạo Cục/Chi cục Thuế và Đơn vị Một cửa không?
* **Kiểm tra ngày hiệu lực (`Effective Date Check`):** Có ghi rõ thời điểm bắt đầu phối hợp / mở rộng triển khai không?
* **Kiểm tra tính đầy đủ (`Completeness Check`):** Nội dung văn bản có bao gồm đủ quy định về đối chiếu chứng từ và SLA như Khung yêu cầu `INTER_AGENCY_COORDINATION_REQUIREMENTS.md` không?
* **Kiểm tra Checksum (Tùy chọn):** Nếu có hệ thống ký số, phải xác minh tính vẹn toàn của chữ ký số bằng phần mềm được cấp phép.

## 3. Nhật Ký Tiếp Nhận & Trạng Thái Bằng Chứng (`Evidence Journaling & Status`)
* **Tiêu chí `VERIFIED`:** Khi và chỉ khi văn bản đáp ứng 100% các tiêu chí kiểm tra ở Mục 2. Người xác nhận (Tech Lead / Business Owner) sẽ đổi trạng thái trong file `GAP_REGISTER.md` thành `VERIFIED`.
* **Tiêu chí `REJECTED`:** Văn bản bị trả lại nếu phát hiện thiếu mộc đỏ, sai thẩm quyền ký, hết hạn, hoặc nội dung không khớp với yêu cầu an toàn kỹ thuật.
* **Quy trình hết hiệu lực (`Expiration SOP`):** Nếu văn bản hết hạn thời gian thí điểm, trạng thái tự động chuyển sang `EXPIRED`. Mọi hoạt động truy xuất dữ liệu thật phải dừng lại cho đến khi gia hạn.
* **Phân quyền truy cập (`Access Control`):** Chỉ các cấp Quản trị hoặc Hội đồng thẩm định mới được cấp quyền đọc văn bản PDF gốc.

## 4. Cách Ghi Nhận Metadata Làm Sạch Vào Git (`Sanitized Git Logging`)
Thay vì up tệp PDF lên Git, nhân sự Kỹ thuật chỉ ghi lại thông tin meta (đã ẩn danh hóa yếu tố nhạy cảm) vào tệp nhật ký Git:
```markdown
* Evidence ID: EVID-AGREEMENT-2026-001
* Tên Văn Bản: Quy chế phối hợp thí điểm giữa CQ Một Cửa và CQ Thuế (Bản Lược Trích)
* Ngày ban hành: [NGÀY/THÁNG/NĂM]
* Thẩm quyền ký: [Chức danh, VD: Cục trưởng Cục Thuế]
* Vị trí lưu trữ vật lý/server: Server Voffice thư mục #305
* Người xác nhận: [Tên Account Admin]
```
Mọi thao tác commit metadata vào Git phải trải qua sự xem xét (Review) để đảm bảo không vi phạm quy tắc làm sạch dữ liệu.
