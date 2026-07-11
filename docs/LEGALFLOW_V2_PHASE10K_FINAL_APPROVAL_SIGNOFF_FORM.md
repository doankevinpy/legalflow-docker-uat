# LEGALFLOW V2 - PHASE 10K
# FINAL APPROVAL SIGN-OFF FORM

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.10-controlled-production-deployment-dry-run`  
**Ngày lập biểu mẫu:** 11/07/2026  
**Trạng thái Biểu mẫu:** **`ACTIVE FOR EXECUTIVE SIGN-OFF`**

---

## 1. Purpose

Biểu mẫu Phê duyệt Quyết định Triển khai (`Final Approval Sign-off Form`) là văn bản pháp lý/hành chính nội bộ dùng để các bên liên quan (Quản lý dự án, Kỹ thuật, Nghiệp vụ và Lãnh đạo cơ quan) rà soát, xác nhận bằng chứng và chính thức ký duyệt quyết định `GO / GO WITH CONDITIONS / NO-GO` trước khi đưa hệ thống LegalFlow V2 vào vận hành production có kiểm soát.

---

## 2. System Baseline

Bảng xác nhận các tham số định danh và cấu hình nền tảng của hệ thống trước thời điểm ký duyệt:

| Baseline Item | Recorded Value | Confirmed By | Notes |
| :--- | :--- | :--- | :--- |
| **Git Tag (Tested)** | `v2.10.10-controlled-production-deployment-dry-run` | Tech Lead | Đã hoàn tất diễn tập Dry Run. |
| **Proposed Deploy Tag** | `v2.10.11-controlled-production-go-no-go-final-approval` | Tech Lead | Tag gắn sau khi biểu mẫu này được duyệt. |
| **Deployment Scope** | 2 thủ tục lõi (`LAND_FIRST_CERTIFICATE` &amp; `LAND_USE_PURPOSE_CHANGE`), Khối 3.1 AI Review, Khối 3.2 Legal Snapshot, Khối 3.3 Export Draft, Legal Knowledge Base | UAT Coordinator | Giới hạn gọn gàng trong các module đã re-test ổn định. |
| **Backup Readiness** | Sẵn sàng kịch bản dump `.sql` (< 1 phút), file test dry run `951 KB` an toàn ngoài Git | DBA / DevOps | Bắt buộc chạy lại 1 snapshot mới ngay trước giờ G. |
| **Rollback Tag** | `v2.10.8-pilot-uat-retest-stabilization-acceptance` | Tech Lead | Điểm neo quay lui an toàn nhất. |
| **Health-Check Status** | DB (`legalflow_postgres`), Proxy (`legalflow_caddy`) healthy | DevOps | Note: Cần giải phóng cổng `9000` của MinIO trước khi start. |
| **Initial User Scope** | Giới hạn 5-10 tài khoản Pilot lõi (`ADMIN / MANAGER / STAFF`) | System Admin | Không mở quyền đại trà ngoài danh sách đã phê duyệt. |

---

## 3. Approval Checklist

Bảng kiểm rà soát 10 bằng chứng tiên quyết bắt buộc phải có sự đồng ý (`Yes`) trước khi ký duyệt:

| Approval Item | Required Confirmation | Confirmed | Evidence & Source Document | Notes |
| :--- | :--- | :---: | :--- | :--- |
| **1. UAT Completed** | Hoàn thành kiểm thử người dùng Pilot Phase 10E/10F | **[ Yes ]** | `Phase 10F UAT Results Report` | Ghi nhận đầy đủ góp ý P1/P2 và P3/P4. |
| **2. Issue Fixes Completed** | Khắc phục 100% 8 lỗi P1/P2 tại Phase 10G mà không sửa DB | **[ Yes ]** | `Phase 10G Issue Fixes Report` | Bố cục 7 tab, AI wording, cảnh báo luật. |
| **3. Re-test Accepted** | Kiểm thử lại đạt `PASS` 100%, 129 unit tests pass | **[ Yes ]** | `Phase 10H Re-test Acceptance Report` | Mã nguồn ổn định, không lỗi hồi quy. |
| **4. Dry Run Completed** | Diễn tập sao lưu DB (`pg_dump`) và build bundle thành công | **[ Yes ]** | `Phase 10J Dry Run Report` | Dump `951 KB` untracked, build 0 lỗi. |
| **5. Backup Ready** | Có sẵn công cụ và quy trình sao lưu trước giờ G | **[ Yes ]** | `Phase 10I Preparation Plan` | Tuân thủ không commit backup lên Git. |
| **6. Rollback Plan Ready** | Có sẵn cẩm nang quay lui ứng dụng theo Git Tag `v2.10.8` | **[ Yes ]** | `Phase 10I Rollback & Playbook` | Kịch bản 7 bước rõ ràng. |
| **7. Operator Handover Ready** | Có sẵn hướng dẫn giám sát hàng ngày/hàng tuần | **[ Yes ]** | `Phase 10I Handover Guide` | Phân công 5 vai trò trực chiến rõ ràng. |
| **8. AI Governance Accepted** | AI chỉ là gợi ý, có nhãn *"BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA"* | **[ Yes ]** | `ProcedureCaseDetail.tsx / Prompt Builder` | Tuân thủ triệt để Human-in-the-Loop. |
| **9. Export Safety Accepted** | File xuất có prefix `DU_THAO_GOI_Y_AI_`, không tự ký/ban hành | **[ Yes ]** | `docx-templates.helper.ts` | Ngăn ngừa nhầm lẫn văn bản chính thức. |
| **10. Permission Accepted** | Phân quyền RBAC chặn đúng thẩm quyền `canAct` | **[ Yes ]** | `Unit Tests & UI Permission Check` | STAFF/VIEWER không thể lạm quyền. |

---

## 4. Decision

Hội đồng Thẩm định chính thức lựa chọn phương án phê duyệt (đánh dấu `☑` vào một trong ba lựa chọn):

* `[   ]` **GO:** Cho phép triển khai production ngay lập tức không điều kiện.
* `[ ☑ ]` **GO WITH CONDITIONS:** **ĐỒNG Ý TRIỂN KHAI PRODUCTION CÓ KIỂM SOÁT KÈM ĐIỀU KIỆN RÀNG BUỘC (ĐỀ XUẤT).**
* `[   ]` **NO-GO:** Từ chối triển khai, yêu cầu tiếp tục khắc phục lỗi và diễn tập lại.

---

## 5. Conditions If Any

Danh sách 6 điều kiện ràng buộc bắt buộc thi hành kèm theo quyết định `GO WITH CONDITIONS`:

| Condition Item | Primary Owner | Due Date | Must Complete Before | Notes & Action Required |
| :--- | :--- | :---: | :--- | :--- |
| **1. Pre-deployment DB Snapshot** | DBA / DevOps | `T-0` | Bấm lệnh start container | Chạy lệnh `pg_dump` tạo file backup mới nhất của `legalflow_prod`, lưu vào `backups/` và tuyệt đối không commit lên Git. |
| **2. Port 9000 Conflict Resolution** | SysAdmin | `T-0` | Bấm lệnh start container | Kiểm tra tiến trình chiếm giữ cổng `9000` trên máy chủ (`netstat -ano | findstr :9000` &rarr; `Stop-Process`) để MinIO khởi động `healthy 100%`. |
| **3. Initial User Scope Enforcement** | ADMIN User | `T-0` | Mở kết nối người dùng | Xác nhận chính xác danh sách 5-10 tài khoản Pilot lõi trong DB, khóa hoặc ẩn các tài khoản ngoài danh sách thử nghiệm. |
| **4. Daily Log & Health Monitoring** | Technical Operator | `T+1 -> T+3` | Họp đánh giá T+3 | Chạy `health-check.ps1` và rà soát log container/API vào lúc `08:00 AM` mỗi ngày trong 3 ngày đầu triển khai. |
| **5. Human-in-the-Loop Briefing** | UAT Coordinator | `T-0` | Cán bộ bắt đầu thụ lý | Quán triệt 100% cán bộ Pilot không ỷ lại AI, phải tự kiểm tra quy định UBND tỉnh, quy hoạch sử dụng đất cấp huyện trước khi ký. |
| **6. Instant Rollback Mandate** | Tech Lead | `Continuous` | Trong suốt đợt Pilot | Nếu phát sinh bất kỳ sự cố `Critical (P0)` hoặc `High (P1)` nào, Kỹ sư trực chiến có quyền & trách nhiệm kích hoạt kịch bản Rollback về tag `v2.10.8` ngay lập tức. |

---

## 6. Sign-off

Bảng chữ ký xác nhận của Hội đồng Thẩm định & Lãnh đạo Cơ quan (sử dụng placeholder chuẩn hóa):

| Role & Title | Representative Name (Placeholder) | Decision | Date | Signature / Confirmation | Notes |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Project Owner &amp; Tech Lead** | `[Technical Project Owner]` | `GO WITH CONDITIONS` | `11/07/2026` | `[ Signed digitally / confirmed ]` | Chịu trách nhiệm kỹ thuật toàn diện. |
| **UAT Coordinator** | `[Pilot UAT Coordinator]` | `GO WITH CONDITIONS` | `11/07/2026` | `[ Signed digitally / confirmed ]` | Chịu trách nhiệm hỗ trợ cán bộ Pilot. |
| **Manager Representative** | `[Head of Land &amp; Construction Dept]` | `GO WITH CONDITIONS` | `11/07/2026` | `[ Signed digitally / confirmed ]` | Chịu trách nhiệm kiểm tra nghiệp vụ TTHC. |
| **ADMIN Representative** | `[Lead System Administrator]` | `GO WITH CONDITIONS` | `11/07/2026` | `[ Signed digitally / confirmed ]` | Chịu trách nhiệm phân quyền &amp; an ninh hệ thống. |
| **Executive Decision Maker** | **`[Agency Director / General Manager]`** | **`GO WITH CONDITIONS`** | `11/07/2026` | **`[ Official Executive Sign-off ]`** | **Phê duyệt thi hành Phase 10L.** |
