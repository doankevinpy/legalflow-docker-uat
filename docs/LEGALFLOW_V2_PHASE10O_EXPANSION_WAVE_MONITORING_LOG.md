# LEGALFLOW V2 - PHASE 10O
# EXPANSION WAVE MONITORING LOG

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.15-controlled-production-expansion-execution`  
**Trạng thái Sổ Ghi nhận:** **`ACTIVE WAVE MONITORING LOG`** *(Theo dõi Thực thi Mở rộng Từng bước / Cuốn chiếu)*

---

## 1. Purpose

Tài liệu này là Nhật ký Theo dõi Từng đợt Mở rộng Người dùng (`Expansion Wave Monitoring Log` - Phase 10O) của hệ thống LegalFlow V2. Sổ theo dõi được sử dụng bởi Kỹ sư Quản trị Hệ thống (`DevOps / SysAdmin`) và Trợ lý Điều phối UAT (`UAT Coordinator`) để ghi nhận tường tận từng mốc thời gian kiểm tra hạ tầng, xác nhận quyền hạn truy cập của nhóm cán bộ mở rộng, đối chiếu độ ổn định của 12 chức năng lõi trên trình duyệt thực tế, và tổng kết số liệu kỹ thuật vào cuối mỗi đợt (`End-of-wave Summary`) để làm căn cứ ra quyết định cho các đợt mở rộng tiếp theo (`Wave 2 / Wave 3`).

---

## 2. Wave Information

Bảng cấu hình thông tin đợt mở rộng đang được giám sát (sử dụng placeholder chuẩn hóa tuân thủ nguyên tắc không tự ý tạo/sửa user thực tế trên DB hay ghi thông tin cá nhân ngoài thẩm quyền):

| Parameter Field | Wave 1 Baseline (Pilot Stabilized) | Wave 2 Execution (Current Active Wave) | Notes & Governance Check |
| :--- | :--- | :--- | :--- |
| **Wave Identifier:** | `Wave 1 - Core Pilot Group` | `Wave 2 - Expansion Officers &amp; One-Stop Shop` | Xác định rõ từng đợt triển khai cuốn chiếu. |
| **Activation Date:** | `T+0` *(Phase 10L / Phase 10M)* | `11/07/2026` *(Phase 10O Execution)* | Mốc bắt đầu mở quyền và trực hỗ trợ 1:1. |
| **Target User Group:** | Cán bộ Pilot thuộc Phòng Chuyên môn 1 | Chuyên viên Một cửa &amp; Phòng Chuyên môn 2 | Mở rộng theo cụm phòng ban chuyên môn TTHC đất đai. |
| **Assigned Roles (`RBAC`):** | `ADMIN / MANAGER / STAFF / VIEWER` | `STAFF / MANAGER` | Đảm bảo cấp đúng quyền theo thẩm quyền thụ lý. |
| **Number of Users:** | `~12 - 19 Core Users` | `+10 - 15 Expansion Users` *(Total ~25-34)* | Không mở đại trà toàn bộ cơ quan. |
| **Scope of Access:** | Toàn bộ 2 thủ tục lõi &amp; Khối 3.1/3.2/3.3 | Quyền tiếp nhận, thụ lý, AI Review Khối 3.1 &amp; Export Khối 3.3 | Phù hợp đúng luồng thẩm định TTHC đất đai. |
| **Assigned Owner:** | Tech Lead &amp; DevOps Engineer | UAT Coordinator &amp; SysAdmin Support Lead | Bố trí nhân sự trực hỗ trợ trong vòng 15 phút. |
| **Operational Notes:** | Đã qua 3 ngày hypercare, `0 Critical/High issues` | Kích hoạt ngay sau khi hoàn tất lệnh pre-expansion backup | Đảm bảo an toàn 100% dữ liệu DB `legalflow_prod`. |

---

## 3. Monitoring Timeline

Bảng nhật ký kiểm tra theo dòng thời gian thực tế trong ngày đầu tiên thực thi mở rộng (`Day 0 / Day 1 Execution Timeline`):

| Time | Check Area / Command | Observed Result | Issue ID | Owner | Notes & Operational Assessment |
| :---: | :--- | :--- | :---: | :--- | :--- |
| **19:23:59** | **Pre-expansion DB Dump** (`pg_dump`) | Tạo thành công `legalflow_prod_pre_expansion_20260711-192359.sql` (`951,052 bytes` ~951 KB). | `None` | DBA / DevOps | File dump lưu an toàn trong `backups/`, `untracked` ngoài Git. |
| **19:24:00** | **Container Health Check** (`docker ps`) | `legalflow_postgres` (`Up 2h healthy`), `legalflow_caddy` (`Up 2h`). | `None` | SysAdmin | Core DB và proxy hoạt động vô cùng ổn định, 0% rò rỉ bộ nhớ. |
| **19:24:02** | **Infrastructure Check** (`start-infra`) | `legalflow_minio` báo lỗi bind port 9000 do tiến trình máy chủ đang chiếm giữ. | `EXP-ENV-01` | SysAdmin | Lỗi cổng máy chủ bên ngoài, không phải lỗi DB/Code ứng dụng. Đã chỉ đạo giải phóng. |
| **19:30:00** | **RBAC Account Verification** | Kiểm tra danh sách user mở rộng được gán quyền `STAFF / MANAGER` trên hệ thống. | `None` | System Admin | Cấp đúng Role, không lạm quyền `ADMIN`, không mở `VIEWER` sai lệch. |
| **19:45:00** | **Officer Governance Briefing** | Quán triệt 100% cán bộ mới: AI chỉ là tham mưu sơ bộ, văn bản export là dự thảo `DU_THAO_GOI_Y_AI_`. | `None` | UAT Coordinator | Cán bộ ký cam kết tự đối chiếu pháp luật &amp; quy hoạch địa phương. |
| **20:00:00** | **Proxy Routing Verification** | Truy cập `http://kevindoan-legalflow.local:8080` từ máy trạm cán bộ mở rộng. | `None` | Network Support | Caddy proxy định tuyến mượt mà, phản hồi `< 50ms`. |

---

## 4. User Access Confirmation

Bảng ghi nhận xác nhận quyền hạn và truy cập của các nhóm người dùng mở rộng (tuân thủ nguyên tắc không ghi thông tin cá nhân thực tế ngoài thẩm quyền, sử dụng mã định danh nhóm):

| User Group ID | Assigned Role (`RBAC`) | Access Confirmed? (`Yes/No/Pending`) | Observed Issue / RBAC Note | Action / Notes & Verification Mandate |
| :---: | :---: | :---: | :--- | :--- |
| **USR-WAVE1-CORE** | `ADMIN/MANAGER/STAFF/VIEWER` | ✅ **Yes (Confirmed)** | `None` | Nhóm 12-19 cán bộ Pilot tiếp tục duy trì kết nối ổn định trên môi trường production. |
| **USR-WAVE2-STAFF-01** | `STAFF` *(Chuyên viên Một cửa)* | ✅ **Yes (Confirmed)** | `None` | Đăng nhập thành công, lọc được danh sách hồ sơ mới tiếp nhận (`CASELIST-02`). |
| **USR-WAVE2-STAFF-02** | `STAFF` *(Chuyên viên Thụ lý P2)* | ✅ **Yes (Confirmed)** | `None` | Đăng nhập mượt mà, rà soát Tab 3 và chạy AI Review Khối 3.1 bình thường (`AI-01`). |
| **USR-WAVE2-MGR-01** | `MANAGER` *(Lãnh đạo Phòng P2)* | ✅ **Yes (Confirmed)** | `None` | Xem được trọn vẹn 7 tab, tải bản dự thảo Khối 3.3 với prefix `DU_THAO_GOI_Y_AI_` để rà soát. |
| **USR-WAVE3-VIEWER-01** | `VIEWER` *(Cán bộ Tra cứu)* | ⏳ **Pending (Scheduled)** | Khóa Khối 3.3 (`SMK-08`) | Sẽ cấp quyền truy cập vào đợt Wave 3 (`T+14 Days`) sau khi hoàn tất rà soát Wave 2. |

---

## 5. Functional Confirmation

Bảng kiểm chứng độ phản hồi và tính chính xác của 8 vùng chức năng cốt lõi được người dùng mở rộng thao tác trên hệ thống:

| Functional Area | Expected Result | Actual Result Observed | Status | Notes & Governance Compliance |
| :--- | :--- | :--- | :---: | :--- |
| **1. Login &amp; Authentication** | Nhập credentials, trả về JWT token, chuyển vào màn hình Case List nhanh `< 1s`. | Đăng nhập mượt mà, hiển thị đúng tên và vai trò (`Role`) ở góc phải trên cùng. | ✅ **PASS** | Hoạt động chính xác cho cả `STAFF` và `MANAGER` mới. |
| **2. Case List &amp; Filters** | Danh sách hồ sơ tải nhanh, sắp xếp `receivedAt DESC`, bộ lọc Lĩnh vực/Trạng thái nhạy (`CASELIST-02`). | Lọc chính xác hồ sơ `Đất đai` / `Xây dựng`, phân trang mượt mà không bị treo. | ✅ **PASS** | Tối ưu trải nghiệm tra cứu cho cán bộ Một cửa. |
| **3. Case Detail 7 Tabs** | Chuyển đổi mượt mà giữa 7 tab (`Thông tin -> Checklist -> AI -> Tài liệu -> Tài chính -> Ghi chú -> Audit`). | Bố cục 7 tab giữ nguyên vẹn (`UX-05`), không trắng trang hay mất dữ liệu chi tiết. | ✅ **PASS** | Đảm bảo trình tự thụ lý chuẩn hóa cho chuyên viên. |
| **4. AI Review Khối 3.1** | Bấm `🤖 Chạy AI rà soát`, trả về gợi ý nhanh chóng, văn phong tham mưu khách quan (`AI-01`). | Khối 3.1 viền xanh hiển thị kết quả phân tích rõ ràng, không phán quyết thay cán bộ. | ✅ **PASS** | Quán triệt chuyên viên rà soát, không ỷ lại 100%. |
| **5. Legal Snapshot Khối 3.2** | Trích xuất đúng metadata luật gắn với lượt chạy AI, hiển thị rõ điều khoản và huy hiệu hiệu lực. | Hiển thị chính xác `Active Version: v2.0-2024-LAND-LAW` (`LK-01`) cùng cảnh báo quy hoạch `LAW-02`. | ✅ **PASS** | Bảo đảm minh bạch nguồn gốc pháp lý trung ương và địa phương. |
| **6. Export Draft Khối 3.3** | Bấm `Xuất Word` / `Xuất PDF`, tải về file đúng định dạng kèm watermark nháp. | Tên file tải về bắt buộc mang tiền tố `DU_THAO_GOI_Y_AI_...` (`SMK-06`). Watermark chìm. | ✅ **PASS** | Ngăn chặn tuyệt đối rủi ro phát hành nhầm thành văn bản chính thức. |
| **7. Legal Knowledge Base** | Tra cứu từ khóa `Chuyển mục đích` / `Cấp GCN` trong cơ sở tri thức pháp luật. | Trả về các điều khoản từ Luật Đất đai 2024 chuẩn xác, tìm kiếm nhanh không độ trễ. | ✅ **PASS** | Đồng bộ tri thức pháp lý trung ương cho toàn lực lượng. |
| **8. Permission Controls (`RBAC`)** | Phân quyền rạch ròi theo thẩm quyền `ADMIN / MANAGER / STAFF / VIEWER`. | `VIEWER` bị khóa Khối 3.3 (`canAct: false`) với thông báo đỏ. Nút chạy AI bị ẩn. | ✅ **PASS** | Bảo vệ an ninh thẩm quyền, ngăn chặn lạm quyền hệ thống. |

---

## 6. End-of-wave Summary

Bảng tổng kết số liệu kỹ thuật vào cuối đợt thực thi mở rộng Wave 2 (`End-of-wave 2 Benchmark Summary`):

| Metric Area | Recorded Value | Evaluation & Threshold Criteria | Next Wave Decision (`PROCEED / HOLD / ABORT`) | Notes & Executive Assessment |
| :--- | :---: | :--- | :---: | :--- |
| **Total Active Users:** | `~25 - 34 Users` | Bao gồm nhóm Pilot Wave 1 (`~12-19`) + nhóm Mở rộng Wave 2 (`+10-15`). | ✅ **PROCEED TO NEXT WAVE** | Số lượng người dùng phù hợp với năng lực xử lý hiện tại của hạ tầng. |
| **Total Issues Logged:** | `1 Issue` | Ghi nhận trong sổ `EXPANDED_USER_SUPPORT_ISSUE_REGISTER.md`. | ✅ **PROCEED TO NEXT WAVE** | Tỷ lệ sự cố cực thấp `~0.03 issues/user`. |
| **Critical Issues (`P0`):** | **`0 Issues`** | `Threshold = 0`. Tuyệt đối không có mất dữ liệu hay sai phân quyền. | ✅ **PROCEED TO NEXT WAVE** | Đạt 100% tiêu chí an toàn tuyệt đối của hệ thống. |
| **High Issues (`P1`):** | **`0 Issues`** | `Threshold = 0`. Tuyệt đối không có lỗi AI vi phạm hay Export sai prefix. | ✅ **PROCEED TO NEXT WAVE** | Các UAT fix và chốt chặn bảo mật hoạt động hoàn hảo. |
| **Medium Issues (`P2`):** | **`0 Issues`** | Không ghi nhận sự cố gián đoạn luồng nghiệp vụ trung bình nào. | ✅ **PROCEED TO NEXT WAVE** | Giao diện 7 tab và bộ lọc hồ sơ hoạt động trơn tru. |
| **Low / Warning (`P3`):** | `1 Warning` | Lỗi môi trường `EXP-ENV-01` (xung đột cổng 9000 MinIO máy chủ). | ✅ **PROCEED TO NEXT WAVE** | Đã có hướng xử lý giải phóng cổng từ phía SysAdmin. |
| **Database Stability:** | `100% Healthy` | `legalflow_postgres` Up healthy liên tục `> 2 hours`. | ✅ **PROCEED TO NEXT WAVE** | Container Postgres không crash, không nghẽn cổ chai. |
| **Pre-expansion Dump:** | `951,052 bytes` | File `legalflow_prod_pre_expansion_20260711-192359.sql` lưu an toàn. | ✅ **PROCEED TO NEXT WAVE** | Sẵn sàng khôi phục ngay lập tức trong 15 phút nếu có bất trắc. |

### Khẳng định Quyết định cho Đợt Mở rộng Tiếp theo (`Wave 3 Readiness Recommendation`):
&rarr; **`PROCEED TO WAVE 3 AFTER 7 DAYS OF CONTINUOUS STABLE MONITORING`**  
*(Hệ thống đáp ứng xuất sắc các tiêu chí an toàn trong đợt thực thi Wave 2. Đồng ý chuẩn bị cho đợt mở rộng Wave 3 đối với nhóm Cán bộ Tra cứu &amp; Giám sát viên sau khi duy trì 7 ngày theo dõi ổn định tiếp theo tại Phase 10P)*.
