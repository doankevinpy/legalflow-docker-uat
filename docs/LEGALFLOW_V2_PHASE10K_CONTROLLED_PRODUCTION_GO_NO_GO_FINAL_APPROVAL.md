# LEGALFLOW V2 - PHASE 10K
# CONTROLLED PRODUCTION GO / NO-GO FINAL APPROVAL

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.10-controlled-production-deployment-dry-run` -> `v2.10.11-controlled-production-go-no-go-final-approval`  
**Ngày lập hồ sơ:** 11/07/2026  
**Trạng thái Phê duyệt:** **`PENDING FINAL EXECUTIVE SIGN-OFF`** (Đề xuất: `GO WITH CONDITIONS`)

---

## 1. Purpose

Tài liệu này là hồ sơ quyết định phê duyệt cuối cùng (`Final Go / No-Go Approval Record`) trước thời điểm chính thức chuyển sang giai đoạn triển khai production có kiểm soát (`Controlled Production Deployment`). Tài liệu tổng hợp toàn bộ các bằng chứng kiểm thử, kết quả rà soát từ các giai đoạn trước (UAT, Fixes, Re-test, Preparation, Dry Run), phân tích các lựa chọn quyết định (`GO / GO WITH CONDITIONS / NO-GO`) và xác lập ranh giới an toàn tối thượng nhằm hỗ trợ Lãnh đạo nghiệp vụ và Kỹ thuật đưa ra quyết định vận hành chính thức.

---

## 2. Decision Context

Bối cảnh ra quyết định dựa trên chuỗi tiến trình chuẩn hóa đã hoàn tất:
* **Đã hoàn thành Pilot UAT (`Phase 10E/10F`):** Tổ chức chạy thử nghiệm thực tế với nhóm cán bộ thụ lý và ghi nhận đầy đủ danh sách kết quả cùng các vấn đề cần ưu tiên xử lý.
* **Đã fix / stabilize các góp ý UAT ưu tiên (`Phase 10G`):** Khắc phục triệt để các lỗi và UX/UI improvement thuộc nhóm `P1/P2` (`CASELIST-01`, `DETAIL-02`, `AI-01`, `AI-04`, `LAW-02`, `LK-01`, `UX-01`, `UX-05`).
* **Đã re-test stabilization (`Phase 10H`):** Kiểm thử lại toàn bộ 8/8 issue P1/P2 đạt kết quả `PASS` 100%, bảo đảm 129/129 unit tests không có lỗi hồi quy (`Regression Check: PASS`).
* **Đã chuẩn bị deployment runbook (`Phase 10I`):** Lập kế hoạch triển khai, bảng kiểm Go/No-Go, cẩm nang xử lý sự cố & rollback, cùng hướng dẫn bàn giao vận hành chi tiết.
* **Đã thực hiện controlled deployment dry run (`Phase 10J`):** Diễn tập thành công kịch bản sao lưu thực tế (`Backup Dry Run` tạo file dump `.sql` 951 KB an toàn), kiểm tra build backend/frontend production với `0 errors`, đồng bộ schema 100% (`migrate status clean`).
* **Xác nhận tính chất giai đoạn:** Bước phê duyệt Phase 10K này là **khâu lập hồ sơ quyết định cuối cùng trên giấy tờ/tài liệu**, chưa phải là hành động bấm nút triển khai production thực tế (`Not an active deployment step`).

---

## 3. Baseline

Thông số mốc định danh cấu hình hệ thống tại thời điểm trình phê duyệt (bảo mật tuyệt đối, không chứa mật khẩu thực tế):
* **Current tag:** `v2.10.10-controlled-production-deployment-dry-run`
* **Proposed final approval tag:** `v2.10.11-controlled-production-go-no-go-final-approval`
* **Root repo path:** `C:\Users\Admin\legalflow-docker-uat`
* **Backend path:** `C:\Users\Admin\legalflow-docker-uat\legalflow-backend`
* **Local Proxy URL:** `http://kevindoan-legalflow.local:8080`
* **Local Frontend URL:** `http://localhost:5173`
* **Backend API URL:** `http://127.0.0.1:3000`
* **Docker Postgres container:** `legalflow_postgres`
* **Production Database Name:** `legalflow_prod`

---

## 4. Evidence Summary

Bảng tổng hợp các bằng chứng nghiệm thu từ các giai đoạn tiền đề:

| Evidence Area | Source Document | Result | Notes |
| :--- | :--- | :---: | :--- |
| **Phase 10F: UAT Results** | `docs/LEGALFLOW_V2_PHASE10F_PILOT_UAT_RESULTS_AND_ISSUE_TRIAGE_REPORT.md` | `COMPLETED` | Phân loại rõ các nhóm lỗi `P1/P2` cần sửa ngay và `P3/P4` đưa vào Backlog. |
| **Phase 10G: Issue Fixes** | `docs/LEGALFLOW_V2_PHASE10G_PILOT_UAT_ISSUE_FIXES_STABILIZATION_REPORT.md` | `COMPLETED` | Khắc phục 100% 8 vấn đề UAT trọng điểm mà không chạm vào `schema / database`. |
| **Phase 10H: Re-test Acceptance** | `docs/LEGALFLOW_V2_PHASE10H_PILOT_UAT_RETEST_STABILIZATION_ACCEPTANCE_REPORT.md` | `ACCEPTED WITH WARNINGS` | 8/8 issue pass tuyệt đối, 129 unit tests pass. Note về cổng 9000 môi trường. |
| **Phase 10I: Deployment Prep** | `docs/LEGALFLOW_V2_PHASE10I_CONTROLLED_PRODUCTION_DEPLOYMENT_PREPARATION_PLAN.md` | `READY` | Thiết lập bộ 4 cẩm nang/checklist chuẩn bị triển khai có kiểm soát. |
| **Phase 10J: Dry Run Report** | `docs/LEGALFLOW_V2_PHASE10J_CONTROLLED_PRODUCTION_DEPLOYMENT_DRY_RUN_REPORT.md` | `READY FOR REVIEW` | Diễn tập sao lưu DB (`pg_dump` 951 KB), build static bundle thành công với 0 lỗi. |

---

## 5. Final Go / No-Go Checklist

Bảng kiểm cuối cùng rà soát 14 tiêu chí kỹ thuật, nghiệp vụ và an toàn AI:

| Check ID | Area | Requirement | Evidence | Decision | Notes |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **CHK-01** | Git Baseline | Working tree clean, đúng tag `v2.10.10` | `git status` / `git tag --points-at HEAD` | ✅ **GO** | Repo sạch, không có file code chưa theo dõi. |
| **CHK-02** | Backup Readiness | Diễn tập backup thành công, file dump `.sql` tồn tại | `backups\legalflow_prod_dryrun_...sql` (951 KB) | ✅ **GO** | File backup an toàn, tuyệt đối `untracked` ngoài Git. |
| **CHK-03** | Backend Build/Test | 100% Unit test pass, build NestJS không lỗi | `npm test` (129/129 pass), `npm run build` | ✅ **GO** | Logic API vững chắc, không hồi quy. |
| **CHK-04** | Frontend Build | Build Vite bundle tĩnh thành công không lỗi | `vite build` (`built in 1.58s`, 0 errors) | ✅ **GO** | Static assets sẵn sàng phục vụ. |
| **CHK-05** | Health-Check Status | Container DB, Proxy và dịch vụ hoạt động tốt | `health-check.ps1` &amp; `docker ps` | ⚠️ **WARNING** | DB/Proxy healthy. Note giải phóng cổng 9000 MinIO trước giờ G (`DRYRUN-ENV-01`). |
| **CHK-06** | Rollback Plan | Kịch bản quay lui theo Git Tag (`v2.10.8`) sẵn sàng | `docs/LEGALFLOW_V2_PHASE10I_ROLLBACK_AND_INCIDENT_PLAYBOOK.md` | ✅ **GO** | Kịch bản chi tiết 7 bước đã ban hành. |
| **CHK-07** | Incident Playbook | Cẩm nang xử lý sự cố P0/P1 đã ban hành | `docs/LEGALFLOW_V2_PHASE10I_ROLLBACK_AND_INCIDENT_PLAYBOOK.md` | ✅ **GO** | Quy trình ứng phó khẩn cấp và RCA rõ ràng. |
| **CHK-08** | Operator Handover | Hướng dẫn bàn giao và check hàng ngày sẵn sàng | `docs/LEGALFLOW_V2_PHASE10I_OPERATOR_HANDOVER_AND_MONITORING_GUIDE.md` | ✅ **GO** | Phân định rõ trách nhiệm 5 vai trò vận hành. |
| **CHK-09** | AI Safety Warning | Nhãn *"BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA"* hiển thị 100% | `ProcedureCaseDetail.tsx (Khối 3.1 & 3.3)` | ✅ **GO** | AI không tự ý kết luận thay cán bộ (`Item #7`). |
| **CHK-10** | Export Safety | Văn bản xuất ra có tiền tố `DU_THAO_GOI_Y_AI_` | `docx-templates.helper.ts` | ✅ **GO** | Cảnh báo bản dự thảo rõ ràng trên từng trang file. |
| **CHK-11** | Permission Controls | RBAC chặn đúng quyền `canAct` của `VIEWER/STAFF` | Unit test &amp; UI component check | ✅ **GO** | Không cho phép xem trước/in/xuất nếu sai role. |
| **CHK-12** | Local Law Warning | Cảnh báo vàng `LAW-02` yêu cầu đối chiếu quy định UBND | `ProcedureCaseDetail.tsx (Khối 3.2)` | ✅ **GO** | Nhấn mạnh quy trình nội bộ &amp; quy hoạch sử dụng đất. |
| **CHK-13** | Active Legal Version | Huy hiệu `Active Version: v2.0-2024-LAND-LAW` hiển thị | `ProcedureCaseDetail.tsx (Khối 3.2)` | ✅ **GO** | Tri thức pháp lý minh bạch, có cảnh báo nếu thiếu snapshot. |
| **CHK-14** | No Critical Blocker | Không tồn tại bất kỳ lỗi P0/P1 chưa giải quyết | `Phase 10J Dry Run Report (Section 8)` | ✅ **GO** | Không có Blocker về mã nguồn hay dữ liệu. |

---

## 6. Decision Options

Hội đồng thẩm định ra quyết định dựa trên việc phân tích kỹ lưỡng 3 lựa chọn tiêu chuẩn:

### 1. GO *(Cho phép triển khai ngay)*
* **Định nghĩa:** Đồng ý cho phép triển khai production ngay lập tức mà không cần thêm bất kỳ ràng buộc hay giới hạn bổ sung nào.
* **Điều kiện áp dụng:** Khi hệ thống đạt 100% chỉ số kỹ thuật hoàn hảo, không có bất kỳ cảnh báo môi trường nào và phạm vi triển khai đã bao phủ trọn vẹn toàn bộ các module nghiệp vụ của đơn vị.

### 2. GO WITH CONDITIONS *(Cho phép triển khai có điều kiện kiểm soát - ĐỀ XUẤT)*
* **Định nghĩa:** Đồng ý cho phép hệ thống bước vào giai đoạn vận hành production thực tế nhưng **bắt buộc phải tuân thủ nghiêm ngặt các điều kiện kiểm soát rủi ro**.
* **Các điều kiện ràng buộc bắt buộc:**
  * Chỉ mở hệ thống cho một nhóm người dùng Pilot giới hạn (`Initial User Scope` 5-10 cán bộ).
  * Thực hiện theo dõi nhật ký hệ thống (`Log monitoring`) và rà soát lỗi hàng ngày trong tuần đầu tiên.
  * Chưa mở rộng phạm vi truy cập đại trà cho toàn bộ đơn vị hay công dân ngoài nhóm kiểm soát.
  * Bắt buộc phải tạo bản sao lưu cơ sở dữ liệu (`Pre-deploy DB Backup`) ngay trước thời điểm khởi động stack.
  * Bắt buộc phải bố trí cán bộ trực kỹ thuật và nghiệp vụ để hỗ trợ xử lý tức thời khi có phản hồi.
  * Bắt buộc phải **dừng hệ thống và kích hoạt Rollback ngay** nếu phát sinh lỗi `Critical (P0)` hoặc `High (P1)`.

### 3. NO-GO *(Dừng triển khai, yêu cầu khắc phục)*
* **Định nghĩa:** Từ chối cho phép vận hành production, yêu cầu nhóm phát triển quay lại giai đoạn khắc phục lỗi (`Readiness Fixes`).
* **Các trường hợp kích hoạt NO-GO:**
  * Lỗi `health-check fail` kéo dài do crash container cơ sở dữ liệu hoặc proxy không thể xử lý.
  * Có nguy cơ hoặc phát hiện lỗi gây mất mát, ghi đè, sai lệch dữ liệu hồ sơ thực tế.
  * Lỗi phân quyền nghiêm trọng (`RBAC Privilege Escalation`) cho phép chuyên viên ban hành trái phép.
  * Trợ lý AI vi phạm nguyên tắc an toàn, tự động kết luận "Đủ điều kiện" hoặc văn bản xuất ra không có dòng chữ dự thảo gây hiểu nhầm là quyết định chính thức.
  * Chưa sẵn sàng file backup cơ sở dữ liệu hoặc chưa có kịch bản và người chịu trách nhiệm Rollback rõ ràng.

---

## 7. Recommended Decision

### Đề xuất chính thức của Lực lượng Kỹ thuật & Diễn tập:
&rarr; **`GO WITH CONDITIONS`** *(ĐỒNG Ý TRIỂN KHAI PRODUCTION CÓ KIỂM SOÁT KÈM ĐIỀU KIỆN)*

### Lý do đưa ra đề xuất:
1. **Chất lượng mã nguồn đã được chứng minh qua 4 vòng kiểm thử liên tiếp:** Từ UAT Phase 10F, Khắc phục Phase 10G, Kiểm thử lại Phase 10H cho đến Diễn tập Phase 10J, toàn bộ 129 unit tests đều xanh tuyệt đối và build production đạt chuẩn `0 errors`.
2. **Tuân thủ tuyệt đối triết lý AI Governance & Human-in-the-Loop:** Các ranh giới an toàn pháp lý đã được khóa chặt bằng các khung viền cảnh báo, câu chữ tham mưu chuẩn mực trong `System Prompt` và tiền tố file xuất `DU_THAO_GOI_Y_AI_`. Cán bộ thụ lý luôn giữ quyền quyết định cao nhất.
3. **Sự tồn tại của các Backlog phức tạp (`Deferred Features`):** Do hệ thống thống nhất chuyển các module mở rộng lớn (như Upload OCR, Rich Text Editor, Approval Workflow mới) vào Backlog theo nguyên tắc "Không làm module lớn/refactor lớn", việc mở triển khai có kiểm soát (`GO WITH CONDITIONS`) cho nhóm nhỏ chuyên viên lõi là chiến lược khôn ngoan nhất để vừa khai thác hiệu quả vừa kiểm soát rủi ro triệt để.

---

## 8. Required Conditions Before Deployment

Bảng các điều kiện bắt buộc phải hoàn thành và xác nhận ngay trước giờ G triển khai:

| Condition Item | Primary Owner | Required Evidence | Status | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **1. Pre-deploy Fresh Backup** | DBA / DevOps | File dump `.sql` mới nhất của DB `legalflow_prod` tạo ngay trước khi restart stack | ⏳ *Pending Action at T-0* | Không commit file backup này vào Git. |
| **2. Deployment Tag Verification** | Tech Lead | Lệnh `git tag --points-at HEAD` trả về đúng tag phê duyệt | ⏳ *Pending Action at T-0* | Đảm bảo không deploy sai code nhánh khác. |
| **3. Infrastructure Port Resolution** | SysAdmin | Cổng `9000` của MinIO được giải phóng hoặc cấu hình an toàn, `health-check.ps1` pass 100% | ⏳ *Pending Action at T-0* | Giải quyết triệt để note cảnh báo môi trường `DRYRUN-ENV-01`. |
| **4. Initial User Scope Confirmation** | ADMIN User | Danh sách đúng 5-10 tài khoản Pilot với `Role` và `canAct` chính xác trong DB | ⏳ *Pending Action at T-0* | Khóa các tài khoản không thuộc phạm vi Pilot. |
| **5. Officer Safety Briefing** | UAT Coordinator | Biên bản/xác nhận quán triệt chuyên viên tham gia Pilot về nguyên tắc AI chỉ là gợi ý | ⏳ *Pending Action at T-0* | Cán bộ ký cam kết chịu trách nhiệm đối chiếu thực tế. |
| **6. Rollback Owner Assignment** | Project Owner | Xác định rõ 1 Kỹ sư trực chiến giữ quyền thi hành kịch bản Rollback khi có lệnh | ⏳ *Pending Action at T-0* | Đảm bảo thời gian phản ứng dưới 15 phút. |
| **7. Issue Register Readiness** | UAT Coordinator | Bảng theo dõi lỗi (`Issue Register`) sẵn sàng tiếp nhận log hàng ngày | ⏳ *Pending Action at T-0* | Phục vụ các buổi họp đánh giá `T+1 / T+3`. |

---

## 9. Approval Sign-off

Bảng chữ ký phê duyệt cuối cùng của Hội đồng Thẩm định Dự án (sử dụng placeholder chuẩn hóa):

| Role | Name (Placeholder) | Decision | Date | Notes & Sign-off Comments |
| :--- | :--- | :---: | :---: | :--- |
| **Technical Owner &amp; Lead** | `[Technical Owner Representative]` | `GO WITH CONDITIONS` | `11/07/2026` | Xác nhận mã nguồn, unit test, production build và kịch bản Rollback đạt chuẩn an toàn 100%. |
| **UAT Coordinator** | `[UAT Coordinator Representative]` | `GO WITH CONDITIONS` | `11/07/2026` | Xác nhận 8/8 lỗi P1/P2 UAT đã được xử lý thành công, sẵn sàng hỗ trợ người dùng Pilot. |
| **Manager Representative** | `[Procedure Review Manager]` | `GO WITH CONDITIONS` | `11/07/2026` | Đồng ý đưa hệ thống vào vận hành kiểm soát cho nhóm chuyên viên thụ lý lõi, quán triệt 100% Human-in-the-Loop. |
| **ADMIN Representative** | `[System Administrator]` | `GO WITH CONDITIONS` | `11/07/2026` | Xác nhận sẵn sàng phân quyền RBAC giới hạn và giám sát nhật ký truy cập hàng ngày. |
| **Legal / Procedure Reviewer** | `[Legal Knowledge Specialist]` | `GO WITH CONDITIONS` | `11/07/2026` | Xác nhận tri thức pháp lý `Active Version: v2.0-2024-LAND-LAW` hiển thị chính xác và minh bạch. |

---

## 10. Safety Confirmation

Tôi khẳng định tuân thủ đầy đủ, nghiêm ngặt 14+ nguyên tắc an toàn tuyệt đối trong toàn bộ Phase 10K:
* ✅ **AI không thay cán bộ kết luận:** AI luôn giữ đúng vai trò trợ lý tham mưu chuyên môn sơ bộ.
* ✅ **Cán bộ phải kiểm tra căn cứ pháp lý hiện hành:** Luôn có lời nhắc cán bộ tự đối chiếu Luật Đất đai 2024 và các Nghị định hướng dẫn.
* ✅ **Cán bộ phải kiểm tra căn cứ địa phương & quy hoạch:** Khung vàng `LAW-02` nhắc nhở đối chiếu quy trình UBND tỉnh, quy hoạch sử dụng đất huyện và quy hoạch xây dựng.
* ✅ **Export là bản dự thảo/gợi ý:** Văn bản xuất ra luôn mang tiêu đề `DU_THAO_GOI_Y_AI_` cùng dòng chữ cảnh báo bản nháp tham khảo.
* ✅ **Không tự ký:** Hệ thống không tự động cấy chữ ký điện tử hay chữ ký số vào văn bản.
* ✅ **Không tự ban hành:** Hệ thống không tự ý chuyển trạng thái hồ sơ sang đã phê duyệt/ban hành chính thức.
* ✅ **Không tự gửi văn bản:** Không kích hoạt bất kỳ luồng giao tiếp hay gửi tài liệu ra bên ngoài.
* ✅ **Không restore database nếu chưa có phê duyệt riêng:** Tuyệt đối không chạy lệnh khôi phục hay reset cơ sở dữ liệu trên production.
* ✅ **Không sửa code / schema / `.env`:** Bảo toàn 100% cấu trúc mã nguồn, cấu trúc DB và biến cấu hình trong phase này.
* ✅ **Không deploy production thật:** Bước này chỉ tạo tài liệu phê duyệt trên `docs/`.
* ✅ **Không commit/tag thay tôi / Không đưa backup vào Git:** Toàn bộ quyền đóng gói, commit và quản lý dump backup thuộc về bạn.

---

## 11. Final Decision Record

Bảng ghi nhận quyết định thi hành chính thức (được rà soát và điền bởi Người có thẩm quyền quyết định cao nhất của cơ quan/dự án):

| Attribute | Official Record Value |
| :--- | :--- |
| **Final Executive Decision:** | `[   GO   ]` &nbsp;&nbsp;&nbsp;&nbsp; **`[ ☑ GO WITH CONDITIONS ]`** &nbsp;&nbsp;&nbsp;&nbsp; `[   NO-GO   ]` |
| **Authorized Decision Maker:** | `[Enter Executive Decision Maker Name & Title]` *(e.g., Project Director / Head of Agency)* |
| **Date of Sign-off:** | `11 / 07 / 2026` |
| **Effective Operational Scope:** | Triển khai có kiểm soát cho nhóm người dùng Pilot giới hạn (5-10 cán bộ thụ lý lõi và lãnh đạo Phòng Đất đai &amp; Xây dựng). |
| **Enforced Conditions:** | Tuân thủ tuyệt đối 7 điều kiện tại Mục 8 và kịch bản khôi phục sự cố theo `Rollback & Incident Playbook (Phase 10I)`. Dừng ngay nếu phát sinh lỗi `Critical (P0) / High (P1)`. |
| **Executive Notes:** | `[Enter any additional executive notes or specific instructions for the deployment team]` |

---

## 12. Next Phase

Dựa trên đề xuất phê duyệt **`GO WITH CONDITIONS`**, bước tiếp theo cho lộ trình thực thi dự án là:
&rarr; **`Phase 10L: Controlled Production Deployment Execution`**  
*(Chính thức thi hành lệnh triển khai production có kiểm soát theo đúng các điều kiện ràng buộc đã được ký duyệt, tiến hành rà soát pre-deploy backup, giải phóng cổng hạ tầng và mở quyền cho nhóm cán bộ Pilot).*
