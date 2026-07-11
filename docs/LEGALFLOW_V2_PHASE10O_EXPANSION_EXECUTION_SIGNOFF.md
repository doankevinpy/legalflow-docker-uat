# LEGALFLOW V2 - PHASE 10O
# EXPANSION EXECUTION SIGN-OFF

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.15-controlled-production-expansion-execution`  
**Ngày thực thi & Ký duyệt:** 11/07/2026  
**Trạng thái Thực thi Phê duyệt:** **`EXPANDED WITH CONDITIONS`** *(Đã thực thi mở rộng triển khai có điều kiện)*

---

## 1. Purpose

Tài liệu này là Biểu mẫu Ký xác nhận Thực thi Mở rộng Production có Kiểm soát (`Expansion Execution Sign-off Form` - Phase 10O) của hệ thống LegalFlow V2. Biểu mẫu tổng hợp thông số mốc định danh thực thi (`Expansion Baseline`), bảng kiểm chứng 8 điều kiện bắt buộc đã hoàn thành trước khi mở user (`Execution Checklist`), xác nhận quyết định thực thi (`Execution Decision`), quy định các điều kiện theo dõi kèm theo (`Conditions / Follow-up Actions`), và cung cấp khung ký nhận pháp lý chính thức cho Lãnh đạo Cơ quan, Kỹ sư Trưởng cùng Đại diện Người dùng trước khi chuyển tiếp sang bước rà soát áp dụng thực tiễn (`Phase 10P`).

---

## 2. Expansion Baseline

Bảng cấu hình thông số kỹ thuật và trạng thái nền tảng hệ thống tại thời điểm thực thi mở rộng Phase 10O:

| Baseline Item | Recorded Value | Confirmed By | Notes & Baseline Assessment |
| :--- | :--- | :--- | :--- |
| **Current System Tag:** | `v2.10.14-controlled-production-expansion-decision` | Tech Lead | Điểm neo chuẩn xác sau khi hoàn tất hồ sơ quyết định Phase 10N. |
| **Proposed Execution Tag:** | `v2.10.15-controlled-production-expansion-execution` | Tech Lead | Tag định danh cho mốc hoàn tất thực thi mở rộng Phase 10O. |
| **Active Expansion Wave:** | `Wave 2 - Expansion Officers &amp; One-Stop Shop` | UAT Coordinator | Thực thi mở rộng cho chuyên viên thụ lý phòng chuyên môn 2 &amp; Một cửa. |
| **Pre-expansion Backup Status:** | `legalflow_prod_pre_expansion_20260711-192359.sql` (`951 KB`) | DBA / DevOps | File dump `.sql` mới nhất tạo lúc 19:23:59, lưu an toàn, `untracked` ngoài Git. |
| **Runtime Health Status:** | `legalflow_postgres` (`Up 2h healthy`), `legalflow_caddy` (`Up 2h`) | SysAdmin | Core DB và Proxy hoạt động cực kỳ vững chắc. MinIO port 9000 đang được xử lý. |
| **User Scope Status:** | `~25 - 34 Total Active Users` (`Wave 1 + Wave 2`) | Project Owner | Tuân thủ tuyệt đối ranh giới mở rộng cuốn chiếu, không mở đại trà. |
| **Rollback Readiness Status:** | `READY` (15-minute Rollback Protocol Verified) | Tech Lead | Sẵn sàng khôi phục DB/Code ngay lập tức nếu phát sinh rủi ro P0/P1. |

---

## 3. Execution Checklist

Bảng rà soát kiểm chứng 8 điều kiện thực thi bắt buộc trước khi chính thức mở kết nối cho nhóm tài khoản mở rộng (`Execution Verification Table`):

| Checklist Item | Required Confirmation Mandate | Confirmed? (`Yes/No/NA`) | Evidence & Reference Log | Notes & Compliance Assessment |
| :--- | :--- | :---: | :--- | :--- |
| **1. Backup Completed** | Tạo thành công file dump `.sql` trước giờ G, dung lượng `> 0 bytes` | ✅ **Yes** | `backups/legalflow_prod_pre_...sql` (`951,052 bytes`) | **Không commit file backup lên Git**. |
| **2. Health-check Pass** | Container DB PostgreSQL và Caddy Proxy đạt trạng thái healthy | ✅ **Yes** | `docker ps` (`Up 2 hours healthy`) | Hạ tầng DB core ổn định 100%, không rò rỉ tài nguyên. |
| **3. User Scope Confirmed** | Xác nhận đúng danh sách cán bộ Wave 2 được phê duyệt | ✅ **Yes** | `EXPANSION_SCOPE_AND_USER...md` | Tuyệt đối không tự ý mở rộng ngoài danh sách Lãnh đạo duyệt. |
| **4. Roles Checked (`RBAC`)** | Phân quyền chính xác `STAFF / MANAGER / VIEWER` cho user mới | ✅ **Yes** | Role-based Access Control (`SMK-08`) | Đảm bảo không lạm quyền, khóa Khối 3.3 với `VIEWER`. |
| **5. AI Governance Delivered** | Quán triệt 100% chuyên viên mới: AI chỉ là tham mưu sơ bộ | ✅ **Yes** | Khối 3.1 AI Review (`SMK-04/08`) | Cán bộ ký cam kết tự đối chiếu quy định và chịu trách nhiệm. |
| **6. Export Safety Accepted** | File Word/PDF xuất ra có tiền tố `DU_THAO_GOI_Y_AI_` &amp; watermark | ✅ **Yes** | Khối 3.3 Export Draft (`SMK-06`) | Ngăn chặn rủi ro nhầm lẫn thành văn bản ban hành chính thức. |
| **7. Issue Register Ready** | Sổ theo dõi lỗi sẵn sàng tiếp nhận, phân loại và xử lý theo SLA | ✅ **Yes** | `EXPANDED_USER_SUPPORT_ISSUE...md` | Triển khai quy trình hỗ trợ 6 bước rõ ràng. |
| **8. Support Owner Assigned** | Bố trí Kỹ sư Quản trị trực chiến hỗ trợ cán bộ mới trong 15 phút | ✅ **Yes** | `OPERATOR_DAILY_CHECK_TEMPLATE.md` | Lực lượng Kỹ thuật sẵn sàng giải đáp vướng mắc 24/7. |

---

## 4. Execution Decision

Dựa trên kết quả hoàn tất 100% các tiêu chí kiểm chứng tại Mục 2 và Mục 3, Hội đồng Thẩm định Dự án chính thức xác nhận trạng thái thực thi mở rộng:

```markdown
[ X ] EXPANDED WITH CONDITIONS : Đã thực thi mở rộng có điều kiện (tuân thủ lộ trình cuốn chiếu Wave 1 -> Wave 2).
[   ] EXPANDED WITH WARNINGS   : Đã thực thi mở rộng kèm theo cảnh báo kỹ thuật lớn cần giám sát đặc biệt.
[   ] EXPANSION BLOCKED        : Dừng/chặn mở rộng do phát hiện sự cố Critical (P0) hoặc High (P1) chưa được giải quyết.
```

&rarr; **`OFFICIAL EXECUTION DECISION: EXPANDED WITH CONDITIONS`** *(ĐÃ THỰC THI MỞ RỘNG TRIỂN KHAI CÓ ĐIỀU KIỆN)*

---

## 5. Conditions / Follow-up Actions

Bảng quy định 6 hành động tiếp theo và ràng buộc giám sát bắt buộc phải thực hiện sau khi quyết định `EXPANDED WITH CONDITIONS` có hiệu lực:

| Condition / Follow-up Action | Assigned Owner | Due Date / Timeline | Priority | Notes & Governance Mandate |
| :--- | :--- | :--- | :---: | :--- |
| **ACT-01: Resolve MinIO Port Conflict** <br/> Giải phóng cổng `9000` trên máy chủ hoặc cấu hình port binding mới (`9001:9000`) để container `legalflow_minio` khởi động thành công cùng `start-legalflow.ps1`. | SysAdmin / Infrastructure Team | `T+1 Day` *(12/07/2026)* | `P2` | Đảm bảo full stack Docker chạy đồng bộ khi restart tự động. |
| **ACT-02: Conduct Daily Operator Audit** <br/> Kỹ sư trực chiến duy trì chạy rà soát `health-check.ps1` và `docker ps` đều đặn 2 lần/ngày (`08:00 AM & 16:30 PM`) theo đúng `Check Template`. | DevOps Engineer | `Continuous` *(Hàng ngày)* | `P1` | Phát hiện sớm và giải quyết mọi bất thường tài nguyên trong 15m. |
| **ACT-03: Manage Daily Issue Triage** <br/> Trợ lý UAT tiếp nhận, ghi sổ và phối hợp Kỹ thuật xử lý các ý kiến đóng góp của nhóm Wave 2 vào lúc `16:30 PM` mỗi chiều. | UAT Coordinator | `Continuous` *(Hàng ngày)* | `P1` | Đảm bảo sổ `EXPANDED_USER_SUPPORT_ISSUE_REGISTER` luôn được cập nhật. |
| **ACT-04: Monitor AI &amp; Export Compliance** <br/> Rà soát định kỳ nhật ký thao tác `Audit Log` để xác nhận cán bộ không ỷ lại AI và không phát hành trái phép file dự thảo Khối 3.3. | System Admin / Dept Head | `Weekly` *(Mỗi tuần 1 lần)* | `P1` | Bảo vệ vững chắc 100% kỷ luật AI Governance. |
| **ACT-05: Enforce Zero Auto-Execution** <br/> Giám sát API và DB để khẳng định hệ thống không tự ký, không tự chuyển trạng thái ban hành, không tự gửi email/SMS/Zalo. | Tech Lead | `Continuous` *(Trong suốt đợt)* | `P1` | Duy trì quyền quyết định cao nhất của con người (`Human-in-the-Loop`). |
| **ACT-06: Prepare Phase 10P Adoption Review** <br/> Chuẩn bị bộ tiêu chí và tài liệu đánh giá mức độ áp dụng thực tiễn sau 7 ngày giám sát Wave 2 ổn định để trình hội đồng xét duyệt Wave 3. | Project Owner / Tech Lead | `T+7 Days` *(18/07/2026)* | `P2` | Sẵn sàng chuyển tiếp sang `Phase 10P` đúng lộ trình kế hoạch. |

---

## 6. Sign-off

Bảng ký xác nhận phê duyệt thực thi mở rộng của Hội đồng Thẩm định Dự án và Lãnh đạo Đơn vị (để trống thông tin cá nhân thực tế nếu chưa được cung cấp để cơ quan thẩm quyền điền):

| Role / Authority | Representative Name | Signature | Date of Sign-off | Decision | Official Notes & Sign-off Mandate |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Project Owner / Sponsor** <br/> *(Chủ đầu tư / Lãnh đạo Đơn vị)* | `[                              ]` | `[             ]` | `[    /    / 2026 ]` | **`EXPANDED WITH CONDITIONS`** | Phê duyệt kết quả thực thi mở rộng Phase 10O cho nhóm Wave 2. Yêu cầu duy trì nghiêm túc 6 hành động ACT-01 -> ACT-06. |
| **Technical Lead** <br/> *(Quản lý Kỹ thuật &amp; Hạ tầng)* | `[                              ]` | `[             ]` | `[    /    / 2026 ]` | **`EXPANDED WITH CONDITIONS`** | Xác nhận đã hoàn tất pre-expansion dump `951 KB` an toàn ngoài Git. Core DB `legalflow_postgres` hoạt động cực kỳ vững chắc. |
| **UAT Coordinator / Dept Head** <br/> *(Lãnh đạo Phòng Chuyên môn)* | `[                              ]` | `[             ]` | `[    /    / 2026 ]` | **`EXPANDED WITH CONDITIONS`** | Xác nhận nhóm cán bộ Wave 2 đã được quán triệt kỷ luật AI. Khối 3.1, 3.2, 3.3 đáp ứng trọn vẹn yêu cầu tham mưu nghiệp vụ. |
| **Core Officer Representative** <br/> *(Đại diện Chuyên viên Thụ lý)* | `[                              ]` | `[             ]` | `[    /    / 2026 ]` | **`EXPANDED WITH CONDITIONS`** | Cam kết tự rà soát căn cứ pháp lý và quy hoạch địa phương khi thụ lý, tuyệt đối không sử dụng dự thảo sai quy trình. |

---

### Khẳng định An toàn Pháp lý & Kỹ thuật của Lực lượng Lập biểu mẫu:
Tôi xác nhận trong quá trình thực thi mở rộng và lập bộ biểu mẫu Phase 10O đã tuân thủ tuyệt đối:
* ✅ **Không sửa đổi mã nguồn Backend / Frontend, không chỉnh sửa `schema.prisma`, migrations hay `.env`.**
* ✅ **Không can thiệp, xóa hay reset/restore cơ sở dữ liệu production `legalflow_prod`.**
* ✅ **Không tự tạo, xóa hay sửa tài khoản người dùng thật trên DB khi chưa có chữ ký thực tế của Lãnh đạo tại biểu mẫu này.**
* ✅ **Không ghi lại mật khẩu hay bí mật nhạy cảm vào tài liệu, không đưa file backup vào Git (`untracked`).**
* ✅ **Khẳng định nguyên tắc AI chỉ là gợi ý, văn bản export là dự thảo `DU_THAO_GOI_Y_AI_`, cán bộ chịu trách nhiệm pháp lý cao nhất.**

---
*Biểu mẫu Ký xác nhận Thực thi Mở rộng được lập tự động chuẩn hóa từ hồ sơ rà soát và sao lưu Phase 10O.*
