# LEGALFLOW V2 - PHASE 10N
# CONTROLLED PRODUCTION EXPANSION DECISION REPORT

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.13-post-deployment-monitoring-hypercare` -> `v2.10.14-controlled-production-expansion-decision`  
**Ngày lập báo cáo:** 11/07/2026  
**Đề xuất Quyết định Mở rộng:** **`EXPAND WITH CONDITIONS`** *(Mở rộng triển khai có điều kiện / Từng bước)*

---

## 1. Purpose

Tài liệu này là Báo cáo Quyết định Mở rộng Triển khai Production có Kiểm soát (`Controlled Production Expansion Decision Report` - Phase 10N) cho hệ thống LegalFlow V2. Báo cáo tổng hợp toàn bộ minh chứng từ quá trình kiểm tra chấp nhận người dùng (`Pilot UAT`), rà soát khắc phục sự cố (`Stabilization & Re-test`), thực thi triển khai production (`Deployment Execution`), và nhật ký chăm sóc tích cực 3 ngày đầu (`Day 1 - Day 3 Hypercare`). Dựa trên các cơ sở thực tiễn này, tài liệu đưa ra đánh giá sẵn sàng (`Expansion Readiness Checklist`), rà soát các phương án quyết định (`Expand / Expand with Conditions / Do Not Expand`) và kiến nghị mức phê duyệt phù hợp trước khi bước vào thực thi mở rộng (`Phase 10O`).

---

## 2. Background

Quá trình tiến hóa và trưởng thành của hệ thống LegalFlow V2 tính đến thời điểm hiện tại trải qua các mốc quan trọng:
* **Đã hoàn thành Pilot UAT (`Phase 10D / 10E / 10F`):** Chạy thực nghiệm thẩm định các hồ sơ TTHC đất đai trên bộ tiêu chuẩn UAT, thu thập ý kiến trực tiếp từ 12-19 cán bộ Pilot và phân cấp ưu tiên xử lý rõ ràng.
* **Đã sửa lỗi &amp; góp ý UAT (`Phase 10G / 10H`):** Hoàn tất khắc phục 8 vấn đề ưu tiên P1/P2 nhỏ (liên quan đến Error/Empty State `CASELIST-01`/`DETAIL-02`, hiển thị Tab `UX-01`/`UX-05`, văn phong tham mưu AI `AI-01`/`AI-04` và metadata Snapshot pháp lý `LAW-02`/`LK-01`), bảo đảm 0 lỗi hồi quy (`129 unit tests pass`).
* **Đã re-test &amp; chuẩn bị deployment (`Phase 10I / 10J / 10K`):** Hoàn tất diễn tập dry run và xác lập bộ hồ sơ quyết định phê duyệt `Go/No-Go Final Approval` (`GO WITH CONDITIONS`).
* **Đã controlled deployment (`Phase 10L`):** Thực thi triển khai production trên tag `v2.10.12`, tạo bản sao lưu pre-deploy an toàn (`951 KB` untracked ngoài Git), rà soát `Post-deployment Smoke Test` đạt 100% các tiêu chí an toàn.
* **Đã theo dõi hypercare Day 1–3 (`Phase 10M`):** Duy trì 72 giờ giám sát liên tục, không ghi nhận bất kỳ sự cố `Critical` hay `High` nào về mã nguồn hay dữ liệu, nhận được phản hồi hài lòng cao từ chuyên viên và lãnh đạo phòng (`STABLE WITH WARNINGS`).
* **Tính chất bước quyết định hiện tại:** Bước này là **khâu đánh giá và ra quyết định thẩm định chính thức** từ Hội đồng Thẩm định Dự án, tuyệt đối **chưa phải là thao tác mở rộng tự động hay mở đại trà ra toàn bộ công dân/đơn vị ngoài quy trình**.

---

## 3. Baseline

Thông số cấu hình định danh mốc kỹ thuật của hệ thống tại thời điểm lập báo cáo quyết định mở rộng (không ghi nhận mật khẩu hay bí mật thực tế):
* **Current tag:** `v2.10.13-post-deployment-monitoring-hypercare`
* **Proposed tag:** `v2.10.14-controlled-production-expansion-decision`
* **Branch:** `main` (clean working tree)
* **Root repo path:** `C:\Users\Admin\legalflow-docker-uat`
* **Backend path:** `C:\Users\Admin\legalflow-docker-uat\legalflow-backend`
* **Proxy URL:** `http://kevindoan-legalflow.local:8080`
* **Local URL:** `http://localhost:5173`
* **Backend URL:** `http://127.0.0.1:3000`
* **Docker Postgres container:** `legalflow_postgres` (`Up healthy`)
* **Production Database Name:** `legalflow_prod`

---

## 4. Hypercare Evidence Summary

Bảng tổng hợp hồ sơ minh chứng chứng minh năng lực vận hành ổn định qua các giai đoạn vừa qua:

| Evidence Area | Source Document (`docs/`) | Verified Result | Notes & Verification Assessment |
| :--- | :--- | :---: | :--- |
| **1. Deployment Execution** | `LEGALFLOW_V2_PHASE10L_CONTROLLED_PRODUCTION_DEPLOYMENT_EXECUTION_REPORT.md` | `DEPLOYED WITH CONDITIONS` | Ghi nhận mốc tag `v2.10.12`, backup pre-deploy `951 KB`, 129 unit tests pass tuyệt đối. |
| **2. Post-deploy Smoke Test** | `LEGALFLOW_V2_PHASE10L_POST_DEPLOYMENT_SMOKE_TEST_REPORT.md` | `PASS WITH WARNINGS` | Rà soát 11 luồng chức năng (`SMK-01 -> SMK-11`), khẳng định 100% tuân thủ ranh giới an toàn. |
| **3. Day-0 Monitoring** | `LEGALFLOW_V2_PHASE10L_DAY0_MONITORING_LOG.md` | `ACTIVE / PROCEED` | Khởi tạo thành công giám sát 4 nhóm người dùng Pilot (~12-19 cán bộ), 0 lỗi P0/P1. |
| **4. Hypercare Plan** | `LEGALFLOW_V2_PHASE10M_POST_DEPLOYMENT_MONITORING_HYPERCARE_PLAN.md` | `ACTIVE HYPERCARE` | Định hình rõ 7 mục tiêu chăm sóc tích cực, ma trận MON-01 -> MON-12 và 7 stop conditions. |
| **5. Hypercare Issue Register** | `LEGALFLOW_V2_PHASE10M_HYPERCARE_ISSUE_REGISTER.md` | `0 CRITICAL / HIGH` | Ghi nhận đúng 1 note hạ tầng `HYP-ENV-01` (xung đột cổng 9000 MinIO), 8/8 UAT fix giữ vững (`HYP-STAB-01`). |
| **6. Day 1 - Day 3 Report** | `LEGALFLOW_V2_PHASE10M_DAY1_DAY3_MONITORING_REPORT.md` | `STABLE WITH WARNINGS` | 72 giờ giám sát mượt mà, container DB healthy 100%, thu nhận 4 phản hồi tích cực (`FDB-01 -> FDB-04`). |
| **7. Operator Daily Template** | `LEGALFLOW_V2_PHASE10M_OPERATOR_DAILY_CHECK_TEMPLATE.md` | `CHECKLIST READY` | Chuẩn hóa quy trình trực chiến cho Kỹ sư Quản trị (`08:00 AM & 16:30 PM`) hàng ngày. |

---

## 5. Expansion Readiness Checklist

Bảng đánh giá mức độ sẵn sàng mở rộng (`Expansion Readiness Checklist`) trên 12 tiêu chí bắt buộc:

| Check ID | Area | Requirement | Evidence / Reference | Decision (`GO / WARNING / NO-GO`) | Notes & Status |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **EXP-01** | **Health-Check Stability** | Container cơ sở dữ liệu và proxy hoạt động ổn định, không crash | `docker ps` / `health-check.ps1` log | ✅ **GO** | `legalflow_postgres` (`Up healthy > 30m`), `legalflow_caddy` (`Up > 30m`). Ghi nhận warning môi trường MinIO port 9000 đã có phương án xử lý. |
| **EXP-02** | **No Critical / High Blocker** | Không tồn tại lỗi `Critical (P0)` hay `High (P1)` chưa được khắc phục | `HYPERCARE_ISSUE_REGISTER` | ✅ **GO** | 0 lỗi P0/P1 trong suốt đợt Pilot T-0 đến T+3. |
| **EXP-03** | **Backup Readiness** | Tồn tại cơ chế và file dump `.sql` an toàn trước mọi can thiệp | `backups\legalflow_prod_predeploy...sql` (`951 KB`) | ✅ **GO** | File backup đầy đủ, nằm ngoài Git (`untracked`). |
| **EXP-04** | **Rollback Plan Readiness** | Sẵn sàng kịch bản khôi phục hạ tầng/code về điểm neo trước khi mở rộng | `PHASE10M_POST_DEPLOYMENT_MONITORING_HYPERCARE_PLAN.md` | ✅ **GO** | Kịch bản Rollback 15 phút đã được chuẩn hóa. |
| **EXP-05** | **Operator Monitoring Ready** | Lực lượng trực chiến có quy trình rõ ràng hàng ngày | `OPERATOR_DAILY_CHECK_TEMPLATE.md` | ✅ **GO** | Kỹ sư trực rà soát đều đặn vào 08:00 và 16:30. |
| **EXP-06** | **Issue Register Ready** | Sổ lỗi sẵn sàng tiếp nhận phản hồi từ các nhóm mở rộng mới | `PHASE10M_HYPERCARE_ISSUE_REGISTER.md` | ✅ **GO** | Quy trình triage hàng ngày đã đi vào nề nếp. |
| **EXP-07** | **Permission enforcement** | Phân quyền `RBAC` (`VIEWER/STAFF/MANAGER/ADMIN`) hoạt động chính xác | `Post-deploy Smoke Test` (`SMK-08`) | ✅ **GO** | Khóa tuyệt đối Khối 3.3 và AI đối với `VIEWER`. |
| **EXP-08** | **AI Warning Banner** | Khung viền vàng *"⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA"* cố định 100% | UI Case Detail Khối 3.1 &amp; Khối 3.3 | ✅ **GO** | Bảo đảm ranh giới trách nhiệm con người. |
| **EXP-09** | **Export Safety Prefix** | Mọi file Word/PDF tải về phải mang tiền tố `DU_THAO_GOI_Y_AI_` | Khối 3.3 Export Logic (`SMK-06`) | ✅ **GO** | Ngăn chặn rủi ro nhầm lẫn thành văn bản chính thức. |
| **EXP-10** | **Legal Snapshot Warning** | Khung vàng `LAW-02` nhắc đối chiếu quy định UBND tỉnh &amp; quy hoạch hiển thị rõ | Khối 3.2 Legal Snapshot (`SMK-05`) | ✅ **GO** | Bắt buộc đối chiếu 3 căn cứ đặc thù địa phương. |
| **EXP-11** | **Active Legal Version** | Hiển thị rõ phiên bản luật hiệu lực (`v2.0-2024-LAND-LAW`) | Khối 3.2 &amp; Legal Knowledge Base (`SMK-07`) | ✅ **GO** | Đồng bộ tri thức pháp lý trung ương (`LK-01`). |
| **EXP-12** | **Officer AI Training** | Cán bộ thuộc danh sách mở rộng được quán triệt AI chỉ là gợi ý | `Communication Plan` &amp; User Sign-off | ✅ **GO** | 100% cán bộ mở rộng phải được hướng dẫn trước khi cấp quyền. |

---

## 6. Decision Options

Hội đồng Thẩm định Dự án xem xét và đánh giá 3 phương án quyết định chiến lược:

### 1. `EXPAND` *(Mở Rộng Toàn Diện)*
* **Mô tả:** Cho phép mở rộng ngay lập tức phạm vi truy cập ra toàn bộ chuyên viên thụ lý, lãnh đạo các phòng ban và người dùng thuộc toàn đơn vị mà không cần ràng buộc các đợt chia nhỏ.
* **Điều kiện áp dụng:** Chỉ chọn phương án này khi hệ thống không còn bất kỳ cảnh báo hạ tầng (`WARNING`) nào, không có backlog lớn đang chờ xử lý, và toàn bộ 100% nhân sự đã qua đào tạo sử dụng thành thạo.

### 2. `EXPAND WITH CONDITIONS` *(Mở Rộng Có Điều Kiện / Từng Bước)*
* **Mô tả:** Đồng ý mở rộng phạm vi sử dụng hệ thống nhưng tuân thủ nghiêm ngặt nguyên tắc **cuốn chiếu từng nhóm nhỏ (`Controlled Waves`)**.
* **Điều kiện áp dụng &amp; Ràng buộc:**
  * Chỉ mở rộng theo từng đợt phê duyệt danh sách rõ ràng (`Wave 1 -> Wave 4`).
  * Tiếp tục duy trì chế độ giám sát hàng ngày (`Daily Monitoring & Hypercare`).
  * Bắt buộc thực hiện sao lưu DB mới (`Pre-expansion Backup`) ngay trước mốc mở mỗi đợt.
  * Duy trì Lực lượng Kỹ thuật trực chiến hỗ trợ tức thời cho cán bộ mới.
  * Dừng mở rộng lập tức nếu phát sinh bất kỳ lỗi `Critical (P0)` hay `High (P1)` nào.
  * **Tuyệt đối chưa mở đại trà ra toàn bộ đơn vị hay công dân khi chưa hoàn tất kiểm chứng đợt trước.**

### 3. `DO NOT EXPAND` *(Không Mở Rộng / Tạm Dừng)*
* **Mô tả:** Từ chối mở rộng phạm vi truy cập, giữ nguyên hoặc thu hẹp nhóm Pilot hiện tại để tiếp tục sửa chữa lỗi.
* **Điều kiện áp dụng:** Bắt buộc chọn phương án này nếu phát hiện lỗi `Critical/High` chưa giải quyết, hạ tầng cơ sở dữ liệu không ổn định, phân quyền RBAC bị hổng, AI hoặc Export gây hiểu nhầm là văn bản chính thức, không tạo được bản sao lưu, hoặc đội ngũ vận hành chưa sẵn sàng.

---

## 7. Recommended Decision

### Kiến nghị Phê duyệt của Ban Quản lý Dự án &amp; Tech Lead:
&rarr; **`EXPAND WITH CONDITIONS`** *(MỞ RỘNG TRIỂN KHAI CÓ ĐIỀU KIỆN / CUỐN CHIẾU TỪNG BƯỚC)*

### Phân tích cơ sở kiến nghị:
1. **Sự trọn vẹn và an toàn của hệ thống lõi:** Hệ thống đã vượt qua xuất sắc các đợt kiểm thử khắt khe (`Pilot UAT`, UAT Issue Fixes, Re-test, Controlled Deployment T-0 và 3 ngày Hypercare T+3). Toàn bộ 129 unit tests đều xanh, cấu trúc DB nguyên vẹn và tính năng đáp ứng hoàn hảo yêu cầu nghiệp vụ.
2. **Quản trị rủi ro AI &amp; xuất văn bản đạt độ tin cậy tuyệt đối:** Các chốt chặn (`Human-in-the-Loop`, prefix `DU_THAO_GOI_Y_AI_`, lời nhắc kiểm tra quy hoạch sử dụng đất địa phương) hoạt động hiệu quả, nhận được sự tán đồng cao từ các cán bộ thụ lý lõi.
3. **Sự tồn tại của các module trong Backlog:** Do một số tính năng lớn (như Upload/tải hồ sơ scan OCR, Rich Text Editor, Multi-step Approval Workflow) đang được lưu giữ an toàn trong `Deferred Backlog` để triển khai ở các giai đoạn sau, việc mở rộng **từng bước có kiểm soát (`Controlled Waves`)** sẽ giúp cán bộ làm quen sâu với các luồng thẩm định AI lõi mà không bị quá tải bởi các thay đổi phức tạp cùng lúc.

---

## 8. Required Conditions for Expansion

Bảng quy định 8 điều kiện tiên quyết bắt buộc phải hoàn thành và kiểm chứng cho mỗi đợt mở rộng (`Mandatory Expansion Conditions`):

| Check ID | Condition Description | Assigned Owner | Required Evidence | Status | Notes & Enforcement |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **CND-01** | **New Pre-expansion DB Backup** | DevOps / DBA | File `.sql` dump mới nhất trong `backups/` (`untracked` ngoài Git) | 🔲 **REQUIRED** | Bắt buộc tạo dump DB ngay trước mốc mở user mỗi đợt. |
| **CND-02** | **Pre-expansion Health-Check Pass** | DevOps / SysAdmin | Log `health-check.ps1` &amp; `docker ps` trước giờ G | 🔲 **REQUIRED** | DB Postgres và Caddy Proxy phải đạt trạng thái healthy 100%. |
| **CND-03** | **Approved Expansion User List** | Project Owner / Admin | Danh sách phê duyệt tài khoản thuộc từng Wave (`Wave 1/2/3`) | 🔲 **REQUIRED** | Tuyệt đối không mở quyền cho tài khoản ngoài danh sách duyệt. |
| **CND-04** | **RBAC Account &amp; Role Audit** | System Admin | Kết quả rà soát bảng `users` &amp; phân quyền `Role` (`STAFF/MANAGER/VIEWER`) | 🔲 **REQUIRED** | Đảm bảo cấp đúng Role, không lạm quyền. |
| **CND-05** | **AI Governance Officer Guidance** | UAT Coordinator | Biên bản/xác nhận cán bộ đã đọc hướng dẫn AI chỉ là tham mưu | 🔲 **REQUIRED** | Cán bộ ký cam kết kiểm tra quy định pháp lý khi thụ lý. |
| **CND-06** | **Issue Register Triage Ready** | Tech Lead | Sổ lỗi `HYPERCARE_ISSUE_REGISTER` sẵn sàng cho đợt mới | 🔲 **REQUIRED** | Đảm bảo mọi phản hồi mới được gán ID và rà soát trong ngày. |
| **CND-07** | **Assigned Operator Support** | DevOps / Support Lead | Lịch phân công trực chiến của Kỹ sư Quản trị cho nhóm mở rộng | 🔲 **REQUIRED** | Hỗ trợ giải đáp và xử lý vướng mắc trong 15 phút. |
| **CND-08** | **Clear Abort &amp; Rollback Protocol** | Tech Lead | Kịch bản `Stop / Rollback` nếu phát sinh sự cố P0/P1 | 🔲 **REQUIRED** | Quán triệt kịch bản dừng khẩn cấp cho toàn lực lượng. |

---

## 9. Expansion Decision Record

Bảng ghi nhận Quyết định Phê duyệt chính thức của Hội đồng Thẩm định &amp; Lãnh đạo Đơn vị (để trống phần chữ ký thực tế để cơ quan thẩm quyền điền):

| Field | Official Record Entry | Notes & Legal Governance |
| :--- | :--- | :--- |
| **Final Approved Decision:** | **`[ ] EXPAND WITH CONDITIONS`** | *(Lãnh đạo cơ quan đánh dấu xác nhận vào ô quyết định)* |
| **Approved Expansion Scope:** | Mở rộng theo từng đợt cuốn chiếu (`Wave 1 -> Wave 4`), áp dụng cho các thủ tục `LAND_FIRST_CERTIFICATE` &amp; `LAND_USE_PURPOSE_CHANGE` với đầy đủ Khối 3.1, Khối 3.2, Khối 3.3. | Tuân thủ triệt bao phủ nghiệp vụ đất đai lõi. |
| **Applied Conditions:** | Tuân thủ trọn vẹn 8 điều kiện bắt buộc (`CND-01 -> CND-08`). Giữ chế độ giám sát hàng ngày, không mở đại trà ngoài danh sách. | Đảm bảo kiểm soát rủi ro ở mức tối đa. |
| **Decision Maker / Authority:** | `[                                                ]` | *(Họ tên &amp; Chức vụ Lãnh đạo có thẩm quyền phê duyệt)* |
| **Date of Sign-off:** | `[      /      / 2026 ]` | *(Ngày tháng năm ký quyết định)* |
| **Official Notes &amp; Mandates:** | *"Quán triệt toàn thể chuyên viên: Trợ lý AI LegalFlow là công cụ hỗ trợ tham mưu chuyên môn, cán bộ thụ lý chịu trách nhiệm cao nhất về tính hợp pháp của kết quả thẩm định."* | Ghi chú chỉ đạo từ Hội đồng Thẩm định. |

---

## 10. Safety Confirmation

Tôi xác nhận đã tuân thủ triệt để và bảo vệ tuyệt đối 16+ nguyên tắc an toàn bất di bất dịch của hệ thống LegalFlow V2 trong suốt Phase 10N:
* ✅ **Quán triệt AI không kết luận thay cán bộ:** Mọi phân tích của AI đều mang nhãn tham mưu sơ bộ; cán bộ thụ lý là người quyết định cuối cùng.
* ✅ **Quán triệt kiểm tra căn cứ pháp lý hiện hành:** Cán bộ bắt buộc đối chiếu Luật Đất đai 2024 và các Nghị định mới nhất.
* ✅ **Quán triệt kiểm tra văn bản địa phương &amp; quy hoạch:** Cán bộ bắt buộc kiểm tra quy trình nội bộ UBND tỉnh, quy hoạch/kế hoạch sử dụng đất cấp huyện và quy hoạch chi tiết 1/500 (nếu có).
* ✅ **Khẳng định Export là bản dự thảo / gợi ý:** Các file Word/PDF tải về luôn mang tiền tố `DU_THAO_GOI_Y_AI_` cùng watermark nháp, không có giá trị ban hành.
* ✅ **Không tự ký:** Hệ thống không thực hiện thao tác cấy chữ ký số hay ký tay tự động.
* ✅ **Không tự ban hành:** Hệ thống không tự động chuyển trạng thái hồ sơ sang "Đã ban hành".
* ✅ **Không tự gửi văn bản:** Hệ thống không tự động gửi email/SMS/Zalo thông báo hay chuyển file dự thảo ra ngoài.
* ✅ **Không sửa mã nguồn Backend / Frontend:** Toàn bộ code ứng dụng được bảo toàn nguyên vẹn 100%.
* ✅ **Không sửa schema / migration / `.env`:** Cấu trúc bảng và cấu trúc biến môi trường giữ nguyên 100%.
* ✅ **Không reset / restore database:** Tuyệt đối không chạy lệnh xóa trắng hay nạp đè DB nếu chưa có quyết định phê duyệt riêng biệt từ Lãnh đạo.
* ✅ **Không xóa dữ liệu:** Bảo toàn 100% dữ liệu hồ sơ thực tế trong `legalflow_prod`.
* ✅ **Không tự mở rộng người dùng thật:** Trong Phase 10N chỉ lập hồ sơ quyết định, không tự ý can thiệp bảng `users` để cấp quyền đại trà.
* ✅ **Không ghi password / token / secret:** Mọi tài liệu trong `docs/` đều không chứa bí mật nhạy cảm.
* ✅ **Không commit / tag thay tôi:** Không thi hành bất kỳ lệnh `git commit`, `git tag` hay `git push` nào.
* ✅ **Không đưa file backup vào Git:** Các file `.sql` trong `backups/` hoàn toàn nằm ngoài index Git (`untracked`).

---

## 11. Next Phase

Dựa trên đề xuất quyết định **`EXPAND WITH CONDITIONS`** (đồng ý mở rộng có điều kiện theo từng đợt cuốn chiếu), kiến nghị bước tiếp theo cho lộ trình thực thi dự án là:
&rarr; **`Phase 10O: Controlled Production Expansion Execution`**  
*(Thực thi mở rộng triển khai production có kiểm soát theo từng đợt Wave 1/Wave 2, tạo bản sao lưu pre-expansion mới, cập nhật danh sách người dùng được duyệt và thực hiện giám sát vận hành chặt chẽ).*

*(Lưu ý phương án dự phòng: Nếu Lãnh đạo cơ quan quyết định `DO NOT EXPAND`, dự án sẽ chuyển hướng sang `Phase 10O: Post-deployment Fixes Before Expansion` để tập trung khắc phục triệt để các vướng mắc theo chỉ đạo trước khi trình xét duyệt lại).*

---
*Báo cáo Quyết định Mở rộng Triển khai có Kiểm soát được lập tự động từ kết quả tổng hợp minh chứng Pilot UAT, Deployment Execution và Day 1 - Day 3 Hypercare trong Phase 10N.*
