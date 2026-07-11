# LEGALFLOW V2 - PHASE 10P
# ADOPTION REVIEW SIGN-OFF

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.16-expanded-production-monitoring-adoption-review`  
**Ngày thẩm định & Ký duyệt:** 11/07/2026  
**Trạng thái Phê duyệt Đánh giá:** **`CONTINUE WITH TRAINING & CONTROLLED EXPANSION`** *(Tiếp tục mở rộng có kiểm soát kết hợp đào tạo hướng dẫn)*

---

## 1. Purpose

Tài liệu này là Biểu mẫu Ký xác nhận Đánh giá Theo dõi và Tiếp nhận sau Mở rộng Production (`Adoption Review Sign-off Form` - Phase 10P) của hệ thống LegalFlow V2. Biểu mẫu tổng hợp thông số mốc rà soát (`Review Baseline`), bảng rà soát 8 điều kiện theo dõi bắt buộc (`Review Checklist`), xác lập quyết định đánh giá chính thức (`Review Decision`), thiết lập các hành động điều phối kèm theo (`Conditions / Follow-up Actions`), và cung cấp khung ký nhận pháp lý cho Lãnh đạo Cơ quan, Kỹ sư Trưởng cùng Đại diện Người dùng trước khi bước vào giai đoạn rà soát áp dụng và tối ưu liên tục (`Phase 10Q`).

---

## 2. Review Baseline

Bảng ghi nhận cấu hình thông số kỹ thuật và tình trạng theo dõi hệ thống tại thời điểm lập biểu mẫu ký duyệt Phase 10P:

| Baseline Item | Recorded Value | Confirmed By | Notes & Baseline Assessment |
| :--- | :--- | :--- | :--- |
| **Current System Tag:** | `v2.10.15-controlled-production-expansion-execution` | Tech Lead | Điểm neo chuẩn xác sau khi hoàn tất thực thi mở rộng Phase 10O. |
| **Proposed Review Tag:** | `v2.10.16-expanded-production-monitoring-adoption-review` | Tech Lead | Tag định danh cho bộ hồ sơ đánh giá tiếp nhận Phase 10P. |
| **Active Expansion Wave:** | `Wave 2 - Expansion Officers &amp; One-Stop Shop` | UAT Coordinator | Đang giám sát thực tiễn nhóm cán bộ thụ lý P2 &amp; Một cửa. |
| **Monitoring Period:** | `Day 0 -> Day 3 Execution Monitoring` | SysAdmin | 72 giờ theo dõi liên tục sau mốc mở user mới Wave 2. |
| **Health-check Result:** | `legalflow_postgres` Up healthy > 2h; Proxy `healthy` | SysAdmin | Core DB &amp; Proxy 100% ổn định. MinIO port 9000 đang được xử lý. |
| **Issue Status Summary:** | `0 Critical / 0 High / 1 Env Note / 3 Backlogs` | Tech Lead | Khẳng định tuyệt đối 0 có lỗi chặn hay mất dữ liệu nào phát sinh. |
| **User Scope Status:** | `~25 - 34 Total Active Users` (`ADMIN/MANAGER/STAFF/VIEWER`) | Project Owner | Tuân thủ kỷ luật mở rộng từng bước, không mở đại trà. |

---

## 3. Review Checklist

Bảng kiểm chứng 8 điều kiện theo dõi và tiếp nhận bắt buộc phải đạt trước khi ký duyệt quyết định Phase 10P (`Review Verification Table`):

| Checklist Item | Required Confirmation Criteria | Confirmed? (`Yes/No/NA`) | Evidence & Reference Log | Notes & Compliance Assessment |
| :--- | :--- | :---: | :--- | :--- |
| **1. Health-check Stable** | Container DB PostgreSQL &amp; Caddy Proxy đạt trạng thái healthy > 2h | ✅ **Yes** | `docker ps` / `task-7015` log | DB &amp; Proxy chạy vô cùng vững chắc, không rò rỉ tài nguyên. |
| **2. No Critical Blocker** | Không có lỗi `Critical (P0)` gây mất dữ liệu hay sai phân quyền | ✅ **Yes** | `ISSUE_AND_FEEDBACK_SUMMARY` | 0 sự cố P0 từ mốc T-0 đến T+3 trên tất cả tài khoản Wave 2. |
| **3. No High Blocker** | Không có lỗi `High (P1)` vi phạm AI Governance hay Export Safety | ✅ **Yes** | `ISSUE_AND_FEEDBACK_SUMMARY` | 0 sự cố P1, các bản vá UAT giữ vững tuyệt đối 100%. |
| **4. AI Governance Understood** | 100% cán bộ mới ghi nhớ AI chỉ tham mưu, phải kiểm tra luật &amp; quy hoạch | ✅ **Yes** | Khảo sát `IND-04 / IND-07` | Cán bộ thụ lý chịu trách nhiệm pháp lý cao nhất về kết quả thẩm định. |
| **5. Export Safety Accepted** | File Word/PDF tải về mang tiền tố `DU_THAO_GOI_Y_AI_` &amp; watermark nháp | ✅ **Yes** | Khảo sát `IND-05 / SMK-06` | Ngăn chặn tuyệt đối rủi ro nhầm lẫn thành quyết định chính thức. |
| **6. Permission Accepted** | Khóa Khối 3.3 và AI với tài khoản `VIEWER`, đúng phân quyền `RBAC` | ✅ **Yes** | Role-based Access Control (`SMK-08`) | Đảm bảo an ninh thẩm quyền giữa 4 vai trò trên môi trường thật. |
| **7. Issue Register Maintained** | Sổ theo dõi lỗi sẵn sàng tiếp nhận, phân loại triage phản hồi mỗi chiều | ✅ **Yes** | `EXPANDED_USER_SUPPORT_ISSUE...` | Duy trì quy trình hỗ trợ 6 bước rõ ràng vào `16:30 PM` hàng ngày. |
| **8. Users Received Guidance** | Cán bộ mở rộng đã được hướng dẫn và sẵn sàng tham gia tập huấn thêm | ✅ **Yes** | `USER_ADOPTION_REVIEW.md` | Đề xuất tổ chức kèm cặp 1:1 và tập huấn ngắn `30-45 phút` tại Phase 10Q. |

---

## 4. Review Decision

Dựa trên kết quả hoàn tất 100% các tiêu chí kiểm chứng tại Mục 2 và Mục 3, Hội đồng Thẩm định Dự án chính thức xác nhận quyết định đánh giá tiếp nhận:

```markdown
[   ] CONTINUE CONTROLLED EXPANSION : Tiếp tục mở rộng ngay lập tức sang Wave tiếp theo không cần đào tạo.
[ X ] CONTINUE WITH TRAINING        : Tiếp tục mở rộng có kiểm soát kết hợp duy trì hỗ trợ và hướng dẫn đào tạo ngắn.
[   ] HOLD EXPANSION                : Tạm dừng mở rộng để theo dõi thêm tải hệ thống.
[   ] GO TO FIXES                   : Dừng mở rộng để tập trung sửa lỗi kỹ thuật.
[   ] STOP / ROLLBACK REVIEW        : Dừng khẩn cấp toàn hệ thống và khôi phục DB về bản sao lưu cũ.
```

&rarr; **`OFFICIAL REVIEW DECISION: CONTINUE WITH TRAINING & CONTROLLED EXPANSION`**  
*(ĐỒNG Ý TIẾP TỤC MỞ RỘNG TRIỂN KHAI CÓ KIỂM SOÁT KẾT HỢP DUY TRÌ HỖ TRỢ VÀ TẬP HUẤN ĐÀO TẠO NGẮN)*

---

## 5. Conditions / Follow-up Actions

Bảng quy định 6 hành động theo dõi và ràng buộc thực thi kèm theo quyết định `CONTINUE WITH TRAINING`:

| Condition / Follow-up Action | Assigned Owner | Due Date / Timeline | Priority | Notes & Governance Mandate |
| :--- | :--- | :--- | :---: | :--- |
| **ACT-01: Execute Targeted User Training (`BCK-09`)** <br/> Tổ chức các buổi hướng dẫn ngắn (`30-45 phút`) tại phòng chuyên môn 2 &amp; Một cửa để kèm cặp cách thao tác 7 tab và bộ lọc hồ sơ nhanh `CASELIST-02`. | UAT Coordinator / Support Lead | `T+3 Days` *(14/07/2026)* | `P1` | Tháo gỡ triệt để rào cản thói quen làm việc cũ cho cán bộ mở rộng. |
| **ACT-02: Resolve MinIO Port 9000 Conflict (`EXP-ENV-01`)** <br/> SysAdmin kiểm tra tiến trình chiếm cổng (`netstat -ano | findstr :9000` &rarr; `Stop-Process`) hoặc cấu hình port binding mới (`9001:9000`) để full stack Docker khởi động đồng bộ. | SysAdmin / Infra Team | `T+1 Day` *(12/07/2026)* | `P2` | Đảm bảo container MinIO chạy đồng bộ cùng `start-legalflow.ps1`. |
| **ACT-03: Maintain Daily Operator Checks** <br/> Kỹ sư trực chiến tiếp tục chạy rà soát `health-check.ps1` và `docker ps` lúc `08:00 AM & 16:30 PM` hàng ngày để bảo vệ sự ổn định của DB PostgreSQL. | DevOps Engineer | `Continuous` *(Hàng ngày)* | `P1` | Duy trì kỷ luật giám sát hệ thống 24/7. |
| **ACT-04: Manage Daily Issue Register Triage** <br/> Trợ lý UAT tiếp nhận, phân loại và cập nhật Sổ Hỗ trợ vào `16:30 PM` mỗi chiều, đảm bảo mọi ý kiến đóng góp (`Suggestion`) được đưa vào Backlog. | UAT Coordinator | `Continuous` *(Hàng ngày)* | `P1` | Đảm bảo tiếng nói của người dùng luôn được lắng nghe triệt để. |
| **ACT-05: Enforce AI &amp; Export Governance Mandates** <br/> Rà soát `Audit Log` định kỳ hàng tuần để khẳng định cán bộ tự kiểm tra căn cứ pháp lý/quy hoạch (`LAW-02`) và không ban hành trái phép file dự thảo `DU_THAO_GOI_Y_AI_`. | System Admin / Dept Head | `Weekly` *(Mỗi tuần 1 lần)* | `P1` | Giữ vững ranh giới trách nhiệm tối cao của con người (`Human-in-the-Loop`). |
| **ACT-06: Prepare Wave 3 Expansion Readiness** <br/> Sau khi hoàn tất 7 ngày giám sát Wave 2 ổn định và tập huấn xong, chuẩn bị bộ hồ sơ rà soát để trình phê duyệt mở kết nối cho nhóm Wave 3 (Tra cứu &amp; Giám sát viên). | Project Owner / Tech Lead | `T+7 Days` *(18/07/2026)* | `P2` | Sẵn sàng cho lộ trình mở rộng cuốn chiếu tiếp theo tại Phase 10Q. |

---

## 6. Sign-off

Bảng ký xác nhận phê duyệt đánh giá tiếp nhận của Hội đồng Thẩm định Dự án và Lãnh đạo Đơn vị (để trống thông tin cá nhân thực tế nếu chưa được cung cấp để cơ quan thẩm quyền điền):

| Role / Authority | Representative Name | Signature | Date of Sign-off | Decision | Official Notes & Sign-off Mandate |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **Project Owner / Sponsor** <br/> *(Chủ đầu tư / Lãnh đạo Đơn vị)* | `[                              ]` | `[             ]` | `[    /    / 2026 ]` | **`CONTINUE WITH TRAINING`** | Phê duyệt Báo cáo Đánh giá Tiếp nhận Phase 10P. Yêu cầu tuân thủ nghiêm túc 6 hành động ACT-01 -> ACT-06. |
| **Technical Lead** <br/> *(Quản lý Kỹ thuật &amp; Hạ tầng)* | `[                              ]` | `[             ]` | `[    /    / 2026 ]` | **`CONTINUE WITH TRAINING`** | Xác nhận hạ tầng DB `legalflow_postgres` và Proxy chạy cực kỳ vững chắc, 0 lỗi P0/P1 hay lỗi mã nguồn. |
| **UAT Coordinator / Dept Head** <br/> *(Lãnh đạo Phòng Chuyên môn)* | `[                              ]` | `[             ]` | `[    /    / 2026 ]` | **`CONTINUE WITH TRAINING`** | Xác nhận chuyên viên tiếp nhận tốt hệ thống. Quán triệt rà soát quy hoạch và tham gia tập huấn bổ sung ngắn. |
| **Core Officer Representative** <br/> *(Đại diện Chuyên viên Thụ lý)* | `[                              ]` | `[             ]` | `[    /    / 2026 ]` | **`CONTINUE WITH TRAINING`** | Cam kết tuân thủ rà soát con người (`Human-in-the-Loop`), không sử dụng dự thảo sai quy trình và tích cực góp ý. |

---

### Khẳng định An toàn Pháp lý & Kỹ thuật của Lực lượng Lập biểu mẫu:
Tôi xác nhận trong quá trình theo dõi, đánh giá tiếp nhận và lập bộ biểu mẫu Phase 10P đã tuân thủ tuyệt đối:
* ✅ **Không sửa đổi mã nguồn Backend / Frontend, không chỉnh sửa `schema.prisma`, migrations hay `.env`.**
* ✅ **Không can thiệp, xóa hay reset/restore cơ sở dữ liệu production `legalflow_prod`.**
* ✅ **Không mở rộng thêm người dùng thật trên DB trong phase này khi chưa có chữ ký thực tế của Lãnh đạo tại biểu mẫu này.**
* ✅ **Không ghi lại mật khẩu hay bí mật nhạy cảm vào tài liệu, không đưa file backup vào Git (`untracked`).**
* ✅ **Khẳng định nguyên tắc AI chỉ là gợi ý, văn bản export là dự thảo `DU_THAO_GOI_Y_AI_`, cán bộ chịu trách nhiệm pháp lý cao nhất.**

---
*Biểu mẫu Ký xác nhận Đánh giá Tiếp nhận được lập tự động chuẩn hóa từ hồ sơ giám sát hạ tầng và khảo sát người dùng Phase 10P.*
