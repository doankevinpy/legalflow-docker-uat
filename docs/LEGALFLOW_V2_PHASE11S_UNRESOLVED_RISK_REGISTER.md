# LEGALFLOW V2 - PHASE 11S
# UNRESOLVED RISK REGISTER

## 1. Purpose

Tài liệu này là Danh mục theo dõi các rủi ro còn tồn đọng trước nạp (`Unresolved Risk Register`) được thiết lập tại Phase 11S nhằm rà soát, kiểm định và quản trị tất cả các nguy cơ tiềm ẩn về kỹ thuật, metadata và pháp lý đối với cơ sở dữ liệu `legalflow_prod` trước thời điểm cho phép thực thi nạp (`Controlled Real Legal Dataset Import Execution`).  
Danh mục rủi ro rà soát cẩn trọng mức độ tác động của từng rủi ro đối với tiến trình nạp (`Import Impact`), thiết lập các quy tắc khóa nạp nghiêm ngặt (`Blocking Rules`) và ra Quyết định Rủi ro (`Risk Decision`) cụ thể cho cả lô nạp mẫu 01 lẫn tổng thể tập dữ liệu thật.

## 2. Risk Register

*(Tuân thủ tuyệt đối quy định không tự điền tên thật nếu chưa được cung cấp chính thức, hệ thống sử dụng các chức danh chuẩn hóa và mã vai trò nghiệp vụ hợp lệ):*

| Risk ID | Area | Description | Severity | Affected Records | Mitigation | Owner | Status | Import Impact | Notes |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- | :---: | :--- | :--- |
| **RISK-2024-01** | `Legal Approval` | Luật Đất đai 2024 (`31/2024/QH15`) là văn bản luật khung gốc, nếu nạp vào DB khi chưa có chữ ký `Approved` của Lãnh đạo Vụ và chưa kèm danh mục nghị định hướng dẫn sẽ gây thiếu hụt cho tra cứu nghiệp vụ. | **High** | `REG-2024-001` | Trình hồ sơ danh mục đầy đủ các nghị định thi hành; hoãn nạp bản ghi này sang lô đợt sau (`BATCH-2024-002`) cho đến khi có chữ ký `Approved`. | Manager Approver (`MANAGER`) | `In Review` | `Blocks Specific Record` / `Deferred to Later Batch` | Trì hoãn nạp bản ghi luật khung sang lô tiếp theo sau khi hoàn tất ký duyệt. |
| **RISK-2024-02** | `Transition Clause` | Nghị định `101/2024/NĐ-CP` chứa quy định chuyển tiếp hồ sơ cũ tiếp nhận trước 01/08/2024 tại Chương VII; nếu cán bộ Một cửa tra cứu mà bỏ qua trích đoạn SLA sẽ dễ giải quyết sai luật cũ. | **Medium** | `REG-2024-002` | Khớp nối chính xác điều khoản chuyển tiếp Chương VII vào `risk_note`; lấy xác nhận đồng ý của Lãnh đạo Vụ trước khi nạp. | Specialist A (`STAFF`) | `In Review` | `Blocks Specific Record` / `Deferred to Later Batch` | Đã viết xong text SLA; chờ Lãnh đạo Vụ ký nháy nghiệm thu phiếu duyệt lô sau. |
| **RISK-2024-03** | `Local Scope` | Quyết định hạn mức giao đất Tỉnh X (`45/2024/QĐ-UBND`) đã chuẩn hóa mã `Province X`, nhưng cần chữ ký phê duyệt tổng hợp trên công văn thống nhất ranh giới áp dụng Một cửa. | **Medium** | `REG-2024-003` | Lấy ý kiến thống nhất chéo giữa Sở TNMT Tỉnh X và Vụ Pháp chế; hoãn sang lô nạp riêng cho địa phương. | Local Officer B (`STAFF`) | `Evidence Added` | `Blocks Specific Record` / `Deferred to Later Batch` | Sở TNMT Tỉnh X đã thống nhất mã địa bàn; chờ Lãnh đạo Vụ ký `Approved`. |
| **RISK-2024-04** | `Expired Status` | Quyết định phê duyệt KHSDĐ năm 2024 Huyện A (`120/QĐ-UBND`) đã hết hiệu lực thi hành theo kỳ hạn năm (`2024-12-31`); nếu nạp sẽ làm bẩn DB và sai lệch quy hoạch 2026. | **Critical** | `REG-2024-004` | Loại bỏ ngay lập tức khỏi manifest lô nạp ứng viên; chuyển sang danh sách từ chối (`Excluded / Rejected`); đổi cờ `legal_status` sang `Expired`. | Planning Clerk C (`STAFF`) | **`Resolved / Rejected`** | **`Blocks Specific Record` (Permanent Exclusion)** | Xử lý triệt để: **KHÔNG NẠP** văn bản quy hoạch hết thời kỳ vào DB production. |
| **RISK-2024-05** | `Auto-active Risk` | Nguy cơ hệ thống tự động kích hoạt phiên bản pháp luật mới sau nạp làm đứt gãy luồng xử lý TTHC hiện hữu nếu không kiểm soát chặt cờ backend `noAutoActive`. | **High** | All Records (`BATCH-2024-001`) | Kiểm chứng API Backend trả về cờ `noAutoActive: true`; tách biệt hoàn toàn luồng kích hoạt version sang module Version UI riêng biệt. | Technical Operator (`ADMIN`) | **`Controlled / Mitigated`** | `Warning Only` | Hệ thống đã thi hành cờ `noAutoActive: true`; bảo toàn nguyên trạng thái `ACTIVE` hiện hữu. |
| **RISK-2024-06** | `Database Integrity` | Nguy cơ sự cố mất điện, rớt mạng hoặc lỗi cú pháp khi thực thi lệnh `execute` làm hỏng cấu trúc bảng DB `legalflow_prod`. | **Critical** | Database (`legalflow_prod`) | Bắt buộc chạy kịch bản sao lưu `pg_dump` sinh tệp `.sql` ngay trước giờ nạp; duy trì đội ngũ Ops trực chiến cùng DR Playbook khôi phục trong 5 phút. | Ops Team (`ADMIN`) | **`Controlled / Mitigated`** | `No Impact` (If Guardrails Followed) | Kịch bản sao lưu `scripts/db-backup.ps1` (~951 KB) và DR Playbook sẵn sàng kích hoạt. |

## 3. Severity Values

Hệ thống phân định rủi ro trước nạp theo 5 cấp độ nghiêm trọng chuẩn (`Severity Values`):
- `Critical`: Rủi ro gây nguy hại nghiêm trọng đến tính hợp pháp của dữ liệu hoặc sự an toàn của DB production (như nạp văn bản hết hiệu lực `Expired`, rủi ro làm hỏng DB do thiếu kịch bản sao lưu).
- `High`: Rủi ro gây cản trở quy trình quản trị nghiệp vụ hoặc phân quyền (như thiếu chữ ký Lãnh đạo Vụ Pháp chế, rủi ro tự động kích hoạt phiên bản trái phép nếu sai cờ API).
- `Medium`: Rủi ro về độ chi tiết của thông tin hướng dẫn nghiệp vụ (như lời nhắc chuyển tiếp `risk_note` chưa được Lãnh đạo ký nháy hoặc đang chờ công văn phối hợp ranh giới Một cửa).
- `Low`: Rủi ro nhỏ về mặt hình thức văn bản, không làm sai lệch bản chất pháp lý (như lỗi gõ phím nhỏ trong phần tóm tắt đã được hiệu đính).
- `Note`: Ghi chú lưu ý kỹ thuật hoặc lịch sử để phục vụ kiểm toán mà không ảnh hưởng đến độ sẵn sàng của lô nạp.

## 4. Import Impact Values

Để xác định chính xác hậu quả của mỗi rủi ro đối với quyết định nạp, hệ thống định nghĩa 5 mức tác động nạp (`Import Impact Values`):
- `Blocks Import`: Rủi ro nghiêm trọng làm chặn đứng toàn bộ lệnh thực thi nạp cho toàn bộ các lô dữ liệu trên hệ thống (`Total Stop`).
- `Blocks Specific Record`: Rủi ro làm chặn đứng lệnh nạp đối với riêng bản ghi bị ảnh hưởng, buộc phải loại trừ (`Exclude`) hoặc trì hoãn (`Defer`) bản ghi đó mà không ảnh hưởng đến các bản ghi sạch khác trong lô.
- `Warning Only`: Rủi ro kỹ thuật hoặc nghiệp vụ đã có biện pháp phòng ngừa (`Mitigation`) chắc chắn, cho phép tiếp tục nạp nhưng hiển thị cảnh báo lưu ý.
- `No Impact`: Rủi ro đã được giải quyết triệt để hoặc không tác động đến tiến trình thực thi nạp của lô dữ liệu.
- `Deferred to Later Batch`: Rủi ro thuộc về các văn bản đang trong quá trình rà soát bổ sung, được tự động chuyển tiếp theo dõi sang các lô dữ liệu kế tiếp.

## 5. Blocking Rules

Nhằm bảo vệ sự tinh khôi và an toàn tối đa cho cơ sở dữ liệu production, Hội đồng Quản trị Kỹ thuật ban hành **7 Quy tắc Khóa Nạp do Rủi ro (`Blocking Rules`)**. Cán bộ vận hành **TUYỆT ĐỐI KHÔNG ĐƯỢC THỰC THI NẠP (`NO IMPORT EXECUTION`)** nếu hệ thống vi phạm bất kỳ điều kiện nào sau đây:
1. **Quy tắc rủi ro Critical (`Critical Risk Rule`):** Còn tồn tại bất kỳ rủi ro mức `Critical` nào chưa được bóc tách khỏi tệp lô nạp (như bản ghi hết kỳ hạn quy hoạch hoặc thiếu kịch bản sao lưu DB).
2. **Quy tắc rủi ro High (`High Risk Rule`):** Còn tồn tại rủi ro mức `High` (như thiếu chữ ký Lãnh đạo Vụ hay nguy cơ tự động kích hoạt version) chưa được thẩm định và chấp nhận bằng văn bản bởi `Approver`.
3. **Quy tắc minh chứng nguồn (`Source URL Rule`):** Có bản ghi trong lô nạp bị khuyết hoặc sai lệch URL nguồn công báo hợp pháp (`.gov.vn`).
4. **Quy tắc tình trạng hiệu lực (`Unknown Legal Status Rule`):** Có bản ghi trong lô nạp bị để tình trạng hiệu lực `Unknown`, `Unverified` hoặc chưa đối chiếu công báo mới nhất.
5. **Quy tắc phê duyệt Lãnh đạo (`Unapproved Record Rule`):** Có bản ghi trong lô nạp chưa có chữ ký `Approved` của Lãnh đạo Vụ Pháp chế.
6. **Quy tắc mâu thuẫn pháp lý (`Unresolved Legal Conflict Rule`):** Có bản ghi phát hiện mâu thuẫn thẩm quyền ban hành hoặc tranh chấp phạm vi áp dụng địa phương chưa được Hội đồng Pháp chế thống nhất giải quyết.
7. **Quy tắc kịch bản phục hồi (`Backup & DR Playbook Rule`):** Kịch bản sao lưu `pg_dump` trước nạp và Kịch bản phục hồi khẩn cấp (`Rollback Plan / DR Playbook`) chưa sẵn sàng trực chiến.

## 6. Risk Decision

Căn cứ vào kết quả đánh giá danh mục rủi ro trên cả 2 cấp độ từng bản ghi và toàn lô nạp (đối với tổng thể bộ dữ liệu 5 văn bản gốc ban đầu vẫn còn 4 văn bản đang trong backlog chờ chữ ký Lãnh đạo Vụ hoặc bị loại bỏ, tuy nhiên Lô dữ liệu ứng viên mẫu số 01 `BATCH-2024-001` chứa bản ghi SOP `REG-2024-005` đã hoàn tất 100% rà soát, sạch rủi ro Critical/High và đã có giải pháp phòng ngừa chắc chắn cho các rủi ro kỹ thuật `RISK-2024-05`, `06`), Lãnh đạo Vụ Pháp chế và Hội đồng Thẩm định chính thức ra Quyết định Rủi ro (`Risk Decision`):

- **Quyết định đối với Tổng thể Bộ dữ liệu thật (5 văn bản gốc ban đầu):**  
  ### `BLOCKING RISKS REMAIN - RISK REVIEW INCOMPLETE`
  *(TẬP DỮ LIỆU THẬT ĐẦY ĐỦ VẪN CÒN CÁC RỦI RO CHƯA ĐƯỢC PHÊ DUYỆT TRONG BACKLOG; KHÔNG ĐỦ ĐIỀU KIỆN AN TOÀN ĐỂ NẠP HÀNG LOẠT TOÀN BỘ)*

- **Quyết định đối với riêng Lô mẫu số 01 (`BATCH-2024-001`):**  
  ### `RISKS ACCEPTED WITH CONDITIONS`
  *(CÁC RỦI RO KỸ THUẬT TRÊN LÔ `BATCH-2024-001` ĐÃ ĐƯỢC PHÒNG NGỪA VÀ CHẤP NHẬN; CHO PHÉP CHUYỂN SANG PHASE 11T ĐỂ THỰC THI NẠP CÓ KIỂM SOÁT VỚI ĐIỀU KIỆN TUÂN THỦ NGHIÊM NGẶT CÁC TƯỜNG LỬA BẢO VỆ)*
