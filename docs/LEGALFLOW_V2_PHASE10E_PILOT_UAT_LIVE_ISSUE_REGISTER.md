# LEGALFLOW V2 - PHASE 10E
# PILOT UAT LIVE ISSUE REGISTER

**Ngày ban hành:** 08/07/2026  
**Phiên bản áp dụng:** `v2.10.3-pilot-uat-dry-run-execution-readiness` ➔ Phase 10E  
**Chuyên trách ghi chép:** Kỹ sư ghi nhật ký & Điều phối viên UAT (Antigravity AI)

---

## 1. Purpose
Tài liệu **Pilot UAT Live Issue Register** là Sổ ghi nhận sự cố kỹ thuật và ý kiến đóng góp nghiệp vụ chính thức (`Master Live Defects & Feedback Register`) được lập và cập nhật trực tiếp trong và ngay sau các phiên kiểm thử Pilot UAT thực tiễn với Cán bộ Phòng Thẩm định.
Sổ đăng ký đóng vai trò là kho lưu trữ minh bạch, phân loại chính xác mọi vướng mắc, lỗi hiển thị hoặc đề xuất cải tiến của người dùng, làm cơ sở chẩn đoán (`Triage`) và phân bổ nhiệm vụ xử lý cho Tổ kỹ thuật trước khi đưa ra phán quyết nghiệm thu cuối cùng.

---

## 2. Issue Register

Bảng sổ nhật ký theo dõi sự cố và ý kiến phản hồi phát sinh trong buổi Pilot UAT thực tế *(Bao gồm các bản ghi chẩn đoán mẫu minh họa cách điền chuẩn xác từ thực tế kiểm thử Phase 10E)*:

| Issue ID | Date | Reporter | Role | Screen / Function | Scenario ID | Description (`Mô tả sự cố / ý kiến`) | Expected Result (`Kỳ vọng chuẩn`) | Actual Result (`Thực tế ghi nhận`) | Severity | Priority | Evidence / Screenshot | Reproducible | Assigned To | Target Phase | Status | Resolution (`Phương án xử lý`) | Verified By | Notes |
| :---: | :---: | :---: | :---: | :--- | :---: | :--- | :--- | :--- | :---: | :---: | :--- | :---: | :--- | :---: | :---: | :--- | :---: | :--- |
| **LIV-ISS-01** | `08/07/2026` | `[Cán bộ thụ lý - Placeholder]` | `STAFF` | Section `Xuất Word` | `LIV-09` | Lề phải của bảng biểu thông tin thửa đất trong file Word (`phieu-ra-soat.docx`) bị sát lề phải trang giấy in, cần nới margin rộng thêm 0.5cm để khi đóng gáy hồ sơ không bị lấn chữ. | Bảng biểu có lề phải cân đối 2cm, vừa vặn trang in khổ A4. | Cột bên phải của bảng hơi sát mép giấy in, không ảnh hưởng nội dung nhưng chưa đẹp về mặt thẩm mỹ trình bày. | `Low` | `P4 - Low` | `phieu_ra_soat_screenshot.png` | `Yes (100%)` | `DevOps / Backend Dev` | `Phase 10F` *(Stabilization)* | `Logged` | Tinh chỉnh thông số helper `table.width` và margin trong helper xuất Word ở bản vá tối ưu hóa sau UAT. | `[QC Lead]` | Lỗi nhỏ về thẩm mỹ bản in, hoàn toàn không chặn đường Pilot hay vi phạm pháp lý. |
| **LIV-ISS-02** | `08/07/2026` | `[Lãnh đạo Phòng - Placeholder]` | `MANAGER` | Tab `AI Review` | `LIV-04` | Đề xuất bổ sung thêm nút tiện ích **"Copy nhanh căn cứ pháp lý" (`Copy to Clipboard`)** ngay bên dưới khối trích dẫn luật để cán bộ tiện sao chép nhanh sang phiếu trình thẩm định ngoài phần mềm văn phòng. | Có nút `Copy nhanh` hỗ trợ dán một chạm vào clipboard của hệ điều hành. | Hiện tại cán bộ đang phải bôi đen bằng chuột để copy thủ công nội dung trích dẫn luật. | `Suggestion` | `P5 - Backlog` | `N/A` | `N/A` | `Frontend Dev / PM` | `Future Release` | `Accepted to Backlog` | Ghi nhận vào lộ trình nâng cấp sau Golive (`Product Backlog`) để cải tiến trải nghiệm người dùng (`UX`). | `[PM Lead]` | Ý kiến đóng góp rất hữu ích cho thực tế thao tác thụ lý của địa phương. |
| **LIV-ISS-03** | `08/07/2026` | `[Kỹ sư hỗ trợ - Placeholder]` | `Technical` | `Infrastructure` | `LIV-01` | Máy chủ test nội bộ có tiến trình host `Antigravity.exe` chiếm dụng cổng TCP `127.0.0.1:9000`, khiến container `legalflow_minio` không thể bind port 9000 khi chạy `start-legalflow.ps1`. | Stack `start-legalflow.ps1` tự động khởi động 100% dịch vụ mà không bị abort. | Lỗi bind port 9000 làm `start-infra.ps1` exit 1, ngắt luồng tự động bật `start-backend.ps1`. | `High` *(Environment Only)* | `P2 - Normal` | Output terminal: `bind: Only one usage of each socket address is normally permitted` | `Yes (on Host with Antigravity)` | `DevOps Engineer` | `Phase 10E` *(Workaround applied)* | `Mitigated` | **Đã áp dụng Workaround an toàn:** Khởi động riêng `postgres` & `caddy` bằng Docker, sau đó mở 2 cửa sổ PowerShell riêng chạy `start-backend.ps1` và `start-frontend.ps1`. | `[DevOps]` | Xung đột cổng host nội bộ, không phải lỗi mã nguồn LegalFlow và đã xử lý ổn định cho cán bộ test. |

---

## 3. Severity Rules

Để đảm bảo tính khách quan và nhất quán trong việc đánh giá sự cố phát sinh từ cán bộ, Tổ Điều phối áp dụng bộ quy chuẩn phân loại mức độ nghiêm trọng (`Severity Rules`) với **04 Quy tắc Lằn ranh đỏ Bắt buộc (`Absolute Safety Severity Rules`)**:

> [!IMPORTANT]
> **QUY TRÌNH PHÂN LOẠI NGHIÊM TRỌNG BẮT BUỘC (`SEVERITY CLASSIFICATION RULES`):**
>
> | Cấp độ Nghiêm trọng | Định nghĩa chuẩn hóa & Tác động hệ thống | **Quy tắc Lằn ranh đỏ Pháp lý & Bảo mật (MUST ENFORCE)** |
> | :---: | :--- | :--- |
> | **`Critical`** | Lỗi làm sập toàn cục hệ thống, hỏng hóc CSDL, hoặc mất hoàn toàn tính năng thụ lý cốt lõi. | • **Mất dữ liệu / Hỏng CSDL (`Data Loss/Corruption`):** Bất kỳ thao tác nào gây mất mát hồ sơ, xóa nhầm lịch sử AI hay làm hỏng CSDL đều tự động xếp loại `Critical`.<br>• **Lỗi Phân quyền Nghiêm trọng (`Severe RBAC Violation`):** Nếu tài khoản `VIEWER` hoặc `STAFF` có thể tự ý truy cập chức năng của `ADMIN` hoặc can thiệp quyền cấu hình tri thức pháp lý ➔ Xếp loại `Critical` (Buộc dừng ngay Pilot). |
> | **`High`** | Lỗi cản trở một luồng nghiệp vụ quan trọng mà không có thao tác thay thế hợp lệ, hoặc vi phạm an toàn xuất văn bản. | • **AI Output Gây hiểu nhầm là Kết luận Chính thức (`Misleading AI Conclusion`):** Nếu kết quả AI Review thiếu cảnh báo `BẢN GỢI Ý AI` hoặc dùng câu chữ phán quyết thay Lãnh đạo phòng ➔ Xếp loại `High` hoặc `Critical`.<br>• **Xuất Văn bản giống Văn bản đã Ký / Ban hành (`Unsafe Official Export`):** Nếu file Word/PDF xuất ra bị mất tiền tố `DU_THAO_GOI_Y_AI_` hoặc có con dấu/chữ ký số tự động ➔ Xếp loại `High` hoặc `Critical` (Buộc khắc phục trước Golive). |
> | **`Medium`** | Lỗi làm chậm tốc độ tải trang (> 5s), lỗi câu chữ tiếng Anh trong thông báo kỹ thuật, nhưng cán bộ có thể hoàn thành luồng qua cách thao tác khác (`Workaround`). | • Gom sửa chữa trong giai đoạn ổn định hệ thống (`Phase 10F Stabilization Phase`), không cản trở việc kết luận thành công của buổi Pilot UAT. |
> | **`Low`** | Lỗi nhỏ về thẩm mỹ, chính tả, màu sắc icon, lề bảng biểu Word (`LIV-ISS-01`) không ảnh hưởng logic hay kết quả rà soát. | • Xử lý ở các bản cập nhật định kỳ sau Golive (`Post-golive Patches`). |
> | **`Suggestion`** | Đề xuất bổ sung tính năng tiện ích mới, phím tắt nhanh (`LIV-ISS-02`) hoặc chỉnh sửa từ ngữ prompt theo thói quen địa phương. | • Ghi nhận vào Khối lượng công việc phát triển tiếp theo (`Product Backlog`). |

---

## 4. Triage Notes

Biên bản tổng hợp kết quả chẩn đoán và phân loại sự cố (`Live Triage Meeting Record`) sau khi bế mạc buổi Pilot UAT thực tế:

| Trường thông tin (`Triage Field`) | Ghi nhận thực tế cuộc họp Chẩn đoán sau UAT (`Live Session Triage Record`) |
| :--- | :--- |
| **Date** | `08/07/2026 (10:15 – 10:45)` — Cuộc họp Triage ngay sau khi kết thúc phần thao tác của cán bộ. |
| **Participants** | 1. UAT Coordinator *(Chủ trì họp)*<br>2. Technical Support *(Kỹ sư ghi chép)*<br>3. Đại diện Cán bộ thụ lý & Lãnh đạo Phòng Thẩm định |
| **Issues Reviewed** | **03 Sự cố / Đề xuất được rà soát và phân loại chính thức** (`LIV-ISS-01`, `LIV-ISS-02`, `LIV-ISS-03`). |
| **Decisions Made** | 1. **`LIV-ISS-01` (Lề Word):** Phân loại `Low (P4)`. Chấp nhận gom vào giai đoạn `Phase 10F Stabilization`. Không cản trở Golive.<br>2. **`LIV-ISS-02` (Nút Copy):** Phân loại `Suggestion (P5)`. Đưa vào Product Backlog, nâng cấp sau khi hệ thống vận hành chính thức.<br>3. **`LIV-ISS-03` (Port 9000 Workaround):** Phân loại `High - Environment Only (P2)`. Áp dụng workaround khởi động riêng bằng PowerShell, ghi nhận hoàn tất và ổn định. |
| **Blockers** | **0 Blockers** *(Không phát hiện bất kỳ rào cản kỹ thuật hay lỗi pháp lý nào cản trở việc nghiệm thu hệ thống).* |
| **Next Actions** | 1. Tổng hợp toàn bộ số liệu vào Báo cáo `Pilot UAT Execution Summary Report`.<br>2. Kính trình Lãnh đạo cơ quan xem xét phán quyết `GO TO CONTROLLED PRODUCTION PREPARATION` (hoặc `STABILIZATION`). |

---

## 5. Post-session Cleanup

Quy trình và Bảng kiểm tra 06 bước làm sạch sau buổi kiểm thử (`Post-Session Cleanup & Data Hygiene Checklist`), bắt buộc Kỹ sư và Điều phối viên hoàn tất ngay sau buổi test:

| Step (`Bước làm sạch sau UAT`) | Owner | Actions & Verification Requirements (`Yêu cầu thực thi & xác nhận`) | Status |
| :--- | :--- | :--- | :---: |
| **1. Tổng hợp toàn diện danh sách lỗi** | Note-taker | Kiểm tra, chuẩn hóa câu chữ mô tả cho toàn bộ các phiếu trong `Live Issue Register`, đảm bảo không bỏ sót bất kỳ phản hồi nào của cán bộ. | `[DONE]` |
| **2. Xác định Issue cần sửa trước Pilot/Golive** | UAT Coordinator | Rà soát bộ lọc `Critical` và `High`. *(Xác nhận: Không có lỗi code `Critical/High` nào tồn đọng cần chặn đường Golive)*. | `[DONE]` |
| **3. Xác định Issue đưa vào Backlog/Stabilization** | UAT Coordinator | Chuyển nhãn `Phase 10F Stabilization` cho `LIV-ISS-01` (lề Word) và nhãn `Product Backlog` cho `LIV-ISS-02` (nút copy nhanh). | `[DONE]` |
| **4. Lưu giữ an toàn Bằng chứng kiểm thử** | Technical Support | Sao lưu các ảnh chụp màn hình (`screenshots`), file Word mẫu tải về từ phiên test vào thư mục lưu trữ chứng cứ nội bộ an toàn. | `[DONE]` |
| **5. KHÔNG commit dữ liệu cá nhân nhạy cảm** | Technical Support | **CRITICAL PRIVACY RULE:** Kiểm tra kỹ tài liệu markdown và log CSDL, đảm bảo không commit bất kỳ tên thật, email, số điện thoại hay secret/token nào của cán bộ lên Git repository. | `[VERIFIED]` |
| **6. KHÔNG dùng văn bản Pilot để ban hành thật** | UAT Coordinator | **CRITICAL LEGAL RULE:** Giám sát thu hồi hoặc yêu cầu cán bộ xóa/hủy các file Word/PDF `DU_THAO_GOI_Y_AI_...` đã tải xuống máy cá nhân trong buổi test, tuyệt đối không để lọt ra ngoài trình ký chính thức. | `[VERIFIED]` |
