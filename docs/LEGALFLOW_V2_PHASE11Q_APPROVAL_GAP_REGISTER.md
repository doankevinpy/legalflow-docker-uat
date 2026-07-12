# LEGALFLOW V2 - PHASE 11Q
# APPROVAL GAP REGISTER

## 1. Purpose

Tài liệu này là Sổ theo dõi khoảng trống phê duyệt và metadata còn khuyết thiếu (`Approval Gap & Metadata Register`) được lập tại Phase 11Q nhằm thống kê, giám sát và tài liệu hóa toàn bộ các khoảng trống thẩm quyền (`Approval Gaps`) cũng như các trường thông tin chưa đầy đủ trên danh mục 5 văn bản thực tế gốc của hệ thống.  
Sổ theo dõi khoảng trống đóng vai trò là "Bản đồ quản trị rào chắn phê duyệt" (`Governance Approval Map`), bảo đảm mọi bất cập về chữ ký của Lãnh đạo Vụ Pháp chế, thiếu hụt công văn phối hợp địa phương hay điều khoản chuyển tiếp đều phải được giám sát chặt chẽ, phân công hạn chót (`Due Date`) cụ thể và giải quyết rốt ráo trước khi cho phép nạp dữ liệu.

## 2. Approval Gap Register

*(Lưu ý về danh tính nhân sự: Tuân thủ tuyệt đối quy định không tự điền tên thật nếu chưa được cung cấp chính thức, hệ thống sử dụng các chức danh và mã vai trò chuyên môn chuẩn hóa):*

| Gap ID | Source ID | Document Title | Gap Type | Missing Evidence | Severity | Required Action | Owner | Due Date | Status | Resolution | Notes |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- | :---: | :---: | :--- | :--- |
| **GAP-2024-01** | `REG-2024-001` | Luật Đất đai 2024 (`31/2024/QH15`) | `Missing Manager Approval` | Chữ ký phê duyệt (`Approval Status: Approved`) của Lãnh đạo Vụ Pháp chế và Bảng rà soát danh mục nghị định thi hành đầy đủ. | **High** | Trình Lãnh đạo Vụ Pháp chế toàn văn bảng rà soát 5 nghị định hướng dẫn chi tiết; tổ chức phiên họp thẩm định chốt chữ ký xác nhận. | Manager Approver (`MANAGER`) | 2026-07-15 | `Open / In Review` | Đang hoàn thiện hồ sơ trình ký Lãnh đạo Vụ; khóa nạp bản ghi này cho đến khi có phiếu ký duyệt. | Khẳng định không nạp văn bản luật khung nếu chưa có chữ ký `Approved`. |
| **GAP-2024-02** | `REG-2024-002` | Nghị định quy định chi tiết Đăng ký đất đai (`101/2024/NĐ-CP`) | `Missing Amendment Review` & `Missing Risk Note Sign-off` | Biên bản rà soát chi tiết điều khoản chuyển tiếp Chương VII và chữ ký xác nhận của Hội đồng chuyên môn trên đoạn `risk_note`. | **Medium** | Khớp nối chính xác điều khoản tiếp nhận hồ sơ cũ; xin xác nhận chéo của Lãnh đạo Vụ đối với nội dung lời nhắc chuyển tiếp. | Specialist A (`STAFF`) | 2026-07-14 | `In Review` | Đã bổ sung text chuyển tiếp chuẩn xác vào `risk_note`; chờ Lãnh đạo Vụ ký nháy nghiệm thu. | Bảo đảm cán bộ tra cứu nắm rõ mốc thời gian chuyển tiếp 01/08/2024. |
| **GAP-2024-03** | `REG-2024-003` | Quyết định hạn mức giao đất Tỉnh X (`45/2024/QĐ-UBND`) | `Missing Local Scope Coordination` | Văn bản/Công văn phối hợp ý kiến nghiệp vụ giữa Sở TNMT Tỉnh X và Vụ Pháp chế về ranh giới thẩm quyền áp dụng Một cửa. | **Medium** | Phát hành công văn lấy ý kiến xác nhận thẩm quyền giải quyết hồ sơ tách/hợp thửa giữa tỉnh X và luồng tra cứu chung. | Local Officer B (`STAFF`) | 2026-07-16 | `Evidence Added` | Sở TNMT Tỉnh X đã gửi công văn phúc đáp thống nhất mã `Province X`; chờ Lãnh đạo Vụ Pháp chế ký `Approved`. | Trì hoãn nạp sang lô tiếp theo (`BATCH-2024-002`) dành riêng cho địa phương. |
| **GAP-2024-04** | `REG-2024-004` | Quyết định phê duyệt KHSDĐ năm 2024 Huyện A (`120/QĐ-UBND`) | `Unknown Legal Status / Expired` | Quyết định phê duyệt Kế hoạch sử dụng đất mới nhất cho năm hành chính hiện hành 2026 của UBND Huyện A. | **Critical** | Loại bỏ ngay lập tức bản ghi hết kỳ hạn năm 2024 khỏi manifest lô nạp. Yêu cầu cơ quan chuyên môn Huyện A cung cấp văn bản KHSDĐ 2026. | Planning Clerk C (`STAFF`) | N/A (Excluded) | **`Resolved / Rejected`** | Đã chuyển cờ hiệu lực sang `Expired`; bóc tách khỏi lô ứng viên và từ chối nạp vĩnh viễn vào DB. | Xử lý triệt để chốt chặn: **KHÔNG NẠP** văn bản quy hoạch hết thời kỳ. |
| **GAP-2024-05** | `REG-2024-005` | Quy trình nội bộ giải quyết TTHC lĩnh vực đất đai (SOP `888/QĐ-UBND`) | `None` (Zero Gaps) | Không có khoảng trống phê duyệt hay metadata. Đã có đủ chữ ký của `SOP Officer D` (`Reviewer`) và Lãnh đạo Vụ Pháp chế (`Approver`). | `Note` | Niêm phong mã băm tệp dữ liệu lô 01 (`BATCH-2024-001`); chuẩn bị sẵn sàng cho lệnh nạp có kiểm soát tại Phase 11R. | SOP Officer D (`STAFF`) | 2026-07-12 | **`Resolved / Confirmed`** | Bản ghi hoàn hảo đạt chuẩn `Approved` 100%, metadata sạch và đầy đủ minh chứng hợp pháp. | Sẵn sàng đóng gói vào lô ứng viên mẫu số 01 chuyển sang Phase 11R. |

## 3. Gap Type Guide

Hệ thống định nghĩa 11 chuẩn loại khoảng trống phê duyệt và metadata (`Gap Type Guide`) nhằm rà soát toàn diện danh mục tri thức pháp lý:
1. `Missing Source Evidence`: Thiếu URL công báo hợp pháp (`.gov.vn`) hoặc tệp toàn văn MinIO xác minh nguồn gốc văn bản.
2. `Missing Effective Date`: Thiếu ngày có hiệu lực thi hành hoặc định dạng thời gian vi phạm chuẩn ISO 8601 (`YYYY-MM-DD`).
3. `Unknown Legal Status`: Tình trạng hiệu lực bị để `Unknown`, `Unverified` hoặc chưa được kiểm tra đối chiếu công báo mới nhất.
4. `Missing Amendment Review`: Chưa thẩm định hay khớp nối quan hệ sửa đổi, bổ sung, đính chính hoặc thay thế văn bản cũ (`amends_document`).
5. `Missing Local Scope`: Thiếu phân định ranh giới áp dụng theo địa bàn hành chính (`National` vs `Province X`, `District A`).
6. `Missing Procedure Mapping`: Chưa ánh xạ văn bản vào 5 chuyên đề thủ tục đất đai trọng tâm Một cửa (`TTHC-LAND-01..05`).
7. `Missing Risk Note`: Thiếu nội dung tại trường `risk_note`, không cung cấp được hướng dẫn rủi ro hay chỉ mức SLA cho cán bộ.
8. `Missing Reviewer Approval`: Thiếu chữ ký xác nhận thẩm định kỹ thuật nghiệp vụ (`Reviewed / Cleaned`) từ Cán bộ chuyên trách.
9. `Missing Manager Approval`: Thiếu chữ ký phê duyệt chính thức (`Approval Status: Approved`) từ Lãnh đạo Vụ/Phòng Pháp chế.
10. `Duplicate Not Resolved`: Tồn tại dòng dữ liệu trùng lặp số ký hiệu hoặc nội dung với DB hiện hữu mà chưa được bóc tách.
11. `Legal Conflict Needs Review`: Phát hiện mâu thuẫn căn cứ pháp lý hoặc chồng chéo thẩm quyền ban hành cần Hội đồng Pháp chế phán xử.

## 4. Gap Status Values

Quá trình theo dõi và giải quyết mỗi khoảng trống được quản trị qua 9 mức trạng thái chuẩn (`Gap Status Values`):
- `Open`: Khoảng trống mới được ghi nhận vào sổ, chưa có giải pháp hoặc chưa phân công nhân sự giải quyết.
- `In Review`: Khoảng trống đang trong quá trình điều tra, rà soát văn bản gốc hoặc chờ Hội đồng Pháp chế xem xét.
- `Evidence Requested`: Đã phát hành công văn hoặc yêu cầu cơ quan ban hành/địa phương cung cấp minh chứng bổ sung.
- `Evidence Added`: Đã thu thập và điền thêm minh chứng mới vào hệ thống (như URL mới, công văn phối hợp), chờ thẩm định lại.
- `Reviewer Confirmed`: Cán bộ nghiệp vụ chuyên trách đã kiểm tra minh chứng mới và ký xác nhận rà soát lại (`Reviewed / Cleaned`).
- `Approver Confirmed`: Lãnh đạo Vụ/Phòng Pháp chế đã thẩm định minh chứng và ký xác nhận đồng ý (`Approved`).
- `Resolved`: Khoảng trống đã được giải quyết triệt để 100%, metadata sạch hoàn toàn và đủ điều kiện đưa vào lô nạp.
- `Deferred`: Khoảng trống được thống nhất hoãn xử lý, chuyển bản ghi sang các lô nạp đợt sau để chờ bổ sung văn bản mới.
- `Rejected`: Khoảng trống dẫn đến quyết định từ chối nạp vĩnh viễn đối với bản ghi (như văn bản hết thời kỳ hoặc bãi bỏ ngầm).

## 5. Approval Rules

Để bảo vệ sự tinh khôi tuyệt đối cho cơ sở dữ liệu `legalflow_prod`, Hội đồng Thẩm định thiết lập **5 Quy tắc Phê duyệt Khóa Nạp (`Approval Blocking Rules`)** không thể thương lượng:
1. **Quy tắc chữ ký Reviewer (`Reviewer Sign-off Rule`):** Bản ghi chưa có chữ ký và trạng thái xác nhận `Reviewed / Cleaned` của Cán bộ chuyên môn **TUYỆT ĐỐI KHÔNG ĐƯỢC PHÉP NẠP (`NO IMPORT EXECUTION`)**.
2. **Quy tắc chữ ký Approver (`Approver Sign-off Rule`):** Bản ghi chưa được Lãnh đạo Vụ/Phòng Pháp chế ký phê duyệt `Approval Status: Approved` **TUYỆT ĐỐI KHÔNG ĐƯỢC PHÉP NẠP (`NO IMPORT EXECUTION`)**.
3. **Quy tắc tình trạng hiệu lực (`Legal Status Verification Rule`):** Bản ghi có tình trạng hiệu lực `Unknown`, `Unverified` hoặc đã hết hiệu lực thi hành (`Expired`) **TUYỆT ĐỐI KHÔNG ĐƯỢC PHÉP NẠP (`NO IMPORT EXECUTION`)**.
4. **Quy tắc minh chứng nguồn (`Source Evidence Verification Rule`):** Bản ghi khuyết thiếu URL nguồn gốc hoặc có liên kết không thuộc Cổng TTĐT hợp pháp của cơ quan hành chính nhà nước (`.gov.vn`) **TUYỆT ĐỐI KHÔNG ĐƯỢC PHÉP NẠP (`NO IMPORT EXECUTION`)**.
5. **Quy tắc xung đột pháp lý (`Legal Conflict Resolution Rule`):** Bản ghi phát hiện có mâu thuẫn thẩm quyền ban hành, trùng lặp số ký hiệu hoặc xung đột ranh giới áp dụng địa bàn chưa được Hội đồng Pháp chế thống nhất giải quyết **TUYỆT ĐỐI KHÔNG ĐƯỢC PHÉP NẠP (`NO IMPORT EXECUTION`)**.
