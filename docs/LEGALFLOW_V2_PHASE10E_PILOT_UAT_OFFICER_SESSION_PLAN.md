# LEGALFLOW V2 - PHASE 10E
# PILOT UAT OFFICER SESSION PLAN

**Ngày ban hành:** 08/07/2026  
**Phiên bản áp dụng:** `v2.10.3-pilot-uat-dry-run-execution-readiness` ➔ Phase 10E  
**Chuyên trách thiết lập:** Trợ lý kỹ thuật & Điều phối viên UAT (Antigravity AI)

---

## 1. Purpose
Tài liệu **Pilot UAT Officer Session Plan** là Kế hoạch tổ chức và Điều phối chi tiết buổi kiểm thử nghiệm thu người dùng thực tế (`Pilot UAT Execution with Officers`) dành riêng cho các Cán bộ, Chuyên viên nghiệp vụ thẩm định hồ sơ TTHC và Lãnh đạo Phòng Thẩm định.
Kế hoạch này thiết lập khung thời gian, phân công vai trò, chuẩn bị hạ tầng tiền đề và chuẩn hóa kịch bản an toàn pháp lý, nhằm đảm bảo buổi kiểm thử diễn ra khoa học, thu thập được tối đa phản hồi nghiệp vụ giá trị mà vẫn tuyệt đối bảo vệ an toàn địa chính và tính tuân thủ pháp luật.

---

## 2. Session Objectives

Buổi Pilot UAT thực tiễn với Cán bộ được tổ chức nhằm đạt được **08 Mục tiêu trọng tâm (`Core Objectives`)**:
1. **Kiểm tra khả năng sử dụng thực tế (`Real-world Usability & UX`):** Đánh giá mức độ trực quan, dễ thao tác của giao diện LegalFlow v2 đối với thói quen làm việc hằng ngày của cán bộ thụ lý.
2. **Kiểm tra AI review (`AI Legal Analysis Accuracy`):** Đánh giá tính chính xác, đầy đủ và hợp lý của Trợ lý AI khi rà soát 04 điều kiện thẩm định đất đai (Quy hoạch, tranh chấp, tài chính, giấy tờ).
3. **Kiểm tra cảnh báo AI (`AI Safety Banner Enforcement`):** Khảo sát nhận thức của cán bộ về khối cảnh báo bắt buộc `BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA`, đảm bảo không có hiện tượng ỷ lại hay nhầm lẫn trách nhiệm pháp lý.
4. **Kiểm tra Legal Snapshot (`Audit Trail & Snapshot Integrity`):** Kiểm chứng tính minh bạch và bất biến của bản chụp Căn cứ pháp lý (`ProcedureAiAnalysisLegalSnapshot`) lưu trữ trong lịch sử hồ sơ.
5. **Kiểm tra Dự thảo / In / Xuất văn bản (`Export Safety & Draft Verification`):** Xác nhận tính chuẩn xác của tiền tố bắt buộc `DU_THAO_GOI_Y_AI_...docx`, kiểm tra bố cục bản in Word/PDF và đảm bảo 100% không tự động đóng dấu/chữ ký số ban hành.
6. **Kiểm tra Phân quyền (`RBAC Hardening Enforcement`):** Thực nghiệm chặt chẽ 4 vai trò (`ADMIN`, `MANAGER`, `STAFF`, `VIEWER`), đặc biệt là bảo mật chặn đứng quyền thao tác nhạy cảm của tài khoản `VIEWER`.
7. **Kiểm tra Lỗi / Empty State (`Error & Empty State Handling`):** Kiểm chứng thông báo lỗi thân thiện, trực quan khi mất mạng hoặc gọi API thất bại, kèm khả năng tự thao tác nút `Thử lại`.
8. **Ghi nhận góp ý nghiệp vụ (`Intake Officer Feedback`):** Thu thập toàn diện các ý kiến đóng góp về câu chữ thuật ngữ pháp lý, biểu mẫu in ấn và thói quen thụ lý của địa phương để hoàn thiện sản phẩm.

---

## 3. Session Participants

Danh sách các bên tham gia buổi kiểm thử Pilot UAT *(Lưu ý tuân thủ nguyên tắc bảo mật không điền thông tin cá nhân thật nếu chưa được cung cấp chính thức)*:

| Role (`Vai trò`) | Participant Name (`Họ và tên đại diện`) | Test Account (`Tài khoản test chuẩn hóa`) | Responsibility (`Trách nhiệm trong buổi UAT`) | Notes (`Ghi chú bảo mật`) |
| :--- | :--- | :--- | :--- | :--- |
| **UAT Coordinator** | `[Placeholder - Điều phối viên UAT]` | `admin_uat` / `manager_uat` | Chủ trì điều phối phiên kiểm thử, giới thiệu mục tiêu, hướng dẫn kịch bản và dẫn dắt phần thảo luận/tổng kết lỗi. | Sử dụng tài khoản quản trị để hỗ trợ reset trạng thái khi cần. |
| **ADMIN Tester** | `[Placeholder - Cán bộ Quản trị hệ thống]` | `admin_uat` | Kiểm thử toàn bộ luồng quản trị hệ thống, quản trị tri thức (`Legal Knowledge`), cấu hình phiên bản AI Prompts và Audit Log. | *Không ghi mật khẩu thật vào tài liệu.* |
| **MANAGER Tester** | `[Placeholder - Lãnh đạo Phòng Thẩm định]` | `manager_uat` | Kiểm thử nghiệp vụ duyệt kết quả AI Review, kiểm tra Căn cứ pháp lý snapshot, thực hiện `Re-run AI Analysis` và kiểm duyệt phiếu xuất Word. | Thẩm định tính chuẩn xác pháp lý của AI Prompt. |
| **STAFF Tester** | `[Placeholder - Chuyên viên Thụ lý Đất đai]` | `staff_uat_01` / `staff_uat_02` | Trực tiếp thao tác luồng nghiệp vụ thụ lý hằng ngày: xem danh sách, lọc hồ sơ, kích hoạt AI Rà soát lần đầu, xem dự thảo và tải file Word. | Đánh giá UX/UI và tốc độ xử lý thực tế. |
| **VIEWER Tester** | `[Placeholder - Cán bộ Thanh tra / Giám sát]` | `viewer_uat` | Kiểm thử độ kín khít bảo mật `Read-Only`: xác nhận nút AI Review và section Xuất văn bản bị ẩn, gọi API trả về 403 Forbidden. | Xác nhận không rò rỉ đặc quyền. |
| **Technical Support** | `[Placeholder - Kỹ sư DevOps / Hỗ trợ kỹ thuật]` | `[System Admin]` | Trực hạ tầng Docker, giám sát log hệ thống, giải quyết các sự cố môi trường (`Port 9000 workaround`), ghi chép `Live Issue Register`. | Đảm bảo hệ thống phản hồi ổn định trong phiên test. |
| **Legal/Procedure Reviewer** *(nếu có)* | `[Placeholder - Chuyên gia Pháp chế / TTHC]` | `manager_uat` | Đánh giá độ chuẩn xác về thể thức văn bản, câu từ trích dẫn Luật Đất đai 2024 và tính hợp lệ của bản dự thảo gợi ý AI. | Giám sát lằn ranh đỏ an toàn pháp lý. |

---

## 4. Pre-session Checklist

Bảng kiểm tra 07 hạng mục chuẩn bị tiền đề trước khi chính thức bắt đầu buổi Pilot UAT:

| Item (`Hạng mục chuẩn bị`) | Owner (`Phụ trách`) | Evidence (`Bằng chứng / Tiêu chí kiểm chứng`) | Status | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **1. Đúng Git Tag & Baseline** | Technical Support | `git status` clean; `git log -1` trỏ tại đúng tag mốc chuẩn bị Pilot UAT. | `[READY]` | Mã nguồn sạch, không bị can thiệp hay sửa đổi bẩn. |
| **2. Backup CSDL Test sẵn sàng** | Technical Support | File dump `pre_pilot_uat_dump.sql` (`> 0 KB`) đã được tạo và lưu trữ an toàn. | `[READY]` | Đảm bảo khả năng khôi phục nguyên trạng CSDL sau buổi test. |
| **3. Health-check Pass** | Technical Support | Lệnh `.\scripts\health-check.ps1` trả về `STATUS: ALL SYSTEMS HEALTHY & OPERATIONAL` *(hoặc đã áp dụng workaround cổng 9000 ổn định)*. | `[READY]` | Các cổng `3000`, `5173`, `5432` phản hồi HTTP 200 OK mượt mà. |
| **4. Tài khoản Test sẵn sàng** | UAT Coordinator | Danh sách 4 tài khoản test (`admin_uat`, `manager_uat`, `staff_uat_01`, `viewer_uat`) đã được phân phối riêng cho từng cán bộ. | `[READY]` | Mật khẩu test chuẩn hóa được gán độc lập, không lộ secret thật. |
| **5. Phổ biến nguyên tắc AI cho Cán bộ** | UAT Coordinator | Tài liệu `Safety Briefing Script` và `Pilot Officer Guide` đã được gửi đến các cán bộ trước 24 giờ. | `[READY]` | Cán bộ hiểu rõ AI chỉ là công cụ hỗ trợ gợi ý tham khảo. |
| **6. Biểu mẫu Ghi nhận Lỗi sẵn sàng** | Technical Support | Sổ `Live Checklist` và `Live Issue Register` đã được chuẩn bị sẵn trên máy tính của người ghi chép (`Note-taker`). | `[READY]` | Sẵn sàng ghi nhận tức thì mọi ý kiến đóng góp của cán bộ. |
| **7. Kỹ sư Hỗ trợ Kỹ thuật trực chiến** | Technical Support | Kỹ sư trực sẵn sàng theo dõi log Docker container thời gian thực qua terminal (`docker logs -f`). | `[READY]` | Xử lý nhanh các vướng mắc kết nối mạng nội bộ nếu phát sinh. |

---

## 5. Session Agenda

Lịch trình chi tiết đề xuất cho buổi Pilot UAT tập trung thời lượng **95 - 110 phút**:

| Thời gian (`Time`) | Thời lượng | Nội dung công việc (`Agenda Item`) | Người dẫn dắt (`Leader`) | Kết quả đầu ra (`Output`) |
| :---: | :---: | :--- | :--- | :--- |
| **08:30 – 08:40** | **10 phút** | **Safety Briefing & Giới thiệu Nguyên tắc AI:**<br>• Tuyên bố lý do, mục tiêu buổi Pilot UAT.<br>• Phổ biến 4 nguyên tắc lằn ranh đỏ an toàn pháp lý. | UAT Coordinator | Cán bộ nắm vững trách nhiệm pháp lý thẩm định cuối cùng. |
| **08:40 – 08:50** | **10 phút** | **Hướng dẫn tổng quan Giao diện (`UI/UX Overview`):**<br>• Trình diễn nhanh luồng làm việc chuẩn trên LegalFlow v2.<br>• Hướng dẫn cách sử dụng tài khoản test và thao tác cơ bản. | UAT Coordinator / Technical Support | Cán bộ làm quen với bố cục màn hình và các nút bấm chính. |
| **08:50 – 09:50** | **60 phút** | **Cán bộ thực hành Kiểm thử (`Officers Hands-on Testing`):**<br>• Cán bộ trực tiếp đăng nhập và thực thi 13 kịch bản cốt lõi.<br>• Kỹ sư trực tiếp quan sát, hỗ trợ thao tác và ghi chép nhật ký. | Các Cán bộ (`ADMIN`, `MANAGER`, `STAFF`, `VIEWER`) | Hoàn tất 100% kịch bản trên `Live Checklist`. |
| **09:50 – 10:05** | **15 phút** | **Tổng hợp Lỗi & Thảo luận Góp ý (`Issues & Feedback Triage`):**<br>• Cán bộ trao đổi về trải nghiệm, đóng góp ý kiến nghiệp vụ.<br>• Kỹ sư tổng hợp danh sách sự cố vào `Live Issue Register`. | UAT Coordinator & Toàn thể Cán bộ | Lập danh sách phân loại `Severity` và `Priority` cho các ý kiến. |
| **10:05 – 10:15** | **10 phút** | **Kết luận sơ bộ Go / No-Go (`Preliminary Closing`):**<br>• Đánh giá sơ bộ kết quả kiểm thử toàn phiên.<br>• Bế mạc buổi test và xác nhận chữ ký/phiếu phản hồi của cán bộ. | UAT Coordinator / Lãnh đạo Phòng | Ra quyết định sơ bộ về lộ trình xử lý tiếp theo. |

---

## 6. Safety Briefing Script

Đoạn kịch bản tuyên bố nguyên tắc an toàn bắt buộc, do **Điều phối viên UAT đọc trước toàn thể Cán bộ tham gia** ngay đầu buổi test:

> [!CAUTION]
> **KỊCH BẢN PHỔ BIẾN NGUYÊN TẮC AN TOÀN PHÁP LÝ (SAFETY BRIEFING SCRIPT):**
>
> *"Kính thưa các đồng chí Lãnh đạo và các chuyên viên nghiệp vụ Phòng Thẩm định,*
>
> *Trước khi chúng ta bước vào thao tác trực tiếp trên hệ thống LegalFlow v2, Tổ Điều phối xin nhấn mạnh **05 nguyên tắc bảo vệ an toàn địa chính và trách nhiệm pháp lý** bất khả xâm phạm:*
>
> 1. **TRỢ LÝ AI CHỈ LÀ GỢ Ý THAM KHẢO (`AI is Advisory Only`):** Trợ lý AI trên hệ thống LegalFlow được thiết kế để rà soát nhanh hồ sơ, tổng hợp dữ liệu và đề xuất các khoản luật áp dụng nhằm tiết kiệm thời gian cho cán bộ. Tuy nhiên, AI **không phải là chủ thể pháp lý và không có thẩm quyền ra kết luận thụ lý**.
> 2. **CÁN BỘ PHẢI KIỂM TRA & CHỊU TRÁCH NHIỆM CUỐI CÙNG (`Human-in-the-Loop Enforced`):** Mọi ý kiến phân tích, nhận xét của AI hiển thị trên màn hình đều phải được cán bộ trực tiếp kiểm chứng, đối chiếu với hồ sơ giấy gốc. Cán bộ thụ lý và Lãnh đạo phòng là người giữ quyền quyết định và chịu trách nhiệm pháp lý duy nhất đối với kết quả thẩm định.
> 3. **VĂN BẢN XUẤT RA LÀ DỰ THẢO GỢI Ý (`Draft Export Safety`):** Toàn bộ file Word (`.docx`) và file PDF tải về từ hệ thống mang tiền tố `DU_THAO_GOI_Y_AI_...` và có khung cảnh báo từ chối trách nhiệm. Đây chỉ là bản dự thảo hỗ trợ soạn thảo nội bộ.
> 4. **KHÔNG DÙNG VĂN BẢN PILOT ĐỂ KÝ / BAN HÀNH THẬT (`Zero Production Dispatch`):** Tuyệt đối không được sử dụng các file dự thảo xuất ra từ phiên kiểm thử Pilot này để trình ký ban hành pháp lý chính thức, không đóng dấu đỏ cơ quan hay gửi cho người nộp hồ sơ ngoài đời thực.
> 5. **KHÔNG NHẬP DỮ LIỆU NHẠY CẢM NGOÀI PHẠM VI TEST (`Data Privacy & Sandbox Discipline`):** Phiên kiểm thử hôm nay chỉ diễn ra trên bộ 15 hồ sơ đất đai mẫu có sẵn trong CSDL Staging (`legalflow_test`). Các đồng chí vui lòng không tự ý nhập các thông tin bí mật cá nhân nhạy cảm bên ngoài hoặc kết nối hệ thống với CSDL đất đai chính thức khi chưa có quyết định Golive của Lãnh đạo cơ quan.*
>
> *Xin cảm ơn sự hợp tác và kính chúc buổi làm việc của chúng ta đạt kết quả cao!"*

---

## 7. Session Exit Criteria

Buổi kiểm thử Pilot UAT được tuyên bố kết thúc hợp lệ (`Session Closed / Passed`) khi và chỉ khi thỏa mãn đồng thời **04 Điều kiện đầu ra (`Exit Criteria`)**:
1. **Các vai trò chính đã test đầy đủ (`100% Core Roles Coverage`):** Cả 4 vai trò (`ADMIN`, `MANAGER`, `STAFF`, `VIEWER`) đều đã hoàn tất tối thiểu 1 lượt thực thi các kịch bản bắt buộc tương ứng trên `Live Checklist`.
2. **Lỗi và góp ý đã được ghi nhận vào sổ (`100% Issues Logged`):** Toàn bộ sự cố kỹ thuật, lỗi hiển thị hoặc ý kiến đóng góp của cán bộ đều được ghi nhận tường tận vào bảng `Live Issue Register` kèm mô tả chi tiết và phân loại mức độ nghiêm trọng sơ bộ.
3. **Không có sự cố dữ liệu hay vi phạm lằn ranh đỏ (`Zero Safety/Data Violations`):** Trong suốt phiên test, không phát sinh bất kỳ sự cố nào liên quan đến sập nguồn CSDL, rò rỉ quyền hạn (`VIEWER` thao tác được AI Review) hay mất tiền tố an toàn `DU_THAO_GOI_Y_AI_`.
4. **Cán bộ xác nhận đã phản hồi đầy đủ (`Officer Sign-off Verified`):** Các cán bộ tham gia đã điền và ký xác nhận vào phiếu `Officer Feedback Checklist`, thống nhất với biên bản tổng kết sơ bộ của Tổ Điều phối.
