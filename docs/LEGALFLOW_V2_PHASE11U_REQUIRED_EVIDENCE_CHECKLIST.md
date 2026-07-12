# LEGALFLOW V2 - PHASE 11U
# REQUIRED EVIDENCE CHECKLIST

## 1. Purpose

Tài liệu này là Bảng rà soát các Bằng chứng Vật lý Thực tế Bắt buộc (`Required Evidence Checklist`) được thiết lập tại Phase 11U nhằm đánh giá tình trạng sẵn sàng của từng hạng mục chứng cứ đối với Lô dữ liệu ứng viên mẫu số 01 (`BATCH-2024-001`).  
Checklist quy định chuẩn mực đối chiếu cho 13 hạng mục bằng chứng toàn diện, phân loại minh bạch giữa những bằng chứng đã có sẵn trên hệ thống quản trị (`Present`) và những bằng chứng bắt buộc phải được người dùng hoặc cơ quan quản lý nhà nước cung cấp bổ sung (`Missing / Requires User Intake`), bảo đảm không có bất kỳ thao tác nạp dữ liệu nào được phép diễn ra khi Sổ rà soát này chưa đạt trạng thái hoàn thiện 100%.

## 2. Evidence Status Definitions

Hệ thống định nghĩa 5 mức giá trị quyết định thẩm định bằng chứng chuẩn (`Decision Values`):
- `COMPLETE`: Hạng mục bằng chứng đã tồn tại đầy đủ trong kho dữ liệu, đã kiểm chứng xác thực và sẵn sàng cho thao tác nạp.
- `INCOMPLETE`: Hạng mục bằng chứng còn khuyết thiếu một phần hoặc đang trong quá trình chuẩn hóa, chưa đạt điều kiện niêm phong.
- `REQUIRES USER-PROVIDED SOURCE`: Hạng mục bằng chứng thuộc thẩm quyền cung cấp của người dùng hoặc cơ quan hành chính nhà nước (như tệp manifest gốc, tệp dữ liệu CSV/JSON thật, chữ ký Lãnh đạo); AI tuyệt đối không tự ý sinh giả.
- `REJECTED`: Hạng mục bằng chứng vi phạm nguyên tắc an toàn, không hợp lệ hoặc chứa thông tin sai lệch bị từ chối công nhận.
- `NOT APPLICABLE`: Hạng mục bằng chứng không áp dụng cho phạm vi của chuyên đề hoặc lô dữ liệu đang xét.

## 3. Required Evidence Checklist Table

*(Tuân thủ nguyên tắc không tự điền tên thật nếu chưa được cung cấp chính thức, hệ thống sử dụng các chức danh chuẩn hóa và mã vai trò nghiệp vụ hợp lệ):*

| Evidence ID | Evidence Item | Required Evidence | Current Status | Missing / Present | Owner | Decision | Notes |
| :--- | :--- | :--- | :---: | :---: | :--- | :---: | :--- |
| **`REQ-EVID-01`** | **locked batch file** | Tệp lô dữ liệu đầu vào (`BATCH-2024-001.csv` hoặc `.json`) được khóa niêm phong không cho phép chỉnh sửa. | `Awaiting Intake` | **Missing** | Specialist A (`STAFF`) | `REQUIRES USER-PROVIDED SOURCE` | Cần người dùng/cơ quan cung cấp tệp dữ liệu chính thức vào thư mục `data/` hoặc `docs/`. |
| **`REQ-EVID-02`** | **manifest file** | Tệp cấu trúc tổng hợp `manifest-batch-2024-001.json` quy định siêu dữ liệu, số lượng bản ghi và thông số Lô 01. | `Awaiting Intake` | **Missing** | Specialist A (`STAFF`) | `REQUIRES USER-PROVIDED SOURCE` | AI chỉ hỗ trợ chuẩn bị hướng dẫn cấu trúc; tuyệt đối không tự tạo tệp giả lập khi chưa có nguồn thật. |
| **`REQ-EVID-03`** | **batch record file** | Tệp dữ liệu chi tiết chứa dữ liệu hàng/cột của bản ghi trong Lô 01. | `Awaiting Intake` | **Missing** | Specialist A (`STAFF`) | `REQUIRES USER-PROVIDED SOURCE` | Tệp CSV 5 dòng Phase 11D không phải tệp dữ liệu khóa của riêng `BATCH-2024-001`. |
| **`REQ-EVID-04`** | **`REG-2024-005` actual data** | Dữ liệu đầy đủ 29 cột chuẩn hóa của bản ghi Quy trình nội bộ SOP `888/QĐ-UBND` Tỉnh X (`REG-2024-005`). | `Awaiting Intake` | **Missing** (in physical file) | Specialist A (`STAFF`) | `REQUIRES USER-PROVIDED SOURCE` | Nội dung siêu dữ liệu đã rà soát trên tài liệu markdown, cần đưa vào tệp CSV/JSON thực tế. |
| **`REQ-EVID-05`** | **official source evidence** | URL Cổng TTĐT chính phủ (`sotnmt.tinhx.gov.vn`) và tệp PDF toàn văn quy trình lưu trữ trên MinIO storage. | `Verified in Docs` | **Present** (Documentation only) | SOP Officer D (`STAFF`) | `INCOMPLETE` | Đường dẫn nguồn đã xác thực đầy đủ trên tài liệu markdown; cần gắn liên kết vào tệp manifest thật. |
| **`REQ-EVID-06`** | **reviewer approval evidence** | Chữ ký điện tử hoặc phiếu thẩm định chuyên môn `Reviewed / Cleaned` của Cán bộ nghiệp vụ chuyên trách. | `Recorded on Paper` | **Present** (In Phase 11R/11S Docs) | SOP Officer D (`STAFF`) | `INCOMPLETE` | Chữ ký hợp lệ nhưng phải được xác nhận bổ sung gắn liền với đúng mã băm SHA256 thực tế mới. |
| **`REQ-EVID-07`** | **approver approval evidence** | Chữ ký phê duyệt `Approval Status: Approved` của Lãnh đạo Vụ Pháp chế cho phép nạp Lô 01 có kiểm soát. | `Recorded on Paper` | **Present** (In Phase 11R/11S Docs) | Manager Approver (`MANAGER`) | `REQUIRES USER-PROVIDED SOURCE` | Yêu cầu Lãnh đạo Vụ ký nháy nghiệm thu trên mã băm SHA256 thực tế sau khi tệp manifest ra đời. |
| **`REQ-EVID-08`** | **SHA256 generated from actual file** | Mã băm SHA256 hợp lệ 64 ký tự hex được sinh ra từ chính tệp `manifest-batch-2024-001.json` vật lý thực tế. | `Not Generated` | **Missing** | Technical Operator (`ADMIN`) | `REQUIRES USER-PROVIDED SOURCE` | Sẽ được tính toán ngay khi tệp manifest chính thức được người dùng cung cấp và tải lên. |
| **`REQ-EVID-09`** | **SHA256 not empty-file hash** | Khẳng định mã băm SHA256 không được phép là giá trị `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`. | `Violation Detected` | **Missing** (Correction Needed) | Technical Operator (`ADMIN`) | `INCOMPLETE` | Mã băm hiện tại trên tài liệu Phase 11S chính là mã băm tệp rỗng; buộc phải loại bỏ triệt để. |
| **`REQ-EVID-10`** | **validation dry-run result** | Biên bản hoặc nhật ký chạy kiểm tra thử `dry-run` qua API `validate` xác nhận 100% hợp lệ, không lỗi cú pháp. | `Not Executed` | **Missing** | Specialist A (`STAFF`) | `INCOMPLETE` | Sẽ chạy thực tế qua endpoint `POST /import/validate` sau khi có tệp manifest đầu vào. |
| **`REQ-EVID-11`** | **backup plan before import** | Kịch bản sao lưu `scripts/db-backup.ps1` (~951 KB) sẵn sàng trực chiến tạo tệp `.sql` lưu trữ an toàn pre-import. | `Playbook Ready` | **Present** | Ops Team (`ADMIN`) | `COMPLETE` | Chốt chặn an toàn kỹ thuật số 1 đã sẵn sàng 100% để bảo vệ toàn vẹn DB production. |
| **`REQ-EVID-12`** | **post-import verification plan** | Kịch bản đối chiếu số lượng bản ghi `totalRecords`, kiểm tra log và nghiệm thu ngay sau khi lệnh nạp chạy xong. | `Playbook Ready` | **Present** | Ops Team (`ADMIN`) | `COMPLETE` | Quy trình kiểm toán nhanh sau nạp trong 15 phút đã được chuẩn hóa và phân nhiệm rõ ràng. |
| **`REQ-EVID-13`** | **no auto-active confirmation** | Khẳng định thi hành cờ `noAutoActive: true` tại backend và tách luồng phê duyệt Active version sang UI riêng. | `Config Verified` | **Present** | Technical Operator (`ADMIN`) | `COMPLETE` | API Backend trả về cờ `noAutoActive: true`; bảo toàn nguyên trạng thái `ACTIVE` hiện hữu 100%. |

## 4. Summary of Evidence Readiness

Căn cứ vào Bảng rà soát 13 tiêu chí trên, Hội đồng Thẩm định Khẳng định Trạng thái Bằng chứng Tổng thể của Lô Pilot `BATCH-2024-001` tại Phase 11U:
- **Số hạng mục đạt `COMPLETE` (Đã sẵn sàng trọn vẹn):** `3 / 13` hạng mục (`REQ-EVID-11`, `12`, `13` &mdash; các rào chắn kỹ thuật sao lưu, hậu nghiệm thu và cấu trúc cờ API `noAutoActive: true`).
- **Số hạng mục `INCOMPLETE` (Cần gắn kết băm / bổ sung):** `4 / 13` hạng mục (`REQ-EVID-05`, `06`, `09`, `10`).
- **Số hạng mục `REQUIRES USER-PROVIDED SOURCE` (Khuyết tệp dữ liệu thực tế / Yêu cầu người dùng cung cấp):** `6 / 13` hạng mục (`REQ-EVID-01`, `02`, `03`, `04`, `07`, `08`).

**Kết luận đánh giá tổng quan (`Overall Checklist Assessment`):**  
### `INCOMPLETE - REQUIRES USER-PROVIDED SOURCE`
*(BẰNG CHỨNG THỰC TẾ CHƯA ĐẦY ĐỦ - BẮT BUỘC PHẢI CHỜ NGƯỜI DÙNG HOẶC CƠ QUAN CÓ THẨM QUYỀN CUNG CẤP TỆP MANIFEST VÀ TỆP DỮ LIỆU CHÍNH THỨC TRƯỚC KHI CẤP PHÉP NẠP)*
