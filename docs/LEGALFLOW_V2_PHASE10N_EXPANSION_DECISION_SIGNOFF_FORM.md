# LEGALFLOW V2 - PHASE 10N
# EXPANSION DECISION SIGN-OFF FORM

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.14-controlled-production-expansion-decision`  
**Ngày thẩm định & Ký duyệt:** 11/07/2026  
**Mức Quyết định Phê duyệt:** **`EXPAND WITH CONDITIONS`** *(Mở rộng có điều kiện / Từng bước cuốn chiếu)*

---

## 1. Purpose

Tài liệu này là Biểu mẫu Ký xác nhận Quyết định Mở rộng Phạm vi Production có Kiểm soát (`Expansion Decision Sign-off Form` - Phase 10N). Biểu mẫu cấu trúc hóa toàn bộ các thông số mốc hệ thống (`System Baseline`), ma trận rà soát 10 điều kiện tiên quyết (`Expansion Checklist`), khẳng định phương án phê duyệt của Hội đồng Thẩm định (`Decision`), xác lập các điều kiện kèm theo (`Conditions If Any`), và cung cấp khung ký nhận pháp lý chính thức cho Lãnh đạo Cơ quan, Kỹ sư Trưởng và Đại diện Người dùng trước khi thực thi tại Phase 10O.

---

## 2. System Baseline

Bảng ghi nhận cấu hình kỹ thuật và trạng thái vận hành hiện tại của hệ thống tại thời điểm thẩm định:

| Baseline Item | Recorded Value | Confirmed By | Notes & Baseline Assessment |
| :--- | :--- | :--- | :--- |
| **Current System Tag:** | `v2.10.13-post-deployment-monitoring-hypercare` | Tech Lead | Điểm neo chuẩn xác sau 3 ngày theo dõi Hypercare Phase 10M. |
| **Proposed Decision Tag:** | `v2.10.14-controlled-production-expansion-decision` | Tech Lead | Tag định danh cho bộ hồ sơ phê duyệt mở rộng Phase 10N. |
| **Deployment Status:** | `DEPLOYED WITH CONDITIONS` (`main` clean) | DevOps Lead | Triển khai ổn định từ Phase 10L, 129/129 unit tests pass. |
| **Hypercare Result:** | `STABLE WITH WARNINGS` (Day 1 -> Day 3) | UAT Coordinator | 72 giờ vận hành mượt mà, 0 lỗi P0/P1, DB healthy 100%. |
| **Backup Status:** | `legalflow_prod_predeploy...sql` (`951 KB`) | DBA / DevOps | File dump `.sql` sẵn sàng trong `backups/`, `untracked` ngoài Git. |
| **Rollback Status:** | `READY` (Rollback Protocol in 15 mins) | Tech Lead | Kịch bản khôi phục hạ tầng và mã nguồn đã được chuẩn hóa. |
| **Monitoring Status:** | `ACTIVE` (`health-check.ps1` &amp; Daily Template) | SysAdmin | Kỹ sư trực chiến kiểm tra đều đặn lúc 08:00 AM &amp; 16:30 PM. |
| **Current User Scope:** | `~12 - 19 Pilot Users` (`ADMIN/MANAGER/STAFF/VIEWER`) | Project Owner | Nhóm cán bộ Pilot cốt lõi hoạt động ổn định, đúng thẩm quyền. |

---

## 3. Expansion Checklist

Bảng kiểm chứng 10 điều kiện tiên quyết bắt buộc phải đạt trước khi ký duyệt mở rộng (`Expansion Verification Table`):

| Checklist Item | Required Confirmation Criteria | Confirmed? (`Yes/No/NA`) | Evidence & Reference | Notes & Compliance Status |
| :--- | :--- | :---: | :--- | :--- |
| **1. No Critical Blocker** | Không có lỗi `Critical (P0)` gây mất dữ liệu hay sai phân quyền | ✅ **Yes** | `HYPERCARE_ISSUE_REGISTER` | 0 sự cố P0 từ mốc T-0 đến T+3. |
| **2. No High Blocker** | Không có lỗi `High (P1)` vi phạm AI Governance hay Export Safety | ✅ **Yes** | `HYPERCARE_ISSUE_REGISTER` | 0 sự cố P1, các UAT fix giữ vững 100%. |
| **3. Health-check Stable** | Container Postgres DB &amp; Caddy Proxy đạt trạng thái healthy | ✅ **Yes** | `docker ps` / `health-check.ps1` | DB &amp; Proxy healthy > 30m. Cảnh báo MinIO port 9000 đã có hướng xử lý. |
| **4. Backup Ready** | File snapshot `.sql` an toàn sẵn sàng, untracked ngoài Git | ✅ **Yes** | `backups\` directory (`951 KB`) | **Không commit file backup lên Git**. |
| **5. Rollback Ready** | Kịch bản dừng khẩn cấp và khôi phục DB/Code sẵn sàng | ✅ **Yes** | `POST_DEPLOYMENT_MONITORING...md` | Quy trình ứng phó rủi ro trong 15 phút. |
| **6. Operator Assigned** | Bố trí Kỹ sư Quản trị trực chiến rà soát và hỗ trợ hàng ngày | ✅ **Yes** | `OPERATOR_DAILY_CHECK_TEMPLATE.md` | Lực lượng Kỹ thuật sẵn sàng cho các Wave mới. |
| **7. Issue Register Ready** | Sổ lỗi sẵn sàng tiếp nhận, phân loại triage phản hồi mỗi chiều | ✅ **Yes** | `HYPERCARE_ISSUE_REGISTER.md` | Tiếp nhận và xử lý lỗi lúc 16:30 PM. |
| **8. AI Governance Accepted** | Khung vàng *"⚠️ BẢN GỢI Ý AI"* hiển thị 100%, AI chỉ tham mưu | ✅ **Yes** | Khối 3.1 AI Review (`SMK-04/08`) | Cán bộ bắt buộc rà soát, chịu trách nhiệm pháp lý. |
| **9. Export Safety Accepted** | File Word/PDF tải về có prefix `DU_THAO_GOI_Y_AI_` &amp; watermark | ✅ **Yes** | Khối 3.3 Export Draft (`SMK-06`) | Ngăn chặn rủi ro nhầm lẫn thành quyết định chính thức. |
| **10. Permission Accepted** | Khóa Khối 3.3 và AI với tài khoản `VIEWER`, đúng quyền `RBAC` | ✅ **Yes** | Role-based Access Control (`SMK-08`) | Bảo đảm an ninh thẩm quyền giữa 4 vai trò. |

---

## 4. Decision

Dựa trên toàn bộ kết quả kiểm chứng tại Mục 2 và Mục 3, Hội đồng Thẩm định Dự án chính thức xác nhận lựa chọn phương án quyết định:

```markdown
[   ] EXPAND                 : Mở rộng toàn diện không giới hạn.
[ X ] EXPAND WITH CONDITIONS : Mở rộng có điều kiện / Cuốn chiếu từng bước theo lộ trình Wave 1 -> Wave 4.
[   ] DO NOT EXPAND          : Không mở rộng, tạm dừng để sửa chữa lỗi.
```

&rarr; **`FINAL APPROVED DECISION: EXPAND WITH CONDITIONS`** *(MỞ RỘNG TRIỂN KHAI CÓ ĐIỀU KIỆN)*

---

## 5. Conditions If Any

Bảng quy định 6 điều kiện bắt buộc và thời hạn hoàn thành gắn liền với quyết định `EXPAND WITH CONDITIONS`:

| Condition ID | Required Condition & Safeguate Mandate | Assigned Owner | Due Date / Milestone | Must Complete Before | Notes & Governance Enforcement |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **CND-01** | **Create Pre-expansion Backup:** Chạy lệnh `pg_dump` tạo snapshot `.sql` mới trước mỗi đợt Wave | DevOps / DBA | `T-0` *(Trước giờ G mỗi Wave)* | Kích hoạt mở quyền kết nối cho user mới | Bảo vệ 100% dữ liệu hồ sơ thực tế trong `legalflow_prod`. |
| **CND-02** | **Pre-wave Health-Check Verification:** Chạy `health-check.ps1` xác nhận Postgres DB &amp; Caddy Proxy healthy | SysAdmin | `T-0` *(Ngay trước mốc mở user)* | Phê duyệt danh sách tài khoản Wave | Đảm bảo hạ tầng ổn định trước tải người dùng mới. |
| **CND-03** | **Wave-based User Rollout:** Chỉ mở quyền truy cập theo đúng danh sách cán bộ được duyệt từng đợt (`Wave 1/2/3`) | Project Owner / Admin | `Continuous` *(Theo lộ trình)* | Cấp quyền trên bảng `users` | Tuyệt đối không mở đại trà ngoài danh sách phê duyệt. |
| **CND-04** | **Officer AI Governance Briefing:** Quán triệt 100% cán bộ mới về nguyên tắc AI chỉ là tham mưu sơ bộ | UAT Coordinator | `T-1` *(Trước ngày mở Wave)* | Cán bộ bắt đầu thao tác thụ lý hồ sơ | Cán bộ ký cam kết tự kiểm tra pháp lý và quy hoạch địa phương. |
| **CND-05** | **Maintain Daily Operator Checks:** Kỹ sư trực chiến duy trì kiểm tra `08:00 & 16:30` và chốt sổ lỗi hàng ngày | Tech Lead / DevOps | `Continuous` *(Trong suốt đợt mở)* | Kết thúc mỗi ngày làm việc | Đảm bảo phát hiện và xử lý sự cố trong vòng 15 phút. |
| **CND-06** | **Strict Abort Trigger Enforcement:** Dừng mở rộng ngay lập tức nếu phát sinh lỗi P0/P1 hoặc mất an toàn DB | Tech Lead | `Immediate` *(Khi có rủi ro P0/P1)* | Bất kỳ thao tác mở rộng nào tiếp theo | Kích hoạt kịch bản Rollback bảo vệ hệ thống. |

---

## 6. Sign-off

Bảng ký xác nhận phê duyệt chính thức của Hội đồng Thẩm định Dự án và Lãnh đạo Đơn vị (để trống thông tin cá nhân thực tế nếu chưa được cung cấp để cơ quan thẩm quyền điền):

| Role / Authority | Representative Name | Signature | Date of Sign-off | Decision | Official Notes & Sign-off Mandate |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Project Owner / Sponsor** <br/> *(Chủ đầu tư / Lãnh đạo Đơn vị)* | `[                              ]` | `[             ]` | `[    /    / 2026 ]` | **`EXPAND WITH CONDITIONS`** | Phê duyệt Kế hoạch Mở rộng cuốn chiếu Phase 10N. Yêu cầu tuân thủ triệt để 6 điều kiện CND-01 -> CND-06. |
| **Technical Lead** <br/> *(Quản lý Kỹ thuật &amp; Hạ tầng)* | `[                              ]` | `[             ]` | `[    /    / 2026 ]` | **`EXPAND WITH CONDITIONS`** | Xác nhận mã nguồn, DB `legalflow_prod` và cấu trúc hạ tầng đạt độ ổn định cao để mở rộng theo từng đợt. |
| **UAT Coordinator / Dept Head** <br/> *(Lãnh đạo Phòng Chuyên môn)* | `[                              ]` | `[             ]` | `[    /    / 2026 ]` | **`EXPAND WITH CONDITIONS`** | Xác nhận Khối 3.1, 3.2, 3.3 đáp ứng yêu cầu nghiệp vụ. Quán triệt cán bộ kiểm tra quy hoạch và luật. |
| **Core Officer Representative** <br/> *(Đại diện Chuyên viên Thụ lý)* | `[                              ]` | `[             ]` | `[    /    / 2026 ]` | **`EXPAND WITH CONDITIONS`** | Cam kết thực thi nghiêm túc rà soát con người (`Human-in-the-Loop`), không sử dụng dự thảo sai quy trình. |

---

### Khẳng định An toàn Pháp lý & Kỹ thuật của Lực lượng Lập báo cáo:
Tôi xác nhận trong quá trình tổng hợp và lập bộ hồ sơ quyết định Phase 10N đã tuân thủ tuyệt đối:
* ✅ **Không sửa đổi mã nguồn Backend / Frontend, không chỉnh sửa `schema.prisma`, migrations hay `.env`.**
* ✅ **Không can thiệp, xóa hay reset/restore cơ sở dữ liệu production `legalflow_prod`.**
* ✅ **Không tự mở rộng người dùng thật trên hệ thống khi chưa có chữ ký thực tế của Lãnh đạo tại biểu mẫu này.**
* ✅ **Không ghi lại mật khẩu hay bí mật nhạy cảm vào tài liệu, không đưa file backup vào Git (`untracked`).**
* ✅ **Khẳng định nguyên tắc AI chỉ là gợi ý, văn bản export là dự thảo `DU_THAO_GOI_Y_AI_`, cán bộ chịu trách nhiệm pháp lý cao nhất.**

---
*Biểu mẫu Ký xác nhận Quyết định Mở rộng được lập tự động chuẩn hóa từ hồ sơ rà soát Pilot UAT và Hypercare Phase 10N.*
