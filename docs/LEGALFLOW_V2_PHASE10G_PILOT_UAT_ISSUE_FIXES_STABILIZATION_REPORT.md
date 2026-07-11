# LEGALFLOW V2 - PHASE 10G: PILOT UAT ISSUE FIXES & STABILIZATION REPORT
**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.5` -> `v2.10.6-pilot-uat-stabilized`  
**Ngày thực hiện:** 11/07/2026  
**Trạng thái Phase 10G:** `COMPLETED` (Đã hoàn thành toàn bộ các hạng mục khắc phục lỗi & tối ưu hóa hệ thống)

---

## 1. TỔNG QUAN & MỤC TIÊU PHASE 10G

Nối tiếp kết luận **`GO TO ISSUE FIXES`** tại Báo cáo Triage Phase 10F (`docs/LEGALFLOW_V2_PHASE10F_PILOT_UAT_RESULTS_AND_ISSUE_TRIAGE_REPORT.md`), Phase 10G tập trung khắc phục các vấn đề UAT mức ưu tiên cao (`P1/P2`) thuộc nhóm trải nghiệm người dùng (`UI/UX`), xử lý trạng thái rỗng/lỗi (`Error & Empty States`), điều chỉnh cấu trúc hiển thị thông tin rà soát AI và chuẩn hóa văn phong hành chính pháp lý.

### Mục tiêu cốt lõi đã đạt được:
1. **Chuẩn hóa Error/Empty States (`DETAIL-02`, `CASELIST-01`)**: Loại bỏ hoàn toàn các màn hình trống hoặc thông báo lỗi kỹ thuật khó hiểu; thay thế bằng các thẻ thông tin chuyên nghiệp có biểu tượng (`Iconography`), mô tả nghiệp vụ rõ ràng và nút thao tác thử lại (`Retry / Refresh`).
2. **Tối ưu Danh sách Hồ sơ (`CASELIST-01`, `CASELIST-02`)**: Bổ sung bộ lọc đa chiều (Lĩnh vực, Trạng thái, Từ khóa), mặc định sắp xếp hồ sơ theo ngày tiếp nhận mới nhất (`receivedAt DESC`) và chuẩn hóa màu sắc huy hiệu trạng thái (`Status Badges`).
3. **Cấu trúc hóa Tab AI Review (`UX-01`, `UX-05`)**: Phân chia rõ ràng thành **3 khối nghiệp vụ độc lập**: Khối 3.1 (`AI Review`), Khối 3.2 (`Legal Snapshot`), Khối 3.3 (`Export Safety`).
4. **Cảnh báo Pháp lý Địa phương & Quy hoạch (`LAW-02`, `LK-01`)**: Gắn cảnh báo bắt buộc về trách nhiệm đối chiếu quy trình nội bộ UBND tỉnh/thành phố, quy hoạch sử dụng đất cấp huyện/kế hoạch sử dụng đất hàng năm và hiển thị rõ phiên bản căn cứ áp dụng (`Active Version: v2.0-2024-LAND-LAW`).
5. **Chuẩn hóa Văn phong AI Hành chính (`AI-01`, `AI-04`)**: Siết chặt chỉ dẫn `System Prompt` của AI, tuân thủ tuyệt đối nguyên tắc `Human-in-the-Loop` – AI chỉ đóng vai trò tham mưu chuyên môn sơ bộ, không đưa ra từ ngữ mang tính kết luận tuyệt đối thay thế cán bộ thẩm quyền.

---

## 2. BẢNG KIỂM TRA TUÂN THỦ GIỚI HẠN PHẠM VI (ABSOLUTE CONSTRAINTS VERIFICATION)

Trong suốt quá trình thực hiện Phase 10G, toàn bộ 10 nguyên tắc bất di bất dịch của dự án đã được tuân thủ nghiêm ngặt 100%:

| STT | Yêu cầu giới hạn tuyệt đối | Trạng thái tuân thủ | Minh chứng thực tế trong codebase |
| :---: | :--- | :---: | :--- |
| **1** | **Không sửa schema database** | ✅ **TUÂN THỦ** | Không có bất kỳ thay đổi nào trong file `prisma/schema.prisma` hoặc định nghĩa bảng. |
| **2** | **Không tạo migration mới** | ✅ **TUÂN THỦ** | Thư mục `prisma/migrations` được giữ nguyên hoàn toàn không có file mới. |
| **3** | **Không chỉnh sửa biến môi trường (`.env`)** | ✅ **TUÂN THỦ** | File `.env` và cấu hình kết nối database/Caddy/MinIO giữ nguyên định dạng pilot. |
| **4** | **Không sửa dữ liệu database thủ công** | ✅ **TUÂN THỦ** | Không chạy câu lệnh SQL `UPDATE/DELETE/INSERT` trực tiếp vào DB của người dùng. |
| **5** | **Không tạo thêm dữ liệu giả lập/thật** | ✅ **TUÂN THỦ** | Chỉ kiểm tra và thao tác trên dữ liệu hồ sơ hiện hữu có sẵn trong môi trường UAT. |
| **6** | **Không sửa đổi trạng thái hồ sơ hiện tại** | ✅ **TUÂN THỦ** | Các hồ sơ đang ở trạng thái `SUBMITTED`, `IN_REVIEW`, `COMPLETED`... được bảo toàn. |
| **7** | **Không làm module lớn hay refactor lớn** | ✅ **TUÂN THỦ** | Các sửa đổi tập trung chính xác vào điểm xử lý logic UI/UX và chuỗi Prompt AI. |
| **8** | **Không tự ý git commit hay tag thay người dùng** | ✅ **TUÂN THỦ** | Mọi thao tác commit/tag/push dành quyền quyết định hoàn toàn cho chủ sở hữu dự án. |
| **9** | **Không biến AI thành kết luận chính thức** | ✅ **TUÂN THỦ** | Tuân thủ triệt để Human-in-the-Loop; mọi bản in/xuất đều có tiêu đề cảnh báo tham mưu. |
| **10** | **Bảo toàn dữ liệu phân tích cũ** | ✅ **TUÂN THỦ** | Không ghi đè hay chỉnh sửa các bản ghi `ProcedureAiAnalysis` đã tạo từ trước trong DB. |

---

## 3. CHI TIẾT CÁC HẠNG MỤC KHẮC PHỤC LỖI & TỐI ƯU HÓA (MAPPING & FIX DETAILS)

### 3.1. Nhóm Khắc phục UI/UX Danh sách Hồ sơ (`ProcedureCaseList.tsx`)
* **Mã vấn đề UAT:** `CASELIST-01`, `CASELIST-02`
* **Nội dung nâng cấp:**
  - **Bộ lọc đa tiêu chí:** Thêm thanh công cụ tìm kiếm theo mã hồ sơ/tên người nộp/thuộc tính (`Keyword search`), bộ lọc theo **Lĩnh vực (`FieldFilter`)** (Đất đai, Xây dựng...) và **Trạng thái (`StatusFilter`)** (Mới tiếp nhận, Đang thẩm tra, Cần bổ sung, Chờ phê duyệt, Hoàn thành, Từ chối).
  - **Nút xóa bộ lọc nhanh:** Hiển thị nút `Xóa bộ lọc tìm kiếm` khi cán bộ đang áp dụng điều kiện lọc, giúp thao tác quay lại danh sách đầy đủ chỉ với 1 cú nhấp chuột.
  - **Sắp xếp mặc định thông minh:** Tự động sắp xếp danh sách hồ sơ theo thứ tự ngày tiếp nhận mới nhất lên trên (`receivedAt DESC`), đảm bảo cán bộ luôn nhìn thấy hồ sơ mới phát sinh.
  - **Huy hiệu trạng thái chuẩn (`Status Badges`)**: Áp dụng hệ màu chuyên nghiệp (`bg-sky-50 text-sky-700`, `bg-amber-50 text-amber-700`, `bg-emerald-50 text-emerald-700`...) để dễ phân biệt bằng mắt thường.
  - **Trạng thái rỗng chuyên nghiệp:** Nếu danh sách lọc trống, hệ thống hiển thị thẻ thông báo `🔍 Không tìm thấy hồ sơ phù hợp` với hướng dẫn cụ thể thay vì bảng trống.

### 3.2. Nhóm Khắc phục Trạng thái Lỗi & Rỗng (`DETAIL-02`) tại Màn hình Chi tiết (`ProcedureCaseDetail.tsx`)
* **Mã vấn đề UAT:** `DETAIL-02`, `UX-04`, `UX-05`
* **Nội dung nâng cấp:**
  - **Quy chuẩn 7 Tab Nghiệp vụ:** Sắp xếp và đánh số thứ tự logic theo luồng thụ lý thực tế: `1. Thông tin hồ sơ` -> `2. Checklist & Dữ liệu` -> `3. AI Rà soát & Căn cứ` -> `4. Tài liệu đính kèm` -> `5. Nghĩa vụ tài chính` -> `6. Ghi chú thẩm định` -> `7. Lịch sử Audit Log`.
  - **Nút điều hướng rõ ràng:** Cải tiến nút `<- Quay lại danh sách hồ sơ TTHC` ở Header và các màn hình lỗi giúp điều hướng liền mạch.
  - **Thẻ Empty States cho từng Tab:**
    - Tab Tài liệu: `📁 Chưa có tài liệu đính kèm cho hồ sơ này` + giải thích nghiệp vụ số hóa/OCR.
    - Tab Checklist: `📋 Chưa có mục checklist kiểm tra nào` + hướng dẫn tạo mục kiểm tra thủ công hoặc từ AI.
    - Tab Ghi chú: `💬 Chưa có ý kiến trao đổi hay ghi chú thẩm định nào` + hướng dẫn trao đổi nội bộ.
    - Tab Audit Log: `🔍 Chưa có bản ghi nhật ký kiểm toán` + mô tả cơ chế ghi nhận tự động minh bạch.
    - Màn hình lỗi tải hồ sơ: Thẻ cảnh báo `⚠️ Không tìm thấy hoặc không thể tải chi tiết hồ sơ TTHC` kèm nút `🔄 Thử lại / Refresh`.

### 3.3. Nhóm Tái cấu trúc Tab AI Review & Cảnh báo Pháp lý (`ProcedureCaseDetail.tsx`)
* **Mã vấn đề UAT:** `UX-01`, `UX-03`, `LAW-02`, `LK-01`
* **Nội dung nâng cấp:**
  - Phân tách Tab AI Review thành **3 Khối nghiệp vụ độc lập có viền & màu sắc nhận diện riêng biệt**:
    1. **Khối 3.1: AI REVIEW – PHÂN TÍCH VÀ ĐÁNH GIÁ CHUYÊN MÔN**: Khung điều khiển kích hoạt rà soát (`handleRunAiReview`) kèm chú thích chức năng rõ ràng (`UX-03`).
    2. **Khối 3.2: CĂN CỨ PHÁP LÝ ĐÃ SỬ DỤNG (LEGAL SNAPSHOT & ACTIVE VERSION)**:
       - Hiển thị nhãn **`Active Version: v2.0-2024-LAND-LAW`** cùng các phiên bản `Knowledge Base`, `Procedure Version`, `Prompt Version` (`LK-01`).
       - **Cảnh báo bắt buộc về quy hoạch/địa phương (`LAW-02`)**: Khung màu vàng nhấn mạnh cán bộ thụ lý bắt buộc phải đối chiếu với **(1) Quy trình nội bộ giải quyết TTHC do UBND tỉnh/thành phố ban hành**; **(2) Quy hoạch sử dụng đất cấp huyện, Kế hoạch sử dụng đất hàng năm**; **(3) Quy hoạch chi tiết xây dựng (nếu có)** trước khi ban hành kết quả.
    3. **Khối 3.3: DỰ THẢO / IN / XUẤT VĂN BẢN (EXPORT SAFETY)**:
       - Cảnh báo bắt buộc (`AI-01` / `AI-04`): *“Văn bản dự thảo do hệ thống tạo tự động chỉ mang tính tham mưu chuyên môn sơ bộ. Cán bộ có thẩm quyền phải kiểm tra, chỉnh sửa, ký số/ký tay và ban hành theo đúng thẩm quyền quy định.”*
       - Hệ thống nút bấm xuất `Xem bản dự thảo`, `In bản gợi ý AI`, `Xuất Word (.docx)`, `Xuất PDF` được trang bị `tooltip/title` mô tả chi tiết công năng từng thao tác (`UX-03`).

### 3.4. Nhóm Chuẩn hóa Văn phong AI & Chỉ dẫn Prompt (`procedure-ai-prompt.builder.ts`)
* **Mã vấn đề UAT:** `AI-04`
* **Nội dung nâng cấp:**
  - Bổ sung **Mục 7: HƯỚNG DẪN VĂN PHONG HÀNH CHÍNH & NGUYÊN TẮC HUMAN-IN-THE-LOOP** vào `systemPrompt` của cả 2 luồng thủ tục `LAND_FIRST_CERTIFICATE` (Cấp GCN lần đầu) và `LAND_USE_PURPOSE_CHANGE` (Chuyển mục đích sử dụng đất).
  - **Quy tắc ngôn ngữ hành chính:** Yêu cầu AI sử dụng ngôn ngữ khách quan, trang trọng, chuẩn mực hành chính nhà nước (VD: *"Qua rà soát bước đầu..."*, *"Đề nghị bộ phận thụ lý kiểm tra, đối chiếu..."*).
  - **Cấm tuyệt đối từ ngữ kết luận thay thế cán bộ:** AI tuyệt đối không được phép sử dụng các từ khẳng định tuyệt đối như *"Hồ sơ hợp lệ/không hợp lệ"*, *"Cho phép chuyển mục đích"*, *"Đủ điều kiện cấp sổ"* mà phải trình bày dưới dạng *"Gợi ý kết quả rà soát để cán bộ thẩm tra quyết định"*.

---

## 4. KẾT QUẢ KIỂM THỬ KỸ THUẬT & BIÊN DỊCH HỆ THỐNG (BUILD & HEALTH VERIFICATION)

Hệ thống đã được chạy kiểm tra biên dịch tĩnh (`TypeScript Compiler`) và đóng gói bản build production bằng Vite (`vite build`). Kết quả xác nhận hệ thống ổn định và sẵn sàng cho môi trường UAT:

```bash
> legalflow@0.0.0 build
> tsc -b && vite build

vite v8.0.12 building client environment for production...
transforming...✓ 3177 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                     0.47 kB │ gzip:   0.30 kB
dist/assets/index-_ngULQQM.css    105.16 kB │ gzip:  15.98 kB
dist/assets/index-DboZ0hfN.js   1,482.10 kB │ gzip: 387.03 kB

✓ built in 2.11s
```

* **Kiểm tra trạng thái dịch vụ backend/frontend (`health-check.ps1`):**
  - `Docker Containers (Postgres, Caddy, MinIO)`: **PASS**
  - `Backend API Server (Port 3000)`: **PASS** (Phản hồi tốt)
  - `Frontend Dev Server (Port 5173)`: **PASS** (Hoạt động ổn định)

---

## 5. KẾT LUẬN & ĐỀ XUẤT TRIỂN KHAI (READINESS DECISION)

### Quyết định Readiness:
-> **`READY FOR WIDER PILOT DEPLOYMENT` (ĐỦ ĐIỀU KIỆN TRIỂN KHAI PILOT UAT MỞ RỘNG VỚI CÁN BỘ THỰC TẾ)**

Toàn bộ các phản hồi và góp ý `P1/P2` từ đợt chạy thử Dry Run/UAT nội bộ đã được giải quyết triệt để trên cả hai khía cạnh Trải nghiệm người dùng (`UI/UX`) và Chuẩn hóa pháp lý AI (`Legal & AI Governance`). Hệ thống duy trì sự ổn định cao, bảo toàn tuyệt đối cơ sở dữ liệu và cấu trúc kiến trúc lõi.

### Các bước khuyến nghị tiếp theo cho nhóm vận hành dự án:
1. **Thông báo Cập nhật UAT:** Gửi thông báo đến cán bộ tham gia Pilot UAT về phiên bản cập nhật `v2.10.6-pilot-uat-stabilized`, nhấn mạnh vào các cải tiến về bộ lọc danh sách hồ sơ và 3 khối cấu trúc rõ ràng tại tab AI Review.
2. **Theo dõi Bản ghi Góp ý:** Sử dụng biểu mẫu `docs/LEGALFLOW_V2_PHASE10C_UAT_SESSION_LOG_TEMPLATE.md` để tiếp tục ghi nhận ý kiến cán bộ trong các buổi chạy thử nghiệm thực tế tiếp theo.
3. **Chuẩn bị Phase tiếp theo (Khi có quyết định mở rộng nghiệp vụ):** Các tính năng nâng cao như Upload file kèm kiểm tra OCR tự động (Tab 4) hoặc Tính toán nghĩa vụ tài chính 3 mức (Tab 5) sẽ được kích hoạt theo lộ trình phát triển riêng của dự án khi bước sang các Phase chính thức tiếp theo.

---
*Báo cáo được lập tự động từ kết quả thực hiện và kiểm thử thực tế của Phase 10G.*
