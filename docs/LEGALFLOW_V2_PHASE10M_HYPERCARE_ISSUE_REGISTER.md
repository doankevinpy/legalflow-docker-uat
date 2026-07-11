# LEGALFLOW V2 - PHASE 10M
# HYPERCARE ISSUE REGISTER

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.12-controlled-production-deployment-execution`  
**Giai đoạn theo dõi:** **`PHASE 10M HYPERCARE (Day 1 -> Day 3)`**  
**Trạng thái Sổ ghi nhận:** **`ACTIVE REGISTER`**

---

## 1. Purpose

Tài liệu này là Sổ ghi nhận Lỗi & Góp ý sau triển khai (`Hypercare Issue Register` - Phase 10M) được duy trì liên tục trong suốt giai đoạn theo dõi vận hành có kiểm soát. Sổ ghi nhận đóng vai trò là cơ sở dữ liệu rủi ro tập trung, giúp Lực lượng Kỹ thuật, Trợ lý UAT và Lãnh đạo dự án phân loại, phân cấp ưu tiên (`Triage & Severity Ranking`) và theo dõi tiến độ xử lý mọi sự cố hoặc góp ý của chuyên viên Pilot trước thời điểm họp xét duyệt quyết định mở rộng (`Phase 10N`).

---

## 2. Issue Register

Bảng ghi nhận toàn bộ các vấn đề, lỗi kỹ thuật và lưu ý môi trường phát sinh trong giai đoạn Hypercare:

| Issue ID | Date/Time | Reporter Role | Screen / Function | Description | Expected Result | Actual Result | Severity | Priority | Evidence | Assigned To | Status | Resolution / Action Plan | Verified By | Notes |
| :---: | :---: | :---: | :--- | :--- | :--- | :--- | :---: | :---: | :--- | :--- | :---: | :--- | :--- | :--- |
| **HYP-ENV-01** | `11/07/2026 17:42` | DevOps | Infrastructure (`MinIO Port 9000`) | Cổng `9000` trên máy chủ bị một tiến trình bên ngoài (như Antigravity IDE hoặc dịch vụ nội bộ khác) chiếm giữ, khiến container `legalflow_minio` không khởi động được khi chạy script. | Container `legalflow_minio` khởi động và bind thành công cổng `9000:9000`. | `Error: bind: Only one usage of each socket address is normally permitted.` Container MinIO dừng ở trạng thái `Created`. | `Low / Warning` *(Environment)* | `P3` | `docker ps` / `health-check.ps1` log | SysAdmin | **OPEN** | Yêu cầu Kỹ sư Quản trị Hạ tầng kiểm tra tiến trình máy chủ (`netstat -ano | findstr :9000` &rarr; `Stop-Process`) để giải phóng cổng 9000, hoặc đổi sang `9001:9000` trong `docker-compose.infra.yml`. | Tech Lead | **Hoàn toàn không phải lỗi mã nguồn hay DB.** Postgres và Caddy chạy rất ổn định. |
| **HYP-STAB-01** | `11/07/2026 18:00` | UAT Coordinator | 8 UAT P1/P2 Fixes (`Tab 3, UI/UX, AI Prompts`) | Kiểm tra định kỳ độ ổn định của 8 vấn đề đã khắc phục tại Phase 10G/10H (`CASELIST-01`, `DETAIL-02`, `AI-01`, `AI-04`, `LAW-02`, `LK-01`, `UX-01`, `UX-05`). | Toàn bộ 8 tính năng hoạt động mượt mà, không có lỗi hồi quy (`0 regressions`). | 129 unit tests pass, UI Khối 3.1, Khối 3.2, Khối 3.3 hiển thị đúng chuẩn. | `Not Defect` *(Verification)* | `P1` | `npm test` &amp; UI Check | UAT Coordinator | **CLOSED / STABILIZED** | Xác nhận 8/8 vấn đề được giữ vững 100% trong suốt quá trình triển khai production có kiểm soát. | Manager Rep | Bằng chứng vững chắc cho tính sẵn sàng mở rộng. |

---

## 3. Severity Rules

Bộ quy tắc phân loại mức độ nghiêm trọng (`Severity Definitions & Rules`) được thống nhất áp dụng cho toàn bộ các sự cố ghi nhận vào Sổ:

### 1. `CRITICAL (P0)` - Lỗi Chặn Tuyệt Đối / Khẩn Cấp
* **Định nghĩa:** Sự cố gây phá hủy cấu trúc, mất mát, xóa trái phép hoặc sai lệch nghiêm trọng dữ liệu hồ sơ thực tế trong database `legalflow_prod`; hoặc lỗi phân quyền nghiêm trọng (`Privilege Escalation`) cho phép cán bộ/người xem tự ý duyệt/ban hành trái phép; hoặc toàn bộ hệ thống DB (`legalflow_postgres`) crash không thể khởi động.
* **Quy tắc xử lý:** Bắt buộc **DÙNG TRIỂN KHAI NGAY LẬP TỨC**, báo cáo Project Owner trong 15 phút và kích hoạt kịch bản Rollback về Git tag `v2.10.8`.

### 2. `HIGH (P1)` - Lỗi Nghiêm Trọng / Rủi Ro Quản Trị AI Cao
* **Định nghĩa:** Sự cố vi phạm nghiêm trọng nguyên tắc quản trị (`AI Governance / Export Safeguard`) như: trợ lý AI đưa ra lời khuyên khẳng định tuyệt đối thay thế thẩm quyền của cán bộ; mất nhãn cảnh báo *"⚠️ BẢN GỢI Ý AI"*; hoặc file tải về từ Khối 3.3 bị mất tiền tố `DU_THAO_GOI_Y_AI_` / tự động chèn chữ ký số gây hiểu nhầm là quyết định chính thức; hoặc không thể thực thi lệnh `pg_dump` tạo backup.
* **Quy tắc xử lý:** Bắt buộc **TẠM DỪNG MỞ RỘNG NGƯỜI DÙNG**, yêu cầu đội Kỹ thuật khắc phục hotfix và rà soát lại trong ngày.

### 3. `MEDIUM (P2)` - Lỗi Chức Năng Bị Giới Hạn / Có Phương Án Thay Thế
* **Định nghĩa:** Lỗi xảy ra trên một tính năng cụ thể (ví dụ: hiển thị lệch một huy hiệu, chuyển tab hơi chậm, hoặc tìm kiếm theo từ khóa đặc biệt chưa tối ưu) nhưng không gây sai lệch pháp lý, không mất dữ liệu và người dùng có thể thực hiện thao tác qua phương án thay thế (`workaround`).
* **Quy tắc xử lý:** Ghi nhận vào Sổ lỗi, đưa vào kế hoạch khắc phục trong đợt ổn định `Stabilization Patch` kế tiếp mà không cần Rollback.

### 4. `LOW / WARNING (P3/P4/Env)` - Lỗi Nhỏ / Lưu Ý Môi Trường / Giao Diện
* **Định nghĩa:** Các lỗi nhỏ về màu sắc, lỗi chính tả trên thông báo, hoặc các xung đột hạ tầng cục bộ trên máy chủ (như xung đột cổng `9000` do tiến trình bên ngoài chiếm giữ) mà không ảnh hưởng đến logic core API và cơ sở dữ liệu.
* **Quy tắc xử lý:** Ghi nhận để theo dõi và phối hợp bộ phận quản trị mạng/máy chủ giải quyết theo giờ hành chính.

### 5. `SUGGESTION (P4)` - Đề Xuất Cải Tiến Của Người Dùng
* **Định nghĩa:** Các ý kiến đóng góp nâng cao từ cán bộ Pilot (như muốn thêm phím tắt, thêm màu huy hiệu, hoặc bổ sung mẫu đơn vào danh mục in ấn).
* **Quy tắc xử lý:** Đưa vào danh sách `Deferred Backlog` để xem xét cho các phiên bản nâng cấp Lớn của tương lai.

---

## 4. Daily Triage Template

Bảng theo dõi và tổng kết hoạt động rà soát, phân loại lỗi hàng ngày trong giai đoạn Hypercare (`Daily Issue Triage Log`):

| Date (`Day`) | New Issues Reported | Critical (`P0`) | High (`P1`) | Medium (`P2`) | Low / Env (`P3/P4`) | Resolved / Closed | Active Blockers | Daily Triage Decision | Notes & Action Items |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **Day 0** <br/> `(11/07)` | **1** | `0` | `0` | `0` | `1` *(HYP-ENV-01)* | `1` *(HYP-STAB-01)* | `0` | **PROCEED TO DAY 1** <br/> *(Hệ thống đạt chuẩn an toàn tuyệt đối về code và DB)* | Yêu cầu SysAdmin rà soát giải phóng cổng 9000 trước giờ làm việc sáng mai. |
| **Day 1** <br/> `(12/07)` | *(Pending)* | `0` | `0` | `0` | `0` | `0` | `0` | *(To be completed at 16:30 PM on Day 1)* | Rà soát log `health-check.ps1` buổi sáng và phản hồi từ 5-8 cán bộ thụ lý lõi. |
| **Day 2** <br/> `(13/07)` | *(Pending)* | `0` | `0` | `0` | `0` | `0` | `0` | *(To be completed at 16:30 PM on Day 2)* | Kiểm tra trạng thái ổn định container Postgres và Caddy Proxy sau 48h. |
| **Day 3** <br/> `(14/07)` | *(Pending)* | `0` | `0` | `0` | `0` | `0` | `0` | *(To be completed at 16:30 PM on Day 3)* | Tổng kết toàn bộ số liệu để họp xét duyệt mở rộng tại **Phase 10N**. |

---
*Sổ ghi nhận lỗi Hypercare được duy trì cập nhật tự động và kiểm duyệt hàng ngày bởi Lực lượng Kỹ thuật & Trợ lý UAT trong Phase 10M.*
