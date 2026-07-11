# LEGALFLOW V2 - PHASE 10N
# EXPANSION SCOPE & USER ROLLOUT PLAN

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.14-controlled-production-expansion-decision`  
**Trạng thái Tài liệu:** **`APPROVED ROLLOUT PLAN`** *(Kế hoạch Mở rộng Từng bước / Cuốn chiếu)*

---

## 1. Purpose

Tài liệu này là Kế hoạch Mở rộng Phạm vi và Lộ trình Triển khai Người dùng (`Expansion Scope & User Rollout Plan` - Phase 10N) của hệ thống LegalFlow V2 ngay sau khi hoàn tất giai đoạn kiểm soát `Controlled Production Deployment` và rà soát 3 ngày `Hypercare`. Kế hoạch xác định rõ các nguyên tắc an toàn, chia nhỏ lộ trình mở rộng thành 4 đợt cuốn chiếu (`Rollout Waves`), quy định ranh giới chức năng được phép theo vai trò (`Role-based Scope`), minh định danh mục tính năng mở rộng vs. danh mục tạm hoãn (`Backlog`), thiết lập mẫu thông báo giao tiếp nội bộ (`Communication Plan`) và các điều kiện dừng mở rộng khẩn cấp (`Stop Conditions`).

---

## 2. Expansion Principles

Toàn bộ quá trình mở rộng người dùng phải tuân thủ nghiêm ngặt 7 nguyên tắc an toàn cốt lõi:
1. **Mở rộng từng bước / Cuốn chiếu (`Controlled Wave Rollout`):** Mở rộng tuần tự theo từng nhóm nhỏ được phê duyệt trước (`Wave 1 -> Wave 4`), tuyệt đối **không mở đại trà ngay lập tức** ra toàn bộ đơn vị hay công dân.
2. **Sao lưu bắt buộc trước mỗi đợt (`Mandatory Wave Backups`):** Trước ngày kích hoạt bất kỳ đợt mở rộng nào, bộ phận Kỹ thuật bắt buộc phải thực thi lệnh `pg_dump` tạo snapshot `.sql` mới nhất (`untracked` ngoài Git).
3. **Kiểm tra dịch vụ bắt buộc trước mỗi đợt (`Pre-wave Health Checks`):** Kịch bản `health-check.ps1` và `docker ps` phải xác nhận Postgres DB và Caddy Proxy đạt trạng thái `healthy 100%` ngay trước khi mở quyền kết nối cho user mới.
4. **Luôn có người trực hỗ trợ (`Assigned Operator Support`):** Mỗi đợt mở rộng phải bố trí Lực lượng Trực chiến Kỹ thuật (`DevOps / SysAdmin`) và Trợ lý Nghiệp vụ (`UAT Coordinator`) sẵn sàng giải đáp và xử lý vướng mắc của chuyên viên trong vòng 15 phút.
5. **AI tuyệt đối chỉ là tham mưu (`AI Advisory Governance`):** Quán triệt đến từng chuyên viên mới: Trợ lý AI chỉ đóng vai trò gợi ý sơ bộ, cán bộ thụ lý là người bắt buộc phải rà soát, đối chiếu quy định pháp lý và chịu trách nhiệm cao nhất về kết quả thẩm định.
6. **Không dùng bản dự thảo để ban hành trái quy trình (`Draft Safeguard Enforcement`):** Mọi văn bản xuất ra từ Khối 3.3 mang tiền tố `DU_THAO_GOI_Y_AI_` chỉ phục vụ tham khảo thảo luận nội bộ; cán bộ không được phép sử dụng bản dự thảo chưa qua rà soát, chỉnh sửa, thẩm định và ký duyệt hợp lệ để ban hành ra ngoài.
7. **Không tự ký / gửi / ban hành (`Zero Auto-Execution`):** Hệ thống không thực hiện thao tác ký số tự động, không tự chuyển trạng thái ban hành và không tự động gửi thông báo ra kênh bên ngoài (`Email/SMS/Zalo`).

---

## 3. Proposed Rollout Waves

Bảng đề xuất lộ trình mở rộng người dùng cuốn chiếu qua 4 đợt (`Rollout Waves` - sử dụng placeholder chuẩn hóa, không ghi tên thực tế):

| Rollout Wave | Target User Group | Assigned Roles | Approx. Number of Users | Proposed Start Date | Entry & Prerequisites Conditions | Monitoring Requirement | Notes & Rollout Strategy |
| :---: | :--- | :---: | :---: | :---: | :--- | :--- | :--- |
| **Wave 1** | **Nhóm Pilot cốt lõi (Khởi động Phase 10O)** | `ADMIN` <br/> `MANAGER` <br/> `STAFF` <br/> `VIEWER` | `~12 - 19 users` | `T+0` <br/> *(Ngay sau Phase 10N)* | Hoàn tất phê duyệt Phase 10N, backup pre-wave `951 KB` sẵn sàng, DB `healthy 100%`. | Giám sát 100% thao tác hàng ngày qua `check template`, rà soát `Issue Register` lúc 16:30. | Chính thức xác nhận và giữ vững nhóm cán bộ Pilot đã tham gia UAT trên môi trường controlled production. |
| **Wave 2** | **Nhóm Chuyên viên &amp; Lãnh đạo Phòng Mở rộng** | `STAFF` <br/> `MANAGER` | `+10 - 15 users` <br/> *(Tổng ~25-34)* | `T+7 Days` <br/> *(Sau 1 tuần Wave 1)* | Wave 1 vận hành ổn định > 5 ngày làm việc, `0 Critical/High issues`, tạo file dump backup mới trước Wave 2. | Kiểm tra `health-check.ps1` 2 lần/ngày, trực chiến hỗ trợ cán bộ mới làm quen giao diện Tab 3. | Mở rộng thêm cho các cán bộ thụ lý hồ sơ đất đai thuộc bộ phận Một cửa và phòng chuyên môn thứ hai. |
| **Wave 3** | **Nhóm Tra cứu, Khảo sát &amp; Giám sát viên** | `VIEWER` <br/> `STAFF` | `+15 - 20 users` <br/> *(Tổng ~40-54)* | `T+14 Days` <br/> *(Sau 2 tuần Wave 1)* | Wave 2 ổn định, rà soát tải DB trên container Postgres bình thường, tạo file dump backup mới trước Wave 3. | Giám sát tính chính xác của phân quyền `canAct: false` đối với `VIEWER` mới, đảm bảo không lạm quyền Khối 3.3. | Mở rộng cho các cán bộ tra cứu, thanh tra nghiệp vụ hoặc chuyên viên hỗ trợ khảo sát thực địa. |
| **Wave 4** | **Xem xét Mở rộng Toàn bộ Đơn vị (`General Rollout Review`)** | `ADMIN` <br/> `MANAGER` <br/> `STAFF` <br/> `VIEWER` | `Entire Unit` <br/> *(Theo nhu cầu)* | `T+30 Days` <br/> *(Sau 1 tháng)* | Hoàn tất rà soát đánh giá tổng thể 1 tháng (`Monthly Stability Audit`), `0 Critical/High issues`, hạ tầng máy chủ được tối ưu. | Đánh giá tổng tải hệ thống (`System Load Benchmark`), thiết lập lịch bảo trì và sao lưu tự động định kỳ an toàn. | Mở rộng bao phủ toàn bộ đơn vị chuyên môn sau khi các chốt chặn an toàn đã được thử thách đầy đủ. |

---

## 4. Role-based Expansion Scope

Bảng quy định ranh giới chức năng được phép và hạn chế cho từng vai trò người dùng (`Role-based Expansion Scope`):

| Role | Allowed Scope & Permissions | Enforced Restrictions & Safeguards | Monitoring Notes & RBAC Audit |
| :---: | :--- | :--- | :--- |
| **`ADMIN`** <br/> *(Quản trị Hệ thống)* | • Quản lý danh sách người dùng, gán quyền `Role` (`STAFF/MANAGER/VIEWER`).<br/>• Giám sát tình trạng tài nguyên container (`docker ps`), chạy `health-check.ps1`.<br/>• Rà soát `Audit Log` và cơ sở tri thức `Legal Knowledge Base`. | • **Không được tự ý thụ lý hay phê duyệt hồ sơ nghiệp vụ thay chuyên viên.**<br/>• Không được can thiệp xóa hay sửa đổi trực tiếp dữ liệu trong bảng DB thực tế. | Giám sát các thao tác gán quyền hoặc reset mật khẩu của `ADMIN` trên hệ thống log hàng ngày. |
| **`MANAGER`** <br/> *(Lãnh đạo Phòng)* | • Xem trọn vẹn 7 tab chi tiết của tất cả hồ sơ trong phòng.<br/>• Rà soát Khối 3.1 AI Review, kiểm tra Khối 3.2 Legal Snapshot.<br/>• Tải bản dự thảo Khối 3.3 (`DU_THAO_GOI_Y_AI_`) để đối chiếu, phê duyệt nghiệp vụ hợp lệ. | • **Không được sử dụng bản dự thảo chưa ký duyệt thực tế để phát hành ra ngoài.**<br/>• Phải đối chiếu quy định UBND tỉnh và quy hoạch sử dụng đất cấp huyện trước khi duyệt (`LAW-02`). | Theo dõi tỷ lệ đồng ý/chỉnh sửa của `MANAGER` đối với các phiếu thẩm định do AI gợi ý. |
| **`STAFF`** <br/> *(Chuyên viên Thụ lý)* | • Tiếp nhận, tìm kiếm và lọc hồ sơ theo lĩnh vực (`CASELIST-02`).<br/>• Kích hoạt nút chạy AI rà soát tại Khối 3.1 Tab 3 (`AI-01`).<br/>• Tải bản dự thảo Word (`.docx`) / PDF với prefix `DU_THAO_GOI_Y_AI_` từ Khối 3.3 (`SMK-06`). | • **Bắt buộc tự rà soát, đối chiếu pháp lý, không ỷ lại 100% vào kết quả AI (`AI-04`).**<br/>• Bắt buộc rà soát căn cứ địa phương &amp; quy hoạch sử dụng đất cấp huyện (`LAW-02`). | Giám sát tần suất chạy AI Khối 3.1 và thao tác xuất file dự thảo của nhóm `STAFF` trên các hồ sơ mới. |
| **`VIEWER`** <br/> *(Cán bộ Tra cứu)* | • Xem danh sách hồ sơ và tra cứu thông tin chung trên Tab 1 và Tab 4.<br/>• Tra cứu từ khóa trong cơ sở tri thức `Legal Knowledge Base` (`LK-01`). | • **Khóa tuyệt đối Khối 3.3 với thông báo đỏ `🚫 Bạn không có quyền xem trước/in/xuất...`.**<br/>• Ẩn/vô hiệu hóa nút chạy AI rà soát Khối 3.1 (`RBAC Enforcement`). | Kiểm tra định kỳ log API để xác nhận tài khoản `VIEWER` không thể gửi yêu cầu POST chạy AI hay Export. |

---

## 5. Features Included in Expansion

Danh mục 9 nhóm tính năng và bộ điều khiển được chính thức đưa vào phạm vi mở rộng phục vụ cán bộ:
1. **Login &amp; Authentication (`Auth System`):** Đăng nhập bảo mật qua JWT token, chuyển hướng thông minh theo quyền hạn.
2. **Case List &amp; Dynamic Filters (`CASELIST-02`):** Danh sách hồ sơ TTHC với bộ lọc lĩnh vực `Đất đai / Xây dựng`, bộ lọc trạng thái và sắp xếp chuẩn `receivedAt DESC`.
3. **Case Detail &amp; 7 Tabs Architecture (`UX-05`):** Bố cục 7 tab nghiệp vụ (`Thông tin -> Checklist -> AI Review -> Tài liệu -> Tài chính -> Ghi chú -> Audit Log`) rõ ràng, mượt mà.
4. **AI Review Module (`Khối 3.1`):** Trợ lý AI tham mưu rà soát cấp GCN lần đầu &amp; Chuyển mục đích sử dụng đất với văn phong khách quan (`AI-01`) và khung viền xanh nổi bật.
5. **Legal Snapshot &amp; Law Warnings (`Khối 3.2`):** Ghi nhận chính xác metadata căn cứ pháp lý gắn với lượt chạy AI, hiển thị rõ huy hiệu `Active Version: v2.0-2024-LAND-LAW` và lời nhắc rà soát 3 căn cứ địa phương/quy hoạch (`LAW-02`).
6. **Export Draft Module (`Khối 3.3`):** Xuất bản dự thảo Word (`.docx`) và PDF phiếu rà soát với tiền tố bắt buộc `DU_THAO_GOI_Y_AI_`, kèm watermark tham khảo nội bộ.
7. **Legal Knowledge Base (`LK-01`):** Tra cứu nhanh từ khóa từ Luật Đất đai 2024, bảo đảm đồng bộ tri thức trung ương.
8. **Friendly Error &amp; Empty States (`CASELIST-01`, `DETAIL-02`):** Thẻ thông báo lỗi và thẻ trống tài liệu thiết kế chuẩn UX, giúp cán bộ không bị nhầm lẫn với lỗi crash hệ thống.
9. **Role-based Permission Controls (`RBAC`):** Phân định rạch ròi thẩm quyền giữa 4 vai trò `ADMIN / MANAGER / STAFF / VIEWER`, tự động khóa chức năng nhạy cảm.

---

## 6. Features Excluded / Backlog

Danh mục các tính năng, module nâng cao tạm thời **CHƯA BAO GỒM trong đợt mở rộng này** (được giữ trong `Deferred Backlog`):
* ⏸ **Upload / Tải hồ sơ scan OCR:** Module tự động nhận dạng chữ in và bóc tách tài liệu đính kèm scan `.pdf / .jpg`.
* ⏸ **Rich Text Editor trước khi Export:** Trình soạn thảo văn bản trực tiếp trên trình duyệt cho phép chuyên viên sửa chữ, căn lề trong Khối 3.3 trước khi bấm tải file `.docx`.
* ⏸ **Internal Comment &amp; Discussion Threads:** Luồng thảo luận, ghi chú ý kiến trao đổi qua lại giữa chuyên viên và lãnh đạo trực tiếp trên Tab 6.
* ⏸ **Multi-step Approval Workflow mới:** Luồng trình ký duyệt nhiều cấp (Chuyên viên &rarr; Phó Phòng &rarr; Trưởng Phòng &rarr; Lãnh đạo Đơn vị) tích hợp chữ ký số.
* ⏸ **Lịch sử nhiều phiên AI analysis chi tiết:** Lưu trữ và so sánh chi tiết (`diff`) giữa nhiều lần chạy AI Khối 3.1 khác nhau trên cùng một hồ sơ qua các thời kỳ.
* ⏸ **Trạng thái xử lý chi tiết mới:** Bổ sung các sub-state nghiệp vụ phức tạp (như `WAITING_FOR_TAX`, `SUPPLEMENT_REQUESTED_TWICE`).
* ⏸ **Mở rộng đại trà toàn bộ đơn vị (`General Availability`):** Chưa mở cho toàn bộ nhân sự khi chưa hoàn tất kiểm chứng đợt Wave 1 và Wave 2.

---

## 7. Communication Plan

Mẫu thông báo nội bộ (`Internal Expansion Broadcast Template`) chuẩn hóa dùng để gửi cho các cán bộ khi bắt đầu mở rộng Wave 1 / Wave 2:

```markdown
Kính gửi: Lãnh đạo và Chuyên viên thuộc Danh sách Mở rộng Triển khai LegalFlow V2 (Wave X),

Thực hiện Kế hoạch Triển khai Production có kiểm soát (Phase 10N), Ban Quản lý Dự án xin trân trọng thông báo về việc chính thức mở quyền truy cập hệ thống Hỗ trợ Thẩm định Hồ sơ Đất đai & Xây dựng (LegalFlow V2) trên môi trường làm việc thực tế cho Quý Cán bộ:

1. MỤC TIÊU SỬ DỤNG:
Hệ thống cung cấp công cụ rà soát nhanh hồ sơ TTHC đất đai, tra cứu Luật Đất đai 2024 và hỗ trợ tham mưu phiếu thẩm định thông qua Trợ lý AI Khối 3.1 nhằm giảm tải thời gian xử lý nghiệp vụ cho chuyên viên.

2. PHẠM VI ÁP DỤNG:
- Địa chỉ truy cập proxy: http://kevindoan-legalflow.local:8080 (hoặc http://localhost:5173).
- Áp dụng cho 02 thủ tục lõi: (1) Cấp Giấy chứng nhận quyền sử dụng đất lần đầu; (2) Chuyển mục đích sử dụng đất.

3. NGUYÊN TẮC QUẢN TRỊ AI (AI GOVERNANCE):
⚠️ TRỢ LÝ AI CHỈ LÀ CÔNG CỤ GỢI Ý THAM MƯU KHÁCH QUAN. AI KHÔNG CÓ THẨM QUYỀN KẾT LUẬN HỒ SƠ HỢP LỆ HAY KHƯỚC TỪ.
👉 Cán bộ thụ lý (STAFF) và Lãnh đạo phòng (MANAGER) BẮT BUỘC phải tự kiểm tra, đối chiếu quy định Luật Đất đai 2024, quy trình nội bộ UBND tỉnh, và quy hoạch/kế hoạch sử dụng đất cấp huyện trước khi ra quyết định. Cán bộ chịu trách nhiệm pháp lý cao nhất về kết quả thẩm định.

4. AN TOÀN XUẤT VĂN BẢN (EXPORT SAFETY):
- Mọi phiếu rà soát tải về từ Khối 3.3 đều có tiền tố "DU_THAO_GOI_Y_AI_" (ví dụ: DU_THAO_GOI_Y_AI_Phieu_ra_soat_#001.docx).
- Đây là tài liệu DỰ THẢO THAM KHẢO NỘI BỘ, tuyệt đối KHÔNG ĐƯỢC PHÉP đóng dấu hay gửi công dân khi chưa qua quy trình thẩm định, chỉnh sửa và ký duyệt chính thức ngoài thực tế.

5. KÊNH HỖ TRỢ & BÁO CÁO SỰ CỐ:
- Trong quá trình thao tác, nếu gặp vướng mắc hoặc phát hiện lỗi, Quý Cán bộ vui lòng thông báo ngay cho Kỹ sư Quản trị trực chiến hoặc Trợ lý UAT để được hỗ trợ tức thời (thời gian phản hồi trong 15 phút).
- Sổ lỗi (Issue Register) được tiếp nhận và xử lý hàng ngày vào 16:30 PM.

Trân trọng cảm ơn sự hợp tác và đóng góp của Quý Cán bộ!
--- Ban Quản lý Dự án LegalFlow V2 ---
```

---

## 8. Stop Conditions

Quy trình mở rộng người dùng cuốn chiếu sẽ lập tức **BỊ DỪNG / TẠM HOÃN (`EMERGENCY ABORT & ROLLBACK`)** nếu xảy ra 1 trong 7 điều kiện chốt chặn khẩn cấp:
1. 🛑 **Phát sinh lỗi Mất hay Sai lệch Dữ liệu (`Data Loss / Corruption` - P0):** Ghi nhận dữ liệu hồ sơ trong `legalflow_prod` bị xóa, ghi đè hoặc sai lệch khi có nhiều cán bộ truy cập đồng thời.
2. 🛑 **Lỗi Phân quyền Nghiêm trọng (`RBAC Privilege Escalation` - P0):** Tài khoản `VIEWER` hoặc `STAFF` của nhóm mở rộng mới có thể truy cập trái phép menu quản trị hoặc vượt quyền ban hành hồ sơ.
3. 🛑 **AI vi phạm Quản trị, Gây hiểu nhầm (`AI Governance Violation` - P0/P1):** Trợ lý AI tự động khẳng định hồ sơ hợp lệ tuyệt đối thay quyền cán bộ hoặc bị mất nhãn viền vàng *"⚠️ BẢN GỢI Ý AI"*.
4. 🛑 **Export vi phạm ranh giới bản nháp (`Export Safeguard Failure` - P0/P1):** File Word/PDF xuất ra bị mất tiền tố `DU_THAO_GOI_Y_AI_` hoặc tự động cấy chữ ký/con dấu giả lập gây nhầm lẫn là quyết định chính thức.
5. 🛑 **Health-Check Fail Kéo dài (`Core Service Down` - P1):** Container cơ sở dữ liệu `legalflow_postgres` hoặc proxy `legalflow_caddy` bị quá tải, crash và không thể khôi phục sau 30 phút.
6. 🛑 **Cơ chế Backup Thất bại (`Pre-wave Backup Failure` - P1):** Lệnh `pg_dump` trước mốc mở user mới gặp lỗi, không thể tạo file dump `.sql` an toàn.
7. 🛑 **Lỗi Critical / High Chưa được Khắc phục (`Unresolved Blockers` - P1):** Tồn tại sự cố P0/P1 trong `Issue Register` nhưng chưa có bản vá `Stabilization Patch` được nghiệm thu hoàn chỉnh.

---
*Kế hoạch Mở rộng Phạm vi & Lộ trình Triển khai Người dùng cuốn chiếu được xây dựng tự động chuẩn hóa từ hồ sơ phê duyệt Phase 10N.*
