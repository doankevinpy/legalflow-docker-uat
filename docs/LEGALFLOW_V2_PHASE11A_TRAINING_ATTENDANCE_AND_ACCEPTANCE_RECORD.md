# LEGALFLOW V2 - PHASE 11A
# TRAINING ATTENDANCE & ACCEPTANCE RECORD

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11A Standard` (`v2.10.17-production-adoption-review-continuous-improvement-backlog`)  
**Ngày ban hành Biểu mẫu:** 11/07/2026  
**Trạng thái Biểu mẫu:** **`OFFICIAL TRAINING ATTENDANCE & ACCEPTANCE TEMPLATE`** *(Biểu mẫu Ghi nhận Tham gia Đào tạo & Xác nhận Nghiệm thu SOP)*

---

## 1. Purpose

Tài liệu này là Biểu mẫu Ghi nhận Tham gia Đào tạo và Xác nhận Nghiệm thu SOP (`Training Attendance & Acceptance Record` - Phase 11A) của hệ thống LegalFlow V2. Biểu mẫu được thiết lập nhằm lưu trữ bằng chứng kiểm toán pháp lý về việc toàn bộ cán bộ thụ lý, chuyên viên Một cửa và lãnh đạo phòng chuyên môn đã tham gia đầy đủ các ca tập huấn, nắm vững quy trình thao tác chuẩn (`SOP`), thấu hiểu sâu sắc các chốt chặn quản trị AI Khối 3.1 (`AI Governance`), đối chiếu phiên bản pháp luật Khối 3.2 (`Legal Snapshot`) và quy chế xuất dự thảo Khối 3.3 (`Export Safety`). Đây là hồ sơ bắt buộc phải hoàn thiện và lưu trữ tại Văn phòng đơn vị trước khi cấp quyền thao tác trên môi trường production có kiểm soát.

---

## 2. Training Session Information

Bảng thông tin tổng quát về buổi tập huấn/đào tạo thao tác sử dụng hệ thống (`Training Session General Information Table`):

| Session Attribute | Recorded Information & Official Context | Notes & Verification Mandate |
| :--- | :--- | :--- |
| **Date &amp; Time (`Date`)** | `[  /  / 2026 ]` *(Giờ bắt đầu: `...:...` - Giờ kết thúc: `...:...`)* | Ghi theo ca trực hoặc lịch huấn luyện chính thức của cơ quan. |
| **Trainer / Lead (`Trainer`)** | `[ Tên Cán bộ Đào tạo / UAT Coordinator / DevOps Lead ]` | Cán bộ phụ trách phải đọc Kịch bản An toàn Mục 6 của SOP trước lớp. |
| **Location / Online (`Location`)** | `[ Phòng Họp Trụ sở UBND / Trực tuyến qua Zoom - E-Meeting ]` | Ghi nhận hình thức đào tạo trực tiếp hoặc kèm cặp 1:1 tại bàn. |
| **System Version / Tag (`Version`)** | `Phase 11A Standard` (`v2.10.17-production-adoption-review-...`) | Đối chiếu đúng thẻ định danh phiên bản production đang vận hành. |
| **Training Topic (`Topic`)** | `Quán triệt SOP Vận hành Phase 11A, Kỷ luật AI Governance &amp; Thao tác 7 Tab` | Tập trung vào 10 mô-đun huấn luyện chuẩn hóa (`MOD-01 -> MOD-10`). |
| **Official Notes (`Notes`)** | `Khóa đào tạo bắt buộc dành cho Chuyên viên thụ lý và Một cửa (Wave 1 / Wave 2)` | Học viên phải hoàn thành 100% checklist nghiệm thu để nhận chứng nhận. |

---

## 3. Attendance Record

Bảng ghi danh danh sách cán bộ tham gia khóa đào tạo (`Attendance Record Table` - *Lưu ý: Để trống thông tin cá nhân thực tế nếu chưa được cung cấp để bảo đảm tuyệt đối quy định bảo mật quyền riêng tư cá nhân khi chưa ban hành chính thức*):

| No. | Officer Full Name (`Name`) | Assigned Role (`RBAC Role`) | Department / Unit (`Unit`) | Attendance (`Present / Absent`) | Official Signature & Notes (`Notes`) |
| :---: | :--- | :---: | :--- | :---: | :--- |
| **01** | `[ Cán bộ Thụ lý P2 - Mẫu 01 ]` | `STAFF` | Phòng Chuyên môn 2 (`Đất đai`) | `[   ] PRESENT` | Đã trực tiếp thao tác chạy AI Khối 3.1 và kiểm tra snapshot `LAW-02`. |
| **02** | `[ Cán bộ Tra cứu - Mẫu 02 ]` | `VIEWER` | Bộ phận Tiếp nhận Một cửa | `[   ] PRESENT` | Đã nắm rõ lý do tài khoản `VIEWER` bị khóa nút xuất Khối 3.3 (`canAct: false`). |
| **03** | `[ Lãnh đạo Phòng - Mẫu 03 ]` | `MANAGER` | Lãnh đạo Phòng Chuyên môn | `[   ] PRESENT` | Quán triệt rà soát phiếu thẩm định và đối chiếu quy hoạch đất huyện. |
| **04** | `[ Chuyên viên Thụ lý - Mẫu 04 ]` | `STAFF` | Phòng Chuyên môn 2 (`Xây dựng`) | `[   ] PRESENT` | Đã tải và mở kiểm tra file Word `DU_THAO_GOI_Y_AI_...docx` trên MS Word. |
| **05** | `[ Kỹ sư Vận hành - Mẫu 05 ]` | `Technical Operator` | Tổ Công nghệ Thông tin / DevOps | `[   ] PRESENT` | Làm chủ script `health-check.ps1` và kỷ luật không commit backup Git. |
| **06** | `[ Cán bộ Giám sát - Mẫu 06 ]` | `Legal Reviewer` | Tổ Pháp chế / Thẩm định | `[   ] PRESENT` | Đã tra cứu điều khoản trong `Legal Knowledge Base` (`v2.0-2024-LAND-LAW`). |

---

## 4. Understanding Confirmation

Bảng kiểm chứng sự am hiểu và cam kết tuân thủ 6 nguyên tắc an toàn pháp lý của từng học viên tham gia khóa học (`Mandatory Understanding Confirmation Table`):

| Confirmation Item (`Competency Check`) | Confirmed (`Yes/No/NA`) | Verification Method & Officer Demonstration | Governance Notes & Legal Mandate |
| :--- | :---: | :--- | :--- |
| **1. Hiểu AI là Gợi ý (`Advisory Only`)** | `[ ✅ YES ]` | Học viên trả lời câu hỏi và xác nhận hiểu rõ AI Khối 3.1 chỉ tham mưu sơ bộ, tuyệt đối không phải là kết luận phán quyết cuối cùng. | Nguyên tắc số 1 bảo vệ an toàn thẩm quyền của con người. |
| **2. Hiểu Cán bộ phải Kiểm tra (`Verification Mandate`)** | `[ ✅ YES ]` | Học viên thao tác kiểm tra huy hiệu `v2.0-2024-LAND-LAW` tại Khối 3.2 và khẳng định tự rà soát tài liệu scan Tab 4 trước khi lập phiếu. | Cán bộ thụ lý và Lãnh đạo chịu trách nhiệm pháp lý cao nhất. |
| **3. Hiểu Export là Dự thảo (`Draft Awareness`)** | `[ ✅ YES ]` | Học viên giải thích được ý nghĩa tiền tố `DU_THAO_GOI_Y_AI_` và watermark nháp (`SMK-06`), cam kết không phát hành bản nháp AI. | Bảo vệ tính chuẩn mực thể thức văn bản hành chính nhà nước. |
| **4. Hiểu Không Tự ký / Ban hành / Gửi (`Zero Auto-Execution`)** | `[ ✅ YES ]` | Học viên xác nhận rõ hệ thống LegalFlow V2 không tự động cấy chữ ký số, không tự động đóng dấu hay ban hành văn bản ra công dân. | Mọi thao tác trình ký, ban hành được thực hiện trên E-Office. |
| **5. Biết Báo lỗi đúng Kênh (`Issue Reporting`)** | `[ ✅ YES ]` | Học viên nêu đúng 6 bước ghi nhận sự cố và biết liên hệ Trợ lý UAT lúc `16:30 PM` hàng ngày khi gặp lỗi hoặc muốn góp ý (`MOD-09`). | Đồng hành cùng tổ kỹ thuật xây dựng Sổ Backlog Phase 11. |
| **6. Biết Giới hạn Dữ liệu Pháp lý (`Data & Local Law Limit`)** | `[ ✅ YES ]` | Học viên đọc và nhớ lời nhắc `LAW-02`, cam kết luôn đối chiếu thủ công quy hoạch đất cấp huyện và quy trình nội bộ UBND tỉnh ngoài E-Office. | Đảm bảo không sai lệch quy định thẩm quyền tại địa phương. |

---

## 5. Feedback After Training

Bảng tiếp nhận các ý kiến phản hồi, góp ý nâng cấp giao diện và vướng mắc từ cán bộ học viên sau khi kết thúc buổi đào tạo (`Post-Training Feedback & Backlog Intake Table`):

| Feedback ID | Officer Role (`Role`) | Detailed Feedback / Suggestion (`Feedback Content`) | Assigned Priority | Follow-up Needed (`Yes/No`) | Action Plan & Roadmap Notes |
| :---: | :---: | :--- | :---: | :---: | :--- |
| **TRN-FB-01** | `STAFF` | Đề xuất bổ sung tính năng bóc tách tự động thông tin chủ sử dụng từ bản scan sổ đỏ Tab 4 sang Tab 1 để giảm thao tác gõ lại. | `Medium` | `Yes` | Đã đưa vào Sổ Backlog Cải tiến Liên tục Phase 11 (`BL-004: OCR Auto-extraction`). |
| **TRN-FB-02** | `MANAGER` | Đề xuất thêm ô cho phép Lãnh đạo ghi chú trực tiếp ý kiến chỉ đạo trên phiếu AI Khối 3.1 trước khi trả về cho chuyên viên sửa đổi. | `Medium` | `Yes` | Đã tích hợp vào kế hoạch nâng cấp nghiệp vụ (`BL-005: Tab 6 Collaboration`). |
| **TRN-FB-03** | `STAFF` | Yêu cầu chuẩn hóa lại mẫu phiếu thẩm định xuất Word theo đúng thể thức Nghị định 30/2020/NĐ-CP chuẩn của cơ quan hành chính. | `High` | `Yes` | Ưu tiên triển khai ngay tại lộ trình tiếp theo (`BL-002: Export Template Upgrade`). |
| **TRN-FB-04** | `VIEWER` | Đề xuất thêm chức năng highlight từ khóa tìm kiếm trong menu `Legal Knowledge Base` (`LK-01`) để tra cứu nhanh hơn. | `Low` | `No` | Ghi nhận vào danh sách tối ưu hóa trải nghiệm người dùng (`BL-007`). |
| **TRN-FB-05** | `Technical Operator` | Đề xuất bổ sung script giải phóng cổng `9000` tự động trong `start-legalflow.ps1` để khắc phục vĩnh viễn lỗi xung đột MinIO (`EXP-ENV-01`). | `Medium` | `Yes` | Tổ DevOps sẽ xử lý cấu hình port binding trong `docker-compose.yml` tại Phase 11. |

---

## 6. Acceptance Statement

Dưới đây là **Đoạn Văn bản Xác nhận Nghiệm thu Chính thức (`Official Acceptance Statement`)** được in ở cuối hồ sơ để các cán bộ học viên, Lãnh đạo đơn vị và Cán bộ Đào tạo cùng ký xác nhận:

> [!IMPORTANT]
> **TUYÊN BỐ XÁC NHẬN NGHIỆM THU QUY TRÌNH & ĐÀO TẠO (LEGALFLOW V2 - PHASE 11A):**
> 
> *"Người tham gia đã được hướng dẫn rằng LegalFlow là công cụ hỗ trợ, không thay thế trách nhiệm kiểm tra, tham mưu và quyết định của cán bộ có thẩm quyền. Văn bản xuất từ hệ thống là bản dự thảo/gợi ý và phải được kiểm tra, chỉnh sửa, ký/ban hành theo đúng quy định nếu sử dụng chính thức."*

---

### Chữ ký Xác nhận của Các Bên Tham gia Nghiệm thu:

* **ĐẠI DIỆN HỌC VIÊN THAM GIA ĐÀO TẠO:**  
  *(Ký và ghi rõ họ tên)*  
  <br/><br/>
  ___________________________________________

* **CÁN BỘ PHỤ TRÁCH ĐÀO TẠO / TRỢ LÝ UAT:**  
  *(Ký và ghi rõ họ tên)*  
  <br/><br/>
  ___________________________________________

* **LÃNH ĐẠO PHÒNG CHUYÊN MÔN / PHÁP CHẾ (`MANAGER`):**  
  *(Ký và ghi rõ họ tên)*  
  <br/><br/>
  ___________________________________________

* **QUẢN TRỊ VIÊN HỆ THỐNG / DEVOPS LEAD (`ADMIN`):**  
  *(Ký và ghi rõ họ tên)*  
  <br/><br/>
  ___________________________________________

---
*Biểu mẫu Ghi nhận Tham gia Đào tạo & Xác nhận Nghiệm thu SOP (Phase 11A Record) được lập tự động từ kết quả chuẩn hóa Phase 10Q.*
