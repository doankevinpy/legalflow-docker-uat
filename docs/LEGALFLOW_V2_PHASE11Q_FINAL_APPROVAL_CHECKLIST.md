# LEGALFLOW V2 - PHASE 11Q
# FINAL APPROVAL CHECKLIST

## 1. Purpose

Tài liệu này là Bảng rà soát phê duyệt chốt chặn cuối cùng (`Final Approval Checklist`) được lập tại Phase 11Q nhằm thực hiện kiểm tra 2 cấp độ: cấp độ từng bản ghi (`Record-level Approval Checklist`) và cấp độ tổng thể lô nạp (`Batch-level Approval Checklist`) trước thời điểm cho phép chuyển lô dữ liệu sang thực thi nạp có kiểm soát (`Controlled Real Legal Dataset Import Execution`).  
Checklist đóng vai trò như một giấy phép thông hành kỹ thuật và pháp lý cao nhất (`Final Clearance Gateway`), kết hợp rà soát độ đầy đủ metadata với các rào chắn kỹ thuật (sao lưu DB, không tự động active version), bảo đảm tuyệt đối chỉ những bản ghi hoàn toàn tinh khôi mới được phép chạm vào cơ sở dữ liệu production.

## 2. Record-level Approval Checklist

Dưới đây là bảng rà soát thẩm định chi tiết 12 cột cho toàn bộ danh mục 5 bản ghi văn bản thực tế gốc của hệ thống tại thời điểm chốt chặn Phase 11Q:

| Source ID | Source Verified | Metadata Complete | Legal Status Checked | Amendment Checked | Local Scope Checked | Procedure Mapped | Risk Note Present | Reviewer Approved | Approver Approved | Import Decision | Notes |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **`REG-2024-001`** | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `No` | `Pending Sign-off` / `Deferred` | Đã hoàn tất chuẩn hóa metadata 100%; đang chờ Lãnh đạo Vụ Pháp chế xem xét danh mục nghị định thi hành và ký phê duyệt `Approved`. |
| **`REG-2024-002`** | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `No` | `Pending Sign-off` / `Deferred` | Đã hoàn thiện trích đoạn chuyển tiếp vào `risk_note`; chờ Lãnh đạo Vụ ký nháy nghiệm thu phiếu duyệt. |
| **`REG-2024-003`** | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `No` | `Pending Sign-off` / `Deferred` | Sở TNMT Tỉnh X đã có công văn thống nhất mã `Province X`; chờ Lãnh đạo Vụ ký `Approved` để lập lô nạp địa phương. |
| **`REG-2024-004`** | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `No` (Rejected) | **`Rejected / Excluded`** | Văn bản quy hoạch hết thời kỳ áp dụng kịch bản năm 2024 (`Expired`); bị loại bỏ hoàn toàn và từ chối nạp vĩnh viễn vào DB. |
| **`REG-2024-005`** | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | `Yes` | **`Ready for Controlled Import`** | Bản ghi SOP chuẩn mực thuộc Lô mẫu số 01 (`BATCH-2024-001`); đạt 100% tiêu chí thẩm định, có chữ ký của Reviewer/Approver. |

## 3. Batch-level Approval Checklist

Bảng dưới đây thẩm định 13 điều kiện chốt chặn cho cấp độ toàn lô nạp, đối chiếu trên cả riêng Lô mẫu số 01 (`BATCH-2024-001`) và tổng thể toàn bộ tập dữ liệu thực tế:

| Check Item | Required Evidence | Confirmed: Yes / No / N/A | Decision: GO / WARNING / NO-GO | Notes |
| :--- | :--- | :---: | :---: | :--- |
| `no Critical issue` | Khẳng định không còn bất kỳ khiếm khuyết mức `Critical` nào đang mở trên lô nạp ứng viên. | `Yes` | ✅ **GO** | Lô `BATCH-2024-001` sạch lỗi Critical 100%; bản ghi lỗi quy hoạch hết kỳ hạn (`REG-2024-004`) đã bị loại. |
| `no High unresolved issue` | Khẳng định không còn khiếm khuyết mức `High` (thiếu chữ ký, trùng lặp) đang mở trên lô ứng viên. | `Yes` | ✅ **GO** | Lô 01 đã đủ chữ ký Lãnh đạo Vụ; các lỗi High của văn bản luật khác được lập hồ sơ theo dõi riêng. |
| `all records have source` | 100% bản ghi trong lô nạp có URL dẫn tới Cổng TTĐT/Công báo hợp pháp (`.gov.vn`). | `Yes` | ✅ **GO** | Toàn bộ URL đều được xác thực HTTP status 200 từ tên miền cơ quan hành chính nhà nước. |
| `all records have effective date` | 100% bản ghi có ngày hiệu lực thi hành hợp lệ, định dạng chuẩn ISO 8601 (`YYYY-MM-DD`). | `Yes` | ✅ **GO** | Ghi nhận mốc ngày hiệu lực `2024-09-15` cho bản ghi SOP ứng viên Lô 01. |
| `no Unknown legal status` | Khẳng định không có bản ghi nào để tình trạng hiệu lực `Unknown` hay `Unverified`. | `Yes` | ✅ **GO** | Bản ghi trong lô ứng viên 01 ghi nhận chuẩn xác trạng thái `Effective`. |
| `no unresolved duplicate` | Khẳng định không có dòng trùng lặp số ký hiệu hoặc nội dung với cơ sở dữ liệu hiện hữu. | `Yes` | ✅ **GO** | Đã rà soát qua công cụ mô phỏng `Validate CSV - Dry Run`, xác nhận `0 duplicates`. |
| `local scope checked` | Phân định rạch ròi phạm vi áp dụng theo cấp hành chính (`National` hoặc `Province X`). | `Yes` | ✅ **GO** | Ghi nhận chuẩn mã địa bàn `Province X` cho SOP cấp tỉnh, khớp luồng tra cứu Một cửa. |
| `reviewer approval complete` | Cán bộ rà soát nghiệp vụ đã ký tên xác nhận chịu trách nhiệm `Reviewed / Cleaned`. | `Yes` | ✅ **GO** | Đã có chữ ký xác nhận của cán bộ chuyên trách (`SOP Officer D`). |
| `approver approval complete` | Lãnh đạo Vụ/Phòng Pháp chế ký xác nhận phê duyệt `Approval Status: Approved` trên phiếu lô nạp. | `Yes` (cho lô 01) / `No` (cho tổng thể) | ✅ **GO** (cho lô 01) / 🛑 **NO-GO** (cho lô nạp toàn bộ) | Lô 01 (`BATCH-2024-001`) đạt 100% chữ ký; tổng thể 5 văn bản gốc vẫn phải chờ Lãnh đạo ký nốt. |
| `backup plan ready` | Kịch bản và quy trình sao lưu cơ sở dữ liệu (`pg_dump`) sẵn sàng chạy ngay trước giờ nạp. | `Yes` | ✅ **GO** | Playbook sao lưu `.sql` đã kiểm chứng (~951 KB); sẵn sàng chạy tại Phase 11R trước giờ G. |
| `rollback plan ready` | Kịch bản khôi phục (`DR Playbook`) và đội ngũ trực chiến sẵn sàng khôi phục DB trong 5 phút. | `Yes` | ✅ **GO** | Playbook khôi phục khẩn cấp đã được phân công cho Ops Team trực chiến. |
| `no auto-active confirmed` | Khẳng định thi hành cờ `noAutoActive: true` sau nạp; việc kích hoạt version tách luồng riêng. | `Yes` | ✅ **GO** | API trả về cờ `noAutoActive: true`; DB bảo toàn nguyên trạng thái `ACTIVE` hiện hữu của hệ thống. |
| `active approval separate` | Quy trình kích hoạt phiên bản (`Active Version`) được tách luồng thành 3 bước độc lập tại UI riêng. | `Yes` | ✅ **GO** | Module `Version Governance UI` (`Phase 8F-E`) sẵn sàng tiếp nhận kiểm soát sau khi lệnh nạp xong. |

## 4. Approval Decision

Căn cứ kết quả thẩm định trên cả 2 cấp độ từng bản ghi và toàn lô nạp (đối với tổng thể bộ dữ liệu 5 văn bản gốc ban đầu vẫn còn 4 văn bản đang trong backlog chờ chữ ký Lãnh đạo hoặc bị loại bỏ, tuy nhiên Lô dữ liệu ứng viên mẫu số 01 `BATCH-2024-001` chứa bản ghi SOP `REG-2024-005` đã hoàn tất 100% rà soát, sạch lỗi Critical/High và có đầy đủ chữ ký Lãnh đạo Vụ Pháp chế), Lãnh đạo Vụ Pháp chế và Hội đồng Thẩm định chính thức ra Quyết định Phê duyệt (`Approval Decision`):

- **Quyết định đối với Tổng thể Bộ dữ liệu thật (5 văn bản gốc):**  
  ### `NOT APPROVED`
  *(TẬP DỮ LIỆU THẬT ĐẦY ĐỦ CHƯA ĐẠT ĐỦ ĐIỀU KIỆN PHÊ DUYỆT ĐỂ NẠP HÀNG LOẠT; TẠM DỪNG NẠP TOÀN BỘ VÀ TIẾP TỤC RÀ SOÁT HOÀN THIỆN TRONG BACKLOG)*

- **Quyết định đối với riêng Lô mẫu số 01 (`BATCH-2024-001`):**  
  ### `APPROVED WITH CONDITIONS`
  *(PHÊ DUYỆT CHO PHÉP CHUYỂN RIÊNG LÔ `BATCH-2024-001` SANG PHASE 11R ĐỂ THỰC THI NẠP CÓ KIỂM SOÁT VỚI ĐIỀU KIỆN TUÂN THỦ NGHIÊM NGẶT 8 TƯỜNG LỬA BẢO VỆ)*

## 5. Required Conditions If Approved With Conditions

Để có thể tiến hành thực thi nạp có kiểm soát đối với lô đã được duyệt mẫu số 01 (`BATCH-2024-001`) tại **Phase 11R**, 8 điều kiện tiên quyết sau bắt buộc phải được hoàn thiện đầy đủ và có chữ ký nghiệm thu trước khi bấm nút Execute:

| Condition | Required Evidence | Owner | Must Complete Before | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **1. backup immediately before import** | Chạy lệnh `pg_dump` sinh tệp `.sql` mới nhất ngay trước giờ thực thi và lưu an toàn ngoài Git (`backups/`). | Ops Team (`ADMIN`) | Trước thời điểm bấm Execute tại Phase 11R | Chốt chặn an toàn số 1 bảo vệ toàn vẹn DB production trước mọi rủi ro. |
| **2. final batch file locked** | Tệp CSV/JSON của lô nạp (`BATCH-2024-001`) được niêm phong mã băm (`MD5/SHA256`), không ai được chỉnh sửa. | Technical Operator (`OPERATOR`) | Trước khi tải lên giao diện Import UI | Bảo đảm tính toàn vẹn tuyệt đối của tệp dữ liệu đầu vào. |
| **3. import reason prepared** | Chuẩn bị sẵn nội dung lý do nạp rõ ràng, ghi rõ số Quyết định phê duyệt Lô 01 của Lãnh đạo Vụ Pháp chế. | Specialist A (`STAFF`) | Trước khi nhập vào form UI | Nhập vào trường `Reason` để lưu vết kiểm toán minh bạch. |
| **4. confirmation text prepared** | Chuẩn bị chuỗi từ khóa xác nhận an toàn chính xác: `"I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION"`. | Specialist A (`STAFF`) | Trước khi bấm nút Execute trên UI | Nhập đúng từ khóa vào trường `Confirmation Text` để vượt qua tường lửa API. |
| **5. importer role verified** | Tài khoản thực hiện thao tác nạp phải có quyền hạn hợp lệ (`MANAGER` hoặc `ADMIN`), tuyệt đối không dùng tài khoản thường. | ADMIN (`ADMIN`) | Trước khi đăng nhập thực thi nạp | Kiểm soát phân quyền RBAC chặt chẽ theo nguyên tắc an toàn. |
| **6. post-import verification checklist ready** | Chuẩn bị sẵn checklist kiểm chứng sau nạp (đối chiếu `totalRecords`, xác nhận cờ `noAutoActive: true` và kiểm tra log). | Ops Team + Legal Lead | Ngay trước thời điểm chạy lệnh | Kiểm toán nhanh trong vòng 15 phút sau khi lệnh nạp chạy xong. |
| **7. active version approval separate** | Khẳng định việc kích hoạt phiên bản (`Active Version`) sẽ được thực hiện qua luồng 3 bước riêng tại module Version UI (`Phase 8F-E`). | Project Owner (`ADMIN`/`MANAGER`) | Ngay sau khi hoàn tất kiểm tra sau nạp | Không được kích hoạt ngay sau nạp; phải có phiên họp phê duyệt riêng. |
| **8. rollback plan verified** | Lãnh đạo Kỹ thuật xác nhận Kịch bản khôi phục khẩn cấp (`DR Playbook`) sẵn sàng chạy phục hồi DB trong 5 phút nếu lỗi. | Ops Team (`ADMIN`) | Trước khi bấm nút Execute tại Phase 11R | Đảm bảo khả năng phục hồi thần tốc nếu phát sinh sự cố bất ngờ. |
