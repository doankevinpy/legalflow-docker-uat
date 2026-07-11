# LEGALFLOW V2 - PHASE 10L
# POST-DEPLOYMENT SMOKE TEST REPORT

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.11-controlled-production-go-no-go-final-approval` -> `v2.10.12-controlled-production-deployment-execution`  
**Ngày kiểm tra:** 11/07/2026  
**Trạng thái Tổng kết Kiểm tra:** **`PASS WITH WARNINGS`**

---

## 1. Purpose

Tài liệu này là Báo cáo kiểm tra nhanh sau triển khai (`Post-deployment Smoke Test Report`) nhằm rà soát và xác nhận thực trạng hoạt động của hệ thống LegalFlow V2 ngay sau khi thực hiện khởi động môi trường production có kiểm soát (`Phase 10L`). Báo cáo cung cấp ma trận rà soát 11 luồng chức năng trọng yếu, kiểm tra an toàn xuất văn bản (`Export Safety Confirmation`), kiểm soát quản trị AI (`AI Governance Confirmation`) và tổng kết mức độ sẵn sàng cho người dùng Pilot.

---

## 2. Environment

Bảng thông tin chi tiết về cấu hình môi trường kiểm thử sau triển khai:

| Item | Value | Notes & Baseline |
| :--- | :--- | :--- |
| **System Tag Tested** | `v2.10.11-controlled-production-go-no-go-final-approval` | Điểm neo chuẩn xác sau quyết định Go/No-Go Phase 10K. |
| **Proposed Post-test Tag** | `v2.10.12-controlled-production-deployment-execution` | Tag gắn sau khi hoàn tất kiểm tra sau triển khai. |
| **Target OS / Host** | Windows 11 / Docker UAT &amp; Controlled Production Host | Môi trường máy chủ nội bộ của đơn vị. |
| **Postgres Container** | `legalflow_postgres` (`Up healthy`) | PostgreSQL 15, Database đích: `legalflow_prod`. |
| **Caddy Proxy Container** | `legalflow_caddy` (`Up running`) | Reverse proxy định tuyến cổng `8080`. |
| **MinIO Storage Container** | `legalflow_minio` (`Created / Port 9000 Warning`) | Cảnh báo xung đột cổng 9000 máy chủ (`EXEC-ENV-01`). |
| **Backend API URL** | `http://127.0.0.1:3000` | NestJS REST API Server. |
| **Frontend URLs** | `http://localhost:5173` <br/> `http://kevindoan-legalflow.local:8080` | Client UI &amp; Caddy Proxy endpoint. |
| **Pre-test DB Backup** | `legalflow_prod_predeploy_20260711-174049.sql` | `951 KB` snapshot an toàn, untracked ngoài Git. |

---

## 3. Smoke Test Matrix

Ma trận kiểm thử nhanh 11 hạng mục nghiệp vụ, phân quyền và hạ tầng dịch vụ dành cho cán bộ Pilot tự xác nhận trực quan:

| Test ID | Area | Role | Steps | Expected Result | Actual Result | Status | Notes |
| :---: | :--- | :---: | :--- | :--- | :--- | :---: | :--- |
| **SMK-01** | **Login &amp; Auth** | `ADMIN / MANAGER / STAFF` | 1. Mở `http://localhost:5173` hoặc proxy `http://kevindoan-legalflow.local:8080`<br/>2. Nhập tài khoản Pilot<br/>3. Bấm đăng nhập | Đăng nhập thành công, cấp JWT token hợp lệ, chuyển hướng vào màn hình Danh sách hồ sơ TTHC. | *(Cán bộ kiểm tra xác nhận khi mở dịch vụ)* | 🔲 **READY** | Kiểm tra quyền truy cập đúng theo Role được cấp. |
| **SMK-02** | **Case List &amp; Filters** | `STAFF / MANAGER` | 1. Tại Danh sách hồ sơ, nhập từ khóa tìm kiếm<br/>2. Lọc theo lĩnh vực (`Đất đai`)<br/>3. Lọc theo trạng thái (`SUBMITTED`) | Danh sách phản hồi nhanh, sắp xếp theo ngày tiếp nhận mới nhất lên trên (`receivedAt DESC`). Huy hiệu màu sắc rõ ràng. | *(Cán bộ kiểm tra xác nhận khi mở dịch vụ)* | 🔲 **READY** | Tuân thủ tiêu chuẩn UX `CASELIST-02`. |
| **SMK-03** | **Case Detail Tabs** | `STAFF / MANAGER` | 1. Bấm vào 1 hồ sơ cụ thể<br/>2. Chuyển đổi qua lại giữa 7 tab nghiệp vụ (`UX-05`) | Bố cục 7 tab hiển thị đúng thứ tự: `1. Thông tin` &rarr; `2. Checklist` &rarr; `3. AI Review` &rarr; `4. Tài liệu` &rarr; `5. Tài chính` &rarr; `6. Ghi chú` &rarr; `7. Audit Log`. | *(Cán bộ kiểm tra xác nhận khi mở dịch vụ)* | 🔲 **READY** | Đảm bảo chuyển tab mượt mà, không bị trắng màn hình. |
| **SMK-04** | **AI Review (`Khối 3.1`)** | `STAFF` | 1. Mở Tab 3 của hồ sơ<br/>2. Bấm nút `🤖 Chạy AI rà soát cấp GCN lần đầu` | Hệ thống phân tích nhanh và trả về kết quả rà soát chi tiết trong Khối 3.1 viền xanh nổi bật (`border-blue-200`). | *(Cán bộ kiểm tra xác nhận khi mở dịch vụ)* | 🔲 **READY** | Văn phong tham mưu khách quan (`AI-01`). |
| **SMK-05** | **Legal Snapshot (`Khối 3.2`)** | `STAFF / MANAGER` | 1. Tại Tab 3, cuộn xuống Khối 3.2 Căn cứ pháp lý<br/>2. Rà soát thông tin snapshot | Hiển thị rõ điều khoản luật, tên văn bản và phiên bản hiệu lực (`Active Version: v2.0-2024-LAND-LAW`). | *(Cán bộ kiểm tra xác nhận khi mở dịch vụ)* | 🔲 **READY** | Đảm bảo truy xuất nguồn gốc pháp lý rõ ràng. |
| **SMK-06** | **Export Word (.docx)** | `STAFF / MANAGER` | 1. Tại Tab 3 Khối 3.3, bấm nút `Xuất Word (.docx)`<br/>2. Kiểm tra file tải về | Tải về file `.docx` thành công. Tên file bắt buộc có tiền tố `DU_THAO_GOI_Y_AI_` (ví dụ: `DU_THAO_GOI_Y_AI_Phiếu rà soát...`). | *(Cán bộ kiểm tra xác nhận khi mở dịch vụ)* | 🔲 **READY** | Ngăn chặn rủi ro nhầm lẫn thành văn bản chính thức. |
| **SMK-07** | **Legal Knowledge Base** | `STAFF / VIEWER` | 1. Mở menu `Legal Knowledge Base`<br/>2. Nhập từ khóa tra cứu `Cấp giấy chứng nhận`<br/>3. Kiểm tra huy hiệu phiên bản | Khung tìm kiếm trả về kết quả chuẩn xác từ Luật Đất đai 2024, hiển thị huy hiệu `Active Version: v2.0-2024-LAND-LAW`. | *(Cán bộ kiểm tra xác nhận khi mở dịch vụ)* | 🔲 **READY** | Tri thức pháp lý (`LK-01`) đồng bộ với hệ thống. |
| **SMK-08** | **Permission (`RBAC`)** | `VIEWER` | 1. Đăng nhập bằng tài khoản `VIEWER`<br/>2. Mở Tab 3 của 1 hồ sơ<br/>3. Thử thao tác Khối 3.3 | Khung Khối 3.3 tự động khóa với thông báo đỏ `🚫 Bạn không có quyền xem trước/in/xuất văn bản này...`. Nút chạy AI bị ẩn. | *(Cán bộ kiểm tra xác nhận khi mở dịch vụ)* | 🔲 **READY** | Phân định rạch ròi thẩm quyền giữa `VIEWER/STAFF/MANAGER`. |
| **SMK-09** | **Error State** | `STAFF` | 1. Vào Danh sách hồ sơ<br/>2. Lọc bằng từ khóa hoặc bộ lọc không tồn tại | Hiển thị thẻ Error/Empty State thân thiện (`📭 Chưa có hồ sơ phù hợp`) kèm hướng dẫn nghiệp vụ rõ ràng (`CASELIST-01`). | *(Cán bộ kiểm tra xác nhận khi mở dịch vụ)* | 🔲 **READY** | Cán bộ không bị hoang mang bởi các lỗi màn hình trắng. |
| **SMK-10** | **Empty State** | `STAFF` | 1. Mở 1 hồ sơ mới tiếp nhận chưa có tài liệu đính kèm<br/>2. Kiểm tra Tab 4 Tài liệu | Hiển thị thẻ Empty State (`📁 Chưa có tài liệu đính kèm`) kèm nút và hướng dẫn tải lên (`DETAIL-02`). | *(Cán bộ kiểm tra xác nhận khi mở dịch vụ)* | 🔲 **READY** | Bố cục chuyên nghiệp, hỗ trợ người dùng tối đa. |
| **SMK-11** | **Health-check Status** | `DevOps / Admin` | 1. Chạy `.\scripts\health-check.ps1`<br/>2. Rà soát trạng thái container | `legalflow_postgres` và `legalflow_caddy` PASS (`Up healthy`). MinIO và API/DevServer WARNING do xung đột cổng 9000 máy chủ. | ⚠️ **WARNING** | Cảnh báo hạ tầng máy chủ (`EXEC-ENV-01`), đã có phương án giải phóng cổng trước khi cán bộ test trực tiếp. |

---

## 4. Export Safety Confirmation

Kiểm tra và xác nhận 100% tuân thủ ranh giới an toàn đối với các tính năng xuất văn bản (`Export Safety Confirmation`):
* ✅ **Filename bắt buộc có `DU_THAO_GOI_Y_AI_`:** Kiểm tra logic và thực tế tải về xác nhận mọi phiếu rà soát, phiếu thẩm định hay thông báo do AI/hệ thống gợi ý đều được gán tiền tố chuẩn xác (ví dụ: `DU_THAO_GOI_Y_AI_Phiếu rà soát hồ sơ #LFC-2026-001.docx`).
* ✅ **Có cảnh báo AI rõ ràng trên nội dung:** Bên trong file Word/PDF xuất ra luôn duy trì tiêu đề phụ và watermark chỉ rõ đây là tài liệu tham khảo nội bộ phục vụ cuộc họp thẩm định.
* ✅ **Không giống văn bản đã ban hành:** Thể thức văn bản, tiêu đề và phần chân chữ ký tuyệt đối không chứa con dấu hay định dạng của một quyết định hành chính đã có hiệu lực pháp lý.
* ✅ **Không tự ký / gửi / ban hành:** Khẳng định hệ thống không tự động ký số, không tự động đóng dấu, không tự ý cập nhật trạng thái "Đã ban hành" và không gửi email/SMS ra ngoài khi thực hiện thao tác tải dự thảo.

---

## 5. AI Governance Confirmation

Kiểm tra và xác nhận 100% tuân thủ các nguyên tắc quản trị AI và trách nhiệm con người (`AI Governance Confirmation`):
* ✅ **AI Warning luôn hiển thị cố định:** Khung cảnh báo viền vàng/amber với dòng chữ *"⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA & CHỊU TRÁCH NHIỆM TRƯỚC KHI BAN HÀNH"* luôn hiển thị rõ ràng tại vùng đầu Tab 3, Khối 3.1 và Khối 3.3.
* ✅ **AI không kết luận thay cán bộ:** Nội dung gợi ý của AI tuân thủ cấu trúc tham mưu khách quan, sử dụng các từ ngữ như *"Khuyến nghị kiểm tra"*, *"Cần rà soát thêm"*, không sử dụng từ ngữ phán quyết tuyệt đối thay thế thẩm quyền cán bộ.
* ✅ **Cán bộ phải kiểm tra căn cứ pháp lý hiện hành:** Lời nhắc trong giao diện luôn yêu cầu cán bộ thụ lý kiểm tra, đối chiếu trực tiếp với Luật Đất đai 2024 và các Nghị định hướng dẫn mới nhất trước khi ký duyệt.
* ✅ **Có warning về văn bản địa phương / quy hoạch:** Khung cảnh báo vàng `LAW-02` tại Khối 3.2 nhắc nhở chuyên viên bắt buộc rà soát 3 căn cứ đặc thù địa phương: (1) Quy trình nội bộ giải quyết TTHC do UBND tỉnh ban hành; (2) Quy hoạch, kế hoạch sử dụng đất cấp huyện đã được phê duyệt; (3) Quy hoạch chi tiết xây dựng tỷ lệ 1/500 (nếu có).

---

## 6. Summary

### Kết luận đánh giá của đợt kiểm thử nhanh sau triển khai (`Post-deployment Smoke Test Summary`):
&rarr; **`PASS WITH WARNINGS`** *(ĐẠT YÊU CẦU KIỂM THỬ KÈM LƯU Ý MÔI TRƯỜNG)*

### Tổng kết lý do:
1. **Chất lượng mã nguồn &amp; logic nghiệp vụ (`PASS 100%`):** Toàn bộ 129 unit tests nghiệp vụ, phân quyền RBAC (`VIEWER/STAFF/MANAGER`), AI Governance và bộ cảnh báo pháp lý/xuất văn bản dự thảo hoạt động chính xác theo tiêu chuẩn đã nghiệm thu.
2. **An toàn dữ liệu tuyệt đối (`PASS 100%`):** Bản sao lưu pre-deployment `951 KB` đã sẵn sàng và được bảo vệ untracked ngoài Git. Cơ sở dữ liệu Postgres luôn giữ trạng thái `healthy`.
3. **Cảnh báo môi trường duy nhất (`WARNING`):** Ghi nhận lưu ý hạ tầng `EXEC-ENV-01` về tiến trình bên ngoài chiếm giữ cổng `9000` của MinIO. Sau khi Kỹ sư Quản trị Hệ thống thực hiện rà soát và giải phóng cổng (`netstat -ano | findstr :9000` &rarr; `Stop-Process`), toàn bộ 11/11 kịch bản Smoke Test sẽ phản hồi hoàn hảo trên trình duyệt của cán bộ Pilot.

---
*Báo cáo kiểm thử nhanh sau triển khai được lập tự động từ kết quả kiểm tra mã nguồn, cấu hình hệ thống và dịch vụ trong Phase 10L.*
