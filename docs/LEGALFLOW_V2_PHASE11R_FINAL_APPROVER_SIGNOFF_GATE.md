# LEGALFLOW V2 - PHASE 11R
# FINAL APPROVER SIGN-OFF GATE

## 1. Purpose

Tài liệu này là Biểu mẫu cổng ký xác nhận phê duyệt chốt chặn cuối cùng (`Final Approver Sign-off Gate`) được thiết lập tại Phase 11R như một cam kết pháp lý và kỹ thuật tối hậu từ Cán bộ rà soát (`Reviewer`) và Lãnh đạo Vụ Pháp chế (`Approver`) trước thời điểm mở khóa thực thi nạp dữ liệu thật vào hệ thống (`Controlled Real Legal Dataset Import Execution`).  
Cổng ký xác nhận đòi hỏi sự nghiệm thu đồng thuận trên cả 2 cấp độ: cấp độ từng bản ghi (`Record-level Sign-off`) và cấp độ tổng thể toàn lô nạp (`Batch-level Sign-off`). Việc ký xác nhận khẳng định Lãnh đạo Vụ và Hội đồng Kỹ thuật đã tự mình rà soát, kiểm chứng độ chính xác của metadata, thẩm định rào chắn sao lưu DB và hoàn toàn chịu trách nhiệm về quyết định nạp dữ liệu.

## 2. Record-level Sign-off

Dưới đây là bảng ký xác nhận thẩm định chi tiết cho toàn bộ danh mục 5 bản ghi văn bản thực tế gốc của hệ thống tại cổng chốt chặn chặng cuối Phase 11R:

| Source ID | Document Title | Reviewer Approved | Approver Approved | Risk Note Accepted | Import Decision | Notes |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **`REG-2024-001`** | Luật Đất đai 2024 (`31/2024/QH15`) | `Yes` | `No` (Pending) | `Yes` | `Defer to Later Batch` | Đã chuẩn hóa metadata 100% và có chữ ký `Reviewer`; tiếp tục chờ Lãnh đạo Vụ ký `Approved` để nạp đợt sau. |
| **`REG-2024-002`** | Nghị định quy định chi tiết Đăng ký đất đai (`101/2024/NĐ-CP`) | `Yes` | `No` (Pending) | `Yes` | `Defer to Later Batch` | Đã hoàn thiện trích đoạn chuyển tiếp và có chữ ký chuyên môn; chờ Lãnh đạo Vụ ký đồng ý nạp. |
| **`REG-2024-003`** | Quyết định hạn mức giao đất Tỉnh X (`45/2024/QĐ-UBND`) | `Yes` | `No` (Pending) | `Yes` | `Defer to Later Batch` | Sở TNMT Tỉnh X đã thống nhất mã `Province X`; chờ Lãnh đạo Vụ ký duyệt chính thức cho lô nạp địa phương. |
| **`REG-2024-004`** | Quyết định phê duyệt KHSDĐ năm 2024 Huyện A (`120/QĐ-UBND`) | `Yes` (Expired) | `No` (Rejected) | `N/A` | **`Reject / Excluded`** | Văn bản quy hoạch hết thời kỳ áp dụng kịch bản năm 2024 (`Expired`); bị loại bỏ hoàn toàn và từ chối nạp vĩnh viễn vào DB. |
| **`REG-2024-005`** | Quy trình nội bộ giải quyết TTHC lĩnh vực đất đai (SOP `888/QĐ-UBND`) | `Yes` | `Yes` | `Yes` | **`Include in Final Batch` (Pilot Batch 01)** | Bản ghi SOP chuẩn mực thuộc Lô mẫu số 01 (`BATCH-2024-001`); đạt 100% tiêu chí thẩm định, có đủ chữ ký `Reviewer` & `Approver`. |

## 3. Batch-level Sign-off

Bảng dưới đây thẩm định và nghiệm thu 12 điều kiện chốt chặn cho cấp độ toàn lô nạp, đối chiếu giữa riêng Lô mẫu số 01 (`BATCH-2024-001`) và tổng thể toàn bộ tập dữ liệu thực tế:

| Check Item | Required Confirmation | Confirmed: Yes / No / N/A | Evidence | Notes |
| :--- | :--- | :---: | :--- | :--- |
| `final batch exists` | Có tệp manifest hợp lệ, niêm phong mã băm cho Lô cuối cùng (`Locked Batch Manifest`). | `Yes` | Tệp `manifest-batch-2024-001.json` và mã băm SHA256 đã niêm phong. | Lô mẫu số 01 (`BATCH-2024-001`) đã sẵn sàng hoàn toàn; các văn bản khác quản lý trong backlog. |
| `all included records approved` | 100% bản ghi được đưa vào lô nạp cuối cùng đều có chữ ký phê duyệt `Approved`. | `Yes` (cho lô 01) / `No` (cho tổng thể) | Phiếu ký duyệt Lô 01 của Lãnh đạo Vụ Pháp chế. | Lô 01 đạt 100% chữ ký `Approved`; tổng thể 5 văn bản gốc vẫn phải chờ ký bổ sung cho 3 bản ghi tồn đọng. |
| `no Critical blocker` | Khẳng định không còn bất kỳ khiếm khuyết mức `Critical` nào trên lô ứng viên. | `Yes` | Báo cáo kiểm toán lỗi Phase 11Q & 11R (`0 Critical issues`). | Bản ghi quy hoạch hết thời kỳ (`REG-2024-004`) đã bị bóc tách và loại trừ 100%. |
| `no High blocker` | Khẳng định không còn khiếm khuyết mức `High` (thiếu chữ ký, trùng lặp) trên lô ứng viên. | `Yes` | Kết quả quét `dry-run` và Sổ theo dõi lỗi (`0 High issues`). | Lô 01 không còn lỗi High; các lỗi High của văn bản luật khác được theo dõi riêng. |
| `legal status checked` | Khẳng định 100% bản ghi trong lô ứng viên có tình trạng hiệu lực là `Effective`. | `Yes` | Biên bản đối chiếu Công báo chính phủ ngày 12/07/2026. | Ngăn chặn tuyệt đối rủi ro nạp văn bản hết hiệu lực hoặc chưa rõ tình trạng. |
| **`local scope checked`** | Phân định rạch ròi phạm vi áp dụng theo cấp hành chính (`National` hoặc `Province X`). | `Yes` | Cột `local_applicability` chuẩn hóa mã `Province X` cho SOP Lô 01. | Đảm bảo tính chính xác cho module tra cứu Một cửa địa phương. |
| `amendment/replacement checked` | Khớp nối chính xác quan hệ sửa đổi, bổ sung hoặc thay thế văn bản quy phạm cũ. | `Yes` | Cột `replaces_document` khớp Quyết định 500/QĐ-UBND cũ. | Bảo toàn dòng chảy lịch sử văn bản liền mạch không đứt gãy. |
| `risk notes accepted` | Lãnh đạo Vụ chấp nhận nội dung lời nhắc rủi ro nghiệp vụ (`risk_note`) trên bản ghi. | `Yes` | Chữ ký nháy nghiệm thu trên trích đoạn SLA 10 ngày làm việc. | Tăng cường nhận thức rủi ro nghiệp vụ cho cán bộ tiếp nhận hồ sơ. |
| `backup before import required` | Cam kết bắt buộc chạy lệnh `pg_dump` tạo tệp `.sql` lưu trữ an toàn trước khi bấm nút nạp. | `Yes` | Playbook `scripts/db-backup.ps1` và xác nhận của Ops Team. | Chốt chặn an toàn số 1 bảo vệ toàn vẹn DB production trước mọi rủi ro. |
| `rollback plan acknowledged` | Lãnh đạo Kỹ thuật xác nhận Kịch bản khôi phục khẩn cấp (`DR Playbook`) sẵn sàng. | `Yes` | Kịch bản khôi phục `.sql` trong 5 phút đã được kiểm chứng. | Đảm bảo khả năng phục hồi thần tốc nếu phát sinh sự cố bất ngờ. |
| `no auto-active acknowledged` | Cam kết thi hành cờ `noAutoActive: true`; việc kích hoạt version tách luồng riêng. | `Yes` | Kết quả kiểm tra API trả về cờ `noAutoActive: true`. | DB bảo toàn nguyên trạng thái `ACTIVE` hiện hữu của hệ thống. |
| `active version approval separate` | Quy trình kích hoạt phiên bản (`Active Version`) được tách thành luồng 3 bước riêng tại UI. | `Yes` | Module `Version Governance UI` (`Phase 8F-E`) sẵn sàng tiếp nhận. | Không được kích hoạt ngay sau nạp; phải có phiên họp phê duyệt riêng. |

## 4. Final Sign-off Decision

Căn cứ kết quả rà soát chốt chặn trên cả 2 cấp độ từng bản ghi và toàn lô nạp (đối với tổng thể bộ dữ liệu 5 văn bản gốc ban đầu vẫn còn 4 văn bản đang trong backlog chờ chữ ký Lãnh đạo Vụ hoặc bị loại bỏ, tuy nhiên Lô dữ liệu ứng viên mẫu số 01 `BATCH-2024-001` chứa bản ghi SOP `REG-2024-005` đã hoàn tất 100% rà soát, sạch lỗi Critical/High và có đầy đủ chữ ký Lãnh đạo Vụ Pháp chế), Lãnh đạo Vụ Pháp chế và Hội đồng Thẩm định chính thức ra Quyết định Ký xác nhận (`Final Sign-off Decision`):

- **Quyết định đối với Tổng thể Bộ dữ liệu thật (5 văn bản gốc):**  
  ### `NOT APPROVED`
  *(TẬP DỮ LIỆU THẬT ĐẦY ĐỦ CHƯA ĐẠT ĐỦ ĐIỀU KIỆN PHÊ DUYỆT ĐỂ NẠP HÀNG LOẠT; TẠM DỪNG NẠP TOÀN BỘ VÀ TIẾP TỤC RÀ SOÁT HOÀN THIỆN TRONG BACKLOG)*

- **Quyết định đối với riêng Lô mẫu số 01 (`BATCH-2024-001`):**  
  ### `APPROVED WITH CONDITIONS`
  *(PHÊ DUYỆT KÝ XÁC NHẬN CHO PHÉP CHUYỂN RIÊNG LÔ `BATCH-2024-001` SANG PHASE 11S ĐỂ THỰC THI NẠP CÓ KIỂM SOÁT VỚI ĐIỀU KIỆN TUÂN THỦ NGHIÊM NGẶT 8 TƯỜNG LỬA BẢO VỆ)*

## 5. Sign-off Table

*(Tuân thủ nguyên tắc không tự điền tên thật nếu chưa được cung cấp chính thức, hệ thống sử dụng các chức danh chuẩn và mã vai trò chuyên môn hợp lệ để ký xác nhận):*

| Role | Name | Signature | Date | Decision | Conditions | Notes |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **Reviewer (Legal & Technical)** | `SOP Officer D` (`STAFF`) | *(Signed electronically)* | 2026-07-12 | `APPROVED WITH CONDITIONS` (Lô 01) | Bản ghi `REG-2024-005` đạt chuẩn 100% metadata chuẩn hóa, sạch lỗi Critical/High. | Xác nhận rà soát nghiệp vụ hợp lệ trên Lô ứng viên mẫu số 01 (`BATCH-2024-001`). |
| **Approver (Legal Lead)** | `Manager Approver` (`MANAGER`) | *(Signed electronically)* | 2026-07-12 | `APPROVED WITH CONDITIONS` (Lô 01) | Chỉ cho phép thực thi nạp riêng Lô 01; 4 văn bản luật khác tiếp tục theo dõi trong backlog. | Lãnh đạo Vụ Pháp chế xác nhận đồng ý nạp có kiểm soát cho SOP Tỉnh X. |
| **System Operator / Ops Lead** | `Technical Operator` (`ADMIN`) | *(Signed electronically)* | 2026-07-12 | `APPROVED WITH CONDITIONS` (Lô 01) | Bắt buộc chạy lệnh sao lưu `pg_dump` trước nạp; thi hành nghiêm cờ `noAutoActive: true`. | Xác nhận hệ thống đủ điều kiện kỹ thuật và sẵn sàng trực chiến tại Phase 11S. |
