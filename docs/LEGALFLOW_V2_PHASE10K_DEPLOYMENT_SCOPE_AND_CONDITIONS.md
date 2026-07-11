# LEGALFLOW V2 - PHASE 10K
# DEPLOYMENT SCOPE & CONDITIONS

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.10-controlled-production-deployment-dry-run`  
**Ngày ban hành:** 11/07/2026  
**Trạng thái Tài liệu:** **`BINDING OPERATIONAL SCOPE & CONDITIONS`**

---

## 1. Purpose

Tài liệu này xác định một cách minh bạch, rạch ròi và có tính chất ràng buộc bắt buộc về **Phạm vi triển khai có kiểm soát (`Initial Deployment Scope`)** cùng các **Điều kiện vận hành (`Operational Conditions`)** cho hệ thống LegalFlow V2 trong đợt triển khai Phase 10L sắp tới. Việc quy định rõ những hạng mục được phép mở (`Included`) và những chức năng/module bị loại trừ hoặc tạm hoãn (`Excluded / Backlog`) nhằm bảo đảm an toàn tuyệt đối cho quy trình nghiệp vụ hành chính nhà nước, ngăn chặn rủi ro lạm dụng công nghệ AI và giữ cho hệ thống hoạt động ổn định nhất.

---

## 2. Initial Deployment Scope

Bảng định nghĩa phân vùng chức năng được phép kích hoạt trong đợt triển khai production có kiểm soát:

| Functional Area | Included (`Bao gồm`) | Excluded (`Loại trừ / Chưa kích hoạt`) | Notes & Governance |
| :--- | :--- | :--- | :--- |
| **Hồ sơ TTHC (`Procedure Cases`)** | ✅ **CÓ:** Tra cứu, lọc, xem chi tiết và rà soát các hồ sơ thuộc 2 thủ tục lõi: Cấp GCN lần đầu (`LAND_FIRST_CERTIFICATE`) và Chuyển mục đích sử dụng đất (`LAND_USE_PURPOSE_CHANGE`). | ❌ **KHÔNG:** Các thủ tục hành chính khác thuộc lĩnh vực Đất đai (như tách/hợp thửa, gia hạn sử dụng đất...) hoặc lĩnh vực Xây dựng phức tạp chưa qua Pilot. | Giới hạn gọn gàng trong phạm vi đã được chuyên viên thử nghiệm &amp; kiểm thử. |
| **AI Review (`Khối 3.1`)** | ✅ **CÓ:** Chức năng Trợ lý AI phân tích hồ sơ và đưa ra gợi ý rà soát chuyên môn sơ bộ theo nguyên tắc `Human-in-the-Loop`. | ❌ **KHÔNG:** Các luồng AI tự động đánh giá hồ sơ không qua sự xác nhận hay kiểm tra trực tiếp của cán bộ chuyên môn. | Bắt buộc hiển thị nhãn cảnh báo viền vàng/amber trên màn hình. |
| **Legal Snapshot (`Khối 3.2`)** | ✅ **CÓ:** Hiển thị thông tin điều khoản luật, tên văn bản và huy hiệu phiên bản hiệu lực (`Active Version: v2.0-2024-LAND-LAW`). | ❌ **KHÔNG:** Tự động áp dụng hay cập nhật các phiên bản luật nháp/chưa qua kiểm duyệt vào hồ sơ đang thụ lý. | Bắt buộc hiển thị khung cảnh báo vàng `LAW-02` về quy định UBND tỉnh &amp; quy hoạch. |
| **Export Draft (`Khối 3.3`)** | ✅ **CÓ:** Thao tác `Xem bản dự thảo`, `In bản gợi ý AI`, `Xuất Word (.docx)`, `Xuất PDF` phục vụ tham khảo nội bộ trong cuộc họp. | ❌ **KHÔNG:** Tự động ký số, tự động đóng dấu hay ban hành trực tiếp văn bản từ hệ thống. | Tên file xuất ra bắt buộc phải có tiền tố `DU_THAO_GOI_Y_AI_`. |
| **Legal Knowledge Base** | ✅ **CÓ:** Tra cứu từ khóa, điều khoản Luật Đất đai 2024, quản lý phiên bản tri thức pháp lý trung ương. | ❌ **KHÔNG:** Cho phép cán bộ tự ý thêm, xóa hoặc chỉnh sửa trực tiếp nội dung cơ sở tri thức khi chưa được ủy quyền. | Quyền quản trị Knowledge Base thuộc về Admin / Legal Reviewer. |
| **Permission (`RBAC`)** | ✅ **CÓ:** Kiểm soát thẩm quyền truy cập theo 4 vai trò: `ADMIN`, `MANAGER`, `STAFF`, `VIEWER`. | ❌ **KHÔNG:** Các quyền tùy biến nâng cao hay tự động phân quyền theo cơ cấu tổ chức bên ngoài chưa tích hợp. | Bảo đảm người dùng `VIEWER` hoặc `STAFF` không thể thực hiện thao tác vượt thẩm quyền. |
| **Error / Empty State** | ✅ **CÓ:** Thẻ thông báo lỗi thân thiện (`CASELIST-01`) và thẻ trống có hướng dẫn nghiệp vụ (`DETAIL-02`). | ❌ **KHÔNG:** Để xảy ra tình trạng trắng màn hình hay hiển thị mã lỗi kỹ thuật nhạy cảm cho người dùng. | Giúp cán bộ thụ lý luôn nhận biết đúng tình trạng dữ liệu. |
| **Monitoring &amp; Health** | ✅ **CÓ:** Script `health-check.ps1`, giám sát trạng thái container Docker và nhật ký truy cập hàng ngày (`Daily SOP`). | ❌ **KHÔNG:** Các hệ thống giám sát phân tán/cloud bên ngoài chưa tích hợp trong hạ tầng máy chủ cục bộ. | Kiểm tra tình trạng Postgres và Caddy mỗi sáng. |
| **Backup Readiness** | ✅ **CÓ:** Chạy lệnh `pg_dump` tạo snapshot `.sql` trước giờ G, lưu vào `backups/` ngoài Git. | ❌ **KHÔNG:** Tự động chạy restore hay reset cơ sở dữ liệu trên môi trường production thực tế. | Khôi phục chỉ thực hiện bởi DBA khi có phê duyệt. |

---

## 3. User Scope

Bảng danh sách nhóm người dùng được phép tham gia đợt triển khai có kiểm soát (sử dụng placeholder chuẩn hóa, không ghi nhận thông tin cá nhân hay bí mật thực tế):

| User Group | Role | Estimated Users | Access Level & Permissions | Notes |
| :--- | :---: | :---: | :--- | :--- |
| **Quản trị Kỹ thuật &amp; Hạ tầng** | `ADMIN` | `2 - 3 users` | **Full Administrative Access:** Quyền quản lý container, kiểm tra log, duy trì health-check, cấu hình tài khoản và phân quyền `RBAC`. | Không can thiệp sửa đổi dữ liệu nghiệp vụ thực tế của cán bộ. |
| **Lãnh đạo Phòng Chuyên môn** | `MANAGER` | `2 - 3 users` | **Full Case &amp; Review Access:** Quyền xem toàn bộ hồ sơ, kiểm tra kết quả AI Review, đối chiếu bản dự thảo và phê duyệt nghiệp vụ trước khi ban hành. | Chịu trách nhiệm cao nhất về kết luận thẩm định thực tế. |
| **Chuyên viên Thụ lý cốt lõi** | `STAFF` | `5 - 8 users` | **Standard Case Action Access:** Quyền tiếp nhận hồ sơ, bấm nút chạy AI Review, xem căn cứ pháp lý, in phiếu tham khảo và xuất bản dự thảo Word/PDF. | Nhóm cán bộ trực tiếp thao tác thử nghiệm hàng ngày. |
| **Cán bộ Tra cứu / Giám sát** | `VIEWER` | `3 - 5 users` | **Read-Only Access:** Quyền xem danh sách, xem chi tiết hồ sơ và tra cứu văn bản luật trong `Legal Knowledge` (không có quyền rà soát AI hay xuất văn bản). | Phục vụ công tác thanh tra, rà soát hoặc theo dõi tổng hợp. |
| **Tổng số người dùng Pilot:** | &mdash; | **`~12 - 19 users`** | **Controlled Production Scope** | **Tuyệt đối không mở rộng cho các phòng ban hay đơn vị khác khi chưa có phê duyệt mới.** |

---

## 4. Operational Conditions

6 điều kiện ràng buộc vận hành bắt buộc thi hành trong suốt đợt triển khai production có kiểm soát:
1. **Chỉ mở cho User giới hạn (`Strict User Access Control`):** Quyền truy cập chỉ được cấp đúng cho danh sách 12-19 tài khoản thuộc bảng trên. Mọi yêu cầu cấp mới tài khoản ngoài danh sách Pilot phải được Lãnh đạo dự án phê duyệt bằng văn bản.
2. **Backup trước mỗi mốc quan trọng (`Mandatory Pre-action Backup`):** Bắt buộc chạy lệnh sao lưu (`pg_dump`) trước thời điểm khởi động stack triển khai (`T-0`) và trước bất kỳ lần cập nhật patch/cấu hình nào trong tương lai.
3. **Theo dõi lỗi hàng ngày (`Daily Monitoring Routine`):** Kỹ sư trực chiến thực hiện chạy `health-check.ps1` và kiểm tra log truy cập mỗi sáng lúc `08:00 AM` để ghi nhận kịp thời bất kỳ cảnh báo nào.
4. **Không dùng AI làm kết luận cuối (`Human-in-the-Loop Mandate`):** Cán bộ thụ lý quán triệt tuyệt đối việc AI chỉ đóng vai trò trợ lý tham mưu chuyên môn sơ bộ. Mọi kết luận "Hợp lệ", "Đủ điều kiện" hay "Khước từ" hồ sơ đều phải do cán bộ tự đối chiếu hồ sơ gốc và ra quyết định theo thẩm quyền.
5. **Không dùng Export Draft để ban hành trực tiếp (`Draft Safety Mandate`):** Các file Word (.docx) và PDF xuất ra từ Khối 3.3 đều có tiêu đề `DU_THAO_GOI_Y_AI_` và chỉ mang giá trị tham khảo. Cán bộ không được in trực tiếp bản dự thảo này để trình ký ban hành chính thức nếu chưa qua kiểm tra, chỉnh sửa thể thức văn bản và ký số theo đúng quy chế công tác văn thư của cơ quan.
6. **Dừng triển khai nếu phát sinh Critical/High (`SLA & Rollback Mandate`):** Nếu xảy ra sự cố thuộc cấp độ `Critical (P0)` hoặc `High (P1)` (như mất dữ liệu, sai phân quyền, hay container DB crash liên tục), Kỹ sư trực chiến lập tức dừng mở rộng và kích hoạt kịch bản Rollback theo Git Tag `v2.10.8`.

---

## 5. Excluded Features / Backlog

Danh sách các module lớn, các tính năng phức tạp được **loại trừ hoàn toàn** khỏi đợt triển khai Phase 10L và chuyển vào `Deferred Backlog` theo đúng nguyên tắc không làm module mới/không refactor lớn:
* ⏳ **Upload & Tải hồ sơ scan kèm OCR tự động:** Chưa tích hợp luồng bóc tách quang học từ file PDF/ảnh scan vào pipeline tự động.
* ⏳ **Rich Text Editor chỉnh sửa trực tiếp trước khi Export:** Chưa tích hợp trình soạn thảo văn bản (`Quill / TinyMCE`) ngay trên giao diện Khối 3.3 để chỉnh sửa phiếu trước khi tải về `.docx`.
* ⏳ **Comment & Ghi chú nội bộ chuyên sâu (`Reply Threads`):** Chưa kích hoạt luồng bình luận nhiều tầng hay `@mention` giữa các cán bộ thẩm định.
* ⏳ **Quy trình phê duyệt nhiều bước (`Multi-step Approval Workflow`):** Chưa xây dựng luồng ký số duyệt nháp nhiều cấp bên trong hệ thống trước khi active phiên bản luật.
* ⏳ **Quản lý lịch sử nhiều phiên rà soát AI (`AI Analysis Session History`):** Chưa cho phép lưu trữ và so sánh song song nhiều lần chạy AI khác nhau trên cùng một hồ sơ.
* ⏳ **Mở rộng trạng thái xử lý hồ sơ chi tiết (`Granular Statuses`):** Chưa bổ sung các trạng thái phụ như `FIELD_VERIFICATION` hay `WAITING_FOR_TAX` vào database schema.

---

## 6. Stop Conditions

Hệ thống bắt buộc phải **TẠM DỪNG VẬN HÀNH (`EMERGENCY STOP / ABORT`)** ngay lập tức nếu vi phạm bất kỳ điều kiện nào sau đây:
1. 🛑 **Lỗi phân quyền nghiêm trọng (`RBAC Privilege Escalation`):** Người dùng `VIEWER` hoặc `STAFF` có thể truy cập menu `ADMIN` hoặc tự ý phê duyệt hồ sơ trái thẩm quyền.
2. 🛑 **Mất mát hay sai lệch dữ liệu (`Data Loss / Corruption`):** Phát hiện hồ sơ thực tế của công dân hay nhật ký thẩm định bị mất, ghi đè hoặc sai lệch thông tin trong DB `legalflow_prod`.
3. 🛑 **Health-Check Fail kéo dài (`Infrastructure Down`):** Container `legalflow_postgres` hoặc proxy `legalflow_caddy` bị crash không khôi phục được sau 30 phút.
4. 🛑 **AI Output gây hiểu nhầm là quyết định chính thức (`Safety Violation`):** Trợ lý AI đưa ra kết luận khẳng định tuyệt đối thay cán bộ hoặc mất khung viền cảnh báo *"BẢN GỢI Ý AI"*.
5. 🛑 **Export giống văn bản chính thức (`Draft Safeguard Failure`):** File tải về bị mất tiền tố `DU_THAO_GOI_Y_AI_` hoặc tự động chèn chữ ký/con dấu giả lập.
6. 🛑 **Không có Backup hợp lệ (`Missing Backup`):** Không tìm thấy file dump `.sql` an toàn lưu trên ổ cứng ngay trước khi khởi động hệ thống.
7. 🛑 **Không có người chịu trách nhiệm xử lý sự cố (`Missing Rollback Owner`):** Không có Kỹ sư trực chiến phụ trách kịch bản khôi phục và phản ứng nhanh.

---

## 7. Next Operational Step

Sau khi hồ sơ phê duyệt `Final Approval Sign-off Form (Phase 10K)` được ký duyệt kèm theo phạm vi và điều kiện ràng buộc tại tài liệu này, bước vận hành thực tế tiếp theo là:
&rarr; **`Phase 10L: Controlled Production Deployment Execution`**  
*(Chính thức khởi chạy kịch bản triển khai production có kiểm soát: chạy pre-deploy backup, giải phóng cổng hạ tầng, kiểm tra sức khỏe dịch vụ và mở quyền truy cập cho nhóm cán bộ Pilot giới hạn).*
