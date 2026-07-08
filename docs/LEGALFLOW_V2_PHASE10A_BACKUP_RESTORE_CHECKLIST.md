# LEGALFLOW V2 - PHASE 10A
# BACKUP & RESTORE CHECKLIST

**Ngày ban hành:** 08/07/2026  
**Phiên bản áp dụng:** `v2.9.13-final-uat-release-candidate-complete` ➔ Phase 10A  
**Chuyên trách thực hiện:** Trợ lý kỹ thuật & kiểm thử UAT (Antigravity AI)

---

## 1. Purpose
Tài liệu **Backup & Restore Checklist** là danh sách rà soát an toàn bắt buộc dành cho Quản trị viên hệ thống (System Administrator / DevOps Engineer) nhằm chuẩn bị và kiểm soát chặt chẽ các quy trình sao lưu (Backup) và phục hồi (Restore) cơ sở dữ liệu trước khi đưa LegalFlow v2 vào triển khai thí điểm (Pilot) hoặc vận hành chính thức (Production).
Tài liệu đảm bảo tính khả dụng của điểm khôi phục thảm họa (Disaster Recovery Point), ngăn chặn tuyệt đối các tai nạn làm mất mát hoặc ghi đè dữ liệu địa chính nhạy cảm.

---

## 2. Backup Checklist

Trước mỗi đợt nâng cấp, bảo trì hoặc kết thúc ngày làm việc trên môi trường Pilot/Production, Quản trị viên thực hiện và xác nhận bảng kiểm tra 6 bước sao lưu sau:

| Step | Command / Procedure | Expected Result | Done | Notes |
| :---: | :--- | :--- | :---: | :--- |
| **1. Tạo thư mục backups** | `if (!(Test-Path ".\backups")) { New-Item -ItemType Directory -Path ".\backups" }` | Thư mục `backups/` tồn tại ngay tại thư mục gốc của dự án (`C:\Users\Admin\legalflow-docker-uat\backups`). | `[DONE]` | Thư mục chuyên dụng để chứa các file `.sql` trích xuất từ PostgreSQL. |
| **2. Chạy lệnh `pg_dump`** | `$ts = Get-Date -Format "yyyyMMdd-HHmmss"`<br>`docker exec legalflow_postgres pg_dump -U legalflow_admin -d legalflow_prod > ".\backups\legalflow_prod_$ts.sql"` | File `legalflow_prod_yyyyMMdd-HHmmss.sql` được sinh ra thành công mà không có lỗi kết nối hay lỗi quyền hạn. | `[DONE]` | Không hardcode mật khẩu, sử dụng biến môi trường hoặc cấu hình chuẩn trong Docker. |
| **3. Kiểm tra file tồn tại** | `Test-Path ".\backups\legalflow_prod_$ts.sql"` | Trả về `True`. File sao lưu đã nằm an toàn trên ổ đĩa máy chủ. | `[DONE]` | Đảm bảo lệnh `pg_dump` không bị ngắt quãng giữa chừng. |
| **4. Kiểm tra dung lượng file** | `(Get-Item ".\backups\legalflow_prod_$ts.sql").Length` | Dung lượng file `> 0 bytes` (thông thường từ vài trăm KB đến nhiều MB tùy số lượng hồ sơ TTHC). | `[DONE]` | ❌ **CẢNH BÁO:** Nếu file bằng `0 bytes`, bản backup bị lỗi, phải chạy lại ngay. |
| **5. Lưu vị trí backup an toàn** | Copy file `.sql` sang ổ lưu trữ dự phòng (D:\ / NAS / External HDD) hoặc hệ thống Cloud Backup riêng. | Bản backup tồn tại ở ít nhất 02 vị trí vật lý độc lập (trên host hiện tại và trên thiết bị lưu trữ ngoại tuyến). | `[DONE]` | Đảm bảo khả năng phục hồi khi ổ cứng máy chủ chính gặp sự cố vật lý. |
| **6. Kiểm tra `git status` (Chặn commit)** | `git status -s` | Thư mục `backups/` và file `.sql` **HOÀN TOÀN KHÔNG XUẤT HIỆN** trong danh sách untracked/modified của Git. | `[DONE]` | Đã được cấu hình bảo vệ trong `.gitignore`. Tuyệt đối không đẩy CSDL lên Git repository. |

---

## 3. Restore Safety Checklist

Quy trình phục hồi dữ liệu (`Restore`) là thao tác can thiệp có tính chất **GHI ĐÈ / PHÁ HỦY DỮ LIỆU HIỆN TẠI (`DESTRUCTIVE ACTION`)**. Trước khi thực hiện bất kỳ lệnh `psql restore` nào, Quản trị viên bắt buộc phải trả lời và ký xác nhận 6 câu hỏi an toàn dưới đây:

| Step | Safety Question (Câu hỏi kiểm chứng an toàn) | Required Confirmation (Yêu cầu xác nhận bắt buộc) | Done | Notes |
| :---: | :--- | :--- | :---: | :--- |
| **1. Phê duyệt chính thức** | Đã có văn bản phê duyệt hoặc chỉ đạo bằng văn bản/email từ Lãnh đạo cơ quan hoặc Trưởng bộ phận Quản trị hệ thống chưa? | **BẮT BUỘC CÓ PHÊ DUYỆT (`REQUIRED`)**. Nếu không có chỉ đạo bằng văn bản, Quản trị viên tuyệt đối không được tự ý thực hiện restore. | `[CHECK]` | Ghi rõ số văn bản/email phê duyệt vào sổ nhật ký vận hành máy chủ. |
| **2. Backup khẩn cấp lần cuối** | Đã thực hiện sao lưu nguyên trạng toàn bộ CSDL hiện tại ngay lập tức trước giờ restore (`Pre-Restore Backup`) chưa? | **BẮT BUỘC ĐÃ BACKUP (`REQUIRED`)**. Dù CSDL hiện tại đang lỗi hay thiếu hụt, vẫn phải `pg_dump` ra một file riêng (ví dụ: `pre_restore_dump.sql`) để làm điểm cứu cánh. | `[CHECK]` | Phòng trường hợp file restore bị lỗi hoặc chọn nhầm thời điểm khôi phục. |
| **3. Xác định đúng môi trường** | Đã xác minh chính xác máy chủ đang thao tác là môi trường Test/Sandbox hay Production (`Production DB: legalflow_prod`) chưa? | **XÁC MINH CHÍNH XÁC (`REQUIRED`)**. Kiểm tra tên container `legalflow_postgres` và biến `DATABASE_URL` trong `.env` để không khôi phục nhầm CSDL. | `[CHECK]` | Tránh thảm họa ghi đè dữ liệu Production bằng file backup của môi trường Test. |
| **4. Xác định đúng file backup** | File `.sql` được chọn để khôi phục có đúng nhãn thời gian (`Timestamp`) mong muốn và đã kiểm tra dung lượng `> 0 KB` chưa? | **XÁC MINH FILE HỢP LỆ (`REQUIRED`)**. Kiểm tra cẩn thận ngày giờ tạo file để đảm bảo khôi phục đúng thời điểm trước khi xảy ra sự cố. | `[CHECK]` | Không khôi phục các file `.sql` bị ngắt quãng hoặc có dung lượng khả nghi. |
| **5. Thông báo người dùng** | Đã thông báo cho toàn bộ cán bộ nghiệp vụ (`ADMIN`, `MANAGER`, `STAFF`) tạm dừng tiếp nhận và xử lý hồ sơ trên hệ thống chưa? | **ĐÃ THÔNG BÁO DỪNG (`REQUIRED`)**. Khóa tạm thời cổng truy cập Caddy/Frontend hoặc gửi thông báo bảo trì hệ thống. | `[CHECK]` | Đảm bảo không có giao dịch mới phát sinh trong lúc đang nạp lại cơ sở dữ liệu. |
| **6. Chuẩn bị kịch bản Rollback** | Đã nắm rõ quy trình khôi phục lại bản `Pre-Restore Backup` (ở Bước 2) và mã nguồn Git Tag tương ứng nếu lần restore này thất bại chưa? | **SẴN SÀNG KỊCH BẢN (`REQUIRED`)**. Đảm bảo kỹ sư trực ca có đủ năng lực và công cụ để khôi phục lại trạng thái ban đầu trong vòng 15 phút. | `[CHECK]` | Luôn để ngỏ đường lui an toàn cho mọi thao tác can thiệp hạ tầng. |

---

## 4. Restore Drill Procedure

> [!IMPORTANT]
> **NGUYÊN TẮC QUẢN TRỊ RỦI RO:**
> Chúng tôi **tuyệt đối không khuyến khích và không cho phép thực hiện thử nghiệm Restore trực tiếp trên cơ sở dữ liệu Production đang vận hành (`legalflow_prod`)**.
> Quy trình diễn tập khôi phục (`Restore Drill Procedure`) dưới đây là quy trình mô phỏng bắt buộc định kỳ hằng tháng/hằng quý, được thiết kế để thực hiện trên một **Môi trường Cách ly (Isolated Sandbox / Staging Server)** hoặc một container PostgreSQL độc lập không kết nối với ứng dụng chính.

### Các bước diễn tập chuẩn hóa (Drill Procedure on Sandbox):
1. **Khởi tạo Container Sandbox riêng biệt:**
   ```powershell
   # Tạo một container PostgreSQL tạm thời phục vụ diễn tập (cách ly hoàn toàn với legalflow_postgres)
   docker run --name legalflow_drill_db -e POSTGRES_PASSWORD=drill_secret -e POSTGRES_DB=legalflow_drill -p 5433:5432 -d postgres:15-alpine
   ```
2. **Nạp thử file backup thực tế vào DB Sandbox:**
   ```powershell
   # Chọn file backup gần nhất từ thư mục backups/
   $backupToTest = ".\backups\legalflow_prod_20260708-120000.sql"

   # Thực hiện nạp dữ liệu vào container diễn tập
   Get-Content $backupToTest | docker exec -i legalflow_drill_db psql -U postgres -d legalflow_drill
   ```
3. **Kiểm tra tính toàn vẹn của dữ liệu đã nạp (Validation Checks):**
   ```powershell
   # Kiểm tra số lượng bảng đã được tạo thành công
   docker exec -i legalflow_drill_db psql -U postgres -d legalflow_drill -c "\dt"

   # Kiểm tra số lượng bản ghi trong các bảng cốt lõi (Hồ sơ TTHC, Legal Knowledge, Audit Log)
   docker exec -i legalflow_drill_db psql -U postgres -d legalflow_drill -c "SELECT count(*) FROM ""ProcedureCase"";"
   docker exec -i legalflow_drill_db psql -U postgres -d legalflow_drill -c "SELECT count(*) FROM ""ProcedureAiAnalysis"";"
   docker exec -i legalflow_drill_db psql -U postgres -d legalflow_drill -c "SELECT count(*) FROM ""ProcedureAuditLog"";"
   ```
4. **Ghi nhận Biên bản diễn tập & Dọn dẹp:**
   * Nếu các câu lệnh `SELECT count(*)` trả về số liệu chính xác khớp với thời điểm backup, đánh giá **Drill PASS**.
   * Xóa bỏ container diễn tập để giải phóng tài nguyên máy chủ:
     ```powershell
     docker rm -f legalflow_drill_db
     ```

---

## 5. Backup Retention Proposal

Để đảm bảo cân bằng giữa độ an toàn dữ liệu địa chính và tối ưu chi phí lưu trữ trên máy chủ, chúng tôi đề xuất chính thức **Chính sách lưu trữ và bảo quản bản sao lưu (`Backup Retention Policy`)** cho LegalFlow v2:

1. **Daily Backup (Sao lưu Hằng ngày):**
   * **Tần suất:** Tự động chạy `pg_dump` vào 23:00 mỗi ngày (thông qua Task Scheduler trên Windows hoặc Cronjob trên Linux).
   * **Thời gian lưu trữ (Retention):** Giữ lại toàn bộ các bản sao lưu hằng ngày trong vòng **14 ngày gần nhất**. Các bản daily cũ hơn 14 ngày sẽ được tự động xóa.
2. **Weekly Backup (Sao lưu Hằng tuần):**
   * **Tần suất:** Bản backup của ngày Chủ nhật hàng tuần được đánh dấu là `Weekly Backup`.
   * **Thời gian lưu trữ (Retention):** Giữ lại các bản Weekly Backup trong vòng **08 tuần (02 tháng) gần nhất**.
3. **Monthly Archive (Lưu trữ lâu dài Hằng tháng):**
   * **Tần suất:** Bản backup của ngày cuối cùng mỗi tháng (`Monthly Archive`) được trích xuất riêng, mã hóa và chuyển sang ổ cứng ngoại tuyến (Offline Storage / Tape / Secure NAS).
   * **Thời gian lưu trữ (Retention):** Giữ lại vĩnh viễn hoặc tối thiểu **05 năm** theo Luật Lưu trữ và quy định bảo mật hồ sơ thủ tục hành chính nhà nước.
4. **Không lưu trữ Secret trong Git (`No Secrets in Git`):**
   * Tất cả các kịch bản tự động hóa backup (`backup.ps1` hoặc `backup.sh`) **tuyệt đối không được hardcode** mật khẩu database, token hay API key bên trong file code. Must read từ biến môi trường của hệ điều hành hoặc `.env`.
5. **Phân quyền người truy cập Backup (`Backup Access Control`):**
   * Thư mục `backups/` trên máy chủ và hệ thống lưu trữ ngoại tuyến phải được thiết lập quyền hạn truy cập nghiêm ngặt (`NTFS Permissions`). Chỉ có **Quản trị viên hệ thống (System Administrator)** và **Lãnh đạo phụ trách IT** mới có quyền Đọc/Ghi/Xóa tại thư mục này.

---

## 6. Emergency Notes

> [!WARNING]
> **CHỈ DẪN HÀNH ĐỘNG KHẨN CẤP TRONG TÌNH HUỐNG THẢM HỌA DỮ LIỆU:**
>
> Nếu trong quá trình vận hành Pilot/Production, Quản trị viên hoặc Cán bộ nghiệp vụ **nghi ngờ hệ thống vừa bị mất mát dữ liệu nghiêm trọng** (xóa nhầm hồ sơ, sai lệch trạng thái hàng loạt, sự cố hỏng hóc ổ cứng vật lý hoặc nghi ngờ tấn công xâm nhập):
>
> 1. **DỪNG NGAY LẬP TỨC MỌI THAO TÁC GHI MỚI (`STOP ALL WRITE OPERATIONS`):**
>    Khóa ngay cổng truy cập từ bên ngoài bằng cách dừng dịch vụ Caddy Proxy (`docker stop legalflow_caddy`) hoặc dừng dịch vụ Backend API (`Stop-Process -Name node`). Điều này ngăn chặn việc các giao dịch mới ghi đè lên các vùng dữ liệu có thể còn cứu vãn được.
> 2. **CHỤP NHANH TRẠNG THÁI HIỆN TẠI (`TAKE EMERGENCY SNAPSHOT`):**
>    Ngay trước khi can thiệp, chạy lệnh `pg_dump` khẩn cấp để sao lưu lại nguyên trạng cơ sở dữ liệu ngay tại thời điểm xảy ra sự cố (dù dữ liệu đang lỗi). Bản dump này sẽ là bằng chứng số và dữ liệu đầu vào cho công tác điều tra sự cố (Incident Investigation).
> 3. **BÁO CÁO NGAY CHO LÃNH ĐẠO VÀ CHUYÊN GIA QUẢN TRỊ (`REPORT TO LEADERSHIP`):**
>    Không tự ý chạy bất kỳ lệnh `psql restore` hay `DROP/TRUNCATE` nào trong lúc hoảng loạn. Lập tức thông báo cho Trưởng phòng CNTT / Quản trị viên trưởng để hội ý và ra quyết định khôi phục từ bản Daily Backup hợp lệ gần nhất.
