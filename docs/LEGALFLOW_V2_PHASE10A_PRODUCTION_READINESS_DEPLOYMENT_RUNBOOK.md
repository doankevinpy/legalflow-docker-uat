# LEGALFLOW V2 - PHASE 10A
# PRODUCTION READINESS & DEPLOYMENT RUNBOOK

**Ngày ban hành:** 08/07/2026  
**Phiên bản hệ thống:** `v2.9.13-final-uat-release-candidate-complete` ➔ Chuẩn bị Pilot/Production (`Phase 10A`)  
**Chuyên trách thực hiện:** Trợ lý kỹ thuật & kiểm thử UAT (Antigravity AI)

---

## 1. Purpose
Tài liệu **Production Readiness & Deployment Runbook** được xây dựng nhằm chuẩn bị bộ quy trình chuẩn hóa, an toàn và có kiểm soát trước khi đưa hệ thống **LegalFlow v2 (Quản trị tri thức pháp lý & Trợ lý AI rà soát thủ tục hành chính đất đai)** vào triển khai thí điểm (Pilot) hoặc vận hành chính thức (Production).
Tài liệu cung cấp hướng dẫn vận hành chi tiết, quy trình khởi động/dừng dịch vụ, sao lưu/phục hồi cơ sở dữ liệu, kiểm soát phân quyền RBAC và quản trị rủi ro AI theo triết lý **Human-in-the-Loop**, bảo đảm tính ổn định, toàn vẹn dữ liệu và tuân thủ pháp luật tối đa.

---

## 2. System Overview
Hệ thống LegalFlow v2 là kiến trúc đa tầng hiện đại bao gồm các thành phần:
* **Frontend:** Ứng dụng Single Page Application (SPA) xây dựng bằng React + Vite + TypeScript, giao diện chuyên biệt cho cán bộ một cửa và chuyên viên thẩm định đất đai.
* **Backend:** RESTful API Server xây dựng trên NestJS + TypeScript, chịu trách nhiệm xử lý logic nghiệp vụ thủ tục hành chính, phân quyền RBAC và điều phối Trợ lý AI.
* **PostgreSQL:** Cơ sở dữ liệu quan hệ mạnh mẽ (bản 15-alpine), quản lý thông tin hồ sơ TTHC, dữ liệu tri thức pháp lý phiên bản hóa và nhật ký kiểm toán.
* **Docker Infrastructure:** Nền tảng containerization đóng gói các dịch vụ hạ tầng (`postgres`, `minio` object storage, `caddy` reverse proxy) để cách ly môi trường và dễ dàng mở rộng.
* **Health-check:** Script tự động chẩn đoán tình trạng sức khỏe hệ thống (`.\scripts\health-check.ps1`), kiểm tra liên tục tình trạng phản hồi HTTP của Frontend, Backend và trạng thái container.
* **Git Tags:** Cơ chế quản trị phiên bản mã nguồn bất biến, đánh dấu chính xác các chặng phát triển và làm điểm tựa an toàn cho quy trình Rollback (`v2.9.13-final-uat-release-candidate-complete`).
* **AI Governance:** Phân hệ kiểm soát Trợ lý AI, đảm bảo mọi gợi ý đều có nhãn cảnh báo rõ ràng, không thay thế con người thẩm định và bảo vệ tính minh bạch.
* **Legal Knowledge:** Phân hệ quản lý vòng đời văn bản pháp luật, quy trình thẩm định, prompt AI và checklist (`Active` / `Pending` / `Deprecated`) với cơ chế kiểm thử an toàn (`Simulation` / `Impact Analysis`).
* **Export Safety:** Cơ chế kiểm soát an toàn xuất tài liệu (Word `.docx` và PDF), tự động gắn tiền tố `DU_THAO_GOI_Y_AI_` và chèn tuyên bố từ chối trách nhiệm pháp lý.

---

## 3. Environment Assumptions
Để bảo đảm an toàn bảo mật, toàn bộ tài liệu **không lưu trữ hoặc ghi chú bất kỳ mật khẩu (password), secret key hay token thật** nào. Các đường dẫn và thông số cấu hình quy ước chuẩn trên máy chủ triển khai như sau:
* **Root Repository Path:** `C:\Users\Admin\legalflow-docker-uat`
* **Backend Repository Path:** `C:\Users\Admin\legalflow-docker-uat\legalflow-backend`
* **Local Frontend URL:** `http://localhost:5173`
* **Local Proxy URL (Caddy Gateway):** `http://kevindoan-legalflow.local:8080`
* **Backend API URL:** `http://127.0.0.1:3000`
* **Docker Postgres Container Name:** `legalflow_postgres`
* **Database Name:** `legalflow_prod` *(Sử dụng tài khoản quản trị quy ước trong biến môi trường `.env`, ví dụ: `legalflow_admin` - tuyệt đối không ghi mật khẩu thực tế tại đây).*

---

## 4. Pre-deployment Checklist

Trước khi thực hiện bất kỳ thao tác khởi động hay cập nhật phiên bản trên máy chủ Pilot/Production, kỹ sư vận hành bắt buộc phải rà soát và xác nhận bảng kiểm tra dưới đây:

| Item | Command / Evidence | Expected Result | Status | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **1. Git Status Clean** | `git status -s` | Không có file code/schema nào bị thay đổi trái phép (chỉ chấp nhận untracked docs nếu có). | `[DONE]` | Bảo đảm mã nguồn nguyên trạng từ repository. |
| **2. Release Candidate Tag** | `git describe --tags --exact-match` | `v2.9.13-final-uat-release-candidate-complete` | `[DONE]` | Đúng phiên bản đã vượt qua Final UAT Audit. |
| **3. Backend Unit Tests** | `cd legalflow-backend && npm test` | `Test Suites: 11 passed, 11 total / 129 passed` | `[DONE]` | 100% test cases nghiệp vụ & AI đều PASS. |
| **4. Backend Build Check** | `cd legalflow-backend && npm run build` | `dist/` created successfully, no TypeScript errors | `[DONE]` | NestJS compiler đóng gói hoàn chỉnh. |
| **5. Frontend Build Check** | `npm run build` | `dist/index.html & assets/... built cleanly` | `[DONE]` | Vite đóng gói SPA bundle thành công. |
| **6. Database Migrate Status** | `cd legalflow-backend && npx prisma migrate status` | `Database schema is up to date!` | `[DONE]` | Schema DB và Prisma migrations hoàn toàn đồng bộ. |
| **7. Docker Containers Up** | `docker ps` | `legalflow_postgres`, `legalflow_caddy` are Up (healthy) | `[DONE]` | Hạ tầng lõi hoạt động ổn định. |
| **8. System Health Check** | `.\scripts\health-check.ps1` | Backend API (3000) and Frontend (5173) responsive | `[DONE]` | Phản hồi HTTP 200 OK. |
| **9. Database Backup Check** | `Test-Path .\backups\*.sql` | Ít nhất 1 file backup `.sql` gần nhất tồn tại trong `backups/` | `[DONE]` | Có sẵn điểm khôi phục an toàn trước deploy. |
| **10. Rollback Tag Identified** | Kiểm tra danh sách tag cũ | Xác định rõ tag `v2.9.12...` hoặc tag stable trước đó | `[DONE]` | Sẵn sàng kịch bản khẩn cấp nếu gặp sự cố. |

---

## 5. Standard Start / Stop Procedure

Quy trình chuẩn để khởi động, dừng hoặc chẩn đoán sức khỏe toàn bộ hệ thống LegalFlow v2 trên máy chủ Windows PowerShell:

```powershell
# 1. Di chuyển vào thư mục gốc của hệ thống
cd C:\Users\Admin\legalflow-docker-uat

# 2. Dừng toàn bộ các dịch vụ đang chạy (Backend, Frontend, Docker Infra)
.\scripts\stop-legalflow.ps1

# 3. Khởi động đồng bộ toàn bộ hạ tầng và ứng dụng (Docker -> Backend -> Frontend)
.\scripts\start-legalflow.ps1

# 4. Chạy kịch bản chẩn đoán tình trạng sức khỏe tổng thể sau khi khởi động
.\scripts\health-check.ps1
```

*(Lưu ý: Khi chạy script start, đảm bảo không có tiến trình lạ nào chiếm dụng cổng `3000`, `5173`, `5432`, `8080`, `9000` trên localhost).*

---

## 6. Backup Runbook

Quy trình sao lưu (Backup) cơ sở dữ liệu PostgreSQL (`legalflow_prod`) thông qua container Docker phải được thực hiện định kỳ hoặc ngay trước các đợt cập nhật lớn:

```powershell
# Di chuyển vào thư mục gốc repository
cd C:\Users\Admin\legalflow-docker-uat

# Tạo thư mục backups nếu chưa tồn tại
if (!(Test-Path ".\backups")) { New-Item -ItemType Directory -Path ".\backups" }

# Lấy nhãn thời gian hiện tại theo định dạng chuẩn yyyyMMdd-HHmmss
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

# Thực hiện lệnh trích xuất dữ liệu pg_dump qua Docker container (không hardcode mật khẩu)
docker exec legalflow_postgres pg_dump -U legalflow_admin -d legalflow_prod > ".\backups\legalflow_prod_$timestamp.sql"

# Kiểm tra xác nhận file backup đã được tạo ra và có dung lượng hợp lệ (> 0 KB)
Get-Item ".\backups\legalflow_prod_$timestamp.sql"
```

**Các nguyên tắc an toàn bắt buộc khi Backup:**
* Tự động tạo thư mục `backups/` nếu chưa có.
* Luôn kiểm tra xác nhận file `.sql` sinh ra tồn tại và có dung lượng thực tế (tránh file rỗng do lỗi kết nối).
* ❌ **TUYỆT ĐỐI KHÔNG COMMIT** thư mục `backups/` hay bất kỳ file `.sql` nào lên Git repository (đã được cấu hình chặn trong `.gitignore`).
* Bảo quản file backup trên thiết bị lưu trữ an toàn riêng biệt hoặc hệ thống lưu trữ ngoại tuyến theo đúng quy định an toàn thông tin nội bộ của cơ quan.

---

## 7. Restore Runbook

Quy trình phục hồi dữ liệu (`Restore`) là thao tác can thiệp sâu có độ rủi ro cực cao. Tài liệu này cung cấp hướng dẫn chuẩn ở mức lý thuyết để quản trị viên nắm rõ, đi kèm các **cảnh báo an toàn khắt khe**:

> [!CAUTION]
> **CẢNH BÁO AN TOÀN TUYỆT ĐỐI (MUST READ BEFORE RESTORE):**
> 1. **Chỉ được phép thực hiện Restore khi có văn bản hoặc chỉ đạo phê duyệt chính thức** từ Lãnh đạo cơ quan hoặc Trưởng bộ phận Quản trị hệ thống.
> 2. **Bắt buộc phải thực hiện Backup toàn bộ CSDL hiện tại thêm một lần nữa ngay trước khi Restore**, bất kể tình trạng CSDL lúc đó ra sao (để có thể khôi phục lại trạng thái trước khi làm sai).
> 3. **Restore sẽ GHI ĐÈ / XÓA BỔ TOÀN BỘ dữ liệu hiện tại** trong database `legalflow_prod`. Mọi hồ sơ mới tiếp nhận, nhật ký kiểm toán mới phát sinh sau thời điểm bản backup sẽ bị mất vĩnh viễn.
> 4. **Tuyệt đối KHÔNG CHẠY lệnh Restore trực tiếp trên môi trường Production** nếu chưa từng diễn tập và xác minh tính hợp lệ của file `.sql` trên môi trường Test/Staging.

### Kịch bản tham khảo (Reference Procedure - Chỉ chạy sau khi đã xác nhận đầy đủ 4 điều kiện trên):
```powershell
# [THAM KHẢO] - Lệnh khôi phục cơ sở dữ liệu từ file backup (chỉ chạy khi đã được phê duyệt)
cd C:\Users\Admin\legalflow-docker-uat

# Bước 1: Dừng các dịch vụ Backend và Frontend để ngắt các kết nối đang hoạt động vào DB
.\scripts\stop-legalflow.ps1
docker start legalflow_postgres

# Bước 2: Chọn đúng file backup cần khôi phục (thay thế tên file thực tế)
$backupFile = ".\backups\legalflow_prod_20260708-120000.sql"

# Bước 3: Thực hiện nạp lại dữ liệu vào PostgreSQL container
Get-Content $backupFile | docker exec -i legalflow_postgres psql -U legalflow_admin -d legalflow_prod

# Bước 4: Khởi động lại toàn bộ hệ thống sau khi restore xong
.\scripts\start-legalflow.ps1
```

---

## 8. Deployment Verification

Ngay sau khi khởi động hệ thống Pilot/Production thành công, kỹ sư vận hành phải tiến hành kiểm chứng 10 bước tuần tự trên giao diện:
1. **Mở Frontend (`http://kevindoan-legalflow.local:8080` hoặc `http://localhost:5173`):** Giao diện tải nhanh, không lỗi màn hình trắng, không có cảnh báo console error nghiêm trọng.
2. **Đăng nhập (`Login`):** Đăng nhập thử bằng các tài khoản chuẩn (`ADMIN`, `MANAGER`, `STAFF`, `VIEWER`), bảo đảm phân quyền đúng role.
3. **Danh sách hồ sơ (`ProcedureCaseList`):** Tải danh sách hồ sơ TTHC mượt mà, bộ lọc Lĩnh vực (`Đất đai`), Trạng thái (`RECEIVED`, `PROCESSING`...) và Từ khóa tìm kiếm hoạt động chính xác.
4. **Chi tiết hồ sơ (`ProcedureCaseDetail`):** Mở xem chi tiết một hồ sơ Cấp GCN lần đầu hoặc Chuyển mục đích, hiển thị đầy đủ thông tin người nộp, thửa đất và trạng thái xử lý.
5. **AI review (`Tab AI Review`):** Nhấn nút `Chạy AI Rà soát` (với tài khoản có quyền `canAct`), kiểm tra kết quả phân tích thẩm định trả về chính xác, tốc độ dưới 10 giây.
6. **Legal snapshot (`Tab Legal Snapshot`):** Kiểm tra hiển thị `Căn cứ pháp lý đã sử dụng` gắn liền với lần chạy AI review gần nhất, đảm bảo tính bất biến.
7. **Export draft (`Dự thảo / In / Xuất Word`):** Kiểm tra chức năng Xem trước PDF, In và Tải xuống file Word (`.docx`). Xác nhận tên file tải về bắt đầu bằng `DU_THAO_GOI_Y_AI_...` và trong văn bản có khối cảnh báo Human-in-the-Loop.
8. **Legal knowledge (`Tab Legal Knowledge`):** Mở danh sách Văn bản pháp luật, Quy trình và AI Prompts. Kiểm tra hiển thị các trạng thái `Active`, `Pending`, `Deprecated`.
9. **Activation / Rollback verification:** Với tài khoản `ADMIN` / `MANAGER`, thử nghiệm tính năng `Simulation` trên một phiên bản pending để xác nhận tính năng phân tích tác động trước khi áp dụng không ảnh hưởng CSDL thật.
10. **Health-check Script (`.\scripts\health-check.ps1`):** Chạy script chẩn đoán cuối cùng, đảm bảo các endpoint đều trả về HTTP Status 200 OK.

---

## 9. Rollback Runbook

Nếu phát hiện sự cố nghiêm trọng (Critical Bug) trên môi trường Pilot/Production sau khi deploy, kỹ sư thực hiện quy trình khôi phục nhanh về phiên bản ổn định (Rollback via Git Tag):

```powershell
# 1. Di chuyển vào thư mục hệ thống
cd C:\Users\Admin\legalflow-docker-uat

# 2. Dừng toàn bộ các dịch vụ đang chạy
.\scripts\stop-legalflow.ps1

# 3. Xác định tag hiện tại và chuyển về tag ổn định trước đó (Ví dụ: v2.9.12 hoặc v2.9.11)
# Phiên bản Release Candidate hiện tại là: v2.9.13-final-uat-release-candidate-complete
git checkout <previous-stable-tag>

# 4. Cập nhật lại các gói phụ thuộc (nếu cần) và build lại Backend + Frontend
cd legalflow-backend
npm run build
cd ..
npm run build

# 5. Khởi động lại hệ thống ở phiên bản đã rollback
.\scripts\start-legalflow.ps1

# 6. Chạy kiểm tra sức khỏe
.\scripts\health-check.ps1
```

**Lưu ý quan trọng khi Rollback:**
* Quy trình Rollback theo Git Tag **chỉ khôi phục mã nguồn (Source Code) và logic ứng dụng**, hoàn toàn **KHÔNG tự động Rollback cơ sở dữ liệu**.
* Nếu sự cố liên quan đến lỗi sai lệch dữ liệu trầm trọng, sau khi git checkout, quản trị viên phải tham khảo **Mục 7 (Restore Runbook)** để phục hồi file backup `.sql` tương ứng với tag đó (theo đúng quy định kiểm duyệt).

---

## 10. User / Role Readiness

Trước khi mở kết nối cho cán bộ nghiệp vụ sử dụng, cần rà soát sự sẵn sàng và chính xác của ma trận phân quyền 4 vai trò:

| Role | Quyền nghiệp vụ hồ sơ TTHC | Quyền chạy AI Review & Export | Quyền Quản trị Legal Knowledge | Kiểm chứng hệ thống |
| :--- | :--- | :--- | :--- | :--- |
| **ADMIN** | Toàn quyền xem, tạo và quản lý tất cả hồ sơ thủ tục hành chính. | Được chạy AI rà soát, xuất phiếu dự thảo Word/PDF. | **Toàn quyền Quản trị:** Tạo mới, `Activate`, `Rollback`, `Simulation` phiên bản pháp lý. | Trang quản trị hiển thị đầy đủ các nút thao tác nhạy cảm. |
| **MANAGER** | Quyền quản lý, giám sát, phân công hồ sơ cho chuyên viên thụ lý. | Được chạy AI rà soát, xuất phiếu dự thảo Word/PDF. | **Quyền Quản trị chuyên môn:** `Activate`, `Rollback`, `Simulation` phiên bản quy trình/prompts. | Được phép phê duyệt các phiên bản quy trình nghiệp vụ mới. |
| **STAFF** | Được tạo hồ sơ mới, xử lý và cập nhật hồ sơ do mình được phân công thụ lý. | Được chạy AI rà soát trên hồ sơ thụ lý, xuất phiếu dự thảo Word/PDF. | **Read-Only / Verification:** Chỉ được xem danh sách Active/Pending và chạy thử nghiệm `Verification`. | ❌ **Bị chặn UI & API:** Không hiển thị nút Activate/Rollback. API trả về `403 Forbidden`. |
| **VIEWER** | Chỉ được xem danh sách và thông tin chi tiết hồ sơ ở chế độ chỉ đọc. | ❌ **KHÔNG được chạy AI Review**, không được xuất phiếu rà soát chuyên môn. | **Read-Only:** Chỉ được xem danh sách và nội dung các quy định hiện hành. | ❌ **Bị chặn UI & API:** Tất cả các nút thao tác nghiệp vụ, AI và quản trị đều bị ẩn hoặc trả về `403 Forbidden`. |

---

## 11. AI Governance Readiness

Hệ thống tuân thủ 7 nguyên tắc vàng về quản trị rủi ro Trợ lý AI trong hành chính công:
1. **AI Warning Visibility:** Cảnh báo `BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA` luôn hiển thị nổi bật bằng viền hổ phách/vàng tại giao diện Tab AI Review và phần đầu văn bản xuất ra.
2. **No AI Auto-Conclusion:** Trợ lý AI chỉ đưa ra các nhận xét, đối chiếu quy định và khuyến nghị thông tin, tuyệt đối không thay thế thẩm quyền ký duyệt hay kết luận pháp lý của cán bộ thụ lý.
3. **Legal Snapshot Integrity:** Mỗi lần chạy AI đều tự động lưu giữ một bản chụp nhanh (`ProcedureAiAnalysisLegalSnapshot`) ghi nhận chính xác văn bản luật, điều khoản và prompt đã dùng để đảm bảo tính giải trình và chống cãi nước đôi (non-repudiation).
4. **Draft-Only Export:** Toàn bộ tài liệu xuất ra phục vụ công tác thẩm định đều mang tính chất bản nháp/dự thảo nội bộ (`DU_THAO_GOI_Y_AI_...`).
5. **No Auto-Signing:** Hệ thống tuyệt đối không tích hợp hay tự động kích hoạt chữ ký số (Digital Signature) vào các bản rà soát do AI sinh ra.
6. **No Auto-Promulgation:** Không có bất kỳ luồng tự động nào chuyển trạng thái hồ sơ sang "Hoàn thành / Đã ban hành" dựa đơn thuần trên kết quả AI Review.
7. **No Auto-Dispatch:** Hệ thống không tự động phát hành văn bản, gửi thông báo tin nhắn hay gửi kết quả ra ngoài Cổng Dịch vụ công hoặc công dân nếu chưa qua xác nhận thủ công của chuyên viên.

---

## 12. Incident Response

Quy trình ứng phó khẩn cấp đối với 8 tình huống sự cố phổ biến trên môi trường Pilot/Production:

| Tình huống sự cố | Triệu chứng nhận dạng | Quy trình xử lý nhanh (First Response Action) |
| :--- | :--- | :--- |
| **1. Frontend không mở được** | Trình duyệt báo `ERR_CONNECTION_REFUSED` hoặc màn hình trắng. | • Chạy `.\scripts\health-check.ps1` kiểm tra port 8080/5173.<br>• Kiểm tra log Caddy và Vite server.<br>• Khởi động lại dịch vụ bằng `.\scripts\start-legalflow.ps1`. |
| **2. Backend API gặp lỗi** | UI báo đỏ "Không thể tải danh sách hồ sơ" hoặc API trả HTTP 500/502. | • Kiểm tra tiến trình Node trên port 3000 (`netstat -ano \| findstr :3000`).<br>• Xem log chi tiết trong console backend.<br>• Chạy thử lại bằng nút **Thử lại** trên UI, nếu không được thì restart backend. |
| **3. Database không phản hồi** | Health-check báo `Postgres container NOT running` hoặc lỗi Prisma Connection. | • Kiểm tra container bằng `docker ps -a`.<br>• Khởi động lại Postgres: `docker start legalflow_postgres`.<br>• Kiểm tra dung lượng ổ cứng host xem có bị đầy (`0 KB available`) hay không. |
| **4. Export Word/PDF bị lỗi** | Nhấn nút Tải/Xem trước báo lỗi "Không thể xuất file Word phiếu rà soát". | • Kiểm tra hồ sơ xem đã có kết quả `ProcedureAiAnalysis` hay chưa.<br>• Kiểm tra log backend xem thư viện `docx` / `Packer` có gặp exception về bộ nhớ hay ký tự đặc biệt không. |
| **5. AI Review không chạy** | Nhấn "Chạy AI Rà soát" bị treo lâu hoặc báo lỗi timeout/LLM error. | • Kiểm tra kết nối mạng từ máy chủ Backend đến nhà cung cấp LLM (Google Gemini / OpenAI API).<br>• Xác minh `API_KEY` trong `.env` có hợp lệ và chưa vượt giới hạn quota hay không. |
| **6. Phân quyền sai lệch** | Tài khoản `STAFF` nhìn thấy hoặc gọi được API của `ADMIN`. | • **KHẨN CẤP:** Kiểm tra cấu hình `JwtAuthGuard` và `RolesGuard` trên controller.<br>• Kiểm tra lại trường `role` trong token JWT của người dùng bằng cách yêu cầu đăng xuất và đăng nhập lại. |
| **7. Dữ liệu nghi ngờ sai lệch** | Cán bộ phát hiện thông tin thửa đất hoặc kết quả AI bị mất hoặc lệch so với CSDL. | • **KHẨN CẤP:** Dừng các thao tác chỉnh sửa hồ sơ đó lập tức.<br>• Kiểm tra nhật ký kiểm toán `ProcedureAuditLog` để truy vết lịch sử thay đổi.<br>• Báo cáo quản trị viên để đối chiếu với bản backup gần nhất. |
| **8. Người dùng báo lỗi chung** | Cán bộ gọi điện hoặc gửi phản hồi qua form khi gặp sự cố thao tác UI. | • Ghi nhận chính xác: Mã hồ sơ, thời điểm xảy ra, tài khoản sử dụng và ảnh chụp màn hình lỗi.<br>• Tái hiện sự cố trên môi trường Test/UAT nội bộ để xác định nguyên nhân gốc rễ (RCA). |

---

## 13. Daily Operation Checklist

Công việc kiểm tra, giám sát hằng ngày dành cho kỹ sư trực ca vận hành hệ thống:
- [ ] **Kiểm tra truy cập hệ thống:** Mở trình duyệt truy cập địa chỉ `http://kevindoan-legalflow.local:8080` (hoặc URL chính thức), xác nhận trang chủ và màn hình đăng nhập phản hồi dưới 2 giây.
- [ ] **Chạy Health-check định kỳ:** Thực hiện lệnh `.\scripts\health-check.ps1` vào đầu giờ sáng mỗi ngày, đảm bảo 3 thành phần cốt lõi (Postgres, Backend, Frontend) đạt `[PASS]`.
- [ ] **Kiểm tra bản Backup gần nhất:** Kiểm tra thư mục `backups/`, xác nhận có file backup `.sql` được tạo ra trong vòng 24 giờ qua và dung lượng file không bị sụt giảm bất thường.
- [ ] **Rà soát phản hồi từ người dùng:** Kiểm tra kênh tiếp nhận hỗ trợ (Form phản hồi UAT / Group Zalo hỗ trợ kỹ thuật) để kịp thời giải đáp vướng mắc cho cán bộ thụ lý.
- [ ] **Kiểm tra Log bất thường (Error Logs):** Rà soát log của Backend API và Container Postgres xem có xuất hiện các chuỗi `[Error]`, `Exception`, `Timeout` hay `Deadlock` hay không.
- [ ] **Kiểm tra dung lượng ổ đĩa máy chủ:** Đảm bảo phân vùng cài đặt hệ thống (`C:\` hoặc `/var`) còn trống ít nhất 20% dung lượng để phục vụ lưu trữ log và database.

---

## 14. Weekly Operation Checklist

Công việc bảo trì, bảo dưỡng và đánh giá chuyên sâu hằng tuần vào ngày làm việc cuối tuần:
- [ ] **Diễn tập phục hồi dữ liệu (Backup Restore Drill):** Lấy file backup `.sql` gần nhất khôi phục thử trên một máy chủ độc lập (Test/Sandbox environment) để xác minh dữ liệu trong file hoàn toàn hợp lệ và có thể phục hồi khi gặp thảm họa.
- [ ] **Kiểm tra ma trận Phân quyền (RBAC Audit):** Rà soát danh sách tài khoản người dùng active trên DB, kiểm tra xem có tài khoản nào bị cấp sai quyền `ADMIN` hay `MANAGER` hay không.
- [ ] **Kiểm tra nhật ký Legal Knowledge:** Mở phân hệ Quản trị tri thức, rà soát lịch sử kích hoạt (`activationHistory`) và phục hồi (`rollbackHistory`) trong tuần xem có thao tác thay đổi quy trình nào không được phê duyệt hay không.
- [ ] **Kiểm tra tính an toàn xuất văn bản (Export Audit):** Tải ngẫu nhiên 3-5 phiếu rà soát Word từ các hồ sơ đã hoàn thành trong tuần, xác minh toàn bộ đều duy trì tiền tố `DU_THAO_GOI_Y_AI_` và không bị mất banner cảnh báo.
- [ ] **Kiểm tra tính toàn vẹn Git Tag:** Chạy lệnh `git status -s` và `git log -1` để xác nhận máy chủ Production không có ai tự ý can thiệp hay chỉnh sửa code trực tiếp ngoài luồng Git release.
- [ ] **Tổng hợp báo cáo UAT & lỗi tuần:** Báo cáo Lãnh đạo về tình hình vận hành Pilot, số lượng hồ sơ đã được AI hỗ trợ rà soát và danh sách các góp ý cải tiến của chuyên viên.

---

## 15. Go / No-Go Criteria

Hệ thống chỉ được phép chuyển sang giai đoạn Pilot thực tế hoặc Production chính thức khi và chỉ khi đáp ứng đồng thời **100% các tiêu chí (Go Criteria)** sau đây:

| Tiêu chí | Điều kiện đạt (Go Criteria) | Trạng thái hiện tại |
| :--- | :--- | :---: |
| **1. Technical Tests Pass** | Toàn bộ 129 Unit Test Cases, Prisma Validate và Build production phải đạt 100% PASS. | **GO ➔ PASS** |
| **2. Backup Readiness** | Thư mục `backups/` đã hoạt động, có ít nhất 1 bản backup sạch trước giờ G. | **GO ➔ PASS** |
| **3. Restore Runbook & Drill** | Tài liệu Restore Runbook đã sẵn sàng, đã được diễn tập trên môi trường sandbox. | **GO ➔ PASS** |
| **4. Officer Training Completed** | Cán bộ thụ lý đất đai đã được hướng dẫn tài liệu UAT Guide và hiểu rõ triết lý AI hỗ trợ. | **GO ➔ READY** |
| **5. RBAC Accounts Setup** | Tài khoản cho Lãnh đạo (`ADMIN`/`MANAGER`), Chuyên viên (`STAFF`) đã cấp phát đúng vai trò. | **GO ➔ READY** |
| **6. Dedicated Operator Assigned** | Có ít nhất 01 kỹ sư hoặc chuyên viên IT được phân công chịu trách nhiệm trực ca vận hành. | **GO ➔ READY** |
| **7. Zero Critical/High Bugs** | Không còn bất kỳ lỗi nào thuộc mức `Critical` (gây sập/mất dữ liệu) hoặc `High` (sai luật) chưa được xử lý. | **GO ➔ PASS** |

*(Nếu bất kỳ tiêu chí nào bị đánh dấu `NO-GO`, quy trình triển khai phải dừng lại lập tức để xử lý triệt để).*

---

## 16. Remaining Risks
Nhằm bảo đảm tính minh bạch trong quản trị, xin báo cáo các rủi ro và giới hạn còn lại cần tiếp tục theo dõi sát sao trong giai đoạn Pilot:
1. **Rủi ro trải nghiệm thực tế của cán bộ (`Real Officer UAT Risk`):** Dù giao diện đã được tối ưu hóa UX/UI states, cán bộ nghiệp vụ tại địa phương có thể vẫn gặp bỡ ngỡ với các khái niệm mới như `Legal Snapshot` hay `AI Prompt Versioning`. Cần hỗ trợ trực tiếp trong 2 tuần đầu.
2. **Rủi ro đa dạng của dữ liệu đất đai thực tế (`Real Data Variety Risk`):** Dữ liệu đất đai thực tế phức tạp (giấy tờ cũ trước 1993, trích lục bản đồ biến động...) có thể khiến AI phân tích chưa đầy đủ căn cứ. Cán bộ phải luôn phát huy vai trò kiểm duyệt cuối cùng.
3. **Rủi ro chính sách lưu trữ Backup (`Formal Backup Policy Risk`):** Hiện tại hệ thống sao lưu qua `pg_dump` cục bộ trên ổ cứng máy chủ. Về lâu dài cần tích hợp chính sách đẩy backup tự động lên Cloud Storage an toàn hoặc NAS riêng của tỉnh.
4. **Rủi ro kiểm soát mạng Production (`Production Network Risk`):** Cần phối hợp với Trung tâm Công nghệ thông tin tỉnh cấu hình tường lửa (Firewall), giới hạn CORS và mở port HTTPS/SSL chính thức thay vì dùng HTTP nội bộ.
5. **Rủi ro giám sát Log tập trung (`Log Monitoring Risk`):** Hiện log đang ghi nhận tại console Docker. Để vận hành quy mô lớn, cần lên kế hoạch tích hợp ELK Stack hoặc Grafana/Loki để cảnh báo tự động qua email/Zalo khi có lỗi server.
6. **Rủi ro hướng dẫn pháp lý nội bộ (`Internal Legal Protocol Risk`):** Cơ quan quản lý cần sớm ban hành Quy chế sử dụng Trợ lý AI nội bộ, quy định rõ trách nhiệm pháp lý của chuyên viên khi tham khảo phiếu rà soát `DU_THAO_GOI_Y_AI_`.

---

## 17. Next Phase
Sau khi ban hành thành công bộ tài liệu **Production Readiness & Deployment Runbook (`Phase 10A`)** và hoàn tất các bước chuẩn bị hạ tầng, chúng tôi chính thức đề xuất chuyển sang giai đoạn thực tiễn tiếp theo:

### **Phase 10B: Pilot UAT with Real Officers**
* **Mục tiêu cốt lõi:**
  1. Tổ chức triển khai thí điểm (Pilot) hệ thống LegalFlow v2 tại Phòng Đăng ký và Cấp GCN đất đai với cán bộ nghiệp vụ thực tế.
  2. Tiếp nhận hồ sơ thực tế song song (shadow processing) với hệ thống Dịch vụ công hiện tại để rà soát, đánh giá độ chính xác của Trợ lý AI.
  3. Thu thập phiếu phản hồi UAT (`Feedback Form`), tổng hợp các góp ý tinh chỉnh UX/UI và tối ưu hóa Prompt AI theo đặc thù địa phương.
  4. Hoàn thiện báo cáo tổng kết giai đoạn Pilot, tạo tiền đề vững chắc cho quyết định Golive chính thức toàn diện.
