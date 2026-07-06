# LEGALFLOW V2 - PHASE 9A

# TTHC AI END-TO-END UAT SCENARIOS

**Ngày phát hành:** 06/07/2026  
**Mô-đun:** Quản trị Trí tuệ Nhân tạo & Thủ tục Hành chính Đất đai (TTHC AI Governance & Hardening Track)  
**Trạng thái:** ĐÃ HOÀN THÀNH (100% End-to-End Test Scenarios & Verification Suite)  

---

## 1. Purpose

Tài liệu này ban hành **Bộ kịch bản kiểm thử nghiệm thu người dùng toàn diện từ đầu đến cuối (End-to-End UAT Scenarios)** cho toàn bộ luồng trí tuệ nhân tạo (AI) hỗ trợ xử lý thủ tục hành chính (TTHC) trong hệ thống LegalFlow V2.

Bộ kịch bản được thiết kế theo chuẩn nghiệp vụ hành chính nhà nước, cung cấp chỉ dẫn thực thi chi tiết cho từng tình huống (Scenario), xác định rõ kết quả mong đợi (Expected Results) và thiết lập các chốt kiểm soát an toàn nhằm bảo đảm 100% tính tuân thủ nguyên tắc **Human-in-the-Loop** trước khi hệ thống chính thức đi vào vận hành thực tế.

---

## 2. Test Environment

Đội ngũ kiểm thử (UAT Team) và Quý cơ quan thực hiện nghiệm thu trên cấu hình môi trường chuẩn dưới đây:

- **Địa chỉ truy cập giao diện (Local URL)**: `http://localhost:5173`
- **Cổng Dịch vụ Backend API (Backend Port)**: `3000` (API Health check tại `http://localhost:3000/api/health`)
- **Cổng Máy chủ Giao diện (Frontend Port)**: `5173` (Vite Development / Production Build)
- **Cổng Reverse Proxy (Caddy Port)**: `8080` (Định tuyến chuẩn giữa Frontend và Backend)
- **Cụm Máy chủ Docker (Docker Containers)**:
  - `legalflow-postgres`: Máy chủ CSDL PostgreSQL 15 (Cổng 5432).
  - `legalflow-minio`: Máy chủ lưu trữ tài liệu MinIO Object Storage (Cổng 9000/9001).
  - `legalflow-caddy`: Máy chủ điều hướng Caddy Reverse Proxy.
  - `legalflow-backend`: Container dịch vụ NestJS API.
  - `legalflow-frontend`: Container dịch vụ React Vite UI.
- **Cơ sở dữ liệu (Database)**: PostgreSQL (Schema `public` với chuẩn Prisma ORM).
- **Kịch bản kiểm tra sức khỏe hệ thống (Health-check Script)**: Chạy lệnh PowerShell `.\scripts\health-check.ps1` từ thư mục gốc để xác nhận 100% dịch vụ đạt trạng thái `[OK]`.

---

## 3. Required Test Data

Trước khi thực thi 11 kịch bản kiểm thử, Người kiểm thử (Tester) cần bảo đảm cơ sở dữ liệu đã có sẵn bộ dữ liệu mẫu tiêu chuẩn (Seed Data):

1. **Hồ sơ TTHC Cấp GCN lần đầu**: Ít nhất **01 hồ sơ** đang ở trạng thái Đang xử lý (`PROCESSING`), có đầy đủ thông tin người nộp và tài liệu đính kèm (Đơn đăng ký, CCCD, Giấy tờ quyền sử dụng đất cũ).
2. **Hồ sơ TTHC Chuyển mục đích sử dụng đất**: Ít nhất **01 hồ sơ** đang ở trạng thái `PROCESSING`, đính kèm Đơn xin chuyển mục đích và trích lục bản đồ.
3. **Nhật ký cập nhật pháp lý Đã phê duyệt**: Ít nhất **01 bản ghi `LegalUpdateLog`** đạt trạng thái `APPROVED` (Đã duyệt tạo version).
4. **Phiên bản thủ tục Đang hiệu lực**: Ít nhất **01 bộ version `ACTIVE`** cho `ProcedureTypeVersion`, `AiPromptVersion` và `ChecklistVersion`.
5. **Phiên bản dự thảo**: Ít nhất **01 bộ version `DRAFT`** đang chờ rà soát.
6. **Kết quả mô phỏng (Simulation Result)**: Ít nhất **01 kết quả Shadow Testing** đã được lưu trong trường notes của nhật ký pháp lý.
7. **Tài khoản kiểm thử đầy đủ 4 quyền**:
   - Quản trị viên: `admin@test.com` (`ADMIN`)
   - Lãnh đạo cơ quan: `manager@test.com` (`MANAGER`)
   - Chuyên viên thụ lý: `staff@test.com` (`STAFF`)
   - Người xem / Thanh tra: `viewer@test.com` (`VIEWER`)

---

## 4. Scenario A: AI Review for First Certificate

**Mục tiêu**: Kiểm chứng luồng AI thẩm tra hồ sơ thủ tục Cấp Giấy chứng nhận quyền sử dụng đất lần đầu.

- **Các bước thực hiện (Steps)**:
  1. Đăng nhập hệ thống bằng tài khoản Chuyên viên (`STAFF`) hoặc Lãnh đạo (`MANAGER`).
  2. Mở mô-đun **Quản lý hồ sơ TTHC**, chọn danh sách thủ tục Cấp GCN lần đầu.
  3. Mở chi tiết 01 hồ sơ đang ở trạng thái `PROCESSING`.
  4. Bấm nút **"Chạy AI Review (Thẩm tra tự động)"**; chờ hệ thống phân tích tài liệu đính kèm.
  5. Kiểm tra phần đầu báo cáo kết quả rà soát AI vừa hiển thị.
  6. Cuộn xuống kiểm tra danh mục đánh giá **Checklist thành phần hồ sơ** (Hợp lệ / Thiếu / Cần bổ sung).
  7. Bấm chuyển sang thẻ **Căn cứ pháp lý (Legal Snapshot)** để xem thông tin phiên bản luật áp dụng.
  8. Kiểm tra lại thông tin chung của hồ sơ và mở bảng CSDL `administrative_procedure_cases`.
  9. Mở Lịch sử thao tác (Audit Trail) của hồ sơ để kiểm tra việc ghi vết.
- **Kết quả mong đợi (Expected Results)**:
  - **AI chỉ gợi ý**: Nội dung phân tích dùng từ ngữ tham mưu, không kết luận thay thẩm quyền cán bộ.
  - **Có cảnh báo bắt buộc**: Xuất hiện banner nổi bật: `⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA`.
  - **Có Legal Snapshot**: Thẻ Legal Snapshot ghi nhận chuẩn xác mã ID của Procedure, Prompt và Checklist version `ACTIVE` đang dùng.
  - **Không sửa hồ sơ**: Trạng thái hồ sơ giữ nguyên 100% là `PROCESSING`, không bị đổi thành `APPROVED` hay `REJECTED`.
  - **Audit Trail chính xác**: Ghi nhận thời gian thực sự kiện chạy AI review kèm tên cán bộ thực hiện.

---

## 5. Scenario B: AI Review for Land Use Purpose Change

**Mục tiêu**: Kiểm chứng luồng AI thẩm tra hồ sơ thủ tục Cho phép chuyển mục đích sử dụng đất.

- **Các bước thực hiện (Steps)**:
  1. Đăng nhập bằng tài khoản `STAFF` hoặc `MANAGER`.
  2. Mở danh sách hồ sơ thủ tục Chuyển mục đích sử dụng đất, chọn 01 hồ sơ đang `PROCESSING`.
  3. Bấm nút **"Chạy AI Review"**; chờ tiến trình bóc tách dữ liệu trích lục bản đồ và quy hoạch hoàn tất.
  4. Rà soát lời văn và các ý kiến nhận xét của AI về sự phù hợp quy hoạch sử dụng đất.
  5. Kiểm tra banner cảnh báo pháp lý trên đầu báo cáo.
  6. Đối chiếu kết quả Checklist thành phần hồ sơ xin chuyển mục đích.
  7. Kiểm tra thẻ Legal Snapshot bảo đảm ánh xạ đúng phiên bản luật đất đai hiện hành.
  8. Xác minh trạng thái thụ lý của hồ sơ không bị thay đổi.
- **Kết quả mong đợi (Expected Results)**:
  - Báo cáo AI phân tích sâu về điều kiện chuyển mục đích nhưng tuân thủ tuyệt đối văn phong gợi ý tham khảo.
  - Hiển thị đầy đủ banner cảnh báo đỏ/vàng `BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA`.
  - Bản chụp Legal Snapshot được khởi tạo thành công và liên kết chặt chẽ với bài rà soát AI.
  - Trạng thái hồ sơ giữ nguyên nguyên trạng `PROCESSING`, bảo đảm cam kết an toàn hồ sơ TTHC.

---

## 6. Scenario C: Draft Document & Export

**Mục tiêu**: Kiểm chứng tính năng sinh dự thảo văn bản hành chính và xuất khẩu ra định dạng Word/PDF.

- **Các bước thực hiện (Steps)**:
  1. Tại hồ sơ TTHC đã chạy AI Review ở Scenario A hoặc B, bấm nút **"Tạo dự thảo văn bản TTHC"**.
  2. Chọn loại dự thảo (Tờ trình thẩm định hồ sơ / Công văn yêu cầu bổ sung giấy tờ).
  3. Đọc kỹ nội dung văn bản dự thảo hiển thị trên giao diện, kiểm tra tiêu đề và lời văn.
  4. Kiểm tra phần chân trang hoặc đầu trang của dự thảo xem có dòng cảnh báo AI hay không.
  5. Bấm nút **"Xuất file Word (.docx)"**; tải file về và mở bằng Microsoft Word để kiểm tra layout.
  6. Bấm nút **"Xuất file PDF (.pdf)"**; tải file về và mở bằng trình đọc PDF để kiểm tra font chữ.
  7. Rà soát phần chữ ký chức danh ở cuối văn bản dự thảo.
  8. Kiểm tra log hệ thống và hộp đi/đến để xác minh không có lệnh phát hành tự động.
- **Kết quả mong đợi (Expected Results)**:
  - **Tiêu đề & Nội dung chuẩn**: Lời văn trang trọng, chuẩn thể thức hành chính nhà nước.
  - **Cảnh báo AI rõ ràng**: Có khuyến cáo *Tài liệu tham khảo do AI hỗ trợ – Cán bộ kiểm tra và chịu trách nhiệm*.
  - **Định dạng Word/PDF chuẩn**: Layout thẳng hàng, không lỗi font Unicode tiếng Việt, bảng biểu rõ ràng.
  - **Không ký thay / Không đóng dấu**: Khối chữ ký cuối văn bản để trống hoàn toàn để Cán bộ ký trực tiếp; không có chữ ký số tự động.
  - **Không tự gửi văn bản**: Thao tác chỉ tải file về máy trạm cục bộ, tuyệt đối không tự động phát hành hay gửi email/Zalo cho công dân.

---

## 7. Scenario D: Legal Update Impact Analysis

**Mục tiêu**: Kiểm chứng năng lực AI phân tích tác động khi có thay đổi văn bản pháp luật và quy trình rà soát workflow.

- **Các bước thực hiện (Steps)**:
  1. Đăng nhập bằng tài khoản Lãnh đạo (`MANAGER`) hoặc Chuyên viên (`STAFF`), vào mô-đun **Kho Kiến thức Pháp lý**.
  2. Mở Tab 6 (Nhật ký cập nhật), chọn 01 nhật ký đang ở trạng thái `PENDING` hoặc `REVIEWING`.
  3. Bấm nút **"Chạy Phân tích tác động AI (Impact Analysis)"**.
  4. Đọc báo cáo rà soát tác động, kiểm tra danh sách thủ tục, prompt và checklist bị ảnh hưởng.
  5. Kiểm tra banner cảnh báo pháp lý hiển thị trên báo cáo tác động.
  6. Thực hiện quy trình Review Workflow: Bấm `START_REVIEW` $\rightarrow$ Nhập ý kiến `ADD_NOTE` $\rightarrow$ Bấm `APPROVE_FOR_VERSIONING` (chỉ `MANAGER`/`ADMIN`).
  7. Kiểm tra CSDL và các thủ tục đang vận hành trong hệ thống.
- **Kết quả mong đợi (Expected Results)**:
  - Báo cáo Phân tích tác động liệt kê chính xác các đối tượng chịu ảnh hưởng kèm khuyến cáo tham khảo.
  - Hiển thị banner cảnh báo `BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA`.
  - Quy trình Review Workflow ghi nhận mạch lạc vào `workflowHistory`.
  - **Không tự tạo ACTIVE version**: Việc duyệt nhật ký chỉ mở khóa tạo bản nháp, **tuyệt đối không tự động sinh ra hay kích hoạt** phiên bản thủ tục mới thành `ACTIVE`.

---

## 8. Scenario E: Draft Version & Simulation

**Mục tiêu**: Kiểm chứng tính năng tạo bản dự thảo pháp lý và chạy kiểm thử song song (Shadow Testing) trên hồ sơ mẫu.

- **Các bước thực hiện (Steps)**:
  1. Đăng nhập tài khoản `MANAGER` hoặc `ADMIN`, mở chi tiết nhật ký đã `APPROVED`.
  2. Bấm nút **"Khởi tạo bản nháp mới"**, chọn tạo cả 3 loại (Procedure, Prompt, Checklist), nhập ghi chú và xác nhận.
  3. Kiểm tra danh sách version vừa tạo, xác nhận huy hiệu màu cam **`DRAFT`**.
  4. Bấm nút **"Chạy kiểm thử bản nháp (Shadow Testing)"** để mở Modal 10.
  5. Tích chọn 03 hồ sơ TTHC mẫu từ danh sách, bấm **"Thực thi mô phỏng AI rà soát"**.
  6. Kiểm tra bảng đối chiếu Diff Summary, xem chênh lệch điểm tin cậy và các cờ rủi ro đỏ (Risk Flags).
  7. Đóng modal, mở lại CSDL kiểm tra bảng `procedure_ai_analyses` và `administrative_procedure_cases` của 03 hồ sơ mẫu.
  8. Kiểm tra chi tiết trường `notes` của nhật ký pháp lý.
- **Kết quả mong đợi (Expected Results)**:
  - Bản nháp được tạo thành công với trạng thái `DRAFT`, không làm ảnh hưởng đến version `ACTIVE` hiện hành.
  - Bảng Shadow Testing hiển thị trực quan sự khác biệt giữa bản `ACTIVE` và `DRAFT`.
  - **Không sửa hồ sơ thật**: Dữ liệu thẩm tra chính thức và trạng thái của 03 hồ sơ mẫu được giữ nguyên nguyên trạng 100%.
  - **Simulation lưu notes**: Toàn bộ kết quả chạy mô phỏng được lưu trữ an toàn vào mảng `simulations` trong nhật ký.

---

## 9. Scenario F: Manual Activation & Post-activation Verification

**Mục tiêu**: Kiểm chứng quy trình kích hoạt phiên bản pháp lý thủ công 4 bước và bảng hậu kiểm chỉ đọc.

- **Các bước thực hiện (Steps)**:
  1. Đăng nhập tài khoản Lãnh đạo (`MANAGER` hoặc `ADMIN`).
  2. Mở nhật ký `APPROVED` đã có bản nháp và đã chạy Simulation ở Scenario E.
  3. Bấm nút màu xanh **"Kích hoạt version chính thức"** để mở Modal 11 (4 bước).
  4. Đi qua bước 1 và bước 2 (đối chiếu version cũ/mới). Tại bước 3, nhập ý kiến chỉ đạo ban hành.
  5. Tại bước 4, nhập thử chuỗi sai $\rightarrow$ Xác nhận nút bị khóa. Gõ chính xác chuỗi: **`ACTIVATE VERSION`**.
  6. Bấm nút **"Xác nhận kích hoạt version"**; chờ hệ thống xử lý giao dịch nguyên tử.
  7. Quan sát bảng UI viền xanh **Kiểm chứng sau kích hoạt (Read-only Audit Dashboard)** vừa hiển thị.
  8. Bấm nút **"Kiểm tra sau kích hoạt"**; kiểm tra huy hiệu trạng thái và 7 tiêu chí thẩm định.
  9. Kiểm tra CSDL và mảng `activationHistory` trong nhật ký.
- **Kết quả mong đợi (Expected Results)**:
  - Modal 4 bước hoạt động nghiêm ngặt, chặn mọi thao tác thiếu ghi chú hoặc sai confirmation text.
  - Giao dịch nguyên tử thành công: Bản nháp chuyển `ACTIVE`, bản cũ chuyển `REPLACED`.
  - Mảng `activationHistory` và `workflowHistory` ghi nhận đầy đủ thời gian, người kích hoạt và lý do.
  - **Hậu kiểm trả về `✔ PASS`**: API `GET activation-verification` trả về status 200 OK, huy hiệu xanh lá, xác nhận không có trùng lặp version và 100% hồ sơ TTHC được bảo toàn.

---

## 10. Scenario G: Rollback UI Without Real Rollback

**Mục tiêu**: Kiểm chứng giao diện và các chốt bảo vệ an toàn của Modal Hoàn tác version (không thực hiện rollback thật).

- **Các bước thực hiện (Steps)**:
  1. Đăng nhập tài khoản `MANAGER` hoặc `ADMIN`, mở chi tiết một nhật ký đã từng kích hoạt version.
  2. Cuộn xuống khu vực Khôi phục phiên bản trước, bấm nút đỏ **"Hoàn tác version"** để mở Modal 12.
  3. Đọc kỹ khuyến cáo đỏ ở phần đầu modal về ranh giới hoàn tác.
  4. Đi qua bước 1 và bước 2; tại bước 3 (Nhập lý do), gõ thử dưới 10 ký tự (ví dụ: `test`) $\rightarrow$ Bấm tiếp tục và quan sát cảnh báo.
  5. Nhập lý do hợp lệ $\ge 10$ ký tự (ví dụ: *Kiểm tra giao diện hoàn tác version pháp lý*).
  6. Tại bước 4, gõ thử chuỗi sai $\rightarrow$ Quan sát nút hoàn tác bị khóa. Gõ chuẩn: **`ROLLBACK VERSION`** $\rightarrow$ Nút đỏ mở khóa.
  7. **KHÔNG bấm xác nhận cuối cùng**; bấm nút **"Đóng modal"** hoặc nút X ở góc trên.
  8. Kiểm tra Network tab và CSDL để xác minh trạng thái hệ thống.
- **Kết quả mong đợi (Expected Results)**:
  - Modal 12 enforcing chuẩn xác quy tắc lý do $\ge 10$ ký tự và chuỗi xác nhận bắt buộc.
  - **Không gọi POST khi chỉ mở/chuyển bước**: Trong suốt quá trình thao tác trên modal, tuyệt đối không có bất kỳ request `POST /rollback-version` nào được gửi đi.
  - Khi đóng modal, CSDL giữ nguyên trạng thái `ACTIVE` hiện hành, bảo đảm an toàn tuyệt đối chống bấm nhầm.

---

## 11. Scenario H: Post-rollback Verification

**Mục tiêu**: Kiểm chứng tính năng bảng hậu kiểm chỉ đọc sau hoàn tác (Post-rollback Verification).

- **Các bước thực hiện (Steps)**:
  1. Tại chi tiết nhật ký pháp lý ở Scenario G, quan sát khối UI viền tím mờ **Kiểm chứng sau rollback (Read-only Audit Dashboard)** hiển thị tại 2 vị trí (dưới nút rollback và tại Lịch sử workflow).
  2. Bấm nút **"Kiểm tra sau rollback"** trên panel hậu kiểm.
  3. Kiểm tra Network tab xác nhận trình duyệt gọi API `GET /api/legal-knowledge/update-logs/:id/rollback-verification`.
  4. Quan sát huy hiệu trạng thái tổng quan và bảng chi tiết 7 tiêu chí trên màn hình.
  5. *(Nếu thực hiện trên nhật ký test đã rollback thật)*: Kiểm tra huy hiệu trả về.
  6. *(Nếu thực hiện trên nhật ký chưa từng rollback thật)*: Kiểm tra huy hiệu và lời giải thích.
- **Kết quả mong đợi (Expected Results)**:
  - API kiểm chứng hoạt động 100% chỉ đọc (Read-only), tuyệt đối không bắn request `POST` hay làm thay đổi CSDL.
  - **Nếu đã rollback thật**: Hệ thống trả về huy hiệu xanh lá **`✔ PASS`**, xác nhận version cũ đã phục hồi `ACTIVE`, version lỗi đã chuyển `REPLACED`, không có trùng lặp version.
  - **Nếu chưa từng rollback**: Hệ thống trả về huy hiệu vàng **`⚠ WARNING`** (hoàn toàn hợp lệ, thông báo rõ *CSDL đạt chuẩn nhưng không tìm thấy lịch sử rollback trong log notes*).

---

## 12. Scenario I: Role-based Access

**Mục tiêu**: Kiểm chứng chéo ma trận phân quyền bảo mật theo vai trò (RBAC Security Guard) trên toàn hệ thống.

- **Các bước thực hiện (Steps)**:
  1. **Test với tài khoản Quản trị viên (`ADMIN`) & Lãnh đạo (`MANAGER`)**:
     - Đăng nhập, xác nhận nhìn thấy đầy đủ nút: Chạy AI Review, Tạo dự thảo, Xuất Word/PDF, Duyệt tạo version, Kích hoạt version, Hoàn tác version.
  2. **Test với tài khoản Chuyên viên (`STAFF`)**:
     - Đăng nhập, xác nhận nhìn thấy và sử dụng tốt nút: Chạy AI Review, Tạo dự thảo, Xuất Word/PDF, Thêm ý kiến review, Khởi tạo bản nháp, Chạy Simulation, Chạy Hậu kiểm.
     - **Xác nhận bị ẩn hoàn toàn**: Nút "Duyệt tạo version" (`APPROVED`), nút "Kích hoạt version", nút "Hoàn tác version".
     - *Dùng Postman/cURL*: Gửi request `POST /activate-version` và `POST /rollback-version` với token của `STAFF` $\rightarrow$ Xác nhận Backend trả về **HTTP 403 Forbidden**.
  3. **Test với tài khoản Người xem (`VIEWER`)**:
     - Đăng nhập, xác nhận chỉ nhìn thấy các thông tin chỉ đọc (Read-only): Danh sách hồ sơ, chi tiết báo cáo AI, danh sách văn bản luật, chi tiết nhật ký, bảng hậu kiểm chỉ đọc.
     - **Xác nhận bị ẩn toàn bộ các nút thao tác**: Chạy AI Review, Tạo dự thảo, Thêm ý kiến workflow, Tạo bản nháp, Simulation, Kích hoạt, Hoàn tác.
     - *Dùng Postman/cURL*: Gửi request chạy AI review hoặc sửa nhật ký với token của `VIEWER` $\rightarrow$ Xác nhận Backend trả về **HTTP 403 Forbidden**.
- **Kết quả mong đợi (Expected Results)**:
  - Phân quyền UI phản ánh chính xác thẩm quyền nghiệp vụ; không hiển thị nút sai chức năng.
  - Phân quyền Backend Guard vững chắc 100%, từ chối mọi truy cập vượt quyền và trả về HTTP 403 Forbidden chuẩn xác.

---

## 13. Scenario J: Error Handling

**Mục tiêu**: Kiểm chứng khả năng xử lý ngoại lệ, tính bồi hoàn giao diện (Resilience) và trải nghiệm người dùng khi gặp sự cố.

- **Các bước thực hiện (Steps)**:
  1. **Kiểm tra Lỗi 401 Unauthorized**: Xóa token trong LocalStorage hoặc chờ hết hạn $\rightarrow$ Bấm thao tác bất kỳ $\rightarrow$ Xác nhận hệ thống hiển thị thông báo hết phiên làm việc và điều hướng về trang Đăng nhập một cách mượt mà.
  2. **Kiểm tra Lỗi 403 Forbidden**: Thử truy cập một đường dẫn quản trị nhạy cảm bằng tài khoản `VIEWER` $\rightarrow$ Xác nhận hiển thị thông báo lỗi quyền truy cập rõ ràng.
  3. **Kiểm tra Lỗi 404 Not Found**: Nhập một đường dẫn URL chứa ID hồ sơ không tồn tại (ví dụ: `/cases/999999`) $\rightarrow$ Xác nhận UI hiển thị trang 404 thân thiện kèm nút quay lại danh sách.
  4. **Kiểm tra Lỗi 500 Internal Server Error**: Giả lập sự cố mất kết nối CSDL hoặc lỗi máy chủ $\rightarrow$ Xác nhận giao diện hiển thị thông báo xin lỗi kỹ thuật, không bị trắng trang hay treo ứng dụng.
  5. **Kiểm tra Empty Response / 204 No Content**: Mở một hồ sơ TTHC mới tiếp nhận chưa từng chạy AI review $\rightarrow$ Xác nhận vùng hiển thị AI trả về trạng thái rỗng (Empty state) trực quan với lời nhắn hướng dẫn chạy review.
  6. **Kiểm tra Loading State**: Khi bấm chạy AI Review hoặc Simulation, xác nhận nút bấm chuyển trạng thái `loading`, hiển thị spinner xoay và khóa nhấp chuột kép (double-click prevention).
- **Kết quả mong đợi (Expected Results)**:
  - Mọi ngoại lệ HTTP đều được bắt (catch) và xử lý gracefully; tuyệt đối không để lộ stack trace nhạy cảm hay gây crash ứng dụng.
  - Các trạng thái Loading và Empty hiển thị trực quan, giúp cán bộ luôn nắm rõ tình trạng hệ thống.

---

## 14. Scenario K: Data Integrity

**Mục tiêu**: Kiểm chứng tổng thể tính toàn vẹn, tính bất biến và độ đồng bộ của cơ sở dữ liệu sau chuỗi thao tác liên hoàn.

- **Các bước thực hiện (Steps)**:
  1. Thực hiện liên hoàn các kịch bản từ A đến J trên hệ thống trong vòng 30 phút.
  2. Mở CSDL PostgreSQL, chạy câu lệnh kiểm tra trùng lặp bản hiệu lực:
     ```sql
     SELECT "procedureCode", count(*) FROM "procedure_type_versions" WHERE status = 'ACTIVE' GROUP BY "procedureCode" HAVING count(*) > 1;
     ```
  3. Rà soát bảng bản chụp pháp lý (`procedure_ai_analysis_legal_snapshots`); xác nhận không có bản ghi nào có thời gian cập nhật (`updatedAt`) bị thay đổi sau khi được tạo.
  4. Kiểm tra bảng hồ sơ TTHC (`administrative_procedure_cases`); xác nhận số lượng hồ sơ và trường trạng thái (`status`) của các hồ sơ test giữ nguyên 100%.
  5. Kiểm tra trường `notes` trong bảng `legal_update_logs`; xác nhận các cấu trúc JSON (`workflowHistory`, `draftVersions`, `simulations`, `activationHistory`, `rollbackHistory`) được lưu đầy đủ, chuẩn cú pháp, không bị rò rỉ Null hay ghi đè mất mát.
- **Kết quả mong đợi (Expected Results)**:
  - **Không duplicate ACTIVE**: Câu lệnh SQL trả về 0 dòng (tuyệt đối không có 02 version cùng ACTIVE cho một thủ tục).
  - **Snapshot & Case Preserved**: 100% dữ liệu hồ sơ TTHC và bản chụp căn cứ pháp lý được bảo toàn bất biến.
  - **Audit Trail Complete**: Toàn bộ chuỗi dấu vết kiểm toán được lưu trữ hoàn hảo, sẵn sàng xuất báo cáo thanh tra.

---

## 15. Scenario Result Template

Bảng mẫu chuẩn hóa dùng để Người kiểm thử ghi nhận kết quả thực thi 11 kịch bản End-to-End UAT:

| Scenario ID | Scenario Name (Tên kịch bản) | Role | Preconditions | Steps Executed | Expected Result | Actual Result | Status (PASS/FAIL) | Defects / Severity | Evidence (Screenshot/Log) | Tester | Date |
| :---: | :--- | :---: | :--- | :--- | :--- | :--- | :---: | :---: | :--- | :--- | :---: |
| `SCE-A` | AI Review Cấp GCN lần đầu | `STAFF` | Hồ sơ GCN đang `PROCESSING` | Đã thực hiện đủ 9 bước kiểm tra | AI chỉ gợi ý, có banner cảnh báo, có snapshot, không đổi trạng thái hồ sơ | Hoạt động chuẩn xác 100% như mong đợi | **PASS** | None | `ev_sce_a_review.png` | Nguyễn Văn A | 06/07/2026 |
| `SCE-F` | Kích hoạt version & Hậu kiểm | `MANAGER` | Log `APPROVED` đã có bản nháp | Đã thực hiện qua Modal 11 và bấm Hậu kiểm | Giao dịch nguyên tử thành công, Hậu kiểm trả về `✔ PASS` | Kích hoạt mượt mà, Hậu kiểm xanh lá | **PASS** | None | `ev_sce_f_audit.png` | Trần Thị B | 06/07/2026 |
| `SCE-I` | Kiểm chứng phân quyền RBAC | `VIEWER` | Tài khoản VIEWER đăng nhập | Đã kiểm tra ẩn nút UI và gửi cURL đến API | UI ẩn toàn bộ nút thao tác; API trả về 403 Forbidden | UI ẩn sạch, API từ chối chuẩn 403 | **PASS** | None | `ev_sce_i_rbac.png` | Lê Văn C | 06/07/2026 |
| *...* | *[Điền các Kịch bản từ B đến K]*| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

---

## 16. Defect Severity Definition

Trong quá trình thực thi kiểm thử, nếu phát hiện khiếm khuyết (Defect/Bug), Người kiểm thử tiến hành phân loại mức độ nghiêm trọng (Severity) theo 04 tiêu chuẩn chuẩn hóa sau:

1. **🔴 Critical (Nghiêm trọng tối cao - Bắt buộc sửa ngay)**:
   - *Định nghĩa*: Lỗi gây sụp đổ hệ thống (Crash), mất mát hoặc sai lệch dữ liệu CSDL, vi phạm ranh giới an toàn pháp lý (ví dụ: AI tự động chuyển trạng thái hồ sơ, AI tự động ký duyệt văn bản, tạo ra 02 version cùng ACTIVE, hoặc mất bản chụp Legal Snapshot).
   - *Hành động*: Lập tức dừng UAT, báo cáo khẩn cấp cho Quản trị dự án và Đội ngũ phát triển; không ký nghiệm thu nếu còn lỗi Critical.
2. **🟠 High (Nghiêm trọng cao - Sửa trước khi phát hành)**:
   - *Định nghĩa*: Lỗi làm suy giảm chức năng chính nhưng không phá hủy dữ liệu (ví dụ: Backend không chặn quyền 403 cho tài khoản STAFF khi gọi API kích hoạt, không hiển thị banner cảnh báo AI trên file Word/PDF xuất ra, hoặc Modal 4 bước không khóa nút khi nhập sai confirmation text).
   - *Hành động*: Đưa vào danh sách ưu tiên khắc phục cao nhất trong đợt Hardening; bắt buộc phải sửa xong trước ngày phát hành chính thức.
3. **🟡 Medium (Mức độ trung bình - Khắc phục trong sprint)**:
   - *Định nghĩa*: Lỗi ảnh hưởng đến trải nghiệm người dùng hoặc hiệu năng nhưng có giải pháp thay thế tạm thời (Workaround) (ví dụ: Lỗi hiển thị lệch lề bảng biểu trong file PDF xuất ra, API 204 không hiển thị Empty state mà để trống vùng nhìn, hoặc thiếu Tooltip giải thích).
   - *Hành động*: Ghi nhận vào Hardening Backlog, lên lịch sửa chữa trong sprint kế tiếp hoặc đợt tối ưu hóa UX.
4. **🟢 Low (Mức độ thấp - Cải tiến nhỏ / Gợi ý UX)**:
   - *Định nghĩa*: Lỗi nhỏ về ngữ pháp, lỗi chính tả trong thông báo lỗi, màu sắc huy hiệu chưa đồng nhất hoặc các đề xuất cải tiến nhỏ về giao diện.
   - *Hành động*: Tập hợp vào danh sách rà soát định kỳ, xử lý khi có thời gian rảnh hoặc gộp vào các bản cập nhật bảo trì nhỏ.

---

## 17. UAT Sign-off Template

Mẫu Biên bản Ký xác nhận Nghiệm thu Người dùng chính thức (UAT Sign-off Record) cho luồng AI xử lý TTHC:

### BIÊN BẢN XÁC NHẬN NGHIỆM THU NGHIỆP VỤ (END-TO-END UAT SIGN-OFF)

- **Tên mô-đun nghiệm thu**: Luồng Trí tuệ Nhân tạo hỗ trợ xử lý TTHC Đất đai & Quản trị Phiên bản Pháp lý (Phase 9A).
- **Đơn vị sử dụng / Nghiệm thu**: .....................................................................................................................
- **Trưởng nhóm Kiểm thử (Lead Tester)**: ....................................... **Vai trò**: .......................................
- **Thời gian thực hiện kiểm thử**: Từ ngày ....../....../2026 đến ngày ....../....../2026.
- **Môi trường kiểm thử**: Docker UAT Stack (`http://localhost:5173` & `http://localhost:3000`).

#### I. TỔNG HỢP KẾT QUẢ KIỂM THỬ END-TO-END
- Tổng số kịch bản kiểm thử thực tế: **11 kịch bản** (Từ Scenario A đến Scenario K).
- Số lượng kịch bản ĐẠT (**PASS**): .......... kịch bản (Đạt tỷ lệ: ..........%).
- Số lượng kịch bản KHÔNG ĐẠT (**FAIL**): .......... kịch bản.
- Tổng số lỗi (Defects) ghi nhận: .......... lỗi (Trong đó: Critical: .... | High: .... | Medium: .... | Low: ....).

#### II. DANH SÁCH LỖI TỒN ĐỌNG (OPEN DEFECTS - NẾU CÓ)
| Defect ID | Tên Lỗi / Mô tả ngắn | Mức độ (Severity) | Phương án xử lý / Workaround | Trạng thái |
| :---: | :--- | :---: | :--- | :---: |
| *Không có* | *Hệ thống hoạt động ổn định, không phát hiện lỗi tồn đọng* | *N/A* | *N/A* | *Closed* |

#### III. CAM KẾT VÀ KẾT LUẬN NGHIỆM THU
1. Chúng tôi xác nhận đã thực thi nghiêm túc, toàn diện 11 kịch bản kiểm thử End-to-End trên môi trường thực tế.
2. Xác nhận **100% các ranh giới an toàn pháp lý (Human-in-the-Loop) được giữ vững**: AI chỉ đóng vai trò hỗ trợ tham mưu, có đầy đủ cảnh báo pháp lý, không tự động duyệt hồ sơ, không tự ký/gửi văn bản, và bảo toàn nguyên vẹn dữ liệu lịch sử/snapshot.
3. **KẾT LUẬN (Sign-off Status)**: 
   - [ ] **CHẤP NHẬN NGHIỆM THU KHÔNG ĐIỀU KIỆN (Approved without conditions)**: Hệ thống đạt chuẩn 100%, sẵn sàng chuyển sang giai đoạn gia cố kỹ thuật cuối cùng và phát hành chính thức.
   - [ ] **CHẤP NHẬN NGHIỆM THU CÓ ĐIỀU KIỆN (Conditional Approval)**: Chấp nhận với điều kiện đội ngũ kỹ thuật hoàn tất khắc phục các lỗi High/Medium ghi nhận tại Mục II trước ngày ....../....../2026.
   - [ ] **TỪ CHỐI NGHIỆM THU (Rejected)**: Hệ thống còn lỗi Critical, yêu cầu khắc phục và tổ chức UAT lại.

| Đại diện Đội ngũ Kiểm thử (Tester) | Đại diện Cán bộ Nghiệp vụ TTHC | Lãnh đạo Cơ quan Phê duyệt (Manager/Admin) |
| :---: | :---: | :---: |
| *(Ký, ghi rõ họ tên)* | *(Ký, ghi rõ họ tên)* | *(Ký, đóng dấu, ghi rõ họ tên)* |
| <br><br><br> | <br><br><br> | <br><br><br> |

---
*Tài liệu Kịch bản Kiểm thử End-to-End được ban hành trong khuôn khổ hoàn thành Phase 9A của hệ thống LegalFlow V2.*
