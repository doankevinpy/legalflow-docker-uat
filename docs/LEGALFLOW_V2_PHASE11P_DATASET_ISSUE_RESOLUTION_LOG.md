# LEGALFLOW V2 - PHASE 11P
# DATASET ISSUE RESOLUTION LOG

## 1. Purpose

Tài liệu này là Nhật ký theo dõi và xử lý các khiếm khuyết của bộ dữ liệu tri thức pháp lý (`Dataset Issue Resolution Log`) được thiết lập tại Phase 11P nhằm thống kê, theo dõi và tài liệu hóa toàn bộ quá trình xử lý khắc phục đối với các lỗi, thiếu sót hoặc bất cập trong metadata của danh mục 5 văn bản thực tế gốc.  
Nhật ký xử lý khiếm khuyết đóng vai trò là "Sổ kiểm toán rào chắn lỗi" (`Issue Defense Audit Log`), bảo đảm mọi bất thường hay cảnh báo pháp lý phát hiện trong quá trình rà soát lại (`Re-review`) đều phải có chủ sở hữu (`Owner`) giải quyết cụ thể, có minh chứng xác minh và phải được đóng (`Resolved / Rejected`) triệt để trước khi ra quyết định nạp vào cơ sở dữ liệu.

## 2. Issue Resolution Log

Dưới đây là bảng ghi nhận chi tiết 5 khiếm khuyết được phát hiện, phân loại và theo dõi xử lý trên 5 bản ghi văn bản thực tế:

| Issue ID | Source ID | Issue Type | Description | Severity | Required Action | Owner | Resolution | Status | Verified By | Notes |
| :--- | :--- | :--- | :--- | :---: | :--- | :--- | :--- | :---: | :--- | :--- |
| **ISS-2024-01** | `REG-2024-001` | `Missing Approver Sign-off` | Bản ghi Luật Đất đai 2024 (`31/2024/QH15`) đã hoàn tất chuẩn hóa 29 cột metadata nhưng chưa có chữ ký phê duyệt (`Approval Status: Approved`) từ Lãnh đạo Vụ Pháp chế. | **High** | Trình hồ sơ danh mục văn bản và bảng rà soát chi tiết qua cuộc họp Hội đồng Pháp chế Vụ để Lãnh đạo Vụ xem xét và ký xác nhận phiếu phê duyệt. | Manager Approver (`MANAGER`) | Đã tiếp nhận hồ sơ; Lãnh đạo Vụ yêu cầu rà soát bổ sung danh mục đầy đủ các nghị định thi hành trước khi ký. | `Open / In Review` | Legal Lead (`MANAGER`) | Khóa nạp bản ghi này cho đến khi có chữ ký `Approved`. |
| **ISS-2024-02** | `REG-2024-002` | `Transition Clause Verification` | Nghị định `101/2024/NĐ-CP` chứa quy định chuyển tiếp phức tạp về hồ sơ đăng ký đất đai tiếp nhận trước 01/08/2024 tại Chương VII, cần chốt lời nhắc rủi ro nghiệp vụ. | **Medium** | Rà soát kỹ điều khoản chuyển tiếp Chương VII; hoàn thiện đoạn text hướng dẫn xử lý hồ sơ cũ vào trường `risk_note` và lấy xác nhận chuyên môn. | Specialist A (`STAFF`) | Đã viết xong nội dung `risk_note` chuyển tiếp chuẩn xác; đang gửi sang Lãnh đạo Vụ thẩm định lần cuối. | `In Review` | Legal Lead (`MANAGER`) | Đảm bảo cán bộ tra cứu không áp dụng nhầm luật mới cho hồ sơ cũ. |
| **ISS-2024-03** | `REG-2024-003` | `Local Scope Coordination` | Quyết định hạn mức giao đất Tỉnh X (`45/2024/QĐ-UBND`) đã chuẩn hóa mã `Province X`, tuy nhiên cần văn bản thống nhất ý kiến nghiệp vụ giữa Sở TNMT Tỉnh X và Vụ Pháp chế. | **Medium** | Lấy ý kiến thống nhất chéo bằng văn bản công văn giữa Sở TNMT Tỉnh X và Vụ Pháp chế Bộ TN&MT về ranh giới áp dụng trên luồng Một cửa. | Local Officer B (`STAFF`) | Sở TNMT Tỉnh X đã có văn bản phúc đáp thống nhất mã địa bàn; chờ Vụ Pháp chế tổng hợp chữ ký `Approver`. | `In Review / Deferred` | Legal Lead (`MANAGER`) | Trì hoãn sang lô nạp riêng cho địa phương sau khi hoàn tất ký duyệt. |
| **ISS-2024-04** | `REG-2024-004` | `Expired Legal Status` | Quyết định phê duyệt Kế hoạch sử dụng đất năm 2024 Huyện A (`120/QĐ-UBND`) đã hết hiệu lực thi hành theo kỳ hạn năm (`2024-12-31`), không còn giá trị cho năm 2026. | **Critical** | Loại bỏ ngay lập tức bản ghi khỏi danh mục ứng viên nạp; chuyển sang danh sách loại trừ (`Excluded`). Yêu cầu bổ sung Quyết định KHSDĐ 2026. | Planning Clerk C (`STAFF`) | Đã đổi trường `legal_status` thành `Expired`; bóc tách khỏi manifest lô nạp và từ chối nạp vĩnh viễn vào DB. | **`Resolved / Rejected`** | Legal Lead (`MANAGER`) | Xử lý triệt để: **KHÔNG NẠP** văn bản hết hạn vào DB `legalflow_prod`. |
| **ISS-2024-05** | `REG-2024-005` | `Minor Grammar Polish` | Bản ghi SOP `888/QĐ-UBND` xuất hiện lỗi gõ phím nhỏ trong phần mô tả tóm tắt luồng bước 3 nghiệp vụ tiếp nhận hồ sơ Một cửa. | **Low** | Sửa đổi câu chữ phần tóm tắt cho chuẩn xác ngữ pháp hành chính theo SOP được UBND Tỉnh X ban hành. | SOP Officer D (`STAFF`) | Đã hiệu đính câu chữ hoàn tất; trường metadata sạch 100%, có chữ ký Lãnh đạo Vụ và niêm phong vào lô `BATCH-2024-001`. | **`Resolved`** | Legal Lead (`MANAGER`) | Bản ghi hoàn hảo, sẵn sàng đưa vào nạp có kiểm soát tại Phase 11Q. |

## 3. Issue Severity

Hệ thống phân chia mức độ nghiêm trọng của khiếm khuyết dữ liệu (`Issue Severity`) theo 5 cấp độ chuẩn:
- `Critical`: Khiếm khuyết gây rủi ro cao nhất cho tính hợp pháp hoặc tính toàn vẹn hệ thống. Ví dụ: văn bản đã hết hiệu lực thi hành (`Expired`), bị bãi bỏ toàn bộ nhưng lại gán cờ `Effective`; sai lệch URL nguồn không tồn tại; hoặc thiếu kịch bản sao lưu DB (`backup plan`).
- `High`: Khiếm khuyết gây cản trở quy trình quản trị nghiệp vụ. Ví dụ: bản ghi thiếu chữ ký phê duyệt (`Missing Approver Sign-off`) của Lãnh đạo Vụ; để tình trạng hiệu lực `Unknown`; hoặc tồn tại dòng trùng lặp (`duplicate`) chưa xử lý.
- `Medium`: Khiếm khuyết về độ chi tiết của thông tin hướng dẫn nghiệp vụ. Ví dụ: lời nhắc rủi ro chuyển tiếp (`risk_note`) viết chưa rõ ràng; hoặc đang chờ công văn phối hợp ý kiến về phạm vi áp dụng địa bàn (`Local Scope`).
- `Low`: Khiếm khuyết nhỏ về hình thức văn bản. Ví dụ: lỗi chính tả, lỗi gõ phím nhỏ trong tiêu đề hoặc phần tóm tắt nội dung mà không làm sai lệch bản chất pháp lý.
- `Note`: Ghi chú lưu ý kỹ thuật hoặc lịch sử sửa đổi để phục vụ kiểm toán mà không ảnh hưởng đến độ sẵn sàng nạp.

*(Danh mục lỗi Critical / High tuyệt đối không được để tồn đọng trước khi nạp: Không rõ nguồn gốc; Không rõ tình trạng hiệu lực (`Unknown`); Văn bản có dấu hiệu hoặc đã hết hiệu lực thi hành; Sai hoặc để trống phạm vi áp dụng địa bàn; Thiếu chữ ký của Lãnh đạo Vụ Pháp chế; Trùng lặp số ký hiệu chưa xử lý; Mâu thuẫn căn cứ pháp lý áp dụng).*

## 4. Resolution Status

Tình trạng xử lý của mỗi khiếm khuyết được theo dõi qua 6 mức trạng thái (`Resolution Status`):
- `Open`: Khiếm khuyết mới được phát hiện và ghi nhận vào sổ, chưa có giải pháp hoặc chưa phân công xử lý.
- `In Review`: Khiếm khuyết đang trong quá trình điều tra, rà soát văn bản gốc hoặc đang chờ ý kiến thẩm định từ Hội đồng chuyên môn.
- `Resolved`: Khiếm khuyết đã được sửa chữa, làm sạch metadata 100% hoặc đã bóc tách loại bỏ văn bản hết hạn thành công, có chữ ký nghiệm thu.
- `Deferred`: Khiếm khuyết được thống nhất tạm hoãn xử lý và chuyển bản ghi sang các lô nạp đợt sau để chờ bổ sung văn bản quy phạm mới.
- `Rejected`: Khiếm khuyết dẫn đến quyết định từ chối nạp vĩnh viễn đối với bản ghi (như văn bản đã bị bãi bỏ ngầm hoặc quy hoạch hết thời kỳ).
- `Not Applicable`: Khiếm khuyết không còn áp dụng do bản ghi đã được thay thế bằng một văn bản quy phạm pháp luật khác.

## 5. Import Blocking Issues

Nhằm thiết lập rào chắn bảo vệ tối thượng, Hội đồng Quản trị Kỹ thuật quy định **7 Khiếm khuyết Khóa Nạp Tuyệt đối (`Import Blocking Issues`)**. Hệ thống **TUYỆT ĐỐI KHÔNG ĐƯỢC CHUYỂN SANG GIAI ĐOẠN THỰC THI NẠP (`NO IMPORT EXECUTION`)** đối với bất kỳ bản ghi hay lô dữ liệu nào nếu phát hiện còn tồn tại dù chỉ một trong 7 điều kiện sau:
1. **Còn tồn tại lỗi Critical chưa xử lý (`Unresolved Critical Issue`):** Bản ghi bị gán nhãn `Critical` (như văn bản quy hoạch hết thời kỳ hoặc sai lệch căn cứ pháp lý) chưa được bóc tách loại trừ khỏi lô dữ liệu nạp.
2. **Còn tồn tại lỗi High chưa xử lý (`Unresolved High Issue`):** Bản ghi có lỗi mức `High` (như thiếu chữ ký Lãnh đạo Vụ hoặc trùng lặp số ký hiệu) vẫn để trạng thái `Open` hoặc `In Review` trong danh sách import.
3. **Bản ghi bị khuyết hoặc không xác minh được URL nguồn (`Missing / Unverified Source URL`):** Bất kỳ dòng dữ liệu nào để trống trường `source_url` hoặc dẫn về tên miền không phải Cổng TTĐT chính phủ (`.gov.vn`).
4. **Bản ghi có tình trạng hiệu lực Unknown (`Unknown Legal Status Presence`):** Bất kỳ văn bản nào có trường `legal_status` bị để `Unknown`, `Unverified` hoặc chưa được kiểm tra đối chiếu công báo mới nhất.
5. **Bản ghi chưa được Lãnh đạo Vụ phê duyệt (`Unapproved Record`):** Trường `approval_status` của bản ghi không ghi nhận chính xác trạng thái `Approved` hoặc không có chữ ký đồng ý của Lãnh đạo Vụ Pháp chế.
6. **Bản ghi thiếu lời nhắc rủi ro nghiệp vụ (`Missing Risk Note`):** Bản ghi để rỗng trường `risk_note`, không cung cấp được cảnh báo rủi ro hay hướng dẫn thời hạn SLA giải quyết thủ tục cho cán bộ Một cửa.
7. **Kịch bản sao lưu DB và khôi phục chưa sẵn sàng (`Missing Backup / Rollback Plan`):** Hệ thống chưa có sẵn kịch bản sao lưu `pg_dump` trước nạp hoặc thiếu kịch bản phục hồi khẩn cấp (`DR Playbook`) để khôi phục DB khi xảy ra sự cố.
