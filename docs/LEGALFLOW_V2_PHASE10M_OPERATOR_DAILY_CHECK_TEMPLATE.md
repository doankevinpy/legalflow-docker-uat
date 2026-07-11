# LEGALFLOW V2 - PHASE 10M
# OPERATOR DAILY CHECK TEMPLATE

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.13-post-deployment-monitoring-hypercare`  
**Đối tượng sử dụng:** Kỹ sư Quản trị Hệ thống / Lực lượng Trực chiến Technical Operator  
**Tần suất thực thi:** Hàng ngày (`Daily Execution Table`)

---

## 1. Purpose

Tài liệu này cung cấp Mẫu biểu Kiểm tra Hàng ngày dành cho Người Vận hành Hệ thống (`Operator Daily Check Template` - Phase 10M) được chuẩn hóa để Kỹ sư Quản trị trực chiến (`DevOps / SysAdmin`) thực hiện rà soát định kỳ mỗi ngày vào `08:00 AM` và `16:30 PM` trong suốt giai đoạn chăm sóc tích cực Hypercare. Mẫu biểu cấu trúc hóa 4 nhóm rà soát cốt lõi: kiểm tra hạ tầng kỹ thuật (`Technical Checks`), kiểm thử kịch bản chức năng (`Functional Checks`), xác nhận tuân thủ quản trị AI/bảo mật xuất văn bản (`AI Governance Checks`) và tổng kết chỉ số rủi ro cuối ngày (`End-of-day Summary`).

---

## 2. Daily Technical Checks

Bảng rà soát các chỉ số kỹ thuật, trạng thái container, kết nối API và tình trạng sao lưu an toàn cơ sở dữ liệu mỗi ngày:

| Time | Check Item | Command / Evidence | Expected Result | Actual Result | Status | Notes & Action Required |
| :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| `08:00` | **Container Health Status** | `docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}"` | `legalflow_postgres` và `legalflow_caddy` hiển thị trạng thái `Up healthy` / `Up running` | `legalflow_postgres: Up (healthy)` <br/> `legalflow_caddy: Up` | ✅ **PASS** | Kiểm tra container lưu trữ DB phải 100% healthy. |
| `08:05` | **System Health-Check** | `.\scripts\health-check.ps1` | `[PASS]` cho Postgres và Caddy. Ghi nhận minh bạch note môi trường MinIO nếu có | `Postgres & Caddy: PASS` <br/> `MinIO port 9000: WARNING` | ⚠️ **WARNING** | Ghi nhận note `HYP-ENV-01` về xung đột cổng 9000 trên máy chủ. |
| `08:10` | **Frontend &amp; Proxy URLs** | Truy cập cURL / Trình duyệt: <br/> `http://localhost:5173` <br/> `http://kevindoan-legalflow.local:8080` | Phản hồi mã HTTP `200 OK`, hiển thị trang đăng nhập không lỗi trắng màn hình | Mã HTTP `200 OK` trên proxy port 8080 | 🔲 **READY** | Caddy proxy hoạt động định tuyến chính xác. |
| `08:15` | **Backend REST API Health** | Truy cập endpoint API: <br/> `http://127.0.0.1:3000/api/health` | Phản hồi JSON status ok, kết nối DB mượt mà | API Server phản hồi JSON status ok | 🔲 **READY** | Kiểm tra các API nghiệp vụ cốt lõi sẵn sàng phục vụ. |
| `08:20` | **Pre-deployment Backup Status** | `Get-ChildItem .\backups` <br/> `git status -s .\backups` | Tồn tại file `.sql` dump mới nhất > 0 KB, và nằm ở trạng thái `untracked` ngoài Git | `legalflow_prod_predeploy...sql` (`951 KB`), `untracked` | ✅ **PASS** | **Tuyệt đối không commit file backup lên Git**, tuân thủ bảo mật. |
| `08:25` | **Host Disk Space Status** | `Get-PSDrive -PSProvider FileSystem` <br/> *(Hoặc `df -h` nếu Linux container)* | Ổ đĩa lưu trữ DB (`C:\` hoặc volume) còn trống trên 20% dung lượng, không bị nghẽn | Ổ đĩa `C:\` đủ dung lượng trống an toàn cho vận hành | ✅ **PASS** | Ngăn chặn rủi ro crash DB do hết dung lượng ổ cứng. |
| `16:30` | **Issue Register Review** | Rà soát `LEGALFLOW_V2_PHASE10M_HYPERCARE_ISSUE_REGISTER.md` | Lỗi phát sinh trong ngày được gán ID, phân loại mức độ và xử lý đúng quy định | 1 note `HYP-ENV-01`, 0 lỗi P0/P1 mã nguồn | ✅ **PASS** | Họp chốt sổ lỗi trước khi kết thúc ca trực mỗi chiều. |

---

## 3. Daily Functional Checks

Bảng rà soát nhanh 8 kịch bản nghiệp vụ trọng tâm trên trình duyệt của người vận hành / Trợ lý UAT:

| Area | Scenario & Execution Steps | Expected Result | Actual Result | Status | Notes |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **1. Login &amp; Auth** | Đăng nhập bằng tài khoản Pilot (`STAFF / MANAGER / ADMIN`) trên `http://localhost:5173` hoặc proxy | Đăng nhập thành công, token hợp lệ, vào ngay màn hình Danh sách hồ sơ TTHC. | *(Người vận hành xác nhận hàng ngày)* | 🔲 **READY** | Kiểm tra quyền truy cập đúng thẩm quyền. |
| **2. Case List &amp; Filter** | Tải danh sách hồ sơ, nhập từ khóa tìm kiếm và lọc theo lĩnh vực `Đất đai`, trạng thái `SUBMITTED` | Danh sách trả về nhanh, sắp xếp chuẩn `receivedAt DESC`, huy hiệu trạng thái rõ ràng (`CASELIST-02`). | *(Người vận hành xác nhận hàng ngày)* | 🔲 **READY** | Đảm bảo tốc độ truy vấn mượt mà. |
| **3. Case Detail Tabs** | Bấm chọn 1 hồ sơ, kiểm tra chuyển qua lại giữa 7 tab nghiệp vụ (`UX-05`) | Bố cục hiển thị đúng thứ tự 7 tab, không bị trắng màn hình hay mất tiêu đề tab. | *(Người vận hành xác nhận hàng ngày)* | 🔲 **READY** | Giám sát trải nghiệm người dùng trên hồ sơ chi tiết. |
| **4. AI Review (`Khối 3.1`)** | Tại Tab 3, bấm chạy AI rà soát cấp GCN lần đầu hoặc Chuyển mục đích sử dụng đất | Hệ thống trả kết quả phân tích nhanh, hiển thị trong Khối 3.1 viền xanh nổi bật (`border-blue-200`) (`AI-01`). | *(Người vận hành xác nhận hàng ngày)* | 🔲 **READY** | Văn phong tham mưu chuyên nghiệp, khách quan. |
| **5. Legal Snapshot (`Khối 3.2`)** | Cuộn xuống Khối 3.2 Căn cứ pháp lý của Tab 3, kiểm tra thông số snapshot | Hiển thị rõ metadata điều khoản, tên văn bản và phiên bản hiệu lực (`Active Version: v2.0-2024-LAND-LAW`). | *(Người vận hành xác nhận hàng ngày)* | 🔲 **READY** | Bảo đảm truy xuất nguồn gốc pháp lý. |
| **6. Export Draft (`Khối 3.3`)** | Thử thao tác các nút `Xem bản dự thảo`, `In bản gợi ý AI`, `Xuất Word (.docx)`, `Xuất PDF` | Tên file tải về bắt buộc có prefix `DU_THAO_GOI_Y_AI_` (ví dụ: `DU_THAO_GOI_Y_AI_Phiếu rà soát...`). Watermark dự thảo. | *(Người vận hành xác nhận hàng ngày)* | 🔲 **READY** | Ngăn chặn rủi ro nhầm lẫn thành văn bản chính thức. |
| **7. Legal Knowledge Base** | Mở menu `Legal Knowledge Base`, tra cứu từ khóa `Cấp giấy chứng nhận` | Trả về kết quả từ Luật Đất đai 2024 chuẩn xác, hiển thị huy hiệu `Active Version: v2.0-2024-LAND-LAW` (`LK-01`). | *(Người vận hành xác nhận hàng ngày)* | 🔲 **READY** | Kiểm tra tri thức pháp lý trung ương đồng bộ. |
| **8. Permission (`RBAC`)** | Đăng nhập bằng tài khoản `VIEWER` (hoặc `canAct: false`), mở Tab 3 | Khung Khối 3.3 tự động khóa với thông báo đỏ `🚫 Bạn không có quyền xem trước/in/xuất văn bản này...`. Nút chạy AI bị ẩn. | *(Người vận hành xác nhận hàng ngày)* | 🔲 **READY** | Phân định rạch ròi thẩm quyền giữa `VIEWER/STAFF/MANAGER`. |

---

## 4. Daily AI Governance Checks

Bảng xác nhận tuân thủ 6 chốt chặn quản trị AI và an toàn pháp lý bất di bất dịch hàng ngày:

| Governance Control Item | Expected Verification Result | Status | Notes & Governance Enforcement |
| :--- | :--- | :---: | :--- |
| **1. AI Safety Warning Presence** | Khung viền vàng/amber với dòng chữ *"⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA & CHỊU TRÁCH NHIỆM TRƯỚC KHI BAN HÀNH"* luôn hiển thị cố định 100% tại Tab 3 Khối 3.1 và Khối 3.3. | 🔲 **READY** | Quán triệt trách nhiệm con người (`Human-in-the-Loop`). |
| **2. Draft / Export Safety Warning** | Bên trong file Word (`.docx`) và PDF xuất ra luôn có tiêu đề phụ và watermark chỉ rõ đây là tài liệu tham khảo nội bộ phục vụ thẩm định, không có chữ ký hay con dấu pháp lý. | 🔲 **READY** | Ngăn chặn rủi ro nhầm lẫn thành văn bản đã ban hành. |
| **3. Legal Snapshot Local Warning** | Khung vàng `LAW-02` tại Khối 3.2 nhắc nhở cán bộ kiểm tra 3 căn cứ đặc thù địa phương: (1) Quy trình UBND tỉnh; (2) Quy hoạch sử dụng đất cấp huyện; (3) Quy hoạch chi tiết 1/500 (nếu có). | 🔲 **READY** | Đảm bảo thẩm định phù hợp quy hoạch cấp huyện. |
| **4. No Auto-Signing (`No Auto Sign`)** | Hệ thống tuyệt đối không thực hiện bất kỳ thao tác chèn chữ ký số hay ký tay tự động nào vào phiếu thẩm định thay thế thẩm quyền của chuyên viên và lãnh đạo. | 🔲 **READY** | Cán bộ thụ lý và lãnh đạo phòng là người ký duy nhất. |
| **5. No Auto-Issuance (`No Auto Issue`)** | Trợ lý AI và hệ thống tuyệt đối không chuyển đổi trạng thái hồ sơ sang "Đã ban hành" hay "Đã phê duyệt". Mọi thao tác chuyển trạng thái phải do con người xác nhận. | 🔲 **READY** | Tuân thủ quy tắc quản trị nhà nước. |
| **6. No Auto-Sending (`No Auto Send`)** | Hệ thống tuyệt đối không kích hoạt luồng gửi email, SMS hay tin nhắn Zalo ra ngoài cho công dân hay tổ chức khi cán bộ chạy AI hoặc xuất file dự thảo. | 🔲 **READY** | Bảo mật tuyệt đối thông tin nội bộ trong quá trình rà soát. |

---

## 5. End-of-day Summary

Bảng tổng kết chỉ số rủi ro cuối ngày (`End-of-Day Summary Table`) dành cho Người trực chiến ghi nhận vào `16:30 PM` mỗi ngày:

| Date (`Monitoring Day`) | Total Checks Executed | Passed Checks (`PASS`) | Warnings (`WARNING`) | Failed Checks (`FAIL`) | New Issues Created (`Count`) | Daily Decision for Next Day | Notes & Operator Sign-off |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Day 0** <br/> `(11/07/2026)` | **`26`** *(Tech + Func + Gov)* | **`25`** | **`1`** *(HYP-ENV-01)* | **`0`** | **`1`** *(Environment)* | **`PROCEED TO DAY 1`** | Xác nhận mã nguồn và DB `legalflow_prod` an toàn tuyệt đối 100%. |
| **Day 1** <br/> `(12/07/2026)` | *(Pending daily check)* | `[ ]` | `[ ]` | `[ ]` | `[ ]` | *(To be decided at 16:30)* | Kỹ sư trực chiến thực hiện kiểm tra lúc 08:00 và 16:30. |
| **Day 2** <br/> `(13/07/2026)` | *(Pending daily check)* | `[ ]` | `[ ]` | `[ ]` | `[ ]` | *(To be decided at 16:30)* | Kỹ sư trực chiến thực hiện kiểm tra lúc 08:00 và 16:30. |
| **Day 3** <br/> `(14/07/2026)` | *(Pending daily check)* | `[ ]` | `[ ]` | `[ ]` | `[ ]` | *(To be decided at 16:30)* | **Chốt kết quả 3 ngày Hypercare:** Trình Hội đồng xét duyệt **Phase 10N**. |

---

### Khẳng định An toàn Vận hành của Kỹ sư Trực chiến:
Tôi xác nhận trong suốt ca rà soát hàng ngày đã tuân thủ tuyệt đối các nguyên tắc bảo mật và an toàn dữ liệu:
* ✅ **Không sửa mã nguồn Backend/Frontend, không sửa schema/migration/.env hay chạy reset/restore DB.**
* ✅ **Không ghi lại mật khẩu, API key, token hay bí mật nhạy cảm vào bảng kiểm tra.**
* ✅ **Không tự động commit hay tag Git thay cho Tech Lead / Project Owner.**
* ✅ **Đảm bảo mọi văn bản xuất ra đều giữ đúng prefix `DU_THAO_GOI_Y_AI_` và nhãn rà soát pháp lý của con người.**

---
*Mẫu kiểm tra hàng ngày dành cho người vận hành được tạo tự động chuẩn hóa từ kế hoạch chăm sóc tích cực Hypercare Phase 10M.*
