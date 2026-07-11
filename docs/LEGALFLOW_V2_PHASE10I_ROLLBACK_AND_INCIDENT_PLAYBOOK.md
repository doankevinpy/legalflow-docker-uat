# LEGALFLOW V2 - PHASE 10I
# ROLLBACK & INCIDENT PLAYBOOK

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Mốc ổn định liền trước (`Stable Baseline Tag`):** `v2.10.8-pilot-uat-retest-stabilization-acceptance`  
**Ngày ban hành:** 11/07/2026  
**Trạng thái Cẩm nang:** `ACTIVE OPERATIONAL PLAYBOOK`

---

## 1. Purpose

Tài liệu cẩm nang (`Rollback & Incident Playbook`) này thiết lập các quy trình hành động chuẩn hóa nhằm phản ứng nhanh, cách ly và xử lý hiệu quả mọi sự cố kỹ thuật hoặc nghiệp vụ phát sinh trong quá trình triển khai production có kiểm soát (`Controlled Production Deployment`). Cẩm nang hướng dẫn chi tiết kịch bản khôi phục ứng dụng theo thẻ Git (`Rollback by Git Tag`), các nguyên tắc an toàn tuyệt đối khi phục hồi cơ sở dữ liệu (`Database Restore Safety`) và các mẫu thông báo khẩn cấp nhằm bảo vệ an toàn tối đa cho hệ thống.

---

## 2. Incident Severity

Hệ thống phân cấp mức độ nghiêm trọng của sự cố theo 4 cấp độ:

| Severity Level | Definition | Response SLA | Target Resolution |
| :---: | :--- | :---: | :---: |
| **CRITICAL** <br/> *(P0 - Khẩn cấp)* | Sự cố gây ngừng trệ toàn bộ hệ thống, mất mát/sai lệch dữ liệu hồ sơ thực tế, rò rỉ bảo mật phân quyền nghiêm trọng, hoặc AI vi phạm nguyên tắc kết luận chính thức thay cán bộ gây nguy cơ pháp lý cao. | **Ngay lập tức** <br/> `(< 15 phút)` | `< 2 giờ` <br/> *(Chạy kịch bản Rollback ngay nếu không fix nhanh được)* |
| **HIGH** <br/> *(P1 - Nghiêm trọng)* | Sự cố làm gián đoạn các luồng nghiệp vụ lõi (chạy AI Review, xuất bản dự thảo Word/PDF, lỗi trang chi tiết hồ sơ) của nhóm chuyên viên Pilot nhưng không gây mất dữ liệu hay sai phân quyền. | `30 phút` | `< 4 giờ` |
| **MEDIUM** <br/> *(P2 - Trung bình)* | Lỗi giao diện, lỗi hiển thị empty/error state cục bộ, hoặc chậm phản hồi API ở một số chức năng phụ không cản trở luồng thẩm định hồ sơ chính. | `2 giờ` | `< 24 giờ` |
| **LOW** <br/> *(P3 - Nhẹ)* | Các lỗi nhỏ về canh lề, lỗi đánh máy help text, hoặc yêu cầu điều chỉnh nhỏ về UX chưa ảnh hưởng đến tiến trình thụ lý. | `8 giờ` | Ghi nhận vào `Issue Register` xử lý ở đợt cập nhật tiếp theo. |

---

## 3. Critical Incidents

Danh sách các tình huống được xếp loại **CRITICAL (`P0`)** bắt buộc phải kích hoạt quy trình ứng phó khẩn cấp và xem xét Rollback ngay lập tức:
1. **Mất dữ liệu (`Data Loss / Corruption`):** Bất kỳ bản ghi hồ sơ, tài liệu đính kèm, ghi chú thẩm định hay nhật ký `Audit Log` của hồ sơ thực tế bị xóa hoặc ghi đè sai lệch không thể khôi phục tự động.
2. **Sai phân quyền nghiêm trọng (`RBAC Privilege Escalation`):** Người dùng thuộc vai trò `VIEWER` hoặc `STAFF` có thể truy cập trái phép vào menu quản trị `ADMIN`, tự ý thay đổi cấu hình hệ thống hoặc xem/sửa hồ sơ ngoài phạm vi thẩm quyền.
3. **AI gây hiểu nhầm là quyết định chính thức (`AI Safety Violation`):** Trợ lý AI đưa ra kết luận khẳng định sai lệch pháp luật, thiếu khung cảnh báo *"BẢN GỢI Ý AI"*, hoặc gợi ý cán bộ ra kết luận trái với quy định mà không cảnh báo rà soát.
4. **Export giống văn bản đã ký / ban hành (`Export Safety Failure`):** File Word (.docx) hoặc PDF xuất ra bị mất tiền tố `DU_THAO_GOI_Y_AI_`, mất dòng chữ cảnh báo dự thảo hoặc tự động chèn chữ ký/con dấu giả lập, gây nguy cơ phát hành văn bản trái thẩm quyền.
5. **Database lỗi (`Database Crash / Deadlock`):** Container PostgreSQL bị crash liên tục, lỗi kết nối (`PrismaClientInitializationError`) kéo dài trên 15 phút khiến hệ thống bị tê liệt.
6. **Health-check fail kéo dài (`Infrastructure Down`):** Caddy proxy hoặc NestJS backend không phản hồi quá 30 phút mà các biện pháp khởi động lại (`restart-legalflow.ps1`) không khắc phục được.

---

## 4. Immediate Response

Quy trình phản ứng khẩn cấp 7 bước bắt buộc cho Kỹ sư Vận hành (`Operator`) khi phát hiện sự cố `CRITICAL / HIGH`:
1. **Dừng mở rộng người dùng:** Ngay lập tức tạm dừng việc cấp mới tài khoản hoặc mở rộng phạm vi người dùng Pilot; thông báo cho nhóm cán bộ đang tham gia tạm dừng thao tác trên hệ thống.
2. **Ghi nhận thời điểm (`Timestamp Recording`):** Ghi nhận chính xác ngày, giờ, phút phát hiện sự cố và hành động thao tác cuối cùng của người dùng trước khi xảy ra lỗi.
3. **Chụp màn hình / log (`Evidence Capture`):** Chụp lại ảnh màn hình lỗi, trích xuất toàn bộ log từ container (`docker logs legalflow_postgres / legalflow_caddy`) và log ứng dụng backend/frontend.
4. **Thông báo người phụ trách:** Báo cáo khẩn cấp cho Quản lý Dự án (`Project Owner`), Trưởng nhóm Kỹ thuật (`Tech Lead`) và Đại diện Lãnh đạo nghiệp vụ.
5. **Backup trạng thái hiện tại (`Incident Snapshot`):** Nếu cơ sở dữ liệu vẫn truy cập được, thực hiện tạo một bản dump nháp (`dump_incident_timestamp.sql`) để phục vụ công tác điều tra nguyên nhân (`Root Cause Analysis`).
6. **Quyết định Rollback hoặc Hotfix:** Họp nhanh 5 phút với Tech Lead để quyết định: nếu lỗi có thể sửa an toàn bằng cấu hình trong 15 phút thì áp dụng Hotfix; nếu không, **bắt buộc kích hoạt Rollback ứng dụng theo Git Tag**.
7. **Nghiêm cấm tự ý restore database:** Tuyệt đối không chạy lệnh khôi phục (`restore / reset DB`) khi chưa có lệnh đồng ý chính thức bằng văn bản của Lãnh đạo Dự án.

---

## 5. Application Rollback by Git Tag

Quy trình thao tác chuẩn (`SOP`) về mức tài liệu hướng dẫn quay lui mã nguồn ứng dụng về phiên bản ổn định liền trước (`Rollback by Git Tag`):

* **Tag ổn định hiện tại được xác định (`Stable Baseline Tag`):**
  ```text
  v2.10.8-pilot-uat-retest-stabilization-acceptance
  ```

* **Các bước thực thi Rollback ứng dụng:**
  1. **Xác nhận không có thay đổi chưa commit:** Kiểm tra `git status` đảm bảo working tree sạch trước khi thao tác.
  2. **Chuyển về tag ổn định (`Git Checkout / Reset`):**
     ```powershell
     cd C:\Users\Admin\legalflow-docker-uat
     git checkout v2.10.8-pilot-uat-retest-stabilization-acceptance
     ```
  3. **Kiểm tra đồng bộ Schema (`Prisma Check`):**
     ```powershell
     cd legalflow-backend
     npx prisma generate
     npx prisma migrate status
     ```
     *(Đảm bảo schema mã nguồn cũ khớp hoàn toàn với DB hiện hữu)*.
  4. **Biên dịch lại ứng dụng (`Rebuild Bundles`):**
     ```powershell
     # Build Backend
     npm run build
     
     # Build Frontend
     cd ..
     npm run build
     ```
  5. **Khởi động lại dịch vụ (`Restart Stack`):**
     ```powershell
     cd C:\Users\Admin\legalflow-docker-uat
     .\stop-legalflow.ps1
     .\start-legalflow.ps1
     ```
  6. **Chạy kiểm tra sức khỏe (`Verify Health`):**
     ```powershell
     .\health-check.ps1
     ```
  7. **Xác nhận chức năng chính:** Đăng nhập thử bằng tài khoản Admin/Manager, kiểm tra trang danh sách hồ sơ và Khối 3.1 AI Review xác nhận ứng dụng đã quay về trạng thái ổn định 100%.

---

## 6. Database Restore Safety

Các cảnh báo và nguyên tắc an toàn **TỐI CAO** khi xem xét khôi phục cơ sở dữ liệu (`Database Restore Safety`):
* ⚠️ **Restore database có thể ghi đè dữ liệu (`Data Overwrite Risk`):** Việc khôi phục từ file dump `.sql` sẽ xóa sạch hoặc ghi đè toàn bộ các hồ sơ, nhật ký xử lý mới được cán bộ tạo ra trong khoảng thời gian từ lúc backup đến lúc xảy ra sự cố.
* ⚠️ **Chỉ thực hiện khi có phê duyệt (`Mandatory Sign-off`):** Chỉ Kỹ sư Quản trị Cơ sở dữ liệu (`DBA`) được phép chạy lệnh restore sau khi có sự đồng ý trực tiếp bằng văn bản/email của `Project Owner` và Lãnh đạo nghiệp vụ.
* ⚠️ **Phải backup lần cuối trước khi restore (`Pre-restore Snapshot`):** Dù DB đang bị lỗi, bắt buộc phải cố gắng export một bản backup dump hiện trạng (`db_pre_restore_crash.sql`) trước khi tiến hành ghi đè bản backup cũ lên.
* ⚠️ **Phải xác định đúng môi trường (`Environment Verification`):** Kiểm tra kỹ tham số connection string và container name (`legalflow_postgres`), tuyệt đối không nhầm lẫn giữa môi trường UAT (`legalflow_uat`) và Production (`legalflow_prod`).
* ⚠️ **Phải diễn tập trước ở môi trường test (`Dry-Run Verification`):** Nếu thời gian cho phép, hãy nạp thử file dump backup vào một container test riêng biệt để kiểm tra tính toàn vẹn của dữ liệu trước khi nạp vào DB thực tế.

---

## 7. Communication Template

Mẫu thông báo nội bộ khẩn cấp gửi qua kênh quản lý dự án / nhóm điều hành khi xảy ra sự cố và khi phục hồi:

### Mẫu 1: Thông báo Phát hiện Sự cố (`Incident Alert`)
```text
[THÔNG BÁO KHẨN CẤP] – SỰ CỐ HỆ THỐNG LEGALFLOW V2 (PHASE 10I)
- Mã sự cố: INC-20260711-001
- Thời điểm phát hiện: [HH:MM] ngày 11/07/2026
- Mức độ nghiêm trọng: [CRITICAL / HIGH]
- Mô tả sự cố: [Mô tả ngắn gọn lỗi phát sinh, ví dụ: Lỗi không hiển thị Khối 3.2 Legal Snapshot hoặc kết nối DB bị chậm].
- Phạm vi ảnh hưởng: [Nhóm chuyên viên thụ lý Pilot / Toàn bộ người dùng].
- Hành động đang thực hiện: Nhóm kỹ thuật đã tạm dừng mở rộng hệ thống, đang tiến hành kiểm tra log và đánh giá kịch bản Rollback về tag ổn định v2.10.8.
- Người phụ trách (`Owner`): [Tên Kỹ sư / Tech Lead].
- Thời gian cập nhật tiếp theo: sau [15 / 30] phút nữa.
Đề nghị các cán bộ tạm dừng thao tác rà soát và xuất văn bản cho đến khi có thông báo an toàn tiếp theo.
```

### Mẫu 2: Thông báo Khôi phục Thành công (`Resolution & Rollback Notice`)
```text
[THÔNG BÁO khôi phục] – HỆ THỐNG LEGALFLOW V2 ĐÃ HOẠT ĐỘNG ỔN ĐỊNH
- Mã sự cố: INC-20260711-001
- Thời điểm xử lý xong: [HH:MM] ngày 11/07/2026
- Biện pháp áp dụng: Đã thực hiện Rollback ứng dụng thành công về phiên bản ổn định (Tag: v2.10.8-pilot-uat-retest-stabilization-acceptance). Cơ sở dữ liệu được bảo toàn nguyên vẹn 100%.
- Tình trạng hiện tại: Toàn bộ dịch vụ Backend, Frontend, AI Review và Export Draft đã qua kiểm tra Health-check và kiểm thử hồi quy thành công.
- Người phụ trách: [Tên Kỹ sư / Tech Lead].
Hệ thống chính thức tiếp tục mở cho nhóm người dùng Pilot tham gia thụ lý hồ sơ. Xin trân trọng cảm ơn sự phối hợp của các bộ phận!
```

---

## 8. Post-incident Review

Bảng theo dõi và đánh giá nguyên nhân gốc rễ (`Root Cause Analysis - RCA`) sau khi xử lý xong sự cố:

| Incident ID | Root Cause | Impact | Corrective Fix | Preventive Action | Owner | Due Date |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: |
| *(Mẫu)* <br/> `INC-001` | Tiến trình bên ngoài máy chủ chiếm giữ cổng `9000` của MinIO container khi khởi động lại stack. | Lỗi khởi động script `start-legalflow.ps1`, không bật được API backend. | Cấu hình cách ly tiến trình hệ thống, kiểm tra lsof trước khi start docker. | Bổ sung check port pre-flight vào script `start-legalflow.ps1` và lập cảnh báo sớm. | DevOps | `13/07/2026` |
| *(Mẫu)* <br/> `INC-002` | Người dùng nhập ký tự đặc biệt lạ trong tên hồ sơ gây ngoại lệ khi render preview PDF. | Chuyên viên không xem trước được bản dự thảo AI cho hồ sơ đó. | Rollback về tag `v2.10.8`, bổ sung sanitize string ở module builder. | Thêm bộ unit test kiểm tra ký tự đặc biệt cho module export và prompt builder. | Backend Dev | `15/07/2026` |

---
*Tài liệu Cẩm nang Rollback & Xử lý Sự cố là quy chuẩn bắt buộc của Phase 10I, giúp duy trì kỷ luật vận hành cao nhất trong môi trường triển khai thực tế.*
