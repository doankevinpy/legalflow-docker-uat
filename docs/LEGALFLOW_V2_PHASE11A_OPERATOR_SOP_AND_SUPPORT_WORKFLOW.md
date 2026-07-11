# LEGALFLOW V2 - PHASE 11A
# OPERATOR SOP & SUPPORT WORKFLOW

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11A Standard`  
**Ngày ban hành SOP Vận hành:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL OPERATOR SOP & SUPPORT WORKFLOW`** *(Quy trình Vận hành Hạ tầng & Hỗ trợ Người dùng)*

---

## 1. Purpose

Tài liệu này là Quy trình Thao tác chuẩn về Vận hành Hạ tầng và Hỗ trợ Người dùng (`Operator SOP & Support Workflow` - Phase 11A) của hệ thống LegalFlow V2. Tài liệu chuẩn hóa các thao tác kiểm tra kỹ thuật hàng ngày (`Daily Checklist`), định kỳ hàng tuần (`Weekly Checklist`), thiết lập quy trình tiếp nhận và xử lý sự cố 9 bước (`Support Intake Workflow`), phân loại chính xác 5 cấp độ nghiêm trọng (`Severity Classification`), quy định kịch bản ứng phó sự cố khẩn cấp (`Incident Response`), tổng hợp danh sách câu lệnh quản trị chuẩn (`Useful Commands`) và nhắc nhở kỷ luật sao lưu an toàn (`Backup Reminder`) nhằm đảm bảo hạ tầng production vận hành liên tục, ổn định và an toàn tối đa.

---

## 2. Daily Operator Checklist

Bảng kiểm tra sức khỏe hạ tầng và giám sát vận hành bắt buộc hàng ca trực (`08:00 AM` và `16:30 PM` hàng ngày - `Daily Operator Audit Table`):

| Check Item | Execution Command / Verification Evidence | Expected System Result | Actual Result | Status | Notes & Action Mandate |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **1. Mở Frontend Web** | Truy cập `http://localhost:5173` (Dev) hoặc `http://kevindoan-legalflow.local:8080` (Prod Proxy) | Trang đăng nhập LegalFlow tải thành công dưới `1s`, không báo lỗi 502/504 | Trả về HTTP 200 OK, giao diện sắc nét, phản hồi nhanh | `[PASS]` | Kiểm tra đầu ca làm việc của kỹ sư trực. |
| **2. Chạy Health-check** | PowerShell: `.\scripts\health-check.ps1` | `[PASS]` cho Postgres và Caddy. Báo cáo minh bạch trạng thái từng cổng dịch vụ | `[PASS]` Postgres &amp; Caddy. MinIO báo `[FAIL]` do cổng 9000 bị chiếm (`EXP-ENV-01`) | `[PASS/WARN]` | Không ảnh hưởng cơ sở dữ liệu Postgres lõi. |
| **3. Kiểm tra `docker ps`** | PowerShell: `docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}"` | `legalflow_postgres` hiển thị `Up (healthy)`. `legalflow_caddy` hiển thị `Up` | `legalflow_postgres` Up > 2 hours (`healthy 100%`). `legalflow_caddy` Up > 2 hours | `[PASS]` | Container DB lõi ổn định tuyệt đối. |
| **4. Kiểm tra Backup Gần nhất** | PowerShell: `dir .\backups\` | Có file `pg_dump` mới nhất (ví dụ: `legalflow_prod_dump_...sql`, `~951 KB`), thuộc tính `untracked` | File dump an toàn `951 KB`, `untracked` ngoài Git | `[PASS]` | Tuyệt đối không commit file `.sql` backup vào Git. |
| **5. Kiểm tra Issue Register** | Mở file `EXPANDED_USER_SUPPORT_AND_ISSUE_SUMMARY.md` trong `docs/` | Xem có phiếu sự cố mới được cán bộ thụ lý gửi về trong 24 giờ qua không | Các lỗi cũ đã `RESOLVED` tại Phase 10G/10L. Sổ ghi nhận sạch sẽ | `[PASS]` | Tiếp nhận phản hồi mới từ `16:30 PM` mỗi chiều. |
| **6. Kiểm tra Lỗi Người dùng** | Xem `Audit Log` trên DB (qua giao diện Admin nếu có) hoặc log API `docker logs` | Không có hiện tượng dò quét mật khẩu hay truy cập trái phép liên tục | Log API ổn định, không có `HTTP 401/403` bất thường | `[PASS]` | Bảo đảm an ninh truy cập theo đúng `RBAC`. |
| **7. Kiểm tra Cảnh báo AI/Export** | Kiểm tra ngẫu nhiên 1 hồ sơ trên Tab 3 và Tab 3.3 | Khung viền vàng AI Warning hiển thị rõ ràng, nút tải Word giữ nguyên tiền tố `DU_THAO_GOI_Y_AI_` | Viền vàng và tiền tố hoạt động chính xác 100% | `[PASS]` | Chốt chặn an toàn pháp lý và văn thư. |

---

## 3. Weekly Operator Checklist

Bảng kiểm tra định kỳ hàng tuần vào chiều thứ Sáu (`Weekly Operator Maintenance Checklist Table`):
1. **Rà soát Phân quyền `RBAC` (`Weekly Permission Audit`):** Đối chiếu danh sách tài khoản đang hoạt động trên hệ thống với danh sách phê duyệt Wave 1 / Wave 2 của Lãnh đạo Cơ quan. Khẳng định không có tài khoản `STAFF` hoặc `VIEWER` nào bị thăng quyền sai quy định (`SMK-08`).
2. **Rà soát Legal Knowledge Active Version (`LK-01 Audit`):** Kiểm tra bảng `LegalKnowledgeVersion` trong cơ sở dữ liệu. Khẳng định phiên bản đang hiệu lực (`active: true`) là `v2.0-2024-LAND-LAW`. Kiểm tra không có văn bản hết hạn nào bị đẩy lên kích hoạt trái phép.
3. **Kiểm tra Sức khỏe Backup (`Backup Verification Audit`):** Rà soát dung lượng các file `.sql` trong `backups/`, bảo đảm không có file dump bị lỗi 0 KB. Khẳng định lại lần nữa toàn bộ thư mục `backups/` nằm trong `.gitignore` (`untracked`).
4. **Rà soát Issue Backlog (`Phase 10Q -> Phase 11 Backlog`):** Mở Sổ Backlog Cải tiến Liên tục (`LEGALFLOW_V2_PHASE10Q_CONTINUOUS_IMPROVEMENT_BACKLOG.md`), rà soát tiến độ chuẩn bị cho các hạng mục ưu tiên cao (`BL-001 -> BL-003`).
5. **Tổng hợp Feedback Người dùng (`Feedback Synthesis`):** Tổng hợp các ý kiến đóng góp từ Sổ theo dõi hỗ trợ hàng ngày (`Issue Register`), phân loại thành các yêu cầu cải tiến UX (`Suggestion`) để báo cáo Ban Quản lý Dự án.
6. **Báo cáo Lãnh đạo nếu có Lỗi High/Critical (`Escalation Report`):** Lập Báo cáo Tổng kết Tuần (*Weekly Ops Report*). Nếu trong tuần phát hiện bất kỳ sự cố `High` hay `Critical` nào, phải báo cáo bằng văn bản cho Lãnh đạo Đơn vị và Tech Lead ngay lập tức.

---

## 4. Support Intake Workflow

Quy trình tiếp nhận, phân loại và tháo gỡ sự cố 9 bước chuẩn hóa cho lực lượng Trợ lý UAT và Kỹ sư Vận hành (`Standardized 90-Step Support Intake Workflow`):
1. **Bước 1: Người dùng báo lỗi (`User Intake`):** Tiếp nhận thông tin từ chuyên viên qua số điện thoại hỗ trợ hoặc trực tiếp tại bàn làm việc vào lúc `16:30 PM` hàng ngày.
2. **Bước 2: Ghi Role (`Record Role`):** Ghi nhận chính xác vai trò phân quyền của cán bộ báo lỗi (`ADMIN / MANAGER / STAFF / VIEWER`) và đơn vị công tác.
3. **Bước 3: Ghi Màn hình / Chức năng (`Record UI Screen`):** Ghi rõ mã hồ sơ, tên màn hình (ví dụ: Tab 1 Danh sách, Tab 3 AI Review hay Khối 3.3 Xuất văn bản).
4. **Bước 4: Ghi Thời điểm (`Record Timestamp`):** Ghi lại ngày giờ chính xác xảy ra sự cố (`YYYY-MM-DD HH:mm:ss`) để tiện tra cứu nhật ký hệ thống (`Audit Log / Docker Logs`).
5. **Bước 5: Ghi Expected / Actual (`Record Deviation`):** Ghi rõ cán bộ kỳ vọng hệ thống hiển thị gì (`Expected Result`) và thực tế hệ thống đã trả về kết quả hoặc lỗi gì (`Actual Result`).
6. **Bước 6: Chụp Bằng chứng nếu có (`Capture Evidence`):** Yêu cầu cán bộ gửi hoặc trực tiếp chụp ảnh màn hình giao diện bị lỗi (chú ý không để lộ thông tin nhạy cảm của công dân nếu không cần thiết).
7. **Bước 7: Phân loại Severity (`Assign Severity`):** Đối chiếu với Bảng Phân loại Nghiêm trọng Mục 5 để gán nhãn `Critical`, `High`, `Medium`, `Low` hoặc `Suggestion`.
8. **Bước 8: Quyết định Xử lý ngay / Backlog / No Action (`Triage Decision`):**  
   * Nếu là lỗi `Critical / High` hoặc lỗi thao tác đơn giản: hướng dẫn xử lý ngay tại chỗ (`Immediate Action`).  
   * Nếu là yêu cầu tính năng nâng cao (như bổ sung quy hoạch đất `BL-001`): đưa vào Sổ Backlog Phase 11 (`Backlog`).  
   * Nếu là thao tác đúng thiết kế nhưng người dùng chưa quen: giải thích SOP (`No Code Action`).
9. **Bước 9: Xác nhận lại với Người dùng (`User Confirmation`):** Thông báo kết quả xử lý lại cho chuyên viên, ghi nhận xác nhận hài lòng và đóng phiếu sự cố trên Sổ theo dõi.

---

## 5. Severity Classification

Bảng định nghĩa chuẩn hóa 5 cấp độ nghiêm trọng của sự cố vận hành LegalFlow V2 (`Incident Severity Classification Table`):

| Severity Level | Definition & Operational Impact | Target Response & Resolution Time | Governance & Escalation Mandate |
| :---: | :--- | :---: | :--- |
| **`Critical` (P0)** | Mất dữ liệu hồ sơ (`Data Loss`), hệ thống crash sập hoàn toàn (`Postgres / Caddy down`), hoặc sai lệch phân quyền nghiêm trọng (`VIEWER` truy cập được quyền Admin/Xóa dữ liệu). | **Phản hồi ngay dưới 15 phút.** <br/>Khắc phục trong `2 giờ`. | **BÁO CÁO KHẨN CẤP LÃNH ĐẠO.** Dừng ngay việc mở rộng, kích hoạt Kịch bản Ứng phó Mục 6. |
| **`High` (P1)** | AI Khối 3.1 gây hiểu nhầm nghiêm trọng là kết luận chính thức, file xuất Khối 3.3 giống hệt văn bản đã ban hành (`mất tiền tố DU_THAO_GOI_Y_AI_ hoặc watermark`), hoặc lỗi Tab 3 không chạy được AI cho toàn bộ `STAFF`. | **Phản hồi dưới 30 phút.** <br/>Khắc phục trong `4 giờ`. | Báo cáo Tech Lead và Lãnh đạo Phòng P2. Ưu tiên sửa ngay bằng Hotfix (nếu được phê duyệt). |
| **`Medium` (P2)** | Lỗi hiển thị UI Tab 1/Tab 4 ở một số độ phân giải màn hình, tốc độ tra cứu `Knowledge Base` chậm, hoặc thiếu dữ liệu quy định địa phương (`LAW-02`) buộc cán bộ rà soát thủ công ngoài phần mềm. | **Phản hồi trong 2 giờ.** <br/>Khắc phục trong `24 – 48 giờ` hoặc Phase kế tiếp. | Ghi nhận vào Sổ theo dõi, hướng dẫn giải pháp thay thế tạm thời (*Workaround*). |
| **`Low` (P3)** | Lỗi lỗi chính tả nhỏ trên tooltip, màu sắc nút bấm chưa đồng bộ hoàn toàn, hoặc thói quen mở file Word `.docx` cần thêm bước chỉnh sửa lề. | **Phản hồi trong 24 giờ.** <br/>Khắc phục trong các đợt phát hành định kỳ. | Đưa vào Sổ Backlog Cải tiến Liên tục Phase 11. |
| **`Suggestion` (Info)** | Ý kiến đóng góp nâng cấp giao diện, đề xuất thêm phím tắt tra cứu nhanh hoặc thêm chức năng bóc tách OCR scan tự động (`BL-004`). | **Phản hồi &amp; Ghi nhận trong 24 giờ.** | Tổng hợp vào Sổ Backlog Phase 10Q / Phase 11 (`Continuous Improvement`). |

### Các Lỗi Bắt buộc xếp hạng `High / Critical`:
* 🚨 **Mất dữ liệu (`Data Loss` -> `Critical`):** Bất kỳ báo cáo nào về việc mất dữ liệu hồ sơ hay thông tin thẩm định.
* 🚨 **Sai phân quyền nghiêm trọng (`RBAC Breach` -> `Critical / High`):** `VIEWER` hoặc `STAFF` vượt quyền thao tác nhạy cảm.
* 🚨 **AI gây hiểu nhầm là kết luận chính thức (`AI Governance Breach` -> `High / Critical`):** Trợ lý AI đưa ra từ ngữ phán quyết thay quyền con người.
* 🚨 **Export giống văn bản đã ban hành (`Export Safety Breach` -> `High / Critical`):** File tải về mất tiền tố `DU_THAO_GOI_Y_AI_` hoặc bị gỡ watermark nháp.

---

## 6. Incident Response

Quy trình 7 bước ứng phó khẩn cấp khi xảy ra sự cố nghiêm trọng `Critical / High` (`Emergency Incident Response Protocol`):
1. **Dừng Mở rộng (`Halt Expansion`):** Tạm dừng ngay mọi kế hoạch bổ sung người dùng mới hoặc chuyển giao tài khoản Wave kế tiếp cho đến khi sự cố được tháo gỡ triệt để.
2. **Ghi nhận Thời điểm (`Log Incident Timestamp`):** Ghi lại chính xác mốc thời gian phát hiện sự cố, tình trạng hệ thống lúc xảy ra lỗi và số lượng cán bộ bị ảnh hưởng.
3. **Thông báo Technical Owner (`Notify Tech Lead &amp; Project Owner`):** Gọi điện và gửi báo cáo nhanh cho Trưởng nhóm Kỹ thuật (`DevOps Lead`) và Ban Lãnh đạo Đơn vị trong vòng 15 phút.
4. **Kiểm tra Backup (`Audit Latest Dump`):** Kỹ sư Vận hành lập tức rà soát file sao lưu `pg_dump` gần nhất trong `backups/`, kiểm tra tính toàn vẹn và dung lượng file (`~951 KB`), đảm bảo sẵn sàng điểm khôi phục an toàn.
5. **KHÔNG RESTORE NẾU CHƯA ĐƯỢC PHÊ DUYỆT (`No Unauthorized Restore`):** Tuyệt đối **không tự ý chạy lệnh khôi phục (`pg_restore` hoặc `mysql -u...`)** trên cơ sở dữ liệu `legalflow_prod` khi chưa có văn bản/ý kiến phê duyệt chính thức từ Lãnh đạo Đơn vị.
6. **KHÔNG RESET DATABASE (`Zero DB Reset`):** Khẳng định kỷ luật thép: **Tuyệt đối không chạy lệnh `npx prisma migrate reset` hay xóa dữ liệu production dưới bất kỳ hình thức nào**.
7. **Tạo Incident Report (`Post-Mortem Documentation`):** Lập Báo cáo Sự cố khẩn cấp (*Incident Report*), ghi rõ nguyên nhân gốc rễ (`Root Cause Analysis`), biện pháp xử lý tạm thời và phương án triệt để ngăn tái diễn.

---

## 7. Useful Commands

Danh sách câu lệnh chuẩn hóa dành cho Kỹ sư Vận hành thao tác kiểm tra hạ tầng và khởi chạy dịch vụ (`Standardized Operator Commands Table`):

### Chạy Health-check & Giám sát Container:
```powershell
cd C:\Users\Admin\legalflow-docker-uat

.\scripts\health-check.ps1

docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}"
```

### Dừng, Khởi động lại & Kiểm tra Sức khỏe Dịch vụ (`Start/Stop Runbook`):
```powershell
cd C:\Users\Admin\legalflow-docker-uat

.\scripts\stop-legalflow.ps1
.\scripts\start-legalflow.ps1
.\scripts\health-check.ps1
```

### Kiểm tra Trạng thái Mã nguồn & Thẻ Định danh (`Git Baseline Check`):
```powershell
cd C:\Users\Admin\legalflow-docker-uat

git status
git log --oneline --decorate -10
git tag --points-at HEAD
```

---

## 8. Backup Reminder

Nhắc nhở kỷ luật an toàn thông tin và quản trị cơ sở dữ liệu bất khả xâm phạm dành cho Kỹ sư trực chiến (`DBA & Backup Safety Mandates`):
1. 🛡️ **Backup tuyệt đối không commit vào Git (`Untracked Mandate`):** Toàn bộ file sao lưu `.sql` trong `backups/` (`~951 KB`) phải nằm ngoài tầm kiểm soát của Git (`untracked / ignored`). Tuyệt đối không thực hiện `git add backups/` hay `git commit -m "backup..."`.
2. 🛡️ **Backup phải bảo quản theo quy định an toàn nội bộ (`Air-gapped / Secure Storage`):** File sao lưu chứa dữ liệu thực tế của công dân và hồ sơ TTHC, phải được lưu trữ trên ổ cứng mã hóa hoặc máy chủ lưu trữ nội bộ có phân quyền nghiêm ngặt theo tiêu chuẩn an toàn thông tin nhà nước.
3. 🛡️ **Restore cần phê duyệt riêng (`Approval Mandate for Restore`):** Quy trình khôi phục cơ sở dữ liệu từ file dump là thao tác thay đổi dữ liệu toàn cục, bắt buộc phải có văn bản phê duyệt từ Lãnh đạo Đơn vị và Tech Lead.
4. 🛡️ **Không tự ý restore Production (`No Ad-hoc Production Restore`):** Kỹ sư trực chiến tuyệt đối không tự ý khôi phục, ghi đè hay reset cơ sở dữ liệu production `legalflow_prod` trong ca trực nếu không có lệnh điều động xử lý sự cố (`Incident Response`) hợp lệ.

---
*Quy trình Vận hành Hạ tầng & Hỗ trợ Người dùng (Operator SOP) được lập tự động từ kết quả chuẩn hóa Phase 10Q.*
