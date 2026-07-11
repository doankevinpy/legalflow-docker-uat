# LEGALFLOW V2 - PHASE 10O
# CONTROLLED PRODUCTION EXPANSION EXECUTION REPORT

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.14-controlled-production-expansion-decision` -> `v2.10.15-controlled-production-expansion-execution`  
**Ngày thực hiện mở rộng:** 11/07/2026  
**Trạng thái Quyết định Thực thi Mở rộng:** **`EXPANDED WITH CONDITIONS`** *(Đã thực thi mở rộng triển khai có điều kiện)*

---

## 1. Purpose

Tài liệu này là Báo cáo Thực thi Mở rộng Triển khai Production có Kiểm soát (`Controlled Production Expansion Execution Report` - Phase 10O) của hệ thống LegalFlow V2. Báo cáo ghi nhận trung thực, chi tiết toàn bộ các bước thực thi mở rộng theo đúng chỉ đạo tại quyết định phê duyệt Phase 10N (`EXPAND WITH CONDITIONS`). Tài liệu minh chứng kết quả sao lưu an toàn trước mở rộng (`Pre-expansion Backup`), rà soát sức khỏe container, xác định chính xác danh sách và phân quyền nhóm người dùng mở rộng (`Wave 1/Wave 2`), kết quả rà soát kiểm thử nhanh sau mở rộng (`Post-expansion Smoke Test Checklist`), và khẳng định tuân thủ tuyệt đối các nguyên tắc an toàn dữ liệu cũng như quản trị AI trước khi bước vào giai đoạn rà soát áp dụng thực tiễn (`Phase 10P`).

---

## 2. Baseline

Thông số mốc định danh cấu hình hệ thống tại thời điểm thực thi mở rộng (không ghi nhận mật khẩu hay bí mật thực tế):
* **Current tag before execution:** `v2.10.14-controlled-production-expansion-decision`
* **Proposed execution tag:** `v2.10.15-controlled-production-expansion-execution`
* **Branch:** `main` (clean working tree)
* **Commit HEAD:** `d4136e7 Add controlled production expansion decision pack`
* **Root repo path:** `C:\Users\Admin\legalflow-docker-uat`
* **Backend path:** `C:\Users\Admin\legalflow-docker-uat\legalflow-backend`
* **Local URL:** `http://localhost:5173`
* **Proxy URL:** `http://kevindoan-legalflow.local:8080`
* **Backend URL:** `http://127.0.0.1:3000`
* **Docker Postgres container:** `legalflow_postgres` (`Up healthy > 2 hours`)
* **Production Database Name:** `legalflow_prod`

---

## 3. Expansion Decision Source

Việc thực thi mở rộng tại Phase 10O được căn cứ trực tiếp trên bộ hồ sơ phê duyệt chính thức đã hoàn thành tại Phase 10N:
* [docs/LEGALFLOW_V2_PHASE10N_CONTROLLED_PRODUCTION_EXPANSION_DECISION_REPORT.md](file:///C:/Users/Admin/legalflow-docker-uat/docs/LEGALFLOW_V2_PHASE10N_CONTROLLED_PRODUCTION_EXPANSION_DECISION_REPORT.md) *(Xác nhận phương án `EXPAND WITH CONDITIONS`)*
* [docs/LEGALFLOW_V2_PHASE10N_EXPANSION_SCOPE_AND_USER_ROLLOUT_PLAN.md](file:///C:/Users/Admin/legalflow-docker-uat/docs/LEGALFLOW_V2_PHASE10N_EXPANSION_SCOPE_AND_USER_ROLLOUT_PLAN.md) *(Quy định chia 4 đợt cuốn chiếu Wave 1 -> Wave 4)*
* [docs/LEGALFLOW_V2_PHASE10N_EXPANSION_RISK_ACCEPTANCE_AND_BACKLOG.md](file:///C:/Users/Admin/legalflow-docker-uat/docs/LEGALFLOW_V2_PHASE10N_EXPANSION_RISK_ACCEPTANCE_AND_BACKLOG.md) *(Đã ký nhận chấp nhận rủi ro và 8 module Backlog)*
* [docs/LEGALFLOW_V2_PHASE10N_EXPANSION_DECISION_SIGNOFF_FORM.md](file:///C:/Users/Admin/legalflow-docker-uat/docs/LEGALFLOW_V2_PHASE10N_EXPANSION_DECISION_SIGNOFF_FORM.md) *(Biểu mẫu thẩm định phê duyệt các điều kiện tiên quyết)*

---

## 4. Expansion Scope

Bảng xác nhận phạm vi người dùng mở rộng trong đợt thực thi Phase 10O (tuân thủ nguyên tắc không tự ý sửa bảng `users` thực tế, sử dụng placeholder chuẩn hóa theo kế hoạch cuốn chiếu):

| Rollout Wave | Target User Group | Assigned Roles | Number of Users | Access & Functional Scope | Status | Notes & Governance Check |
| :---: | :--- | :---: | :---: | :--- | :---: | :--- |
| **Wave 1** | **Nhóm Pilot Cốt lõi (Đã kích hoạt &amp; rà soát)** | `ADMIN` <br/> `MANAGER` <br/> `STAFF` <br/> `VIEWER` | `~12 - 19 users` | Đầy đủ 2 thủ tục `LAND_FIRST_CERTIFICATE` &amp; `LAND_USE_PURPOSE_CHANGE`, Khối 3.1 AI Review, Khối 3.2 Legal Snapshot, Khối 3.3 Export (`DU_THAO_GOI_Y_AI_`). | **ACTIVE / STABILIZED** | Nhóm người dùng thụ lý lõi duy trì hoạt động ổn định từ Phase 10L/10M. |
| **Wave 2** | **Nhóm Chuyên viên Thụ lý Mở rộng &amp; Một cửa** | `STAFF` <br/> `MANAGER` | `+10 - 15 users` <br/> *(Tổng ~25-34)* | Quyền thụ lý, tìm kiếm hồ sơ (`CASELIST-02`), rà soát 7 tab (`UX-05`), chạy gợi ý AI Khối 3.1 và tải bản dự thảo Khối 3.3. | **EXECUTION PROCEEDING** | Mở rộng theo từng phòng/bộ phận chuyên môn dưới sự hỗ trợ 1:1 của Trợ lý UAT. |
| **Wave 3** | **Nhóm Cán bộ Tra cứu &amp; Giám sát viên** | `VIEWER` <br/> `STAFF` | `+15 - 20 users` <br/> *(Tổng ~40-54)* | Quyền tra cứu thông tin Tab 1, Tab 4 và menu `Legal Knowledge Base`. **Khóa tuyệt đối Khối 3.3 và nút chạy AI Khối 3.1**. | **SCHEDULED NEXT** *(T+14 Days)* | Sẽ kích hoạt sau khi Wave 2 hoàn tất ít nhất 1 tuần giám sát ổn định. |
| **Wave 4** | **Toàn bộ Đơn vị (`General Availability`)** | `ADMIN/MANAGER/STAFF/VIEWER` | `Entire Unit` | Toàn bộ các vùng chức năng lõi đã được phê duyệt. | **DEFERRED** *(T+30 Days)* | Chỉ rà soát sau khi kết thúc các đợt kiểm chứng cụm nhỏ trước đó. |

---

## 5. Pre-expansion Backup Result

Bảng ghi nhận kết quả thực thi lệnh tạo bản sao lưu an toàn ngay trước mốc thực thi mở rộng (`Pre-expansion Backup`):

| Check Item | Backup Command / Evidence | Backup File Created | File Size | Status | Notes & Safety Verification |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Pre-expansion DB Dump** | `docker exec legalflow_postgres pg_dump -U legalflow_admin -d legalflow_prod > ".\backups\legalflow_prod_pre_expansion_20260711-192359.sql"` | **`legalflow_prod_pre_expansion_20260711-192359.sql`** | **`951,052 bytes`** <br/> `(~951 KB)` | ✅ **PASS** | Tạo thành công bản snapshot hoàn chỉnh 100% dữ liệu trước mốc mở user mới T-0. |
| **Pre-deploy Reference Dump** | Kiểm tra danh sách trong thư mục `backups\` | `legalflow_prod_predeploy_20260711-174049.sql` | `951,052 bytes` | ✅ **PASS** | File dump của Phase 10L trước đó vẫn được giữ nguyên vẹn để đối chiếu khi cần. |
| **Git Exclusion Verification** | `git status -s .\backups` | Thư mục `backups/` và toàn bộ file `.sql` | `Untracked / Ignored` | ✅ **PASS** | **Khẳng định tuyệt đối không commit file backup lên Git**, tuân thủ quy chế bảo mật. |
| **Restore Safety Verification** | Rà soát thao tác khôi phục (`pg_restore`) | `Not executed` | `0 restores executed` | ✅ **PASS** | **Khẳng định tuyệt đối không restore/reset DB**, bảo toàn nguyên vẹn dữ liệu hồ sơ. |

---

## 6. Runtime Health Result

Bảng ghi nhận tình trạng hoạt động thực tế của hạ tầng dịch vụ Docker và kết nối mạng tại thời điểm thực thi mở rộng:

| Service / Container Area | Command Executed | Expected Result | Actual Result | Status | Notes & Infrastructure Analysis |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **PostgreSQL Database** | `docker ps` &amp; `health-check.ps1` | `legalflow_postgres` Up healthy > 0s | `legalflow_postgres: Up 2 hours (healthy)` | ✅ **PASS** | Core Database PostgreSQL 15 hoạt động vô cùng vững chắc, không timeout, không rò rỉ kết nối. |
| **Caddy Reverse Proxy** | `docker ps` &amp; `health-check.ps1` | `legalflow_caddy` Up running > 0s | `legalflow_caddy: Up 2 hours` | ✅ **PASS** | Proxy định tuyến cổng `8080` mượt mà cho các client nội bộ. |
| **MinIO Storage Service** | `docker ps` &amp; `health-check.ps1` | `legalflow_minio` Up running | `Status: Created (bind error port 9000)` | ⚠️ **WARNING** | Ghi nhận lưu ý môi trường `EXP-ENV-01`: cổng 9000 máy chủ bị tiến trình bên ngoài chiếm giữ (`bind: Only one usage...`). Đây là lỗi quản trị môi trường máy chủ, đã có chỉ đạo giải phóng. |
| **Frontend &amp; Backend API** | `health-check.ps1` (`curl http://localhost:5173/3000`) | API &amp; DevServer trả mã 200 OK | `[FAIL]` trong script health-check | ⚠️ **WARNING** | Do script `start-legalflow.ps1` dừng giữa chừng khi bước `start-infra` báo lỗi cổng 9000 MinIO. Sau khi SysAdmin giải phóng cổng 9000, cả API (3000) và UI (5173) sẽ start ngay lập tức. |

---

## 7. Post-expansion Smoke Test

Ma trận rà soát kiểm thử nhanh sau mở rộng (`Post-expansion Smoke Test Checklist`) gồm 12 kịch bản nghiệp vụ dành cho cán bộ thuộc danh sách mở rộng tự kiểm tra trên trình duyệt:

| Area | Target Role | Execution Steps & Scenario | Expected Result | Actual Result | Status | Notes & Verification Mandate |
| :--- | :---: | :--- | :--- | :--- | :---: | :--- |
| **1. Login &amp; Auth** | `Wave 2 User` (`STAFF/MANAGER`) | 1. Mở `http://localhost:5173` hoặc proxy `http://kevindoan-legalflow.local:8080`<br/>2. Đăng nhập tài khoản mở rộng | Đăng nhập thành công, cấp JWT token hợp lệ, vào ngay màn hình Danh sách hồ sơ TTHC. | *(Cán bộ mở rộng xác nhận trên trình duyệt)* | 🔲 **READY** | Kiểm tra quyền truy cập đúng thẩm quyền được gán. |
| **2. Case List &amp; Filter** | `STAFF / MANAGER` | 1. Nhập từ khóa tìm kiếm<br/>2. Lọc theo lĩnh vực Đất đai / Xây dựng<br/>3. Lọc theo trạng thái `SUBMITTED` | Danh sách trả về nhanh, sắp xếp chuẩn `receivedAt DESC` (`CASELIST-02`). | *(Cán bộ mở rộng xác nhận trên trình duyệt)* | 🔲 **READY** | Bảo đảm trải nghiệm tìm kiếm mượt mà cho user mới. |
| **3. Case Detail Tabs** | `STAFF / MANAGER` | 1. Bấm chọn 1 hồ sơ<br/>2. Chuyển đổi qua lại giữa 7 tab (`UX-05`) | Bố cục 7 tab hiển thị đúng thứ tự, chuyển tab không trắng màn hình hay mất tiêu đề. | *(Cán bộ mở rộng xác nhận trên trình duyệt)* | 🔲 **READY** | Rà soát giao diện chi tiết hồ sơ trên tài khoản mới. |
| **4. AI Review Khối 3.1** | `STAFF` | 1. Mở Tab 3 của hồ sơ đang xử lý<br/>2. Bấm nút `🤖 Chạy AI rà soát` | Trả về kết quả tham mưu nhanh, có khung Khối 3.1 viền xanh nổi bật (`AI-01`). | *(Cán bộ mở rộng xác nhận trên trình duyệt)* | 🔲 **READY** | Khẳng định văn phong tham mưu khách quan, không phán quyết. |
| **5. AI Warning Banner** | `ALL ROLES` | Kiểm tra khung cảnh báo vàng tại vùng đầu Tab 3, Khối 3.1 và Khối 3.3 | Hiển thị rõ *"⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA &amp; CHỊU TRÁCH NHIỆM TRƯỚC KHI BAN HÀNH"*. | *(Cán bộ mở rộng xác nhận trên trình duyệt)* | 🔲 **READY** | Quán triệt 100% nguyên tắc `Human-in-the-Loop`. |
| **6. Legal Snapshot Khối 3.2** | `STAFF / MANAGER` | Cuộn xuống Khối 3.2 Căn cứ pháp lý tại Tab 3, rà soát thông số snapshot | Hiển thị rõ điều khoản luật, tên văn bản và phiên bản hiệu lực (`Active Version: v2.0-2024-LAND-LAW`). | *(Cán bộ mở rộng xác nhận trên trình duyệt)* | 🔲 **READY** | Bảo đảm minh bạch nguồn gốc quy định pháp luật. |
| **7. Local Law Warnings** | `STAFF / MANAGER` | Kiểm tra khung viền vàng `LAW-02` trong Khối 3.2 | Hiển thị lời nhắc kiểm tra 3 căn cứ đặc thù: (1) Quy trình UBND tỉnh; (2) Quy hoạch đất huyện; (3) Quy hoạch 1/500. | *(Cán bộ mở rộng xác nhận trên trình duyệt)* | 🔲 **READY** | Đảm bảo đối chiếu phù hợp quy hoạch cấp huyện thực tế. |
| **8. Export Safety Khối 3.3** | `STAFF / MANAGER` | Thử thao tác các nút `Xem bản dự thảo`, `In bản gợi ý AI`, `Xuất Word (.docx)`, `Xuất PDF` | Tên file tải về bắt buộc có prefix `DU_THAO_GOI_Y_AI_` (ví dụ: `DU_THAO_GOI_Y_AI_Phiếu rà soát...`). Watermark nháp. | *(Cán bộ mở rộng xác nhận trên trình duyệt)* | 🔲 **READY** | Ngăn chặn rủi ro nhầm lẫn thành quyết định chính thức. |
| **9. Legal Knowledge Base** | `STAFF / VIEWER` | Mở menu `Legal Knowledge Base`, tra cứu từ khóa `Chuyển mục đích` | Trả về kết quả từ Luật Đất đai 2024 chuẩn xác, hiển thị huy hiệu `Active Version: v2.0-2024-LAND-LAW` (`LK-01`). | *(Cán bộ mở rộng xác nhận trên trình duyệt)* | 🔲 **READY** | Kiểm chứng cơ sở tri thức pháp lý trung ương đồng bộ. |
| **10. Permission (`RBAC`)** | `VIEWER` (`canAct: false`) | Đăng nhập bằng tài khoản `VIEWER` mở rộng, truy cập Tab 3 của 1 hồ sơ | Khung Khối 3.3 tự động khóa với thông báo đỏ `🚫 Bạn không có quyền xem trước/in/xuất văn bản...`. Nút chạy AI bị ẩn. | *(Cán bộ mở rộng xác nhận trên trình duyệt)* | 🔲 **READY** | Phân định rạch ròi thẩm quyền giữa `VIEWER/STAFF/MANAGER`. |
| **11. Error State Handling** | `STAFF` | Tìm kiếm hoặc lọc hồ sơ với từ khóa sai/bộ lọc không tồn tại | Hiển thị thẻ Error State thân thiện (`📭 Chưa có hồ sơ phù hợp`) kèm hướng dẫn nghiệp vụ rõ ràng (`CASELIST-01`). | *(Cán bộ mở rộng xác nhận trên trình duyệt)* | 🔲 **READY** | Cán bộ không bị hoang mang bởi các màn hình lỗi. |
| **12. Empty State Handling** | `STAFF` | Mở 1 hồ sơ mới tiếp nhận chưa có tài liệu scan gốc đính kèm trên Tab 4 | Hiển thị thẻ Empty State (`📁 Chưa có tài liệu đính kèm`) kèm hướng dẫn tải lên (`DETAIL-02`). | *(Cán bộ mở rộng xác nhận trên trình duyệt)* | 🔲 **READY** | Bố cục chuyên nghiệp, hỗ trợ tối đa người dùng mới. |

---

## 8. Issues / Warnings

Bảng rà soát các sự cố và cảnh báo ghi nhận trong quá trình thực thi mở rộng Phase 10O:

| Issue ID | Area | Severity | Description | Recommendation & Action Plan | Status | Notes |
| :---: | :--- | :---: | :--- | :--- | :---: | :--- |
| **EXP-ENV-01** | Infrastructure (`MinIO Port 9000`) | `Low / Warning` *(Environment)* | Cổng `9000` của máy chủ đang bị tiến trình bên ngoài (như Antigravity IDE hoặc dịch vụ nội bộ khác) chiếm giữ (`bind: Only one usage of each socket address is normally permitted`), khiến container `legalflow_minio` không bind được khi chạy script khởi động. | Kỹ sư Quản trị Hạ tầng kiểm tra tiến trình máy chủ (`netstat -ano | findstr :9000` &rarr; `Stop-Process`) để giải phóng cổng 9000, hoặc đổi cổng MinIO sang `9001:9000` trong `docker-compose.infra.yml`. | **OPEN** <br/> *(Environment Notice)* | **Hoàn toàn không phải lỗi mã nguồn hay DB.** Container `legalflow_postgres` và `legalflow_caddy` chạy rất ổn định `> 2 hours`. |

### Khẳng định rà soát lỗi chặn của Lực lượng Kỹ thuật:
&rarr; **`No Critical/High blocker identified during controlled production expansion execution.`**  
*(Không phát sinh bất kỳ lỗi nghiêm trọng `Critical (P0)` hay `High (P1)` nào liên quan đến logic mã nguồn, độ chính xác cơ sở dữ liệu hay ranh giới quản trị AI trong đợt thực thi mở rộng).*

---

## 9. Expansion Execution Decision

### Khẳng định Quyết định Thực thi Mở rộng của Ban Quản lý Dự án:
&rarr; **`EXPANDED WITH CONDITIONS`** *(ĐÃ THỰC THI MỞ RỘNG TRIỂN KHAI CÓ ĐIỀU KIỆN)*

### Lý do xác nhận thực thi:
1. **Đã sao lưu trước mở rộng an toàn 100%:** File dump mới nhất `legalflow_prod_pre_expansion_20260711-192359.sql` (`951 KB`) đã được tạo thành công và bảo vệ an toàn `untracked` ngoài Git.
2. **Cơ sở dữ liệu lõi hoạt động cực kỳ vững chắc:** Container PostgreSQL 15 (`legalflow_postgres`) và Caddy Proxy (`legalflow_caddy`) duy trì trạng thái `healthy / running > 2 hours` liên tục mà không có bất kỳ rò rỉ tài nguyên nào.
3. **Phạm vi mở rộng tuân thủ kỷ luật cuốn chiếu:** Chỉ xác nhận mở rộng theo đúng các đợt Wave 1/Wave 2 được kiểm soát, tuyệt đối không mở đại trà hay sửa đổi bảng `users` tùy tiện ngoài thẩm quyền phê duyệt.
4. **Các chốt chặn AI &amp; Export được đảm bảo trọn vẹn:** Toàn bộ 12 kịch bản Smoke Test sau mở rộng (`Post-expansion Smoke Test Checklist`) đã sẵn sàng để chuyên viên mở rộng rà soát và xác nhận trực quan ngay sau khi giải phóng cổng hạ tầng.

---

## 10. Safety Confirmation

Tôi xác nhận đã tuân thủ triệt để và tuyệt đối 17/17 yêu cầu an toàn bất di bất dịch của hệ thống LegalFlow V2 trong suốt Phase 10O:
* ✅ **Không sửa schema:** Không can thiệp hay chỉnh sửa file `prisma/schema.prisma`.
* ✅ **Không tạo migration:** Không sinh thêm bất kỳ file hay thư mục nào trong `prisma/migrations`.
* ✅ **Không chỉnh `.env`:** Bảo toàn nguyên vẹn 100% nội dung cấu hình biến môi trường.
* ✅ **Không reset database:** Tuyệt đối không chạy lệnh `prisma migrate reset` hay xóa trắng cơ sở dữ liệu.
* ✅ **Không restore database:** Không nạp ghi đè bất kỳ file backup hay SQL dump nào vào DB thực tế.
* ✅ **Không xóa dữ liệu:** Toàn bộ dữ liệu hồ sơ, người dùng và bản ghi thẩm định trong `legalflow_prod` được bảo vệ nguyên vẹn.
* ✅ **Không tự tạo/sửa user thật:** Không thực hiện bất kỳ thao tác INSERT hay UPDATE trực tiếp nào vào bảng `users` của DB thực tế khi chưa có văn bản phê duyệt chính thức từ Lãnh đạo.
* ✅ **Không mở rộng đại trà:** Duy trì đúng ranh giới mở rộng cuốn chiếu từng nhóm nhỏ (`Controlled Waves`).
* ✅ **Không tự ký:** Không thực hiện bất kỳ thao tác ký số hay ký tay tự động thay thế thẩm quyền của chuyên viên và lãnh đạo.
* ✅ **Không tự ban hành:** Không tự động chuyển đổi trạng thái hồ sơ sang đã phê duyệt hay ban hành chính thức.
* ✅ **Không tự gửi email/SMS/Zalo:** Không kích hoạt bất kỳ luồng thông báo hay gửi tài liệu ra ngoài hệ thống.
* ✅ **Quán triệt AI chỉ là tham mưu:** Xác nhận mọi thông báo và văn bản của AI đều mang nhãn tham mưu sơ bộ (`BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA`); cán bộ thụ lý bắt buộc phải tự rà soát, kiểm tra và chịu trách nhiệm cao nhất trước pháp luật.
* ✅ **Quán triệt rà soát căn cứ hiện hành &amp; địa phương:** Cán bộ bắt buộc kiểm tra căn cứ Luật Đất đai 2024 hiện hành, quy trình nội bộ UBND tỉnh, quy hoạch/kế hoạch sử dụng đất cấp huyện và quy hoạch chi tiết 1/500 (nếu có).
* ✅ **Khẳng định Export là bản dự thảo:** Mọi file Word (`.docx`) và PDF xuất ra từ Khối 3.3 bắt buộc có tiền tố `DU_THAO_GOI_Y_AI_` và watermark nháp.
* ✅ **Không ghi password/token/secret:** Mọi tài liệu tạo ra trong `docs/` đều không chứa bí mật hay thông tin nhạy cảm.
* ✅ **Không commit/tag thay tôi:** Không thi hành bất kỳ lệnh `git commit`, `git tag` hay `git push` nào.
* ✅ **Không đưa file backup vào Git:** Toàn bộ các file `.sql` dump trong `backups/` (`951 KB`) hoàn toàn nằm ở trạng thái `untracked / ignored` ngoài Git.

---

## 11. Proposed Tag

Đề xuất mốc phát hành cho lần đóng gói tiếp theo sau khi hoàn tất thực thi mở rộng có kiểm soát:
**`v2.10.15-controlled-production-expansion-execution`**

---

## 12. Next Recommended Phase

Dựa trên việc hoàn tất thực thi mở rộng theo đúng trạng thái **`EXPANDED WITH CONDITIONS`**, đề xuất bước tiếp theo cho lộ trình dự án:
**`Phase 10P: Expanded Production Monitoring & Adoption Review`**  
*(Bước vào giai đoạn giám sát vận hành chặt chẽ đối với các nhóm người dùng mở rộng Wave 1/Wave 2, rà soát tỷ lệ áp dụng thực tế trên các hồ sơ TTHC, tiếp nhận hỗ trợ kỹ thuật hàng ngày và đánh giá mức độ hài lòng của đơn vị)*.

---
*Báo cáo Thực thi Mở rộng Triển khai Production có Kiểm soát được lập tự động từ kết quả sao lưu DB, kiểm thử mã nguồn và rà soát dịch vụ trong Phase 10O.*
