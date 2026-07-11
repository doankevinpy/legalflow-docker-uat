# LEGALFLOW V2 - PHASE 10M
# POST-DEPLOYMENT MONITORING & HYPERCARE PLAN

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.12-controlled-production-deployment-execution` -> `v2.10.13-post-deployment-monitoring-hypercare`  
**Ngày ban hành kế hoạch:** 11/07/2026  
**Trạng thái Kế hoạch:** **`ACTIVE HYPERCARE MONITORING`**

---

## 1. Purpose

Tài liệu này thiết lập Kế hoạch Theo dõi & Chăm sóc Tích cực sau triển khai (`Post-deployment Monitoring & Hypercare Plan` - Phase 10M) đối với hệ thống LegalFlow V2 ngay sau khi hoàn tất triển khai production có kiểm soát (`Phase 10L`). Kế hoạch quy định các mục tiêu rà soát, khung thời gian giám sát, ma trận kiểm tra hàng ngày, điều kiện leo thang/dừng hệ thống (`Stop Conditions`) và phân công trách nhiệm rõ ràng cho 6 vai trò trực chiến nhằm bảo đảm sự ổn định, an toàn dữ liệu và tuân thủ tuyệt đối quy định quản trị AI (`AI Governance`) trước khi đưa ra quyết định mở rộng phạm vi người dùng (`Phase 10N`).

---

## 2. Hypercare Objective

Giai đoạn Hypercare tập trung đạt được 7 mục tiêu rà soát trọng tâm:
1. **Theo dõi lỗi sau triển khai (`Real-time Defect Tracking`):** Phát hiện, ghi nhận và xử lý tức thời các lỗi kỹ thuật, lỗi giao diện hay bất thường về hiệu năng phát sinh khi cán bộ thụ lý bắt đầu thao tác trên môi trường Pilot.
2. **Xác nhận hệ thống ổn định (`Stabilization Assurance`):** Chứng minh tính ổn định liên tục của các container cơ sở dữ liệu (`legalflow_postgres`), proxy (`legalflow_caddy`) và các API nghiệp vụ cốt lõi sau nhiều ngày vận hành thực tế.
3. **Ghi nhận phản hồi người dùng (`User Feedback Intake`):** Thu thập các đóng góp, khó khăn và đề xuất cải tiến của nhóm 12-19 cán bộ Pilot (`ADMIN / MANAGER / STAFF / VIEWER`) trong quá trình thụ lý hồ sơ TTHC thực tế.
4. **Kiểm soát rủi ro AI Governance (`AI Governance Enforcement`):** Giám sát chặt chẽ luồng trợ lý AI Khối 3.1, đảm bảo AI không tự động kết luận "Hợp lệ / Khước từ" thay thẩm quyền cán bộ và khung viền cảnh báo luôn hiển thị rõ ràng.
5. **Kiểm soát phân quyền (`RBAC Privilege Monitoring`):** Rà soát nhật ký truy cập hàng ngày để ngăn chặn và phát hiện sớm các hành vi truy cập trái thẩm quyền hoặc lạm quyền giữa `VIEWER`, `STAFF` và `MANAGER`.
6. **Kiểm soát Export Safety (`Export Safeguard Verification`):** Đảm bảo mọi văn bản, phiếu rà soát xuất ra từ Khối 3.3 đều duy trì tiền tố `DU_THAO_GOI_Y_AI_` và không tự động ký hay ban hành.
7. **Quyết định mở rộng phạm vi (`Expansion Readiness Decision`):** Cung cấp các bằng chứng xác thực và số liệu vận hành để Hội đồng Thẩm định quyết định việc mở rộng phạm vi triển khai cho toàn bộ đơn vị hay tiếp tục giới hạn kiểm soát.

---

## 3. Hypercare Duration

Khung thời gian chăm sóc tích cực được chia thành 4 giai đoạn nối tiếp:
* **Day 0 (`Deployment Execution & Initial Baseline`):** Thực thi kịch bản triển khai Phase 10L, chạy sao lưu trước triển khai (`pg_dump` 951 KB), rà soát baseline Git và mở quyền kết nối cho nhóm cán bộ Pilot giới hạn.
* **Day 1 (`Intensive Real-time Monitoring`):** Giám sát chặt chẽ 100% thao tác hệ thống, kiểm tra nhật ký `health-check.ps1` lúc `08:00 AM` và `16:30 PM`, hỗ trợ trực tiếp chuyên viên xử lý hồ sơ đầu tiên trên môi trường mới.
* **Day 2 – Day 3 (`Continuous Operational & Feedback Tracking`):** Tiếp tục rà soát nhật ký container hằng ngày, tiếp nhận và phân loại lỗi vào `Hypercare Issue Register`, kiểm tra tính toàn vẹn cơ sở dữ liệu và đánh giá trải nghiệm 7 tab nghiệp vụ.
* **Sau Day 3 (`Expansion / Stabilization Decision Gate`):** Tổng kết toàn bộ số liệu rà soát từ Day 1 – Day 3 vào Báo cáo `Day 1 - Day 3 Monitoring Report`. Nếu hệ thống đạt trạng thái `STABLE / STABLE WITH WARNINGS` (không có lỗi Critical/High), chính thức trình duyệt quyết định mở rộng phạm vi (`Phase 10N: Controlled Production Expansion Decision`).

---

## 4. Monitoring Scope

Phạm vi giám sát bao phủ toàn bộ 12 vùng chức năng và hạ tầng dịch vụ cốt lõi:
1. **Login &amp; Authentication:** Kiểm tra độ ổn định của luồng cấp token JWT và đăng nhập qua `http://localhost:5173` và proxy `http://kevindoan-legalflow.local:8080`.
2. **Case List &amp; Filters:** Giám sát tốc độ phản hồi và tính chính xác của bộ lọc theo lĩnh vực (`Đất đai`, `Xây dựng`) và trạng thái (`SUBMITTED`, `IN_REVIEW`).
3. **Case Detail &amp; 7 Tabs:** Theo dõi trải nghiệm chuyển đổi qua lại giữa 7 tab nghiệp vụ (`1. Thông tin -> 7. Audit Log`) trên các hồ sơ thực tế.
4. **AI Review (`Khối 3.1`):** Giám sát thời gian phản hồi của API AI prompt builder, độ chuẩn xác văn phong tham mưu và sự hiện diện của nhãn cảnh báo viền xanh/amber.
5. **Legal Snapshot (`Khối 3.2`):** Kiểm tra tính minh bạch của metadata phiên bản luật (`Active Version: v2.0-2024-LAND-LAW`) và khung vàng `LAW-02` nhắc đối chiếu quy định UBND tỉnh.
6. **Export Safety (`Khối 3.3`):** Kiểm tra tên file tải về (`DU_THAO_GOI_Y_AI_`), kiểm tra watermark bản nháp và xác nhận không kích hoạt chữ ký số tự động.
7. **Legal Knowledge Base:** Rà soát khả năng tìm kiếm từ khóa Luật Đất đai 2024 và tính đồng bộ của cơ sở tri thức trung ương.
8. **Permission (`RBAC Controls`):** Giám sát hiệu lực khóa Khối 3.3 và ẩn nút chạy AI đối với tài khoản `VIEWER` hoặc `canAct: false`.
9. **Error / Empty States:** Kiểm tra các thẻ thông báo giao diện (`CASELIST-01`, `DETAIL-02`) khi dữ liệu rỗng hoặc lọc sai.
10. **System Health-Check:** Giám sát các thông số tài nguyên và phản hồi của 4 container qua script `health-check.ps1`.
11. **Backup Status:** Kiểm tra sự tồn tại và an toàn của các bản dump `.sql` trong thư mục `backups/` (`untracked` ngoài Git).
12. **User Feedback:** Tổng hợp và xử lý mọi phản hồi từ 4 nhóm người dùng Pilot (`ADMIN / MANAGER / STAFF / VIEWER`).

---

## 5. Daily Monitoring Checklist

Bảng kiểm tra định kỳ hàng ngày dành cho Lực lượng trực chiến (`Operator Daily Monitoring Table`):

| Check ID | Area | Check Item | Evidence / Command | Expected Result | Status | Notes |
| :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| **MON-01** | **Container Health** | Trạng thái hoạt động của Docker containers | `docker ps --format ...` | `legalflow_postgres` và `legalflow_caddy` Up healthy/running | ✅ **PASS** | Kiểm tra lúc `08:00 AM` mỗi ngày. |
| **MON-02** | **Script Health-Check** | Chạy kiểm tra tổng thể 4 dịch vụ | `.\scripts\health-check.ps1` | DB &amp; Proxy PASS. Ghi nhận cảnh báo môi trường nếu có | ⚠️ **WARNING** | Ghi nhận note `HYP-ENV-01` về cổng 9000 MinIO. |
| **MON-03** | **Backup Integrity** | Kiểm tra thư mục và file dump pre-deploy | `Get-ChildItem .\backups` | File dump `.sql` > 0 KB, untracked ngoài Git | ✅ **PASS** | File `951 KB` sẵn sàng, không commit. |
| **MON-04** | **Login &amp; Session** | Thử đăng nhập và kiểm tra thời gian hết hạn token | UI Login / Network tab | Đăng nhập mượt mà, không lỗi 500 hay timeout | 🔲 **READY** | Cán bộ trực kiểm tra lúc đầu giờ sáng. |
| **MON-05** | **Case List Query** | Tải danh sách hồ sơ TTHC, thử các bộ lọc | UI Case List (`/cases`) | Danh sách trả về dưới 1 giây, sắp xếp `receivedAt DESC` | 🔲 **READY** | Tuân thủ `CASELIST-02`. |
| **MON-06** | **Case Detail &amp; Tabs** | Mở 1 hồ sơ đang thụ lý, bấm qua 7 tab | UI Case Detail (`/cases/:id`) | Bố cục 7 tab không trắng màn hình, dữ liệu chuẩn xác | 🔲 **READY** | Cải tiến `UX-05`. |
| **MON-07** | **AI Review &amp; Prompt** | Rà soát log chạy AI Khối 3.1 và văn phong | Backend AI Log / Khối 3.1 | AI trả lời đúng định dạng tham mưu, có nhãn viền vàng/amber | 🔲 **READY** | Tuân thủ `AI-01`, `AI-04`. |
| **MON-08** | **AI Safety Warning** | Kiểm tra hiển thị khung cảnh báo *"BẢN GỢI Ý AI"* | UI Case Detail Tab 3 | Khung vàng *"CÁN BỘ PHẢI KIỂM TRA"* hiển thị 100% | 🔲 **READY** | Trách nhiệm con người (`Human-in-the-Loop`). |
| **MON-09** | **Legal Snapshot &amp; Law** | Kiểm tra Khối 3.2 và cảnh báo vàng `LAW-02` | UI Case Detail Khối 3.2 | Hiển thị `Active Version: v2.0-2024-LAND-LAW` &amp; quy định UBND | 🔲 **READY** | Đảm bảo truy xuất nguồn gốc pháp lý. |
| **MON-10** | **Export Filename** | Thử tải bản dự thảo Word (`.docx`) và PDF | UI Case Detail Khối 3.3 | Tên file bắt buộc có prefix `DU_THAO_GOI_Y_AI_` | 🔲 **READY** | Ngăn chặn rủi ro nhầm lẫn văn bản chính thức. |
| **MON-11** | **Permission enforcement** | Kiểm tra quyền `canAct` của tài khoản `VIEWER` | UI Tab 3 / API call | Tài khoản `VIEWER` bị khóa Khối 3.3 với thông báo đỏ rõ ràng | 🔲 **READY** | Bảo đảm `RBAC enforcement`. |
| **MON-12** | **Issue Register Review** | Cập nhật và triage lỗi mới trong ngày | `HYPERCARE_ISSUE_REGISTER` | Lỗi được phân loại đúng `Critical/High/Medium/Low` | 🔲 **READY** | Họp rà soát vào `16:30 PM` hàng ngày. |

---

## 6. Stop / Escalation Conditions

Hệ thống bắt buộc phải **TẠM DỪNG VẬN HÀNH / DỪNG MỞ RỘNG (`EMERGENCY ABORT & ESCALATION`)** và kích hoạt quy trình Rollback nếu xảy ra bất kỳ điều kiện nào dưới đây:
1. 🛑 **Mất hay sai lệch dữ liệu (`Data Loss / Corruption` - Critical P0):** Phát hiện dữ liệu hồ sơ đất đai, thông tin chủ sử dụng hay nhật ký thẩm định bị mất, xóa trái phép hoặc ghi đè sai lệch trong DB `legalflow_prod`.
2. 🛑 **Lỗi phân quyền nghiêm trọng (`RBAC Privilege Escalation` - Critical P0):** Người dùng `VIEWER` hoặc `STAFF` có thể tự ý phê duyệt hồ sơ, sửa đổi cấu hình tri thức pháp lý hoặc truy cập menu `ADMIN`.
3. 🛑 **AI gây hiểu nhầm là kết luận chính thức (`AI Governance Violation` - High/Critical P0/P1):** Trợ lý AI tự động phán quyết hồ sơ đủ điều kiện thay cán bộ hoặc bị mất khung cảnh báo *"⚠️ BẢN GỢI Ý AI"*.
4. 🛑 **Export giống văn bản đã ký/ban hành (`Export Safeguard Failure` - High/Critical P0/P1):** File tải về từ Khối 3.3 bị mất tiền tố `DU_THAO_GOI_Y_AI_` hoặc tự động cấy chữ ký/con dấu giả lập gây nhầm lẫn là quyết định chính thức.
5. 🛑 **Health-Check Fail kéo dài (`Core Service Down` - High P1):** Container cơ sở dữ liệu `legalflow_postgres` hoặc proxy `legalflow_caddy` bị crash và không thể phục hồi sau 30 phút.
6. 🛑 **Không Backup được (`Backup Mechanism Failure` - High P1):** Lệnh `pg_dump` báo lỗi, không thể tạo snapshot `.sql` an toàn trước khi xử lý kỹ thuật.
7. 🛑 **Lỗi Critical/High chưa có người xử lý (`Unassigned Critical Defect` - High P1):** Phát sinh sự cố P0/P1 trong `Issue Register` nhưng không có Kỹ sư trực chiến tiếp nhận kịch bản ứng phó trong vòng 15 phút.

---

## 7. Hypercare Roles

Bảng phân công trách nhiệm và tần suất thực thi cho 6 vai trò trực chiến trong giai đoạn Hypercare:

| Role | Assigned Responsibility | Frequency | Notes & Governance Check |
| :--- | :--- | :---: | :--- |
| **Technical Operator (`DevOps / SysAdmin`)** | Chạy `health-check.ps1`, giám sát tài nguyên container (`docker ps`), rà soát lỗi hạ tầng, duy trì kịch bản pre-deploy backup và giải phóng cổng hạ tầng máy chủ (`9000`). | **Hàng ngày** (`08:00 & 16:30`) | Chịu trách nhiệm trực tiếp về độ ổn định của Postgres và Caddy. |
| **UAT Coordinator (`Pilot Support Lead`)** | Trực tiếp hướng dẫn và giải đáp thắc mắc cho 12-19 cán bộ Pilot, ghi nhận lỗi từ người dùng vào `Hypercare Issue Register`, điều phối các buổi kiểm tra nhanh hàng ngày. | **Hàng ngày** (`Continuous`) | Cầu nối thông suốt giữa Kỹ thuật và Nghiệp vụ. |
| **ADMIN Representative (`System Admin`)** | Kiểm soát danh sách tài khoản Pilot, rà soát phân quyền `RBAC`, đảm bảo không có tài khoản ngoài danh sách truy cập hệ thống, kiểm tra `Audit Logs` nghiệp vụ. | **Hàng ngày** (`Continuous`) | Chịu trách nhiệm an ninh truy cập tối cao. |
| **Manager Representative (`Dept Head`)** | Thẩm định các kết quả tham khảo của Khối 3.1 AI Review, đối chiếu bản dự thảo Khối 3.3 với quy định thực tế, ra quyết định ban hành văn bản thực tế ngoài hệ thống theo thẩm quyền. | **Hàng ngày** (`Continuous`) | Chịu trách nhiệm nghiệp vụ cao nhất, quán triệt `Human-in-the-Loop`. |
| **Staff Representative (`Core Case Officer`)** | Trực tiếp thao tác thụ lý hồ sơ TTHC trên môi trường mới, kiểm tra các bộ lọc Danh sách, rà soát 7 tab chi tiết, in tham khảo phiếu rà soát và phản hồi ngay nếu có bất thường. | **Hàng ngày** (`Continuous`) | Nhóm người dùng thao tác thực tế đông đảo nhất (~5-8 cán bộ). |
| **Legal / Procedure Reviewer (`Specialist`)** | Rà soát tính chính xác của điều khoản Luật Đất đai 2024 tại `Legal Knowledge Base`, xác nhận hiển thị đúng huy hiệu `Active Version: v2.0-2024-LAND-LAW` và khung vàng `LAW-02`. | **Định kỳ** (`Day 1 & Day 3`) | Bảo đảm tri thức pháp lý luôn chuẩn xác tuyệt đối. |

---

## 8. Next Phase

Dựa trên lộ trình thực thi và các tiêu chí đánh giá tại Kế hoạch Hypercare Phase 10M, bước tiếp theo sau khi hoàn tất rà soát 3 ngày đầu là:
&rarr; **`Phase 10N: Controlled Production Expansion Decision`**  
*(Hội đồng Thẩm định họp rà soát Báo cáo `Day 1 - Day 3 Monitoring Report` và Sổ lỗi `Hypercare Issue Register` để ra quyết định: mở rộng phạm vi truy cập cho toàn bộ chuyên viên hay tiếp tục duy trì giới hạn kiểm soát).*
