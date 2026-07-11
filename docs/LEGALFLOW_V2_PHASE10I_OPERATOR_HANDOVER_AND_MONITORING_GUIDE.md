# LEGALFLOW V2 - PHASE 10I
# OPERATOR HANDOVER & MONITORING GUIDE

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản bàn giao:** `v2.10.8-pilot-uat-retest-stabilization-acceptance`  
**Ngày bàn giao:** 11/07/2026  
**Trạng thái Hướng dẫn:** `ACTIVE OPERATIONAL & MONITORING GUIDE`

---

## 1. Purpose

Tài liệu Hướng dẫn Bàn giao & Theo dõi Vận hành (`Operator Handover & Monitoring Guide`) này được thiết lập nhằm quy định rõ ranh giới trách nhiệm, quy trình giám sát hàng ngày/hàng tuần và luồng hỗ trợ kỹ thuật khi hệ thống LegalFlow V2 bước vào giai đoạn triển khai production có kiểm soát (`Controlled Production Deployment`). Hướng dẫn này đóng vai trò là "cẩm nang trực chiến" giúp các kỹ sư vận hành, điều phối viên nghiệp vụ và lãnh đạo kiểm soát chặt chẽ sức khỏe hệ thống, an toàn dữ liệu và tuân thủ tuyệt đối các nguyên tắc quản trị AI (`AI Governance`).

---

## 2. Operator Responsibilities

Bảng phân định trách nhiệm chi tiết giữa các bộ phận tham gia vận hành có kiểm soát:

| Role | Primary Responsibility | Frequency | Notes |
| :--- | :--- | :---: | :--- |
| **Technical Operator** <br/> *(Kỹ sư Vận hành Hạ tầng)* | Chịu trách nhiệm trực chiến giám sát sức khỏe container (`Postgres`, `Caddy`), kiểm tra log lỗi backend/frontend, thực thi sao lưu dữ liệu DB định kỳ, và áp dụng kịch bản `Rollback` khi có lệnh từ `Project Owner`. | **Hàng ngày** <br/> *(Daily)* | Không được tự ý chạy `restore DB` hay sửa đổi cấu hình `.env` nếu chưa được phê duyệt. |
| **UAT Coordinator** <br/> *(Điều phối viên Thử nghiệm)* | Chịu trách nhiệm làm đầu mối tiếp nhận các thắc mắc, phản hồi hoặc báo lỗi từ chuyên viên thụ lý Pilot; tổng hợp và phân loại (`Triage`) vào `Issue Register`. | **Hàng ngày** <br/> *(Daily)* | Hướng dẫn chuyên viên không nhầm lẫn lỗi mạng với dữ liệu rỗng (`CASELIST-01`, `DETAIL-02`). |
| **ADMIN User** <br/> *(Quản trị viên Hệ thống)* | Chịu trách nhiệm quản lý danh sách tài khoản, kiểm soát phân quyền (`RBAC`) theo đúng danh sách người dùng Pilot giới hạn; khóa hoặc mở quyền cho cán bộ theo yêu cầu lãnh đạo. | **Hàng tuần** <br/> *(Weekly / As needed)* | Đảm bảo không có tài khoản vô danh hay phân quyền sai lệch (`STAFF` cầm quyền `ADMIN`). |
| **Manager Representative** <br/> *(Đại diện Lãnh đạo Phòng)* | Chịu trách nhiệm nghiệp vụ cao nhất trong đợt Pilot; rà soát, kiểm tra độ chính xác của các bản gợi ý AI, kiểm tra đối chiếu quy chế địa phương trước khi ký ban hành hồ sơ thực tế. | **Hàng ngày** <br/> *(Daily)* | Giám sát chuyên viên tuân thủ nguyên tắc `Human-in-the-Loop`, không ỷ lại 100% vào AI. |
| **Legal / Procedure Reviewer** <br/> *(Cán bộ rà soát Pháp lý)* | Chịu trách nhiệm theo dõi và quản trị module `Legal Knowledge Base`; rà soát đảm bảo hệ thống luôn hiển thị đúng phiên bản luật đang hiệu lực (`Active Version: v2.0-2024-LAND-LAW`). | **Hàng tuần** <br/> *(Weekly)* | Phối hợp cập nhật metadata khi có văn bản quy phạm pháp luật mới được ban hành. |

---

## 3. Daily Monitoring Checklist

Bảng kiểm rà soát tình trạng hoạt động bắt buộc thực hiện vào **sáng mỗi ngày vận hành** (`Daily Monitoring SOP`):

| Check Item | Command / Evidence | Expected Result | Status | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **Frontend UI Access** | Mở trình duyệt vào `http://localhost:5173` | Trang đăng nhập/danh sách tải nhanh dưới 2s, không trắng màn hình | ⏳ *Check Daily* | Đảm bảo cdn/asset static phục vụ tốt. |
| **Backend Health-Check** | Chạy `.\health-check.ps1` hoặc `curl http://127.0.0.1:3000/api/health` | HTTP `200 OK`, `{"status":"ok"}` | ⏳ *Check Daily* | Xác nhận NestJS API phản hồi mượt mà. |
| **Docker Containers** | Chạy `docker ps` trên máy chủ | 2 container `legalflow_postgres`, `legalflow_caddy` trạng thái `Up (healthy)` | ⏳ *Check Daily* | Nếu có container restart liên tục phải báo ngay. |
| **User Access Logs** | Kiểm tra `docker logs legalflow_postgres` &amp; app access logs | Không có đột biến truy cập lạ, lỗi `401 Unauthorized` hay `403 Forbidden` hàng loạt | ⏳ *Check Daily* | Giám sát an toàn bảo mật và phân quyền. |
| **Export Service Status** | Thử gọi hàm preview PDF/Docx từ một hồ sơ nháp/bài test | File trả về nhanh, đầy đủ header dự thảo `DU_THAO_GOI_Y_AI_` | ⏳ *Check Daily* | Đảm bảo thư viện tạo docx/pdf không bị nghẽn bộ nhớ. |
| **AI Review API Health** | Kiểm tra log gọi LLM / builder trong ngày hôm trước | Không xuất hiện lỗi `Timeout` hoặc `500 Internal Server Error` vượt hạn mức | ⏳ *Check Daily* | Giám sát độ ổn định của module AI tham mưu. |
| **Latest Database Backup** | Kiểm tra thư mục chứa file backup hàng ngày | Có file `.sql` dump mới nhất của đêm qua với kích thước hợp lệ (> vài MB) | ⏳ *Check Daily* | Tiêu chí sống còn để bảo vệ dữ liệu TTHC. |
| **Disk Space Availability** | Chạy kiểm tra dung lượng ổ đĩa máy chủ (`Get-PSDrive C` / `df -h`) | Ổ cứng chứa docker và DB còn trống ít nhất `> 20% / > 10GB` | ⏳ *Check Daily* | Tránh lỗi crash database do full ổ cứng (`Disk Full`). |

---

## 4. Weekly Monitoring Checklist

Bảng kiểm định kỳ **mỗi tuần một lần (`Weekly Monitoring SOP`)** nhằm duy trì hệ thống ở trạng thái ổn định tối ưu:
1. **Kiểm tra phân quyền (`RBAC Audit`):** Rà soát lại toàn bộ danh sách `User` trong database (`SELECT id, email, role, canAct FROM User;`), xác nhận không có sự gia tăng tài khoản bất thường hay sai quyền hạn.
2. **Kiểm tra Legal Knowledge Active Version:** Truy cập module `Legal Knowledge`, xác nhận phiên bản `v2.0-2024-LAND-LAW` vẫn đang ở trạng thái `ACTIVE`, không có bản nháp chưa kiểm duyệt bị kích hoạt nhầm.
3. **Kiểm tra tính toàn vẹn của Backup (`Restore Simulation Check`):** Thực hiện tra cứu log backup tuần, lấy thử ngẫu nhiên 1 file backup sang môi trường test để rà soát đảm bảo file không bị lỗi cấu trúc (`Corrupted file`).
4. **Kiểm tra & Cập nhật Issue Register:** Tổng hợp toàn bộ các góp ý, báo lỗi nhỏ (`P3/P4`) từ `UAT Coordinator`, cập nhật trạng thái (`Pending / Backlog`) vào báo cáo tuần cho `Project Owner`.
5. **Rà soát góp ý của Cán bộ thụ lý:** Tổ chức phỏng vấn nhanh 10 phút với 3-5 chuyên viên Pilot để đánh giá độ thân thiện UX/UI và chất lượng văn phong AI trong tuần qua.
6. **Kiểm tra tính hiển thị của Warning AI / Export:** Rà soát ngẫu nhiên 5 hồ sơ đã xử lý trong tuần, xác nhận các thẻ cảnh báo Khối 3.1, Khối 3.2, Khối 3.3 và prefix file `DU_THAO_GOI_Y_AI_` được duy trì 100%.

---

## 5. User Support Workflow

Quy trình chuẩn (`SOP`) 7 bước tiếp nhận, phân loại và xử lý phản hồi/lỗi từ người dùng trong giai đoạn Pilot:
1. **Người dùng báo lỗi (`Report Reception`):** Cán bộ thụ lý gặp vướng mắc gửi báo cáo qua `UAT Coordinator` (kèm mô tả ngắn gọn và chụp màn hình).
2. **Ghi màn hình / chức năng (`Context Recording`):** Ghi nhận chính xác chức năng đang thao tác (ví dụ: Tab 3 AI Review, Khối 3.2 Legal Snapshot, hay nút Xuất Word).
3. **Ghi Role (`Role Identification`):** Ghi rõ vai trò của tài khoản báo cáo (`STAFF`, `MANAGER`, hay `VIEWER`) để xác định có phải do bị chặn quyền theo thiết kế hay không.
4. **Ghi thời điểm (`Timestamp Recording`):** Ghi ngày, giờ chính xác xảy ra hiện tượng để Technical Operator đối chiếu với `docker logs`.
5. **Ghi Expected vs. Actual (`Gap Analysis`):** Ghi rõ kết quả cán bộ mong muốn (`Expected Result`) và kết quả thực tế hiển thị (`Actual Result`).
6. **Phân loại Severity (`Triage & Classification`):** Đánh giá mức độ theo cẩm nang: `Critical (P0)`, `High (P1)`, `Medium (P2)`, hay `Low (P3/Backlog)`.
7. **Quyết định Hành động (`Action Routing`):**
   * Nếu là lỗi `Critical / High`: Báo ngay `Tech Lead` kích hoạt kịch bản ứng phó khẩn cấp (`Rollback / Hotfix`).
   * Nếu là hiểu nhầm nghiệp vụ/empty state: `UAT Coordinator` giải thích ngay theo tài liệu Hướng dẫn.
   * Nếu là cải tiến UX/Backlog (`Medium / Low`): Ghi nhận vào `Deferred Backlog` không sửa code ngay.

---

## 6. AI Governance Monitoring

Checklist đặc biệt rà soát việc tuân thủ các ranh giới an toàn AI (`AI Safety & Governance Enforcement`) hàng ngày/hàng tuần:
* [x] **AI Warning còn hiển thị 100%:** Xác nhận khung cảnh báo vàng *"⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA"* không bị ẩn hay che khuất trên mọi trình duyệt của cán bộ.
* [x] **AI không kết luận thay cán bộ:** Kiểm tra các bản output AI sinh ra trong ngày, xác nhận AI tuyệt đối tuân thủ văn phong tham mưu (`"Đề nghị cán bộ kiểm tra..."`, `"Cần rà soát đối chiếu..."`), không có câu từ kết luận `"Đủ điều kiện ban hành"`.
* [x] **Legal Snapshot Warning còn rõ:** Khung màu vàng `LAW-02` nhắc nhở đối chiếu 3 nhóm quy định địa phương (Quy trình UBND tỉnh, Quy hoạch huyện, Quy hoạch xây dựng) hiển thị cố định tại Khối 3.2.
* [x] **Export vẫn có `DU_THAO_GOI_Y_AI_`:** Kiểm tra log xuất file hoặc file mẫu tải về, xác nhận tên file luôn đi kèm prefix `DU_THAO_GOI_Y_AI_` và nội dung file có Header/Footer cảnh báo bản nháp.
* [x] **Không có hành vi tự ký / ban hành / gửi:** Xác nhận hệ thống không có bất kỳ tiến trình ngầm (`Cron Job / Background Worker`) nào tự động ký số, tự động đổi trạng thái sang `APPROVED` hay tự động gửi email/văn bản ra ngoài.

---

## 7. Handover Notes

Các ghi chú bàn giao quan trọng nhất cho đội ngũ kế nhiệm vận hành và lãnh đạo phụ trách:
1. **Tài liệu cốt lõi cần nắm vững:**
   * Kế hoạch chuẩn bị triển khai: `docs/LEGALFLOW_V2_PHASE10I_CONTROLLED_PRODUCTION_DEPLOYMENT_PREPARATION_PLAN.md`
   * Bảng kiểm ra quyết định: `docs/LEGALFLOW_V2_PHASE10I_GO_NO_GO_CHECKLIST.md`
   * Cẩm nang Rollback & Sự cố: `docs/LEGALFLOW_V2_PHASE10I_ROLLBACK_AND_INCIDENT_PLAYBOOK.md`
   * Hướng dẫn Vận hành này: `docs/LEGALFLOW_V2_PHASE10I_OPERATOR_HANDOVER_AND_MONITORING_GUIDE.md`
2. **Ai chịu trách nhiệm vận hành kỹ thuật (`Technical Ownership`):** Kỹ sư Quản trị Hạ tầng (`DevOps / SysAdmin`) chịu trách nhiệm cao nhất về sức khỏe container, backup DB và thực thi Rollback khi có lệnh.
3. **Ai chịu trách nhiệm pháp lý / nghiệp vụ (`Legal & Procedure Ownership`):** Lãnh đạo Phòng Chuyên môn (`MANAGER`) chịu trách nhiệm cao nhất về kết luận thẩm định cuối cùng của các hồ sơ TTHC xử lý trong hệ thống, tuyệt đối không quy trách nhiệm pháp lý cho Trợ lý AI.
4. **Ai được quyền xử lý Rollback (`Rollback Authorization`):** Chỉ `Project Owner (Kevin Doan)` hoặc `Tech Lead` có thẩm quyền ra lệnh kích hoạt quy trình `Rollback by Git Tag` theo cẩm nang sự cố.
5. **Ai được quyền quản trị Legal Knowledge (`Knowledge Base Authority`):** Chỉ Trưởng bộ phận Thẩm định Pháp lý hoặc Admin được ủy quyền mới có thẩm quyền chuyển đổi (`Active/Deactive`) các phiên bản tri thức luật trong hệ thống.

---

## 8. Next Phase

Sau khi hoàn thiện bộ tài liệu chuẩn bị, bảng kiểm `Go/No-Go`, cẩm nang sự cố và tài liệu bàn giao vận hành của Phase 10I, đề xuất bước tiếp theo cho lộ trình dự án:
&rarr; **`Phase 10J: Controlled Production Deployment Dry Run`**  
*(Diễn tập toàn diện kịch bản triển khai, sao lưu, kiểm tra sức khỏe và rollback trên môi trường kiểm soát trước giờ vận hành chính thức).*
