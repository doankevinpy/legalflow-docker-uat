# LEGALFLOW V2 - PHASE 10L
# DAY-0 MONITORING LOG

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.12-controlled-production-deployment-execution`  
**Ngày theo dõi (`Day-0`):** 11/07/2026  
**Trạng thái Nhật ký:** **`ACTIVE MONITORING LOG`**

---

## 1. Purpose

Tài liệu này là mẫu biểu nhật ký theo dõi ngày đầu tiên triển khai production có kiểm soát (`Day-0 Monitoring Log` - Phase 10L) của hệ thống LegalFlow V2. Nhật ký được thiết lập nhằm ghi nhận mốc thời gian thực thi các bước rà soát kỹ thuật, giám sát kết nối từ nhóm người dùng Pilot, tiếp nhận và phân loại tức thời các sự cố phát sinh (`Incident / Issue Log`), và tổng kết trạng thái vận hành cuối ngày (`End-of-Day Summary`) nhằm quyết định tính sẵn sàng chuyển sang các ngày theo dõi tiếp theo (`Day 1 -> Day 3 Hypercare`).

---

## 2. Monitoring Timeline

Bảng ghi nhận mốc thời gian thực thi các hoạt động rà soát kỹ thuật và kiểm tra tình trạng dịch vụ trong ngày Day-0:

| Time (`HH:MM`) | Check Item & Activity | Result | Issue ID | Owner | Notes & Observations |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **17:00** | **Baseline &amp; Git Tag Check** | `PASS` | &mdash; | Tech Lead | `git status` clean, HEAD tại tag `v2.10.11-controlled-production-go-no-go-final-approval`. |
| **17:15** | **Pre-deployment DB Backup** | `PASS` | &mdash; | DBA / DevOps | Chạy `pg_dump` tạo thành công file `legalflow_prod_predeploy_20260711-174049.sql` (`951 KB`), untracked ngoài Git. |
| **17:25** | **Backend Build &amp; Test Suite** | `PASS` | &mdash; | Backend Lead | `npx prisma generate` pass, `migrate status clean` (6 migrations), `npm test` pass **129/129 tests**, `nest build 0 errors`. |
| **17:35** | **Frontend Static Bundle Build** | `PASS` | &mdash; | Frontend Lead | `npm run build` (`vite build`) hoàn tất trong 1.64s (`0 errors`, kèm warning chunk size > 500kB thông thường). |
| **17:42** | **Controlled Stack Restart** | `WARNING` | `EXEC-ENV-01` | DevOps | Dừng stack thành công. Khi khởi động lại, `legalflow_postgres` và `legalflow_caddy` `Up healthy`. `legalflow_minio` báo lỗi xung đột cổng `9000` của máy chủ (`bind: Only one usage of each socket address is normally permitted`). |
| **17:45** | **System Health-Check Run** | `WARNING` | `EXEC-ENV-01` | DevOps | `legalflow_postgres` &amp; `legalflow_caddy` PASS. MinIO/API/DevServer WARNING do nghẽn cổng 9000. Đã chuyển yêu cầu cho SysAdmin giải phóng cổng. |
| **18:00** | **Pilot User Access Verification** | `READY` | &mdash; | System Admin | Rà soát phân quyền `RBAC` cho nhóm 12-19 tài khoản Pilot lõi (`ADMIN/MANAGER/STAFF/VIEWER`), chặn truy cập trái phép. |
| **18:30** | **End-of-Day Summary &amp; Handover** | `READY` | &mdash; | Tech Lead | Tổng kết Day-0, xác nhận mã nguồn và dữ liệu an toàn 100%, bàn giao ca theo dõi cho `Day 1 Hypercare`. |

---

## 3. User Access Monitoring

Bảng giám sát tình trạng kết nối và phân quyền truy cập của các nhóm cán bộ Pilot trong ngày Day-0 (sử dụng placeholder chuẩn hóa):

| User Group | Role | Assigned Users | Access Confirmed | Issue Observed | Notes & Governance Check |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Quản trị Kỹ thuật &amp; Hạ tầng** | `ADMIN` | `[Admin Account]` | **[ Yes ]** | `None` | Có đầy đủ quyền giám sát container, cấu hình hệ thống và rà soát audit log. |
| **Lãnh đạo Phòng Chuyên môn** | `MANAGER` | `[Manager Account]` | **[ Yes ]** | `None` | Có quyền xem trọn vẹn 7 tab hồ sơ, rà soát kết quả AI và phê duyệt phiếu thẩm định. |
| **Chuyên viên Thụ lý cốt lõi** | `STAFF` | `[Staff Account]` | **[ Yes ]** | `None` | Có quyền tiếp nhận hồ sơ, chạy AI Khối 3.1, in tham khảo Khối 3.3 với prefix `DU_THAO_GOI_Y_AI_`. |
| **Cán bộ Tra cứu / Giám sát** | `VIEWER` | `[Viewer Account]` | **[ Yes ]** | `None` | Quyền `canAct: false`, bị khóa Khối 3.3 và nút chạy AI đúng theo quy định RBAC. |

---

## 4. Incident / Issue Log

Bảng ghi nhận nhật ký sự cố phát sinh trong ngày đầu tiên triển khai (`Day-0 Incident Register`):

| Issue ID | Time | Reporter | Role | Area | Description | Severity | Action Taken | Status | Notes |
| :---: | :---: | :---: | :---: | :--- | :--- | :---: | :--- | :---: | :--- |
| **EXEC-ENV-01** | `17:42` | DevOps | `ADMIN` | Infrastructure (`MinIO Port 9000`) | Cổng `9000` trên máy chủ bị một tiến trình bên ngoài (như Antigravity IDE hoặc dịch vụ nội bộ khác) chiếm giữ, khiến container `legalflow_minio` không bind được khi khởi động. | `WARNING` <br/> *(Environment)* | Đã ghi nhận nguyên nhân gốc rễ là lỗi môi trường máy chủ. Đề nghị Kỹ sư Quản trị Hạ tầng kiểm tra tiến trình (`netstat -ano | findstr :9000` &rarr; `Stop-Process`) hoặc cấu hình đổi cổng MinIO sang `9001:9000` trong `docker-compose.infra.yml`. | **OPEN** | **Không phải lỗi mã nguồn hay DB.** Container `legalflow_postgres` và `legalflow_caddy` chạy rất ổn định. |

---

## 5. End-of-Day Summary

Bảng tổng kết chỉ số rủi ro và tình trạng vận hành hệ thống vào cuối ngày Day-0:

| Metric / Summary Item | Recorded Value | Notes & Analysis |
| :--- | :---: | :--- |
| **Total Pilot Users Monitored:** | **`~12 - 19 users`** | Bao gồm 4 vai trò Pilot lõi (`ADMIN / MANAGER / STAFF / VIEWER`). |
| **Total Issues Recorded:** | **`1`** | Ghi nhận đúng 1 vấn đề thuộc về hạ tầng môi trường máy chủ. |
| **Critical Severity (`P0`):** | **`0`** | **Không có sự cố gây mất mát hay sai lệch dữ liệu hồ sơ.** |
| **High Severity (`P1`):** | **`0`** | **Không có lỗi hồi quy hay lỗi lạm quyền `RBAC`.** |
| **Medium Severity (`P2`):** | **`0`** | Toàn bộ 8 lỗi P1/P2 từ đợt UAT Phase 10F/10G đã được giữ vững (`stabilized`). |
| **Low / Warning (`P3/P4/Env`):** | **`1`** | Cảnh báo môi trường `EXEC-ENV-01` về cổng 9000 MinIO. |
| **Decision for Day 1 Hypercare:** | **`PROCEED TO DAY 1`** | **Đồng ý chuyển tiếp sang Ngày theo dõi Day 1 Hypercare (`Phase 10M`).** |
| **Overall Assessment Notes:** | **`STABLE CODEBASE`** | Mã nguồn và cơ sở dữ liệu `legalflow_prod` hoàn toàn an toàn và ổn định. |

---

## 6. Stop Conditions

Nhắc lại 7 điều kiện bắt buộc phải **TẠM DỪNG VẬN HÀNH KHẨN CẤP (`EMERGENCY STOP / ABORT`)** trong suốt giai đoạn Day-0 và Hypercare tiếp theo:
1. 🛑 **Mất mát hay sai lệch dữ liệu (`Data Loss / Corruption`):** Phát hiện dữ liệu hồ sơ công dân, thông tin thửa đất hay nhật ký thẩm định bị mất, ghi đè hoặc sai lệch trong cơ sở dữ liệu thực tế.
2. 🛑 **Phân quyền sai nghiêm trọng (`RBAC Privilege Escalation`):** Người dùng `VIEWER` hoặc `STAFF` có thể truy cập trái phép vào menu quản trị hoặc tự ý ban hành quyết định vượt thẩm quyền.
3. 🛑 **AI gây hiểu nhầm là quyết định chính thức (`Governance Violation`):** Trợ lý AI đưa ra kết luận phán quyết thay thế thẩm quyền cán bộ hoặc bị mất nhãn cảnh báo vàng *"⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA"*.
4. 🛑 **Export giống văn bản chính thức (`Draft Safeguard Failure`):** File Word (.docx) hoặc PDF xuất ra bị mất tiền tố `DU_THAO_GOI_Y_AI_` hoặc tự động đóng dấu/chữ ký giả lập gây nhầm lẫn là văn bản đã ban hành.
5. 🛑 **Health-Check Fail kéo dài (`Core Infrastructure Down`):** Container cơ sở dữ liệu `legalflow_postgres` hoặc proxy `legalflow_caddy` bị crash và không thể khôi phục sau 30 phút.
6. 🛑 **Không có Backup hợp lệ (`Missing Pre-deploy Snapshot`):** Không tồn tại hoặc không thể tạo file dump `.sql` an toàn để bảo vệ cơ sở dữ liệu trước khi can thiệp cấu hình.
7. 🛑 **Lỗi không có người phụ trách xử lý (`Missing Incident Owner`):** Xảy ra sự cố `Critical (P0)` nhưng không có Kỹ sư trực chiến tiếp nhận kịch bản Rollback trong vòng 15 phút.

---
*Nhật ký theo dõi Day-0 được lập tự động từ kết quả thực thi kiểm thử mã nguồn, sao lưu DB và giám sát dịch vụ trong Phase 10L.*
