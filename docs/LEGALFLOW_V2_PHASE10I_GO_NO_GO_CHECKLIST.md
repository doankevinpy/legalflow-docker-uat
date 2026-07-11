# LEGALFLOW V2 - PHASE 10I
# GO / NO-GO CHECKLIST

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản kiểm tra:** `v2.10.8-pilot-uat-retest-stabilization-acceptance`  
**Ngày rà soát:** 11/07/2026  
**Trạng thái Bảng kiểm:** `ACTIVE FOR DEPLOYMENT SIGN-OFF`

---

## 1. Purpose

Bảng kiểm (`Go / No-Go Checklist`) là công cụ rà soát bắt buộc được sử dụng bởi Nhóm Quản lý Dự án, Quản trị Kỹ thuật và Lãnh đạo Nghiệp vụ nhằm đánh giá toàn diện sự sẵn sàng của hệ thống LegalFlow V2 trước thời điểm mở quyền truy cập cho người dùng trong đợt triển khai production có kiểm soát (`Controlled Production Deployment`). Việc ra quyết định `GO` đòi hỏi tất cả các tiêu chí kỹ thuật, chức năng và an toàn pháp lý AI phải đạt điều kiện quy định.

---

## 2. Technical Go / No-Go

Bảng rà soát các điều kiện kỹ thuật hạ tầng, mã nguồn và cơ sở dữ liệu:

| Check ID | Check Item | Command / Evidence | Expected Result | Actual Result | Decision | Owner | Notes |
| :---: | :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| **TEC-01** | Git Working Tree Status | `git status` | Clean working tree, không có file sửa đổi | `nothing to commit, working tree clean` | ✅ **GO** | Tech Lead | Repository sạch tuyệt đối. |
| **TEC-02** | Baseline Git Tag | `git tag --points-at HEAD` | Trỏ vào tag `v2.10.8` | `v2.10.8-pilot-uat-retest-stabilization-acceptance` | ✅ **GO** | Tech Lead | Đúng mốc ổn định sau re-test Phase 10H. |
| **TEC-03** | Prisma Client Generation | `npx prisma generate` (Backend) | Tạo thành công Prisma Client | `Generated Prisma Client (v7.8.0)` | ✅ **GO** | Backend Dev | Khớp hoàn toàn với schema hiện tại. |
| **TEC-04** | Database Migrate Status | `npx prisma migrate status` (Backend) | Schema đồng bộ 100%, 0 pending | `Database schema is up to date!` | ✅ **GO** | DBA / DevOps | 6 migrations đã áp dụng chuẩn xác. |
| **TEC-05** | Backend Unit Tests | `npm test` (Backend) | 100% Unit Tests pass | `129 passed, 129 total across 11 suites` | ✅ **GO** | QC Engineer | Không phát sinh lỗi logic hay hồi quy. |
| **TEC-06** | Backend Production Build | `npm run build` (Backend) | Build thành công không lỗi | `nest build` completed (`0 errors`) | ✅ **GO** | Backend Dev | Dist bundle backend hợp lệ. |
| **TEC-07** | Frontend Production Build | `npm run build` (Frontend) | TS check pass, Vite build bundle ok | `built in 1.57s`, `0 errors` | ✅ **GO** | Frontend Dev | Bundle static frontend sẵn sàng. |
| **TEC-08** | Runtime Infrastructure | `health-check.ps1` / Docker ps | Các container lõi (Postgres, Caddy) chạy ổn định | `legalflow_postgres`, `legalflow_caddy` running | ✅ **GO** | DevOps | Hạ tầng lưu trữ và proxy phản hồi tốt. |
| **TEC-09** | Database Backup Readiness | Kiểm tra file dump/backup gần nhất | Tồn tại bản backup DB `legalflow_prod` trước giờ G | File `.sql` snapshot đã lưu trên ổ cứng | ✅ **GO** | DBA | Sẵn sàng khôi phục nếu phát sinh lỗi nghiêm trọng. |
| **TEC-10** | Rollback Tag Identification | Kiểm tra git tag liền trước | Xác định rõ tag quay lui an toàn | `v2.10.7-pilot-uat-issue-fixes-stabilization-complete` | ✅ **GO** | Tech Lead | Kịch bản rollback đã được lập tài liệu. |

---

## 3. Functional Go / No-Go

Bảng kiểm chứng các luồng nghiệp vụ cốt lõi trên giao diện người dùng:

| Area | Scenario | Expected Result | Decision | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **Login & Authentication** | Đăng nhập với tài khoản Pilot Cán bộ / Lãnh đạo | Đăng nhập thành công, chuyển hướng vào màn hình danh sách hồ sơ TTHC | ✅ **GO** | Phân quyền token JWT hoạt động mượt mà. |
| **Danh sách hồ sơ (`Case List`)** | Lọc hồ sơ theo từ khóa, lĩnh vực (Đất đai, Xây dựng), trạng thái | Bộ lọc phản hồi nhanh, tự động sắp xếp ngày tiếp nhận mới nhất lên trên (`receivedAt DESC`) | ✅ **GO** | Huy hiệu màu sắc hiển thị trực quan (`CASELIST-02`). |
| **Chi tiết hồ sơ (`Case Detail`)** | Chuyển đổi qua lại giữa 7 Tab nghiệp vụ theo tiến trình thụ lý (`UX-05`) | Các tab 1-7 tải nội dung chuẩn, giữ đúng trạng thái `activeTab` | ✅ **GO** | Thứ tự tab tuân thủ sát tiến trình thực tế. |
| **AI Review (`Khối 3.1`)** | Bấm nút chạy rà soát AI hồ sơ Cấp GCN lần đầu hoặc Chuyển mục đích | AI trả về phân tích chuyên môn chi tiết trong khung Khối 3.1, không báo lỗi | ✅ **GO** | Văn phong tham mưu hành chính (`AI-01`, `AI-04`). |
| **Legal Snapshot (`Khối 3.2`)** | Kiểm tra thông tin căn cứ pháp lý và các cảnh báo quy định địa phương | Hiển thị rõ `Active Version: v2.0-2024-LAND-LAW` và khung cảnh báo vàng `LAW-02` | ✅ **GO** | Minh bạch hóa bộ luật áp dụng (`LK-01`). |
| **Export Draft (`Khối 3.3`)** | Thao tác `Xem bản dự thảo`, `In bản gợi ý AI`, `Xuất Word (.docx)`, `Xuất PDF` | Tải về file/mở preview chính xác, các nút có tooltip giải thích rõ ràng | ✅ **GO** | Tiêu đề file có prefix chuẩn `DU_THAO_GOI_Y_AI_`. |
| **Legal Knowledge Base** | Tra cứu từ khóa luật, rà soát các điều khoản Luật Đất đai 2024 | Trả về danh sách điều khoản khớp từ khóa, hiển thị metadata chuẩn | ✅ **GO** | Tra cứu tốc độ cao, độ chính xác cao. |
| **Permission (`RBAC`)** | Thử truy cập nút rà soát/xuất báo cáo bằng tài khoản `VIEWER` (không có quyền `canAct`) | Khung Khối 3.3 hiển thị cảnh báo `🚫 Bạn không có quyền xem trước/in/xuất...` | ✅ **GO** | Bảo mật đúng ranh giới trách nhiệm. |
| **Error State (`CASELIST-01`)** | Giả lập mất kết nối API khi tải danh sách hồ sơ | Hiển thị thẻ cảnh báo lỗi `⚠️ Không tải được danh sách hồ sơ` + nút `Thử lại` | ✅ **GO** | Không bị nhầm lẫn thành bảng trống không có hồ sơ. |
| **Empty State (`DETAIL-02`)** | Truy cập hồ sơ mới chưa có tài liệu đính kèm hay mục checklist | Hiển thị thẻ `📁 Chưa có tài liệu đính kèm...` / `📋 Chưa có mục checklist...` | ✅ **GO** | Hướng dẫn cụ thể bước tiếp theo cho chuyên viên. |

---

## 4. AI Governance Go / No-Go

Bảng kiểm chứng tuân thủ các nguyên tắc quản trị an toàn AI (`AI Safety & Governance`):

| Governance Item | Expected Control | Decision | Evidence | Notes |
| :--- | :--- | :---: | :--- | :--- |
| **AI Safety Warning Display** | Mọi khung rà soát AI phải kèm nhãn: *"BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA"* | ✅ **GO** | `ProcedureCaseDetail.tsx (Khối 3.1 & 3.3)` | Cảnh báo viền vàng/amber hiển thị 100% thời gian. |
| **No Automated Conclusion** | AI tuyệt đối không dùng từ ngữ khẳng định tuyệt đối (`Hợp lệ/Không hợp lệ`, `Cho phép`) | ✅ **GO** | `procedure-ai-prompt.builder.ts (Item #7)` | Chỉ dùng các từ ngữ gợi ý tham mưu (`Đề nghị kiểm tra...`). |
| **Mandatory Legal Verification** | Cảnh báo cán bộ phải tự kiểm tra văn bản pháp luật hiện hành và địa phương | ✅ **GO** | `ProcedureCaseDetail.tsx (LAW-02 banner)` | Nhấn mạnh quy trình nội bộ UBND tỉnh & quy hoạch huyện. |
| **Draft-Only Export Marking** | Tất cả văn bản xuất ra đều là bản dự thảo tham mưu, có tiền tố `DU_THAO_GOI_Y_AI_` | ✅ **GO** | `docx-templates.helper.ts / ProcedureCaseDetail.tsx` | Ngăn chặn việc sử dụng nhầm thành văn bản chính thức. |
| **No Auto-Signing** | Hệ thống tuyệt đối không thực hiện ký số/ký điện tử tự động vào văn bản | ✅ **GO** | Kiến trúc không có module Auto-Sign | Quyền ký số thuộc về lãnh đạo qua phần mềm ký riêng. |
| **No Auto-Promulgation** | Hệ thống không tự động chuyển trạng thái hồ sơ sang đã ban hành/phê duyệt | ✅ **GO** | `ProcedureCaseDetail.tsx` | Trạng thái chỉ thay đổi bởi thao tác người có thẩm quyền. |
| **No Auto-Dispatch** | Không tự động gửi email, SMS, Zalo hay chuyển văn bản ra ngoài cho công dân | ✅ **GO** | Kiến trúc không có luồng Auto-Send | Đảm bảo bảo mật và kiểm soát luồng thông tin nhà nước. |

---

## 5. Legal / Procedure Go / No-Go

Các nguyên tắc bắt buộc về mặt nghiệp vụ pháp lý phải được xác nhận trước khi mở hệ thống:
1. **Cán bộ phải kiểm tra văn bản pháp luật hiện hành:** Chuyên viên thụ lý xác nhận không ỷ lại 100% vào AI mà phải đối chiếu các điều khoản Luật Đất đai 2024 và các Nghị định hướng dẫn (102/2024/NĐ-CP, 103/2024/NĐ-CP) đang có hiệu lực.
2. **Cán bộ phải kiểm tra văn bản địa phương:** Xác nhận bắt buộc kiểm tra các Quyết định, Quy định riêng về điều kiện tách thửa, hạn mức đất ở, và quy chế phối hợp do UBND tỉnh/thành phố ban hành.
3. **Cán bộ phải kiểm tra quy hoạch / kế hoạch sử dụng đất:** Đối chiếu bắt buộc với Bản đồ quy hoạch sử dụng đất cấp huyện, Kế hoạch sử dụng đất hàng năm đã được phê duyệt và Quy hoạch chi tiết xây dựng (nếu có).
4. **Cán bộ phải kiểm tra quy trình nội bộ tại thời điểm xử lý:** Thẩm định thời gian, thành phần hồ sơ và các bước chuyển tiếp theo đúng bộ thủ tục hành chính nội bộ của địa phương.
5. **Hệ thống không tự khẳng định căn cứ pháp lý là đầy đủ tuyệt đối:** Tất cả thông báo của LegalFlow V2 đều xác định tri thức pháp lý của hệ thống là `Snapshot` hỗ trợ tra cứu, cán bộ giữ trách nhiệm cao nhất trong việc quyết định căn cứ áp dụng.

---

## 6. No-Go Conditions

Hệ thống **BẮT BUỘC PHẢI DỪNG TRIỂN KHAI (`NO-GO` / `ABORT`)** ngay lập tức nếu vi phạm bất kỳ điều kiện nào sau đây:
* 🛑 **Health-check Fail:** Container cơ sở dữ liệu (`legalflow_postgres`) hoặc proxy (`legalflow_caddy`) không khởi động được hoặc API backend crash/không phản hồi.
* 🛑 **Backup chưa có:** Không tìm thấy file sao lưu cơ sở dữ liệu hợp lệ (`Database Backup Dump`) ngay trước giờ triển khai.
* 🛑 **Migration pending không rõ:** Lệnh `npx prisma migrate status` báo có migration chưa áp dụng hoặc bị lệch pha cấu trúc bảng (`Schema mismatch`).
* 🛑 **Lỗi phân quyền nghiêm trọng:** Phát hiện tài khoản `VIEWER` hoặc `STAFF` có thể tự ý thay đổi quyền, xem trái phép cấu hình hệ thống hoặc tự ý ban hành hồ sơ mà không qua `MANAGER`.
* 🛑 **AI output gây hiểu nhầm là kết luận chính thức:** AI đưa ra các câu khẳng định tuyệt đối như *"Hồ sơ đã đủ điều kiện 100%, đề nghị ký quyết định ban hành ngay"* mà không có chỉ dẫn tham mưu.
* 🛑 **Export giống văn bản đã ban hành:** File xuất Word/PDF thiếu dòng chữ cảnh báo dự thảo hoặc thiếu prefix `DU_THAO_GOI_Y_AI_`, dễ bị nhầm là quyết định chính thức.
* 🛑 **Mất/Sai dữ liệu:** Phát hiện hồ sơ hiện hữu của cán bộ bị sai lệch thông tin, mất tài liệu hoặc thay đổi trạng thái trái phép.
* 🛑 **Không có người phụ trách Rollback:** Không có kỹ sư hệ thống/DBA trực chiến sẵn sàng thực thi kịch bản khôi phục khi xảy ra sự cố.
* 🛑 **Chưa thống nhất phạm vi người dùng:** Danh sách cán bộ tham gia Pilot chưa được lãnh đạo phê duyệt hoặc bị cấp phát tài khoản tràn lan không kiểm soát.

---

## 7. Final Decision

Bảng ký xác nhận quyết định triển khai chính thức của Nhóm Quản lý Dự án:

| Decision | Decision Maker | Role | Date | Conditions & Notes |
| :---: | :--- | :--- | :---: | :--- |
| **[ ✅ GO ]** <br/> `[   NO-GO   ]` | **Kevin Doan** | Project Owner &amp; Tech Lead | `11/07/2026` | Đủ điều kiện triển khai có kiểm soát cho nhóm Pilot. Yêu cầu tuân thủ nghiêm ngặt theo dõi log hàng ngày và kịch bản Rollback nếu có rủi ro. |
| **[ ✅ GO ]** <br/> `[   NO-GO   ]` | **Đại diện Lãnh đạo nghiệp vụ** | Head of Procedure Review Team | `11/07/2026` | Đồng ý triển khai thử nghiệm trên nhóm chuyên viên thụ lý cốt lõi. Quán triệt 100% nguyên tắc Human-in-the-Loop. |
| **[ ✅ GO ]** <br/> `[   NO-GO   ]` | **Kỹ sư Quản trị Hạ tầng** | DevOps &amp; System Administrator | `11/07/2026` | Xác nhận đã hoàn tất sao lưu DB `legalflow_prod` và sẵn sàng kịch bản khôi phục hệ thống an toàn. |
