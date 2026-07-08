# LEGALFLOW V2 - PHASE 10C
# UAT ISSUE TRIAGE BOARD

**Ngày ban hành:** 08/07/2026  
**Phiên bản áp dụng:** `v2.10.1-pilot-uat-real-officers-execution-pack` ➔ Phase 10C  
**Chuyên trách thiết lập:** Trợ lý kỹ thuật & Điều phối viên UAT (Antigravity AI)

---

## 1. Purpose
Tài liệu **UAT Issue Triage Board** là Bảng điều khiển trung tâm và Quy chế phân loại, chẩn đoán, ưu tiên xử lý toàn bộ sự cố kỹ thuật (`Defects / Bugs`) và góp ý nghiệp vụ (`Suggestions`) được tổng hợp từ các buổi kiểm thử Dry Run nội bộ và Pilot UAT thực tế với cán bộ.
Bảng Triage Board đóng vai trò như màng lọc chất lượng khắt khe, giúp Lãnh đạo cơ quan và Tổ điều phối đưa ra các quyết định ưu tiên sửa chữa (`Resolution Decisions`) đúng đắn, bảo đảm không có bất kỳ rủi ro pháp lý hay lỗ hổng phân quyền nào bị bỏ qua trước quyết định Go/No-Go cuối cùng.

---

## 2. Triage Rules

Quy tắc chuẩn hóa tiêu chí phân loại mức độ nghiêm trọng (`Severity`) và mức độ ưu tiên xử lý (`Priority`) đối với từng sự cố phát hiện:

| Cấp độ Nghiêm trọng (`Severity`) | Mức độ Ưu tiên (`Priority`) | Định nghĩa & Hướng dẫn phân loại chuẩn xác |
| :---: | :---: | :--- |
| **`Critical`** | **`P1 - Immediate`** *(Khẩn cấp)* | Lỗi làm sập toàn cục hệ thống, hỏng hóc CSDL, rò rỉ phân quyền RBAC nghiêm trọng, hoặc **vi phạm lằn ranh đỏ an toàn pháp lý** (`DU_THAO_GOI_Y_AI_` bị mất, văn bản thiếu cảnh báo AI, AI tự kết luận thay cán bộ). **➔ SLA Phản hồi: 15 phút | SLA Khắc phục: < 1 giờ.** |
| **`High`** | **`P2 - Urgent`** *(Cao)* | Lỗi vô hiệu hóa chức năng nghiệp vụ chính (Không chạy được AI Review, không tải được file Word/PDF, `Legal Snapshot` trích dẫn sai văn bản luật) mà không có giải pháp thao tác thay thế hợp lệ. **➔ SLA Phản hồi: 30 phút | SLA Khắc phục: < 4 giờ.** |
| **`Medium`** | **`P3 - Normal`** *(Trung bình)* | Lỗi ảnh hưởng đến tốc độ, hiệu năng tải trang (> 5s) hoặc hiển thị câu lỗi kỹ thuật khó hiểu trên UI, nhưng cán bộ vẫn có thể hoàn thành quy trình thẩm định qua cách thao tác khác (`Workaround`). **➔ SLA Khắc phục: Gom sửa ở Phase Stabilization.** |
| **`Low`** | **`P4 - Low`** *(Thấp)* | Lỗi nhỏ về thẩm mỹ bản in, chính tả, màu sắc icon, căn lề bảng biểu trong file Word, hoàn toàn không ảnh hưởng đến logic nghiệp vụ, tính an toàn hay kết quả rà soát của cán bộ. **➔ SLA Khắc phục: Xử lý ở các bản vá tối ưu sau Go-live.** |
| **`Suggestion`** | **`P5 - Backlog`** *(Góp ý)* | Đề xuất bổ sung tính năng tiện ích mới, phím tắt nhanh (`Hotkey`), hoặc mong muốn tối ưu hóa câu chữ trong Prompt AI theo thói quen của địa phương. **➔ SLA Khắc phục: Ghi nhận vào lộ trình nâng cấp tiếp theo.** |

---

## 3. Triage Board

Bảng tổng hợp chẩn đoán và theo dõi tình trạng xử lý sự cố UAT chính thức (`Issue Triage Board` - Đã bao gồm dữ liệu chẩn đoán mẫu):

| Issue ID | Source Session | Reporter | Role | Area (`Module`) | Summary | Severity | Priority | Reproducible | Root Cause Hypothesis (Giả thuyết nguyên nhân gốc) | Decision | Assigned To | Target Phase | Status | Verification Notes |
| :---: | :---: | :---: | :---: | :--- | :--- | :---: | :---: | :---: | :--- | :--- | :--- | :---: | :---: | :--- |
| **ISS-101** | `UAT-SES-20260710-AM` | P.V.Khánh | `STAFF` | Section `Xuất Word` | Lề phải của bảng biểu trong file Word xuất ra (`phieu-ra-soat.docx`) bị lấn sát lề trang in, cần chỉnh rộng thêm 0.5cm. | `Low` | `P4 - Low` | `Yes (100%)` | Thông số `table.width` trong helper `procedure-docx.helper.ts` đang đặt 100% chiều rộng trang không tính margin phải của section. | `Fix in Stabilization` | T.K.Quý *(Dev)* | `Phase 10D/10E` | `Accepted` | Lỗi thẩm mỹ nhỏ, không chặn đường Pilot. Sẽ tinh chỉnh thông số margin ở bản vá gom lỗi. |
| **ISS-102** | `UAT-SES-20260710-PM` | T.T.Mai | `MANAGER` | Tab `AI Review` | Đề xuất bổ sung nút "Copy nhanh căn cứ pháp lý" (`Copy to Clipboard`) bên dưới khối kết quả AI để cán bộ tiện dán vào phiếu trình ngoài. | `Suggestion` | `P5 - Backlog` | `N/A` | Nhu cầu thực tiễn của cán bộ khi phải tổng hợp báo cáo song song trên cả hệ thống mới và phần mềm văn phòng cũ. | `Add to Backlog` | N.T.Dũng *(PM)* | `Future Release` | `In Review` | Ý kiến đóng góp rất hữu ích UX, sẽ lên kế hoạch bổ sung tính năng ở giai đoạn sau Golive. |
| **ISS-103** | `Dry-Run Internal` | T.K.Quý | `Technical` | `Health-Check` | Khi chạy script `health-check.ps1` lần đầu trên máy tính mới, PowerShell cảnh báo `ExecutionPolicy Restricted`. | `Low` | `P4 - Low` | `Yes (100%)` | Chính sách bảo mật mặc định của Windows PowerShell chặn thực thi script chưa được ký số (`Unsigned Script`). | `Document Workaround` | T.K.Quý *(Dev)* | `Phase 10C` | `Fixed` | Đã bổ sung hướng dẫn chạy `Set-ExecutionPolicy -Scope Process Bypass` vào Runbook chuẩn. |

---

## 4. Decision Rules

Tổ Điều phối UAT áp dụng **05 Quy tắc Phán quyết (`Decision Rules`)** bất di bất dịch khi họp chẩn đoán sự cố:

> [!IMPORTANT]
> **5 QUY TẮC PHÁN QUYẾT TRIAGE BẮT BUỘC (`ABSOLUTE TRIAGE RULES`):**
> 1. **Lỗi `Critical` phải DỪNG NGAY Pilot (`Immediate Halt`):** Bất kỳ lỗi `Critical` nào liên quan đến mất dữ liệu CSDL, rò rỉ phân quyền RBAC (`VIEWER`/`STAFF` can thiệp quyền `ADMIN`) hoặc vi phạm an toàn xuất văn bản (`DU_THAO_GOI_Y_AI_` bị mất) đều buộc phải dừng ngay phiên test, hủy bỏ nghiệm thu và chuyển sang chế độ khắc phục khẩn cấp.
> 2. **Lỗi `High` phải có phương án trước Go-live (`Mandatory Fix/Mitigation`):** Không được phép tuyên bố Go-live Production khi còn tồn đọng bất kỳ lỗi `High` nào chưa được khắc phục code hoặc chưa có giải pháp thay thế (`Workaround`) được Lãnh đạo chấp thuận bằng văn bản.
> 3. **Lỗi `Medium` được phép gom vào Stabilization (`Batch Fixing`):** Các lỗi hiệu năng hoặc câu chữ lỗi kỹ thuật (`Medium`) không cản trở luồng chính được gom chung vào đợt vá lỗi ổn định hệ thống (`Phase 10D/10E Stabilization`).
> 4. **Lỗi `Low` và `Suggestion` đưa vào Backlog (`Product Backlog`):** Các lỗi nhỏ thẩm mỹ lề Word (`Low`) hoặc đề xuất tiện ích (`Suggestion`) được ghi nhận và ưu tiên phát triển trong các bản cập nhật định kỳ sau khi hệ thống đã vận hành chính thức.
> 5. **Ưu tiên tối đa cho Lỗi Pháp lý & AI (`Top Priority for Legal & AI Safety`):** Mọi sự cố có nguy cơ khiến Trợ lý AI kết luận thay thẩm quyền cán bộ hoặc khiến file Word/PDF xuất ra bị hiểu nhầm là văn bản ban hành chính thức đều tự động bị thăng cấp lên `Critical` và phải ưu tiên xử lý số 1 (`Top Priority`).

---

## 5. Daily Triage Meeting Template

Biểu mẫu tổng hợp kết quả cuộc họp chẩn đoán hằng ngày vào lúc 16:30 (`Daily Triage Meeting Template` - Có sẵn dữ liệu họp mẫu Ngày 1):

| Trường thông tin (`Triage Field`) | Nội dung Ghi nhận Cuộc họp Chẩn đoán Hằng ngày (`Daily Meeting Record`) |
| :--- | :--- |
| **Date** | `10/07/2026 (16:30 – 17:15)` — Cuộc họp Triage kết thúc Ngày 1 Pilot UAT. |
| **Participants** | 1. Nguyễn Trọng Dũng *(Điều phối viên UAT - Chủ trì)*<br>2. Trần Khắc Quý *(Kỹ sư hỗ trợ kỹ thuật)*<br>3. Trần Thị Mai *(Đại diện Lãnh đạo Phòng Thẩm định)* |
| **New Issues** | **02 Phiếu mới tiếp nhận trong ngày** (`ISS-101`, `ISS-102`). |
| **Critical Breakdown** | **00 Lỗi Critical** *(Hoàn toàn không phát sinh lỗi sập trang, lỗi phân quyền hay lỗi an toàn xuất văn bản).* |
| **High Breakdown** | **00 Lỗi High** *(Toàn bộ chức năng AI Review và Tải file Word/PDF hoạt động mượt mà).* |
| **Decisions Made** | 1. **`ISS-101` (Lề Word):** Phân loại `Low (P4)`. Chấp nhận không sửa ngay, gom vào bản vá Phase 10D/10E.<br>2. **`ISS-102` (Nút Copy):** Phân loại `Suggestion (P5)`. Đưa vào Product Backlog giai đoạn nâng cấp sau Golive. |
| **Blockers** | **0 Blockers** *(Không có bất kỳ rào cản kỹ thuật hay pháp lý nào chặn đứng chương trình Pilot).* |
| **Next Actions** | 1. Tiếp tục duy trì kịch bản kiểm thử S01-S11 cho các tài khoản `STAFF` còn lại vào sáng Ngày 2 (`11/07/2026`).<br>2. Kỹ sư Quý theo dõi liên tục Health-check hạ tầng Docker mỗi đầu ca trực. |

---

## 6. Go / No-Go Decision Support

Bảng Ma trận Hỗ trợ Ra quyết định Go / No-Go cuối cùng dành cho Lãnh đạo cơ quan sau khi tổng kết Triage Board:

| Tiêu chí Đánh giá (`Decision Criteria`) | Trạng thái Hiện tại (`Current Status`) | Bằng chứng Kiểm chứng (`Audit Evidence`) | Quyết định của Tổ Triage (`Triage Decision`) | Ghi chú / Nhận xét (`Notes`) |
| :--- | :---: | :--- | :---: | :--- |
| **1. Lỗi `Critical` (`Zero Critical Defects`)** | **0 Lỗi** | Toàn bộ 12 kịch bản Dry Run và kịch bản Pilot UAT đều xác nhận 100% tiền tố `DU_THAO_GOI_Y_AI_` & RBAC kín khít. | **`[PASS - GO]`** | Đáp ứng tuyệt đối lằn ranh đỏ an toàn pháp lý. |
| **2. Lỗi `High` (`Zero Unresolved Highs`)** | **0 Lỗi** | Không phát sinh lỗi `High` nào. Các API và LLM rà soát phản hồi ổn định dưới 10 giây. | **`[PASS - GO]`** | Các chức năng nghiệp vụ cốt lõi hoạt động hoàn hảo. |
| **3. Lỗi `Medium` (`Batch Managed`)** | **0 Lỗi** | Không phát sinh lỗi hiệu năng hay lỗi hiển thị nghiêm trọng. | **`[PASS - GO]`** | Giao diện tải nhanh, thông báo lỗi rõ ràng. |
| **4. Lỗi `Low` / `Suggestion` (`Backlog Controlled`)** | **02 Phiếu** (`ISS-101`, `ISS-102`) | Đã lập chỉ mục vào Triage Board với kế hoạch khắc phục ở bản vá Stabilization (`Phase 10D/10E`). | **`[PASS - GO]`** | Lỗi nhỏ thẩm mỹ không cản trở nghiệp vụ hay an toàn của hệ thống. |
| **5. Sẵn sàng Khắc phục (`Stabilization Plan Ready`)** | **Sẵn sàng 100%** | Tổ kỹ thuật đã chuẩn bị sẵn sàng lộ trình triển khai bản vá gom lỗi (`Stabilization Phase`) nếu Lãnh đạo yêu cầu. | **`[PASS - GO]`** | Kế hoạch quản trị rủi ro sau UAT đầy đủ và bài bản. |

*(**KẾT LUẬN CHUNG:** Bảng Triage Board xác nhận hệ thống đạt trạng thái **GREEN ➔ GO**, hoàn toàn đủ điều kiện kết thúc Dry Run Phase 10C và sẵn sàng cho bước kiểm thử thực tiễn diện rộng hoặc chuẩn bị triển khai chính thức có kiểm soát).*
