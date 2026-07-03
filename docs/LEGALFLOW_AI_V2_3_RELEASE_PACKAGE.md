# LegalFlow AI v2.3 – Internal Release Package

**Ngày đóng gói:** 03/07/2026  
**Tài liệu hướng dẫn phát hành nội bộ & chuẩn bị UAT nâng cao**

---

## 1. Thông Tin Bản Phát Hành

- **Tên bản phát hành:** LegalFlow AI v2.3
- **Mốc Tag hiện tại:** `v2.3.8-ai-system-summary`
- **Mục tiêu:** Cung cấp gói giải pháp hoàn chỉnh phục vụ trình diễn (Demo) và kiểm thử người dùng UAT nâng cao cho công tác thụ lý, giải quyết đơn thư khiếu nại, tố cáo, kiến nghị, phản ánh về đất đai tại cấp xã/phường/huyện.
- **Trạng thái:** Hoàn thiện 100% chức năng cốt lõi, sẵn sàng triển khai demo nội bộ và kiểm thử UAT nâng cao.

---

## 2. Tóm Tắt Chức Năng Chính

1. **AI Trích xuất & Tóm tắt đơn thư:** Đọc tài liệu hồ sơ, cô đọng nội dung trọng tâm trong vài giây.
2. **AI Phân loại đơn thư:** Xác định chính xác loại đơn (Khiếu nại / Tố cáo / Kiến nghị / Phản ánh) và lĩnh vực chuyên sâu (Tranh chấp đất đai / Cấp GCN / Bồi thường GPMB).
3. **AI Gợi ý Checklist nghiệp vụ:** Đề xuất danh sách công việc theo quy trình chuẩn, chỉ ra hồ sơ pháp lý cần đối chiếu, thời hạn giải quyết và rủi ro pháp lý.
4. **AI Soạn dự thảo văn bản (AI Drafting):** Tạo nhanh 6 loại mẫu văn bản hành chính & nghiệp vụ thông dụng.
5. **Quản lý bản nháp an toàn tại `CaseNote`:** Lưu trữ các bản nháp AI trực tiếp vào ghi chú nội bộ của hồ sơ với tiền tố nhận diện rõ ràng.
6. **Xuất Word `.docx` chuẩn thể thức:** Kết xuất văn bản có thể chỉnh sửa theo đúng bố cục Nghị định 30/2020/NĐ-CP, tích hợp thông tin cơ quan.
7. **Xem trước & In PDF qua trình duyệt:** Khung mô phỏng tờ giấy A4 trang trọng, cho phép in hoặc lưu tệp PDF không cần phần mềm bên thứ ba.
8. **Kiểm toán toàn diện (Audit Logging):** Ghi vết 100% thao tác gọi AI, đánh giá chấp nhận/từ chối và kết xuất tài liệu vào `AiAuditLog`.

---

## 3. Luồng Nghiệp Vụ End-to-End

Toàn bộ quá trình giải quyết đơn thư với Trợ lý AI tuân theo luồng khép kín:
1. **Mở hồ sơ:** Cán bộ truy cập hồ sơ vụ việc cần thụ lý.
2. **AI phân tích:** Bấm kích hoạt Trợ lý AI đọc và đánh giá hồ sơ.
3. **Cán bộ chấp nhận / từ chối:** Thẩm định kết quả tóm tắt và phân loại; bấm "Chấp nhận" để điền vào thông tin chính thức.
4. **Tạo checklist:** Yêu cầu AI gợi ý quy trình xử lý, bấm "Áp dụng vào hồ sơ" để lập danh sách việc cần làm.
5. **Tạo bản nháp:** Chọn mẫu văn bản tương ứng (ví dụ: Giấy mời làm việc, Thông báo thụ lý), AI tự động tạo dự thảo chi tiết.
6. **Lưu ghi chú:** Cán bộ chỉnh sửa nội dung nháp và nhấn "Lưu vào ghi chú hồ sơ" (`CaseNote`).
7. **Tải Word:** Bấm nút **"📄 Tải Word (.docx)"** để tải tệp văn bản đã được bóc tách và chèn thông tin cơ quan ban hành.
8. **Xem / In PDF:** Bấm nút **"🖨️ Xem & In PDF"** để mở modal trang A4, rà soát thể thức và lưu thành tệp `.pdf`.
9. **Kiểm tra Audit Log:** Người quản trị kiểm tra lịch sử thao tác của cán bộ trên hệ thống nhật ký kiểm toán.

---

## 4. Nguyên Tắc Human-in-the-Loop

Hệ thống được thiết kế dựa trên triết lý **Con người là trung tâm kiểm soát (Human-in-the-Loop)**, tuân thủ nghiêm ngặt 7 giới hạn bảo mật:
- **AI không thay thế cán bộ:** AI chỉ đóng vai trò trợ lý hỗ trợ soạn thảo và tổng hợp thông tin.
- **AI không tự ra quyết định:** Mọi kết luận thẩm quyền hay quyết định pháp lý đều do con người thực hiện.
- **AI không tự đổi trạng thái hồ sơ:** Trạng thái (`status`) và người thụ lý (`assignedToId`) tuyệt đối giữ nguyên.
- **AI không tự gửi văn bản:** Không có luồng gửi công văn hay email tự động cho công dân hoặc cơ quan khác.
- **AI không tự phát hành:** Không kết nối ký số hay ban hành văn bản chính thức.
- **Cán bộ chịu trách nhiệm cuối cùng:** Cán bộ bắt buộc phải kiểm tra, thẩm định câu chữ trước khi trình ký.
- **Cảnh báo bất biến:** Mọi bản nháp hiển thị, tải Word hay in PDF đều mang nhãn **“⚠️ BẢN NHÁP AI – CHƯA PHÁT HÀNH”**.

---

## 5. Danh Sách Tài Liệu Quan Trọng Trong Thư Mục `docs`

- `LEGALFLOW_AI_V2_3_SYSTEM_SUMMARY.md`: Tài liệu tổng kết toàn bộ kiến trúc và tính năng hệ thống LegalFlow AI v2.3.
- `LEGALFLOW_V2_AI_TECHNICAL_PLAN.md`: Bản thiết kế tổng thể kiến trúc phân hệ AI v2.
- `LEGALFLOW_V2_AI_PHASE2_PLAN.md` / `COMPLETION.md`: Kế hoạch và báo cáo hoàn thành UI AI Assistant.
- `LEGALFLOW_V2_AI_PHASE3_PLAN.md` / `COMPLETION.md`: Kế hoạch và báo cáo hoàn thành AI Checklist.
- `LEGALFLOW_V2_AI_PHASE4_PLAN.md` / `4B` / `4C`: Kế hoạch và báo cáo hoàn thành phân hệ AI Drafting (6 mẫu văn bản & Polish UI).
- `LEGALFLOW_V2_AI_PHASE5A_PLAN.md` / `5B` / `5C` / `5D`: Kế hoạch và báo cáo hoàn thành xuất Word `.docx`, chuẩn hóa Template, Cấu hình cơ quan và Browser PDF Preview.
- `LEGALFLOW_AI_UAT_DEMO_SCRIPT.md`: Kịch bản trình diễn chi tiết từng bước phục vụ buổi Demo.
- `LEGALFLOW_DEMO_SAMPLE_CASE_GUIDE.md`: Hướng dẫn khởi tạo và sử dụng các hồ sơ mẫu tiêu biểu.
- `LEGALFLOW_AI_UAT_FEEDBACK_FORM.md`: Biểu mẫu khảo sát, thu thập ý kiến đánh giá từ cán bộ nghiệp vụ.
- `LEGALFLOW_AI_UAT_RESULT_SUMMARY.md`: Báo cáo tổng hợp kết quả kiểm thử UAT.
- `LEGALFLOW_AI_V2_3_RELEASE_PACKAGE.md`: Tài liệu hướng dẫn đóng gói bản phát hành nội bộ này.

---

## 6. Danh Sách Mốc Tag Quan Trọng

- `v2.1.0-ai-phase3-checklist`: Hoàn tất phân hệ AI Trích xuất, Phân loại & Gợi ý Checklist nghiệp vụ.
- `v2.2.0-ai-phase4a-drafting`: Khởi tạo luồng soạn thảo văn bản nháp AI (Phiếu xử lý đơn, Giấy mời).
- `v2.2.2-ai-phase4b-complete`: Hoàn tất mở rộng 6 bộ mẫu dự thảo hành chính nội bộ.
- `v2.2.4-ai-demo-package`: Đóng gói gói trình diễn Demo UAT đợt 1.
- `v2.2.8-ai-phase4c-complete`: Hoàn thiện tinh chỉnh giao diện AI Assistant Widget & Quick Chips.
- `v2.3.1-ai-phase5a-complete`: Hoàn tất chức năng xuất bản nháp AI ra tệp Word `.docx`.
- `v2.3.3-ai-phase5b-complete`: Hoàn tất phân nhóm 3 bố cục thể thức Word chuẩn Nghị định 30.
- `v2.3.5-ai-phase5c-complete`: Hoàn tất cấu hình thông tin cơ quan qua biến môi trường `.env`.
- `v2.3.7-ai-phase5d-complete`: Hoàn tất tính năng xem trước A4 & in PDF qua trình duyệt.
- `v2.3.8-ai-system-summary`: Đóng gói tài liệu tổng kết hệ thống v2.3 toàn diện.

---

## 7. Thành Phần Kỹ Thuật

- **Frontend:** React 18, TypeScript, TailwindCSS, Vite (hiệu năng cao, giao diện hiện đại).
- **Backend:** NestJS, TypeScript, RESTful APIs, StreamableFile Handling.
- **Cơ sở dữ liệu:** PostgreSQL 15+ (lưu trữ hồ sơ, ghi chú, kiểm toán).
- **ORM:** Prisma ORM (quản lý schema loại bỏ lỗi runtime).
- **Containerization:** Docker & Docker Compose (đóng gói trọn gói Full-stack).
- **Object Storage:** MinIO (lưu trữ minh chứng, tài liệu đính kèm hồ sơ gốc).
- **AI Engine:** Mock Gemini Engine (tích hợp sẵn phục vụ dev/test) / Google Gemini Pro API (sẵn sàng kết nối qua `.env`).
- **Thư viện xử lý tài liệu:** `docx` (sinh file Word chuẩn OpenXML tại backend).

---

## 8. Cấu Hình Vận Hành Local

Hệ thống được trang bị bộ script PowerShell tự động hóa tại thư mục `scripts/`:
- **Khởi động toàn bộ hệ thống:**
  ```powershell
  .\scripts\start-legalflow.ps1
  ```
- **Dừng hệ thống an toàn:**
  ```powershell
  .\scripts\stop-legalflow.ps1
  ```
- **Kiểm tra sức khỏe hệ thống (Health Check):**
  ```powershell
  .\scripts\health-check.ps1
  ```
- **URL Frontend:** `http://localhost:8080`
- **URL Backend API:** `http://localhost:3000`
- **Lưu ý bảo mật:** **Tuyệt đối không commit tệp `.env` chứa API Key thật** (Gemini Key, JWT Secret, Database Password) lên kho lưu trữ Git chung.

---

## 9. Backup & Restore

Để bảo đảm an toàn dữ liệu trước các đợt kiểm thử hoặc phát hành:
1. **Sao lưu Source Code:** Đóng gói toàn bộ mã nguồn thành tệp ZIP (loại trừ thư mục `node_modules` và `.git`).
2. **Sao lưu Cơ sở dữ liệu:** Kết xuất CSDL PostgreSQL ra tệp `.sql` bằng công cụ `pg_dump` hoặc script tự động của dự án.
3. **Nguyên tắc lưu trữ:** Luôn lưu trữ tệp backup trên ổ cứng gắn ngoài hoặc hệ thống đám mây bảo mật của cơ quan.
4. **Bảo mật thông tin:** Dữ liệu hồ sơ đơn thư chứa nhiều PII (thông tin cá nhân công dân), tuân thủ nghiêm quy định bảo mật khi sao chép bản backup.

---

## 10. Checklist Trước Khi Demo

Trước khi tiến hành buổi trình diễn, cán bộ phụ trách kỹ thuật cần kiểm tra nhanh 9 mục:
- [ ] **Docker Containers:** Các container Postgres, Backend, Frontend đang chạy ổn định (màu xanh trên Docker Desktop).
- [ ] **Khả năng kết nối:** Backend trả về 200 OK tại điểm `http://localhost:3000`, Frontend tải mượt mà.
- [ ] **Tài khoản người dùng:** Đăng nhập thành công bằng tài khoản Cán bộ thụ lý / Quản trị viên.
- [ ] **Dữ liệu mẫu:** Có sẵn ít nhất 2-3 hồ sơ mẫu (Tranh chấp đất liền kề, Khiếu nại bồi thường).
- [ ] **Khối AI Assistant:** Bấm tóm tắt/phân loại hoạt động nhanh chóng, hiển thị phản hồi mượt mà.
- [ ] **Bản nháp AI:** Hồ sơ đã có sẵn hoặc có thể tạo ngay bản nháp lưu trong tab Ghi chú (`CaseNote`).
- [ ] **Xuất Word (.docx):** Bấm nút "Tải Word" stream file về trình duyệt thành công, mở bằng MS Word hiển thị không lỗi.
- [ ] **Xem trước / In PDF:** Bấm nút "Xem & In PDF" mở modal A4 đúng bố cục, lệnh in trình duyệt hoạt động.
- [ ] **Hiển thị Tiếng Việt:** Toàn bộ giao diện, văn bản Word và PDF hiển thị phông tiếng Việt sắc nét, không vỡ dấu.

---

## 11. Checklist UAT Nâng Cao

Dành cho cán bộ nghiệp vụ trực tiếp trải nghiệm kiểm thử chuyên sâu:
- [ ] **Test đủ 6 loại bản nháp:** Soạn thảo và kiểm tra chất lượng từ ngữ cho Phiếu xử lý đơn, Giấy mời, Thông báo thụ lý, Thông báo không thụ lý, Văn bản chuyển đơn, Trả lời công dân.
- [ ] **Test bố cục Word:** Tải 3 nhóm template (`INTERNAL_NOTE`, `NAMED_DOC`, `OFFICIAL_LETTER`), kiểm tra Quốc hiệu, Tiêu ngữ, Nơi nhận.
- [ ] **Test bố cục PDF:** Mở modal in PDF cho cả văn bản nội bộ và văn bản có tên loại, xác nhận lề A4 chuẩn và ẩn giao diện web khi in.
- [ ] **Test kiểm toán Audit Log:** Kiểm tra bảng `AiAuditLog` ghi nhận chính xác từng lần gọi `EXPORT_DOCX` và `EXPORT_PDF_PREVIEW`.
- [ ] **Test tính bất biến của hồ sơ:** Xác nhận `status` và `assignedToId` của hồ sơ hoàn toàn không bị thay đổi trong suốt quá trình test AI.
- [ ] **Test cấu hình cơ quan:** Thay đổi thử biến trong `.env` (ví dụ `AGENCY_NAME`), khởi động lại backend và xác nhận tên cơ quan mới xuất hiện trên Word/PDF.
- [ ] **Test Fallback Placeholder:** Xóa trắng cấu hình trong `.env`, xác nhận văn bản tự động hiển thị placeholder `[Cán bộ bổ sung...]` màu cam rõ nét.

---

## 12. Rủi Ro Còn Lại

- **Chất lượng nội dung AI:** Bản nháp do AI soạn vẫn có thể chứa sai sót nhỏ nếu đơn thư có cấu trúc phức tạp hoặc thiếu thông tin gốc; cán bộ thụ lý bắt buộc phải đọc rà soát.
- **Chuẩn thể thức đặc thù:** Quy chuẩn văn bản hành chính của từng địa phương có thể có sai khác nhỏ về khoảng cách dòng/chữ, cần bộ phận văn thư thẩm định.
- **Trình duyệt khi in PDF:** Khi in qua trình duyệt, cán bộ cần lưu ý bật tùy chọn "Background graphics" (Hình nền) và chọn đúng khổ giấy A4 trong hộp thoại Print.
- **Chưa ký số & Phát hành:** Hệ thống chưa kết nối chữ ký số CA và chưa tích hợp cổng liên thông văn bản quốc gia.
- **Chưa lưu phiên bản file Word/PDF:** File tải về lưu trên máy cá nhân của cán bộ, chưa được quản lý phiên bản tập gian trên máy chủ.
- **Chưa có GUI cấu hình cơ quan:** Việc điều chỉnh thông tin UBND cơ quan ban hành vẫn cần thao tác kỹ thuật trên tệp `.env`.
- **Quản lý tài nguyên Gemini thật:** Khi chuyển sang API Gemini thực tế, cần theo dõi sát dung lượng Quota và chi phí vận hành.

---

## 13. Đề Xuất Hướng Phát Triển Tiếp Theo

1. **Thực hiện đợt UAT nâng cao:** Đưa gói phát hành v2.3 cho cán bộ thụ lý chuyên trách tại các UBND xã/phường dùng thử thực tế trên số liệu giả định.
2. **Xây dựng Dashboard Kiểm toán AI:** Màn hình thống kê trực quan lượng hồ sơ sử dụng AI, thời gian tiết kiệm trung bình và tỷ lệ chấp nhận phản hồi AI.
3. **Trang Quản trị Cấu hình Cơ quan (UI Dashboard):** Cho phép Quản trị viên thiết lập Quốc hiệu, Tên cơ quan, Chức danh người ký trực tiếp trên giao diện web.
4. **Quản lý Phiên bản Tệp văn bản (File Versioning):** Tự động đính kèm và đánh chỉ mục các bản nháp Word/PDF đã xuất vào kho tài liệu (`Document`) của hồ sơ.
5. **Tích hợp kho lưu trữ MinIO cho bản nháp:** Đồng bộ tệp nháp trực tiếp lên hệ thống lưu trữ đám mây nội bộ.
6. **Kết nối Google Gemini Pro thực tế:** Chuyển đổi cờ cấu hình sang môi trường Production, áp dụng các model AI tiên tiến nhất.
7. **Phân quyền nâng cao (Advanced RBAC):** Quy định chi tiết thẩm quyền sử dụng tính năng AI theo chức vụ (Nhân viên / Trưởng phòng / Lãnh đạo).
8. **Báo cáo thống kê hiệu quả AI:** Xuất báo cáo định kỳ đánh giá năng suất giải quyết khiếu nại tố cáo nhờ hỗ trợ của Trợ lý AI.

---

## 14. Kết Luận

Gói phát hành nội bộ **LegalFlow AI v2.3** đánh dấu một mốc hoàn thiện mang tính bước ngoặt, khép kín trọn vẹn quy trình giải quyết đơn thư từ khâu tiếp nhận thông tin, phân tích thông minh, đề xuất quy trình đến kết xuất văn bản nháp hành chính song hành trên định dạng Word `.docx` và PDF A4.

Hệ thống đã hoàn toàn sẵn sàng cho các buổi trình diễn chính thức và các đợt kiểm thử chuyên sâu với người dùng thực tế. Bộ nguyên tắc vàng **Human-in-the-Loop – Con người làm chủ, AI hỗ trợ tối đa** tiếp tục khẳng định vai trò là nền tảng vững chắc bảo đảm sự chính xác, minh bạch và an toàn pháp lý cho toàn bộ hệ thống LegalFlow.
