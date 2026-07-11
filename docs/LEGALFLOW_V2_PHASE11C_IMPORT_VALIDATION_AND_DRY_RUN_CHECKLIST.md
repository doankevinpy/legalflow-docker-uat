# LEGALFLOW V2 - PHASE 11C
# IMPORT VALIDATION & DRY RUN CHECKLIST

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11C Standard`  
**Ngày ban hành Checklist:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL IMPORT VALIDATION & DRY RUN CHECKLIST TEMPLATE`** *(Biểu mẫu Checklist Kiểm tra Trước Nạp & Diễn tập Nạp Dữ liệu)*

---

## 1. Purpose

Tài liệu này là Biểu mẫu Bảng kiểm Thẩm định Trước Nạp và Diễn tập Nạp Dữ liệu Tri thức Pháp lý (`Import Validation & Dry-Run Checklist` - Phase 11C) của hệ thống LegalFlow V2. Biểu mẫu được ban hành làm công cụ thao tác bắt buộc cho Cán bộ Thẩm định Pháp chế (`Legal Reviewer`), Lãnh đạo Phòng (`MANAGER`) và Quản trị viên (`ADMIN`) trước khi thực hiện bất kỳ lệnh import hay dry-run nào đối với dữ liệu Legal Knowledge (Khối 3.2). Checklist chuẩn hóa 14 tiêu chí kiểm tra dữ liệu đầu vào (`Pre-import Validation Checklist`), thiết lập quy trình kiểm thử mô phỏng 10 bước (`Dry-Run Checklist`), xác lập 7 điều kiện cấm nạp tuyệt đối (`No-import Conditions`) và khẳng định cam kết an toàn hệ thống (`Safety Confirmation`).

---

## 2. Pre-import Validation Checklist

Bảng rà soát 14 tiêu chí bắt buộc trước khi cho phép dữ liệu bước vào luồng diễn tập dry-run hoặc chuẩn bị nạp DB (`Standardized 14-Point Pre-import Audit Table` - *Lưu ý: Đánh dấu `PASS / WARNING / FAIL / NA` vào cột kết quả khi rà soát thực tế*):

| Check ID | Check Item (`Validation Item`) | Required Evidence (`Mandatory Proof`) | Result (`PASS/WARN/FAIL/NA`) | Reviewer (`Sign-off`) | Notes & Audit Remarks |
| :---: | :--- | :--- | :---: | :--- | :--- |
| **VAL-01** | **Nguồn rõ (`Verified Source`)** | URL Công báo tỉnh, cổng thông tin điện tử UBND tỉnh hoặc file scan gốc có dấu đỏ lưu tại Văn thư. | `[   ] PASS` | `Legal Reviewer` | Loại bỏ ngay lập tức các tài liệu trôi nổi chưa rõ nguồn gốc. |
| **VAL-02** | **Số / ký hiệu có (`Document Number`)** | Số và ký hiệu văn bản (`docNumber`) đầy đủ, đúng chuẩn cú pháp (`25/2024/QĐ-UBND`). | `[   ] PASS` | `Legal Reviewer` | Đảm bảo định danh duy nhất và phục vụ trích dẫn Word Khối 3.3. |
| **VAL-03** | **Cơ quan ban hành có (`Issuing Authority`)** | Trường `issuing_authority` ghi rõ tên cơ quan ban hành (UBND tỉnh X, Bộ TN&MT, HĐND tỉnh). | `[   ] PASS` | `Legal Reviewer` | Phân loại chính xác thẩm quyền Trung ương hay Địa phương. |
| **VAL-04** | **Ngày ban hành có (`Issue Date`)** | Trường `issue_date` đúng ngày tháng năm ký ban hành trên quyết định gốc (`YYYY-MM-DD`). | `[   ] PASS` | `Legal Reviewer` | Sắp xếp trình tự lịch sử ban hành của thư viện tri thức. |
| **VAL-05** | **Ngày hiệu lực có (`Effective Date`)** | Trường `effective_date` ghi chính xác mốc thời gian bắt đầu có hiệu lực thi hành (`YYYY-MM-DD`). | `[   ] PASS` | `Legal Reviewer` | Căn cứ cốt lõi cho AI Khối 3.1 đối chiếu ngày nộp hồ sơ TTHC. |
| **VAL-06** | **Tình trạng hiệu lực đã kiểm tra (`Status Audited`)** | Xác nhận rõ văn bản đang `Effective` (`ACTIVE`) hoặc `Pending`. Không nhận văn bản `Expired` hoặc `Unknown`. | `[   ] PASS` | `Legal Reviewer` | Ngăn chặn tuyệt đối việc nạp văn bản đã hết hiệu lực vào luồng active. |
| **VAL-07** | **Văn bản sửa đổi / bổ sung / thay thế đã kiểm tra** | Ghi rõ vào `amends_document` / `replaces_document` số hiệu của văn bản cũ bị sửa đổi hay bãi bỏ. | `[   ] PASS` | `Legal Reviewer` | Xây dựng chuỗi truy vết lịch sử pháp lý (`Legal Lineage`) minh bạch. |
| **VAL-08** | **Phạm vi địa phương đã kiểm tra (`Territorial Scope`)** | Ghi nhãn `scope: LOCAL` và xác định rõ địa bàn áp dụng (`local_applicability` - Toàn tỉnh hay cấp huyện). | `[   ] PASS` | `Legal Reviewer` | Ngăn chặn áp dụng nhầm hạn mức tách thửa giữa các huyện/xã. |
| **VAL-09** | **Liên quan thủ tục đã xác định (`Procedure Mapped`)** | Danh sách mã thủ tục TTHC liên quan (`TTHC-LAND-01`, `TTHC-LAND-05`...) được ánh xạ chính xác. | `[   ] PASS` | `Procedure Lead` | Bảo đảm AI Khối 3.1 gọi đúng căn cứ khi rà soát từng loại hồ sơ. |
| **VAL-10** | **Summary đã có (`Accurate Summary`)** | Trường `summary` phản ánh trung thực, cô đọng nội dung quy định core ảnh hưởng đến thụ lý TTHC. | `[   ] PASS` | `Legal Reviewer` | Giúp chuyên viên dễ dàng đọc nhanh và tra cứu trên menu `Knowledge`. |
| **VAL-11** | **Source URL / location đã có (`Audit Location`)** | Đường dẫn URL hợp lệ hoặc URI vị trí lưu trữ file toàn văn nội bộ (`minio://...`). | `[   ] PASS` | `Legal Reviewer` | Bằng chứng tra cứu trực tiếp cho chuyên viên thẩm định hồ sơ. |
| **VAL-12** | **Reviewer đã xác nhận (`Reviewer Sign-off`)** | Cán bộ Pháp chế trực tiếp thẩm định (`reviewer`) đã ký xác nhận và hoàn tất Bảng kiểm Phase 11B. | `[   ] PASS` | `Legal Reviewer` | Trách nhiệm giải trình pháp lý cá nhân rõ ràng. |
| **VAL-13** | **Approval status là `Approved` (`Approval Mandate`)** | Trường `approval_status` khóa chặt ở giá trị `Approved`, có chữ ký phê duyệt của Lãnh đạo Phòng (`MANAGER`). | `[   ] PASS` | `MANAGER Approver` | **Chốt chặn sống còn: không nạp văn bản `Draft / Pending Review`.** |
| **VAL-14** | **Risk note đã ghi nếu có (`Risk & Disclaimer Logged`)** | Ghi rõ các hạn chế, điều khoản chuyển tiếp phức tạp vào `risk_note` để hiển thị cảnh báo vàng cho cán bộ. | `[   ] PASS` | `Legal Reviewer` | Nhắc nhở chuyên viên lưu ý các tình huống ngoại lệ tại địa bàn. |

---

## 3. Dry-run Checklist

Quy trình kiểm thử mô phỏng 10 bước (`Standardized 10-Step Dry-Run Audit Table`) để rà soát chất lượng và tính toàn vẹn của batch file mẫu/file CSV trước khi tiến hành import diễn tập tại Phase 11D:

| Step Index | Step Description (`Execution Item`) | Expected Result (`Success Criteria`) | Actual Result (`Observed State`) | Status (`PASS/FAIL/HOLD`) | Notes & Corrective Action |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **Step 1** | **Kiểm tra file / template nguồn** | File CSV mẫu/batch file mở được, đúng định dạng `UTF-8 no BOM`, không bị lỗi phông chữ tiếng Việt. | `File đọc tốt, chuẩn UTF-8, cấu trúc 29 cột rõ ràng.` | `[ PASS ]` | Đảm bảo trình phân tích CSV không bị lệch cột hoặc mất ký tự dấu. |
| **Step 2** | **Kiểm tra số lượng bản ghi (`Record Count`)** | Số dòng bản ghi (`row count`) trong file CSV khớp chính xác với số lượng phiếu đề xuất đã phê duyệt trên Sổ Đăng ký. | `Khớp chính xác số dòng (Ví dụ: 10/10 bản ghi đã duyệt).` | `[ PASS ]` | Ngăn chặn việc chèn thêm bản ghi lạ hoặc bị mất dòng khi xuất CSV. |
| **Step 3** | **Kiểm tra bản ghi thiếu field bắt buộc** | Chạy script kiểm tra (`Validation check`): 100% bản ghi có đầy đủ các cột bắt buộc (`title, docNumber, effectiveDate...`). | `0 bản ghi thiếu trường bắt buộc (`Missing Fields = 0`).` | `[ PASS ]` | Nếu phát hiện dòng nào thiếu `title` hay `effective_date`, từ chối cả batch. |
| **Step 4** | **Kiểm tra duplicate document number** | Chạy kiểm tra trùng lặp số hiệu (`Duplicate code check`) trong nội bộ file CSV và đối chiếu với bảng `LegalKnowledge` trên DB. | `Không phát hiện số hiệu trùng lặp (`Duplicates = 0`).` | `[ PASS ]` | Nếu có trùng lặp, báo `ADMIN` kiểm tra xem là lỗi lặp hay update bản ghi. |
| **Step 5** | **Kiểm tra document status (`Legal Status Audit`)** | 100% bản ghi trong batch có `legal_status = Effective` (hoặc `Active`). Không có dòng `Expired` hay `Unknown`. | `Toàn bộ bản ghi đều đạt trạng thái `Effective`.` | `[ PASS ]` | Thanh lọc hoàn toàn các văn bản đã hết hiệu lực khỏi luồng import mới. |
| **Step 6** | **Kiểm tra local scope (`Scope & Applicability Audit`)** | Các văn bản địa phương đều gắn `local_scope = Local` và chỉ định rõ địa bàn `local_applicability` (Huyện/Xã). | `100% văn bản địa phương có địa bàn áp dụng rõ ràng.` | `[ PASS ]` | Ngăn chặn áp dụng nhầm hạn mức tách thửa giữa các đơn vị hành chính. |
| **Step 7** | **Kiểm tra approval status (`Manager Approval Check`)** | 100% bản ghi có `approval_status = Approved` và có `approval_date` hợp lệ. | `Toàn bộ bản ghi đạt `Approved` có chữ ký Lãnh đạo Phòng.` | `[ PASS ]` | Lọc bỏ tuyệt đối các bản ghi `Draft`, `Pending Review` hoặc `Rejected`. |
| **Step 8** | **Kiểm tra active candidate (`Staging Flag Check`)** | Toàn bộ bản ghi có thuộc tính `active_candidate = false` (hoặc cờ `active = false`). | `100% bản ghi có cờ `active_candidate = false`.` | `[ PASS ]` | Khẳng định dữ liệu sau import chỉ nằm ở vùng chờ, không tự động live. |
| **Step 9** | **Kiểm tra warning / risk note (`Risk Note Audit`)** | Các bản ghi có điều khoản chuyển tiếp đều có nội dung cảnh báo vàng trong trường `risk_note`. | `Các ghi chú rủi ro được ánh xạ trọn vẹn vào `risk_note`.` | `[ PASS ]` | Bảo đảm thông điệp cảnh báo hiển thị đầy đủ trên giao diện Khối 3.1 &amp; Khối 3.2. |
| **Step 10** | **Kết luận điều kiện dry-run import ở phase sau** | Đánh giá tổng hợp 9 bước trên: Nếu toàn bộ đạt `[PASS]`, chính thức xác nhận đủ điều kiện dry-run/nạp diễn tập tại Phase 11D. | `ĐỦ ĐIỀU KIỆN KỸ THUẬT CHO PHASE 11D (`Ready for Phase 11D`).` | **`[ PASS ]`** | Niêm phong bộ dữ liệu mẫu, chuẩn bị báo cáo Lãnh đạo cho giai đoạn tiếp theo. |

---

## 4. No-import Conditions

Các điều kiện cấm nạp tuyệt đối (`Mandatory No-import Conditions`). Quản trị viên (`ADMIN`) và Cán bộ Thẩm định **BẮT BUỘC DỪNG NGAY LẬP TỨC (`HALT IMPORT ENGINE`)** nếu phát hiện bất kỳ một trong 7 điều kiện vi phạm sau đây:
1. 🛑 **Có bản ghi thiếu nguồn (`Missing Source Condition`):** Trong batch dữ liệu tồn tại dù chỉ 1 bản ghi không có URL Công báo tỉnh (`source_url`) hoặc thiếu đường dẫn file toàn văn (`full_text_location`).
2. 🛑 **Có bản ghi chưa approved (`Unapproved Record Condition`):** Tồn tại bản ghi có `approval_status != Approved` (`Draft`, `Pending Review`, `Rejected`, hoặc để trống).
3. 🛑 **Có bản ghi legal status unknown (`Unknown Legal Status Condition`):** Tồn tại bản ghi có trường `legal_status` ghi là `Unknown / Needs Review` hoặc chưa xác định ngày có hiệu lực thi hành.
4. 🛑 **Có bản ghi local scope không rõ (`Ambiguous Local Scope Condition`):** Tồn tại văn bản quy định hạn mức hay quy hoạch đất địa phương nhưng trường `local_applicability` bỏ trống hoặc ghi mơ hồ "chưa rõ địa bàn".
5. 🛑 **Có bản ghi nghi ngờ hết hiệu lực (`Suspected Expiration Condition`):** Tồn tại văn bản gốc ban hành từ nhiều năm trước mà không có kiểm chứng quan hệ sửa đổi/thay thế, hoặc đã qua ngày `expiry_date`.
6. 🛑 **Chưa có backup (`Zero Backup Condition`):** Chưa thực hiện bản sao lưu cơ sở dữ liệu (`Database Backup - pg_dump`) trước thời điểm chuẩn bị chạy script import trên môi trường thực tế/staging.
7. 🛑 **Chưa có người duyệt (`Missing Approver Condition`):** Phiếu đề xuất import tổng thể hoặc batch file CSV chưa có chữ ký xác nhận phê duyệt chính thức từ Lãnh đạo Phòng (`MANAGER`).

---

## 5. Safety Confirmation

Tôi xác nhận và tái khẳng định tuân thủ tuyệt đối **5 Cam kết An toàn Vận hành & Quản trị Phase 11C (`5 Inviolable Phase 11C Safety Confirmations`)**:
1. ✅ **PHASE NÀY KHÔNG IMPORT THẬT (`Zero Real Data Ingestion`):** Toàn bộ hoạt động trong Phase 11C là chuẩn bị tài liệu, biểu mẫu, quy chuẩn mapping và checklist kiểm tra. Không chạy bất kỳ lệnh insert hay seed dữ liệu nào vào bảng `LegalKnowledge` trên DB production `legalflow_prod`.
2. ✅ **KHÔNG ACTIVE VERSION (`Zero Version Activation`):** Không thực hiện bất kỳ lệnh thay đổi cờ hiệu lực (`active: true`) hay kích hoạt phiên bản tri thức pháp lý nào.
3. ✅ **KHÔNG SỬA DATABASE (`Zero DB Tampering`):** Cơ sở dữ liệu production được giữ nguyên 100%, không sửa đổi schema, không tạo migration, không chạy reset (`migrate reset`) và không restore.
4. ✅ **KHÔNG DÙNG DỮ LIỆU CHƯA DUYỆT CHO AI REVIEW CHÍNH THỨC (`Zero Unverified AI Usage`):** Trợ lý AI Khối 3.1 tuyệt đối không được truy cập hay áp dụng các bản ghi nháp (`Draft`), chờ rà soát (`Pending Review`) hoặc chưa qua thẩm định chính thức (`Approved`).
5. ✅ **CÁN BỘ VẪN LÀ CHỐT CHẶN PHÁP LÝ TỐI CAO (`Human-in-the-Loop Supremacy`):** Khẳng định thông điệp pháp lý tối thượng: AI chỉ là công cụ gợi ý sơ bộ, không bao giờ khẳng định căn cứ là đầy đủ tuyệt đối. Chuyên viên thụ lý P2, Chuyên viên Một cửa và Lãnh đạo Phòng bắt buộc rà soát văn bản gốc thực tế trước khi tham mưu quyết định TTHC.

---
*Checklist Kiểm tra Trước Nạp & Diễn tập Nạp Dữ liệu (Import Validation Checklist) được lập tự động từ Kế hoạch Phase 11C.*
