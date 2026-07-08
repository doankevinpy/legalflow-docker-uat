# LEGALFLOW V2 - PHASE 10C
# UAT SESSION LOG TEMPLATE

**Ngày ban hành:** 08/07/2026  
**Phiên bản áp dụng:** `v2.10.1-pilot-uat-real-officers-execution-pack` ➔ Phase 10C  
**Chuyên trách thiết lập:** Trợ lý kỹ thuật & Điều phối viên UAT (Antigravity AI)

---

## 1. Purpose
Tài liệu **UAT Session Log Template** là Biểu mẫu nhật ký làm việc chuẩn hóa được thiết kế dành riêng cho Người điều phối (`Facilitator`) và Kỹ sư ghi chép (`Note-taker`) trong từng buổi kiểm thử trực tiếp (thử nghiệm nội bộ Dry Run hoặc Pilot UAT thực tế với cán bộ).
Biểu mẫu cho phép theo dõi chi tiết theo thời gian thực (`Real-time Tracking`) từng bước thao tác của cán bộ, ghi nhận ngay lập tức các sự cố hoặc ý kiến đóng góp, và cung cấp dữ liệu tóm tắt (`Session Summary`) minh bạch phục vụ cuộc họp phân loại lỗi (`Daily Triage`) vào cuối mỗi phiên làm việc.

---

## 2. Session Information

Bảng thông tin tổng quan của phiên kiểm thử (Nhân sự điều phối điền trước khi bắt đầu buổi test):

| Trường thông tin (`Header Field`) | Nội dung chi tiết của Phiên kiểm thử (`Session Data`) | Ghi chú / Hướng dẫn điền (`Instructions`) |
| :--- | :--- | :--- |
| **Session ID** | `UAT-SES-20260710-AM` *(Ví dụ: Phiên sáng Ngày 10/07/2026)* | Mã định danh duy nhất theo cú pháp: `UAT-SES-YYYYMMDD-[AM/PM]`. |
| **Date** | `10/07/2026` | Ngày tổ chức phiên kiểm thử thực tế. |
| **Time** | `08:30 – 11:30 (03 giờ làm việc)` | Khung giờ diễn ra buổi test. |
| **Environment** | `Pilot UAT Server (Docker Staging Environment)` | Môi trường kiểm thử (`http://kevindoan-legalflow.local:8080`). |
| **Git Tag** | `v2.10.1-pilot-uat-real-officers-execution-pack` | Phiên bản mã nguồn chính thức được triển khai trên máy chủ test. |
| **Facilitator** | Nguyễn Trọng Dũng *(Điều phối viên UAT)* | Người chủ trì, hướng dẫn kịch bản và giải đáp thắc mắc cho cán bộ. |
| **Participants** | 1. Phạm Văn Khánh *(Chuyên viên Phòng Đăng ký đất đai)*<br>2. Trần Thị Mai *(Phó Trưởng phòng Thẩm định)*<br>3. Trần Khắc Quý *(Kỹ sư hỗ trợ kỹ thuật)* | Danh sách những người tham gia trực tiếp trong phiên làm việc. |
| **Roles Tested** | `STAFF`, `MANAGER`, `VIEWER` | Các vai trò hệ thống được tập trung kiểm thử trong phiên này. |
| **Notes** | Phiên tập trung rà soát thủ tục Cấp GCN lần đầu và kiểm tra tính năng Xuất file Word phiếu rà soát chuyên môn. | Ghi chú đặc biệt về trọng tâm hoặc bối cảnh buổi test. |

---

## 3. Test Execution Log

Bảng nhật ký theo dõi thao tác theo thời gian thực trong suốt phiên làm việc (Kỹ sư hỗ trợ ghi chép từng tình huống):

| Time | Tester | Role | Scenario | Action (Thao tác thực hiện) | Result (Kết quả phản hồi) | Issue ID | Screenshot / Evidence | Notes / Observation |
| :---: | :---: | :---: | :---: | :--- | :--- | :---: | :--- | :--- |
| **08:45** | Phạm Văn Khánh | `STAFF` | `S-01`<br>`STF-01` | Đăng nhập tài khoản `staff_uat_01` và lọc danh sách hồ sơ TTHC đất đai đang thụ lý. | `[PASS]` Đăng nhập thành công dưới 2s. Danh sách lọc đúng hồ sơ thụ lý của chuyên viên Khánh. | N/A | `ses_am_login_pass.png` | Cán bộ thao tác nhanh, đánh giá giao diện danh sách trực quan. |
| **09:10** | Phạm Văn Khánh | `STAFF` | `S-04`<br>`STF-02` | Mở hồ sơ `HS-2026-001` (Cấp GCN lần đầu), vào Tab AI Review và nhấn nút **Chạy AI Rà soát**. | `[PASS]` AI phân tích sau 7.5 giây. Trả về nhận xét chi tiết 4 điều kiện: Quy hoạch, tranh chấp, nghĩa vụ tài chính và giấy tờ đất. | N/A | `ses_am_ai_review.png` | AI trích dẫn chính xác khoản 1 Điều 137 Luật Đất đai 2024. |
| **09:30** | Phạm Văn Khánh | `STAFF` | `S-06`<br>`STF-03` | Kiểm tra hiển thị cảnh báo AI và Tab `Legal Snapshot`. | `[PASS]` Khối cảnh báo `BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA` hiển thị rõ màu vàng. `Legal Snapshot` ghi đầy đủ prompt version. | N/A | `ses_am_snapshot.png` | Cán bộ ghi nhận thông báo rất rõ ràng, nhắc nhở tốt trách nhiệm. |
| **10:00** | Phạm Văn Khánh | `STAFF` | `S-08`<br>`STF-05` | Cuộn xuống section hành động, nhấn nút **Xuất file Word (.docx)** và mở file vừa tải về. | `[PASS]` Tên file: `DU_THAO_GOI_Y_AI_phieu-ra-soat-...docx`. Có đầy đủ banner từ chối trách nhiệm ở đầu trang. | `ISS-101` | `ses_am_word_export.png` | *Ghi nhận ý kiến:* Lề phải bảng biểu trong file Word hơi sát mép trang in. |
| **10:30** | Trần Thị Mai | `MANAGER` | `S-11`<br>`MGR-05` | Đăng nhập `manager_uat`, vào menu `Legal Knowledge`, thực hiện `Activate Version` trên một quy định mới. | `[PASS]` Thao tác `Activate` thực hiện thành công, lịch sử được lưu vào `activationHistory`. CSDL phản hồi mượt mà. | N/A | `ses_am_knowledge.png` | Lãnh đạo phòng đánh giá cao khả năng kiểm soát phiên bản quy định. |
| **11:00** | Trần Thị Mai | `VIEWER` | `S-09`<br>`VWR-04` | Thử dùng tài khoản `viewer_uat` mở chi tiết hồ sơ và kiểm tra các Tab rà soát AI. | `[PASS]` Nút "Chạy AI Rà soát" và toàn bộ section Xuất văn bản bị ẩn hoàn toàn. Gọi API qua console bị chặn `403 Forbidden`. | N/A | `ses_am_viewer_403.png` | Phân quyền RBAC bảo đảm kín khít 100%, đúng yêu cầu bảo mật. |

---

## 4. Issues Found During Session

Bảng tổng hợp nhanh các sự cố kỹ thuật hoặc ý kiến đóng góp (`Defects / Suggestions`) được ghi nhận trong riêng buổi test này:

| Issue ID | Severity | Summary (Tóm tắt sự cố / Đề xuất) | Screen / Function | Reproducible (Tái hiện được không?) | Assigned To | Next Action (Hành động tiếp theo) | Notes |
| :---: | :---: | :--- | :--- | :---: | :--- | :--- | :--- |
| **ISS-101** | `Low` | Lề phải của bảng biểu trong file Word xuất ra (`phieu-ra-soat.docx`) bị lấn sát lề trang in, cần chỉnh rộng thêm 0.5cm. | Section `Xuất file Word` (`ProcedureCaseDetail`) | `Yes (100%)` | Trần Khắc Quý *(Dev)* | Chuyển vào `Issue Triage Board`. Sẽ tinh chỉnh thông số `margins` trong helper ở Phase 10D/10E. | Lỗi nhỏ về thẩm mỹ bản in, hoàn toàn không làm sai lệch hay ảnh hưởng an toàn pháp lý. |
| *(Trống)* | *(Trống)* | *(Không phát sinh thêm sự cố kỹ thuật hay lỗi Critical/High nào trong suốt 3 giờ làm việc).* | N/A | N/A | N/A | Tiếp tục duy trì kịch bản test cho buổi chiều (`PM Session`). | Hệ thống chạy cực kỳ ổn định, tốc độ tải trang trung bình < 1.2 giây. |

---

## 5. Session Summary

Bảng thống kê số liệu tổng kết kết quả của phiên làm việc (Điều phối viên điền trước khi bế mạc buổi test):

| Chỉ tiêu thống kê (`Summary Metric`) | Số liệu ghi nhận (`Session Result`) | Đánh giá & Nhận xét của Tổ điều phối (`Facilitator Assessment`) |
| :--- | :---: | :--- |
| **Total scenarios tested** *(Tổng số kịch bản đã thực thi)* | **06 Kịch bản** | Thực hiện trọn vẹn 6/6 kịch bản trọng tâm theo kế hoạch buổi sáng (`S01`, `S04`, `S06`, `S08`, `S09`, `S11`). |
| **Passed** *(Số kịch bản đạt chuẩn PASS)* | **06 / 06 (100%)** | 100% kịch bản phản hồi chính xác về logic nghiệp vụ, phân quyền RBAC và an toàn xuất văn bản. |
| **Failed** *(Số kịch bản thất bại / Lỗi nghiệp vụ)* | **00 / 06 (0%)** | Hoàn toàn không có kịch bản nào bị lỗi phán quyết AI hay vi phạm quy trình TTHC đất đai. |
| **Blocked** *(Số kịch bản bị cản trở không chạy được)* | **00 / 06 (0%)** | Hạ tầng Docker mượt mà, không xảy ra hiện tượng mất kết nối hay sập trang. |
| **Critical issues** *(Số lượng lỗi nghiêm trọng tối đa)* | **00** | **ZERO CRITICAL BUGS:** Tiền tố `DU_THAO_GOI_Y_AI_` và cảnh báo AI đạt kiểm chứng 100%. |
| **High issues** *(Số lượng lỗi nghiêm trọng cao)* | **00** | **ZERO HIGH BUGS:** Tất cả các endpoint API hoạt động đúng đặc tả 200 OK / 403 Forbidden. |
| **Decision** *(Quyết định kết thúc phiên)* | **SESSION ACCEPTED (`PASS`)** | Phiên làm việc thành công tốt đẹp. Các cán bộ tham gia nhất trí cao với chất lượng phản hồi của hệ thống. |
| **Next session required** *(Có cần chạy lại phiên này không?)* | **No (`Continue to PM Session`)** | Không cần chạy lại phiên sáng. Buổi chiều tiếp tục thực hiện kiểm thử các tình huống ngoại lệ (`Negative Tests`). |

---

## 6. Sign-off

Xác nhận của các đại diện tham gia buổi kiểm thử (Đồng ý với số liệu ghi nhận trong Session Log):

| Name (Họ và tên) | Role (Vai trò trong buổi test) | Confirmation (Xác nhận kết quả) | Date | Notes / Signature |
| :--- | :--- | :---: | :---: | :--- |
| **Nguyễn Trọng Dũng** | Điều phối viên UAT (`Facilitator`) | `[CONFIRMED]` Nhất trí 100% số liệu. | 10/07/2026 | *Đã ký xác nhận trên sổ nhật ký điện tử* |
| **Phạm Văn Khánh** | Chuyên viên thụ lý (`STAFF Tester`) | `[CONFIRMED]` Nhất trí kết quả test. | 10/07/2026 | *Đã ký xác nhận (Giao diện dễ dùng, AI hỗ trợ tốt)* |
| **Trần Thị Mai** | Lãnh đạo thẩm định (`MANAGER Tester`) | `[CONFIRMED]` Nhất trí kết quả test. | 10/07/2026 | *Đã ký xác nhận (Phân quyền bảo mật đúng quy định)* |
| **Trần Khắc Quý** | Kỹ sư hỗ trợ (`Technical Note-taker`) | `[CONFIRMED]` Nhất trí log kỹ thuật. | 10/07/2026 | *Đã ghi nhận 01 backlog lề Word vào Triage Board* |
