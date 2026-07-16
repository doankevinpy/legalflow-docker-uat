# Kế Hoạch Vô Hiệu Hóa Tính Năng, Khôi Phục & Ứng Phó Sự Cố Khẩn Cấp (Rollback, Disable & Incident Response Plan) Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12M
## Phase 12M: Rollback, Disable and Incident Response Plan

> [!IMPORTANT]
> **PHÂN BIỆT THƯỜNG TRỰC (`CRITICAL DISTINCTION`):**
> * **Vô hiệu hóa Phân hệ (`Module Disable / Feature Toggle`):** Là biện pháp ngắt lập tức giao diện và API của riêng module Nghĩa vụ tài chính mà **không làm gián đoạn** các thủ tục hành chính khác của hệ thống và **không thay đổi hoặc xóa bỏ dữ liệu trong Database**. Đây là biện pháp ưu tiên hàng đầu (`First-line Defense`) khi phát hiện bất thường về chiết tính hoặc hiển thị.
> * **Khôi phục Cơ sở dữ liệu (`Database Restore / Rollback`):** Là biện pháp khôi phục toàn bộ PostgreSQL từ bản sao lưu an toàn trước đó (`pg_dump archive`). Đây là biện pháp cực đoan (`Last-resort Defense`), **CHỈ ĐƯỢC THỰC HIỆN** khi xảy ra sự cố suy biến dữ liệu nghiêm trọng (`Data Corruption / Integrity Loss`).

---

## 1. Chiến Lược Ngắt Khẩn Cấp & Phân Cô Lập (`Feature Toggle / Module Disable Strategy`)
Khi xảy ra tình huống khẩn cấp, Quản trị viên không cần khởi động lại toàn bộ máy chủ mà thực hiện cách ly hai tầng ngay lập tức:
1. **Tầng Giao diện (`Frontend UI Isolation`):** Vô hiệu hóa tab "Nghĩa vụ tài chính" và các cảnh báo chiết tính trên giao diện người dùng để cán bộ Một cửa và Thẩm định không thể nhìn thấy hay thao tác vào phân hệ.
2. **Tầng API Backend (`Backend Endpoint Isolation`):** Ngắt hoặc chặn toàn bộ nhóm API `/financial-obligations/*` bằng biến môi trường hoặc cờ kiểm soát giao thức (`Feature Flag / Route Guard`). Mọi truy xuất vào API lúc này sẽ trả về `HTTP 503 Service Unavailable (Module Maintenance)`.

---

## 2. Điều Kiện Kích Hoạt Vô Hiệu Hóa Lập Tức (`Immediate Disable Trigger Conditions`)
Quản trị viên Hệ thống (`ADMIN / IT_OPS`) được quyền và có trách nhiệm kích hoạt vô hiệu hóa phân hệ ngay lập tức (không cần chờ họp Lãnh đạo) nếu phát hiện **bất kỳ 01 trong 04** tình huống sau:
1. **Lỗi chiết tính sai lệch nghìn lần (`Order-of-Magnitude Estimation Error`):** AI hoặc bảng tính nháp tự động đưa ra số tiền chiết tính sai lệch bất thường (ví dụ: đất ở đô thị được tính giá vài nghìn đồng/m² hoặc vài trăm tỷ đồng/m²) gây hiểu lầm nghiêm trọng cho người dân và cán bộ.
2. **Khóa an toàn bị vô hiệu hóa (`Completion Guard Failure`):** Nút bấm "Hoàn thành thủ tục" (`Complete Procedure`) trên giao diện đột ngột cho phép bấm và xử lý thành công khi hồ sơ chưa có bản chứng nhận thanh toán Kho bạc (`OFFICER_VERIFIED = false`).
3. **Rò rỉ hoặc gửi thông báo tự động (`Unauthorized Notification Leak`):** Phát hiện bất kỳ tiến trình ngầm hoặc tích hợp ngoài nào cố gắng tự động gửi email, SMS hay thông báo qua Zalo cho công dân về số tiền nộp thuế.
4. **Vi phạm cô lập dữ liệu (`Real Data Ingestion in Test Mode`):** Phát hiện cán bộ vô tình tải lên hoặc nhập dữ liệu của hồ sơ công dân thật ngoài đời vào nhóm hồ sơ kiểm thử mô phỏng (`DEMO-FO-UAT-*`).

---

## 3. Hướng Dẫn Kỹ Thuật Từng Bước Vô Hiệu Hóa Phân Hệ (`Step-by-Step Disable Instructions`)

### Bước 1: Kích hoạt Cờ Vô Hiệu Hóa trên Backend (`Turn Off Feature Flag in Backend`)
Mở PowerShell với quyền quản trị viên, di chuyển vào thư mục hạ tầng và ngắt dịch vụ Backend hiện tại:
```powershell
cd C:\Users\Admin\legalflow-docker-uat
.\scripts\stop-legalflow.ps1
```
*(Hoặc nếu backend chạy độc lập qua `npm run start:dev`, nhấn `Ctrl + C` trên cửa sổ terminal của Backend).*

Cập nhật biến môi trường trong tệp `legalflow-backend\.env` (hoặc cấu hình hệ thống):
```env
FEATURE_FLAG_FINANCIAL_OBLIGATIONS_ENABLED="false"
```

### Bước 2: Khởi chạy lại Stack hoặc Backend (`Restart Backend Service`)
Khởi chạy lại Backend API để áp dụng cờ vô hiệu hóa:
```powershell
cd C:\Users\Admin\legalflow-docker-uat
.\scripts\start-legalflow.ps1
```

### Bước 3: Kiểm chứng Trạng thái Cô lập (`Verify Module Isolation`)
Thực hiện gọi API kiểm tra sức khỏe phân hệ từ PowerShell hoặc cURL:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/financial-obligations/health" -Method Get
```
*Kết quả mong đợi:* Hệ thống trả về `HTTP 503 Service Unavailable` hoặc JSON `{ "status": "DISABLED", "message": "Module is currently undergoing maintenance." }`.

---

## 4. Điều Kiện Kích Hoạt & Hướng Dẫn Khôi Phục DB (`Database Rollback Triggers & Step-by-Step Instructions`)

### A. Điều Kiện Kích Hoạt Rollback DB (`When to Restore DB`)
**Tuyệt đối chỉ rollback cơ sở dữ liệu khi:**
- Cấu trúc bảng `land_profile_financial_obligations` hoặc `financial_obligation_audit_logs` bị hỏng (`Table Corruption`).
- Phát hiện việc thực thi nhầm script `seed` gây ghi đè làm mất dữ liệu của các hồ sơ thủ tục hành chính thực tế (`TTHC-2026-0001..0003`).

### B. Quy Trình Khôi Phục DB Từng Bước (`Step-by-Step DB Restore Instructions`)

#### Bước 1: Dừng toàn bộ kết nối đến Database (`Stop Application Stack`)
```powershell
cd C:\Users\Admin\legalflow-docker-uat
.\scripts\stop-legalflow.ps1
```

#### Bước 2: Khởi động riêng Container PostgreSQL (`Start Postgres Only`)
```powershell
docker compose -f docker-compose.infra.yml up -d postgres
```

#### Bước 3: Ngắt các kết nối rỗi và Khôi phục từ bản Backup chuẩn nhất (`Restore from Verified Backup`)
Sử dụng tệp sao lưu đã được kiểm chứng (ví dụ `backup_before_pilot_seed.sql` hoặc tệp backup gần nhất trong `backups/`):
```powershell
Get-Content C:\Users\Admin\legalflow-docker-uat\backups\backup_before_pilot_seed.sql | docker exec -i legalflow_postgres psql -U legalflow_admin -d legalflow_prod
```

#### Bước 4: Khôi phục lại toàn bộ hạ tầng và kiểm tra cấu trúc (`Verify Schema Status`)
```powershell
cd C:\Users\Admin\legalflow-docker-uat\legalflow-backend
npx prisma migrate status
```
*Kết quả mong đợi:* `7 migrations found | Database schema is up to date!`.

---

## 5. Kế Hoạch Truyền Thông Khi Xảy Ra Sự Cố (`Emergency Communication Plan`)
Quy trình báo cáo liên lạc khẩn cấp khi kích hoạt vô hiệu hóa (`Disable`) hoặc khôi phục (`Rollback`):
1. **Thông báo nội bộ tức thời (trong 15 phút):** Quản trị viên gửi thông báo qua kênh điều hành nội bộ (`Internal Channel / Email`) cho Cán bộ Một cửa (`RECEIVING_OFFICER`) và Cán bộ Thẩm định (`REVIEWING_OFFICER`) với thông điệp: *"Phân hệ Nghĩa vụ tài chính tạm thời được vô hiệu hóa để rà soát kỹ thuật. Các thủ tục hành chính khác về đất đai và giấy tờ vẫn tiếp nhận và xử lý bình thường trên hệ thống."*
2. **Báo cáo Lãnh đạo Đơn vị (trong 30 phút):** Quản trị viên lập báo cáo nhanh gửi Lãnh đạo Phê duyệt (`APPROVAL_MANAGER`) và Lãnh đạo Đơn vị Thí điểm nêu rõ: nguyên nhân kích hoạt cờ, phạm vi ảnh hưởng và thời gian dự kiến khôi phục dịch vụ.
3. **Nguyên tắc không gây hoang mang cho công dân:** Vì phân hệ thí điểm hoàn toàn nội bộ (`Internal UAT Pilot`), việc ngắt module **KHÔNG ẢNH HƯỞNG** đến công dân. Cán bộ Một cửa giải thích nhẹ nhàng nếu công dân hỏi về tiến trình đối chiếu thuế: *"Hồ sơ thuế đang được cơ quan chuyên môn đối chiếu theo quy trình chuẩn."*

---

## 6. Yêu Cầu Rà Soát Sau Sự Cố (`Post-Incident Review Requirement - Postmortem`)
Trong vòng **48 giờ** kể từ khi khắc phục hoặc vô hiệu hóa thành công sự cố, Quản trị viên Hệ thống (`ADMIN`) có trách nhiệm tổ chức phiên họp Rà soát Sau Sự cố (`Postmortem Meeting`) với sự tham gia của Tech Lead và Lãnh đạo Đơn vị Thí điểm để lập **Báo cáo Khắc phục (`Incident Postmortem Report`)**, bao gồm:
* Dòng thời gian chi tiết của sự cố (`Timeline of Events`).
* Phân tích gốc rễ bằng phương pháp 5-Why (`Root Cause Analysis`).
* Bảng đánh giá mức độ tuân thủ rào chắn an toàn (`Safety Compliance Assessment`).
* Kế hoạch hành động và các chốt chặn kỹ thuật bổ sung để ngăn ngừa tái diễn (`Corrective Action Plan`), trước khi trình xin phép mở lại (`Re-enable`) phân hệ.
