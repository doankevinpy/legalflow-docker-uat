# Sổ Đăng Ký Theo Dõi Sự Cố, Lỗi & Phản Hồi Cán Bộ (`Issue, Incident & Operator Feedback Register`) Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12P
## Phase 12P: Pilot Issue, Incident & Operator Feedback Register

> [!CAUTION]
> **TÚYÊN BỐ NGUYÊN TẮC XỬ LÝ SỰ CỐ & PHÂN LOẠI LỖI (`INCIDENT TRIAGE & ACTION RULE`):**
> Sổ đăng ký này ghi nhận toàn bộ các phát hiện lỗi, sự cố hạ tầng và ý kiến phản hồi của cán bộ trong suốt thời gian vận hành thí điểm Phase 12P. Tuân thủ tuyệt đối quy tắc phán quyết của Giai đoạn 12P:
> - **Nếu phát hiện bất kỳ 01 lỗi `CRITICAL` hoặc `HIGH` nào:** Lập tức kích hoạt lệnh đình chỉ thí điểm (`PILOT SUSPENDED`).
> - **Nếu chỉ phát sinh các ý kiến phản hồi UX (`Low / UX Note`) hoặc duy trì lỗi không chặn cũ từ Phase 12K (`0 Blocking Issues`):** Nghiêm cấm tự ý sửa đổi mã nguồn (`backend, frontend, schema, migration`) trong Phase 12P; toàn bộ các đề xuất nâng cấp UX được ghi nhận vào Backlog cho phiên bản chính thức v2.13 và kết luận phán quyết là **`PILOT MONITORING COMPLETED`**.

---

## 1. Bảng Tổng Hợp Phân Loại Sự Cố & Lỗi (`Issue Classification Summary Table`)

Căn cứ trên nhật ký giám sát ngày T+01 và rà soát của Trưởng Đội ngũ Kỹ thuật (`Tech Lead`), số lượng sự cố/lỗi được phân loại như sau:

| Mức Độ Nghiêm Trọng (`Severity Level`) | Tiêu Chí Phân Loại (`Classification Criteria`) | Số Lượng Phát Hiện (`Count`) | Tác Động Đến Quyết Định Vận Hành (`Operational Impact`) | Hành Động Xử Lý Trong Phase 12P (`Phase 12P Action`) |
| :---: | :--- | :---: | :--- | :--- |
| **`CRITICAL`** | Lỗi sập hệ thống, mất dữ liệu, vi phạm rào chắn pháp lý (`officialAmount != null` hoặc gửi thông báo thuế tự động). | **`0`** | **ĐÌNH CHỈ NGAY (`PILOT SUSPENDED`)** | Không có (*N/A*). |
| **`HIGH`** | Lỗi làm sai lệch chiết tính nháp, rò rỉ chứng từ ra ngoài mạng UAT, rào chắn không chặn được thao tác vượt quyền. | **`0`** | **ĐÌNH CHỈ NGAY (`PILOT SUSPENDED`)** | Không có (*N/A*). |
| **`MEDIUM`** | Lỗi giao diện hiển thị sai màu sắc cảnh báo, tải chứng từ chậm `> 10s`, lỗi ngắt kết nối tạm thời. | **`0`** | Theo dõi kỹ thuật, không đình chỉ. | Không có (*N/A*). |
| **`LOW / UX NOTE`** | Gợi ý cải tiến giao diện, phím tắt, tooltip giải thích bổ sung hoặc tiện ích hỗ trợ thao tác nhanh cho cán bộ. | **`02`** *(01 Baseline + 01 New Feedback)* | **KHÔNG CHẶN (`NON-BLOCKING`)** | Chuyển vào Backlog v2.13; **chỉ ghi nhận tài liệu, không sửa code**. |

---

## 2. Chi Tiết Danh Sách Sự Cố, Lỗi & Phản Hồi Cán Bộ (`Detailed Issue & Feedback Logs`)

### A. CÁC GHI NHẬN TỪ ĐƯỜNG CƠ SỞ TRƯỚC KÍCH HOẠT (`BASELINE CARRYOVER ISSUES`)

* **`ISSUE-UAT-12K-01` (`Tooltip cho nút hoàn thành bị khóa chưa hiển thị lý do chi tiết`):**
  - **Mức độ nghiêm trọng (`Severity`):** `Low / UX Note` *(Non-blocking)*
  - **Nguồn phát hiện:** Kế thừa từ kết quả UAT Phase 12K / 12L / 12N.
  - **Mô tả hiện tượng:** Khi Cán bộ thẩm định di chuột (`hover`) lên nút "Hoàn thành thủ tục" đang bị khóa mờ (`Disabled`) do chưa xác nhận chứng từ, hệ thống có hiển thị biểu tượng cấm bấm nhưng phần tooltip giải thích chi tiết (*"Vui lòng xác nhận chứng từ nộp tiền trước khi hoàn thành"*) xuất hiện hơi chậm (`~1.5s`).
  - **Đánh giá rủi ro pháp lý & rào chắn:** **`0% Risk`**. Rào chắn vẫn chặn tuyệt đối thao tác bấm hoàn thành (`100% Guardrail Block`).
  - **Quyết định xử lý trong Phase 12P:** **`MAINTAINED IN BACKLOG (NO CODE FIX IN PHASE 12P)`**. Cán bộ thẩm định đã được hướng dẫn quy trình trong Cẩm nang đào tạo (`PHASE12M_OPERATOR_TRAINING.md`). Chuyển lịch tối ưu CSS/Tooltip vào đợt phát hành `v2.13.0`.

---

### B. CÁC PHẢN HỒI UX MỚI PHÁT SINH TRONG QUÁ TRÌNH GIÁM SÁT (`NEW OPERATOR FEEDBACK IN PHASE 12P`)

* **`FEEDBACK-12P-01` (`Đề xuất tiện ích tải xuống nhanh toàn bộ chứng từ scan trong một tệp nén ZIP`):**
  - **Mức độ nghiêm trọng (`Severity`):** `Low / UX Enhancement Proposal` *(Non-blocking)*
  - **Người đề xuất:** Cán bộ Thẩm định Phòng Tài nguyên & Môi trường (`REVIEWER_01`) lúc 14:30 ngày 16/07.
  - **Mô tả phản hồi:** Đối với các hồ sơ tách thửa hoặc chuyển nhượng có nhiều chứng từ tài chính đi kèm (ví dụ: Thông báo lệ phí trước bạ + Thông báo thuế thu nhập cá nhân + 02 Giấy nộp tiền vào ngân sách nhà nước), cán bộ hiện tại phải bấm xem/tải xuống từng tệp PDF một trên tab "Nghĩa vụ tài chính". Cán bộ đề xuất bổ sung thêm nút **"Tải xuống tất cả chứng từ (.ZIP)"** (`Download All Scans as ZIP`) để tiết kiệm thời gian rà soát ngoại tuyến.
  - **Đánh giá rủi ro pháp lý & rào chắn:** **`0% Risk`**. Đây là tính năng nâng cao tiện ích trải nghiệm người dùng (`QoL / UX Enhancement`), hoàn toàn không ảnh hưởng đến rào chắn hay tính chính xác của chiết tính nháp.
  - **Quyết định xử lý trong Phase 12P:** **`ACCEPTED FOR POST-PILOT ROADMAP (NO CODE FIX IN PHASE 12P)`**. Ghi nhận vào danh sách cải tiến kỹ thuật sau thí điểm. Trong thời gian 30 ngày pilot hiện tại, cán bộ tiếp tục rà soát trực tiếp trên trình xem PDF tích hợp (`Integrated PDF Viewer`) của hệ thống.

---

## 3. Khẳng Định Không Có Lỗi Chặn & Tuân Thủ Mã Nguồi (`Non-Blocking & Code Integrity Confirmation`)

| Hạng Mục Kiểm Tra (`Verification Item`) | Kết Quả (`Status`) | Minh Chứng Kỹ Thuật (`Technical Proof`) |
| :--- | :---: | :--- |
| **Tổng số sự cố `CRITICAL` hoặc `HIGH`** | **`0`** | Nhật ký giám sát `PILOT_OPERATION_LOG.md` sạch hoàn toàn. |
| **Tổng số lỗi chặn nghiệp vụ (`Blocking Issues`)** | **`0`** | Cả 08 hồ sơ demo (`DEMO-FO-UAT-01..08`) đều luân chuyển trơn tru qua các bước. |
| **Sự can thiệp sửa đổi mã nguồn trong Phase 12P** | **`0 FILES`** | Lệnh `git status` khẳng định `0 files modified` trong `backend, frontend, schema, db`. |

---

## 4. Ký Nhận Của Trưởng Đội Ngũ Kỹ Thuật (`Tech Lead Register Signoff`)

> **Lời chứng phân loại sự cố:** *"Tôi xác nhận toàn bộ 02 hạng mục ghi nhận trong sổ đăng ký này đều thuộc nhóm `Low / UX Note` và không cấu thành sự cố nghiêm trọng hay lỗi chặn nghiệp vụ (`0 Critical | 0 High | 0 Blocking`). Tuân thủ đúng chỉ đạo Phase 12P, đội ngũ kỹ thuật không thực hiện bất kỳ sửa đổi mã nguồn hay can thiệp DB nào để xử lý 02 ghi nhận UX này trong đợt giám sát thí điểm."*

* **Người xác nhận:** Trưởng Đội ngũ Kỹ thuật LegalFlow (`TECH_LEAD`)
* **Ngày xác nhận:** `16/07/2026`
* **Phán quyết mức độ lỗi:** **`NO BLOCKING ISSUES DETECTED -> QUALIFIES FOR MONITORING COMPLETION`**
