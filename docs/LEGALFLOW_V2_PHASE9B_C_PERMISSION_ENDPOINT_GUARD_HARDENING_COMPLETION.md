# LEGALFLOW V2 - PHASE 9B-C COMPLETION REPORT
**Phase 9B-C: Permission & Endpoint Guard Hardening (Gia cố phân quyền thực tế cho backend endpoints & đồng bộ UI)**

---

## 1. Executive Summary

Trong Phase 9B-C, hệ thống LegalFlow đã được gia cố toàn diện về phân quyền thực tế trên các API endpoints của Backend (NestJS) và đồng bộ hóa điều kiện hiển thị giao diện trên Frontend (React/Vite) theo ma trận phân quyền chuẩn.

Tuân thủ tuyệt đối các nguyên tắc ràng buộc:
- **Không sửa schema/migration/.env/database**: Toàn bộ hệ thống cơ sở dữ liệu và biến môi trường được giữ nguyên 100%.
- **Không sửa trạng thái hồ sơ TTHC**: Các luồng nghiệp vụ hiện có không bị thay đổi trạng thái sai lệch.
- **Backend-First Hardening**: Nhận định việc ẩn nút bấm trên Frontend chỉ là hỗ trợ trải nghiệm người dùng (UX); Backend đóng vai trò là chốt chặn an ninh tối hậu (Security Guard), từ chối mọi yêu cầu trái phép với HTTP Status `403 Forbidden`.
- **Chuẩn hóa thông báo lỗi**: Mọi HTTP Status 401/403 được chuyển hóa đồng nhất trên toàn hệ thống thành thông báo tiếng Việt rõ ràng: `"Bạn không có quyền thực hiện thao tác này."`.

---

## 2. Ma Trận Phân Quyền Được Áp Dụng (Permission Matrix)

| Nhóm chức năng | Endpoint / Hành động | ADMIN / MANAGER | STAFF | VIEWER |
| :--- | :--- | :---: | :---: | :---: |
| **Quản lý Hồ sơ TTHC** | Xem danh sách & chi tiết hồ sơ (`GET /api/procedure-cases/*`) | ✅ | ✅ | ✅ |
| | Tiếp nhận / Tạo hồ sơ mới (`POST /api/procedure-cases`) | ✅ | ✅ | ❌ |
| | Cập nhật hồ sơ, ghi chú, checklist (`PUT/POST`) | ✅ | ✅ | ❌ |
| **AI Rà soát & Thẩm định** | Chạy AI rà soát cấp GCN / Chuyển mục đích (`POST .../ai/*`) | ✅ | ✅ | ❌ |
| | Chấp nhận / Từ chối kết quả AI (`POST .../accept`, `reject`) | ✅ | ✅ | ❌ |
| | Xem trước PDF phiếu rà soát (`GET .../preview-data`) | ✅ | ✅ | ✅ |
| | Xuất file Word phiếu rà soát (`GET .../export-*-docx`) | ✅ | ✅ | ❌ |
| **Kho Căn Cứ Pháp Lý** | Xem danh sách, chi tiết, kiểm chứng (`GET .../activation-verification`) | ✅ | ✅ | ✅ |
| | Ghi chú thẩm định, Yêu cầu bổ sung thông tin | ✅ | ✅ | ❌ |
| | Kích hoạt, Hoàn tác, Chạy thử simulation, Duyệt version | ✅ | ❌ | ❌ |

---

## 3. Chi Tiết Triển Khai Backend

### 3.1. Gia cố `ProcedureCasesController`
Đã rà soát và áp dụng decorator `@Roles()` cho toàn bộ 17 endpoints thuộc module thủ tục hành chính (`src/administrative-procedures/procedure-cases.controller.ts`):
- **Read-only Endpoints (`GET`)**: Cho phép `[Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER]` truy cập để xem hồ sơ và dữ liệu xem trước (preview).
- **Mutation & AI Endpoints (`POST`, `PUT`)**: Giới hạn nghiêm ngặt cho `[Role.ADMIN, Role.MANAGER, Role.STAFF]`. Ngăn chặn hoàn toàn vai trò `VIEWER` thực hiện:
  - Tạo mới hồ sơ (`createCase`)
  - Cập nhật thông tin hồ sơ (`updateCase`)
  - Thêm/sửa checklist (`addChecklist`, `updateChecklist`)
  - Thêm ghi chú trao đổi nội bộ (`addNote`)
  - Kích hoạt trợ lý AI rà soát (`runLandFirstCertificateReview`, `runLandUsePurposeChangeReview`)
  - Phê duyệt / Từ chối kết quả AI (`acceptAiAnalysis`, `rejectAiAnalysis`)
  - Tải xuống văn bản Word (`exportReviewDocx`, `exportPurposeChangeReviewDocx`)

### 3.2. Gia cố `CasesController`
Đã chặn quyền truy cập của vai trò `VIEWER` đối với các endpoints tải file Word xuất hồ sơ vụ việc (`src/cases/cases.controller.ts`):
- Giới hạn các endpoint `exportDocx` và `exportDoc` chỉ cho phép `[Role.ADMIN, Role.MANAGER, Role.STAFF]`.

### 3.3. Kiểm chứng `LegalKnowledgeController`
Đã rà soát toàn bộ 27 endpoints quản trị phiên bản pháp lý (`src/legal-knowledge/legal-knowledge.controller.ts`), xác nhận việc áp dụng `@Roles()` đã hoàn toàn khớp với nghiệp vụ:
- Các thao tác quản trị cấp cao (Duyệt version, Kích hoạt, Hoàn tác, Simulation, Nháp) được bảo vệ bằng `[Role.ADMIN, Role.MANAGER]`.
- Thao tác nghiệp vụ thẩm định (Bắt đầu review, Thêm ý kiến) được bảo vệ bằng `[Role.ADMIN, Role.MANAGER, Role.STAFF]`.
- Thao tác tra cứu và kiểm chứng an toàn (Activation/Rollback verification) mở cho tất cả các vai trò bao gồm `VIEWER`.

---

## 4. Chi Tiết Triển Khai Frontend & Chuẩn Hóa UX

### 4.1. Chuẩn hóa bộ xử lý lỗi toàn cục (`src/lib/apiClient.ts`)
Cập nhật cả hai phương thức `request` (gọi REST API thông thường) và `downloadBlob` (tải file nhị phân/Word/PDF):
- Tự động bắt mã lỗi HTTP `401 Unauthorized` và `403 Forbidden`.
- Ném ra ngoại lệ chuẩn `ApiError` với thông điệp: `"Bạn không có quyền thực hiện thao tác này."`.
- Đảm bảo tất cả các trang và modal khi catch error đều hiển thị đúng thông báo chuẩn cho người dùng.

### 4.2. Đồng bộ giao diện trang Danh sách Hồ sơ TTHC (`src/pages/ProcedureCaseList.tsx`)
- Tích hợp kiểm tra quyền `canCreate` từ `useAuth()`.
- Nút **"+ Tiếp nhận hồ sơ"** tự động ẩn khi người dùng đăng nhập với vai trò `VIEWER`.

### 4.3. Đồng bộ giao diện trang Chi tiết Hồ sơ Vụ việc (`src/pages/CaseDetail.tsx`)
- Sử dụng cờ `canEdit` (khác `VIEWER`).
- Khi ở chế độ `VIEWER`, tự động ẩn:
  - Nút **"🤖 Phân tích AI"** và thanh công cụ AI Review
  - Nút **"⚡ Gợi ý Checklist từ AI"**
  - Nút **"📝 Soạn thảo Văn bản AI"**
  - Các nút tải xuống / xuất file Word

### 4.4. Đồng bộ giao diện trang Chi tiết Hồ sơ TTHC (`src/pages/ProcedureCaseDetail.tsx`)
- Bổ sung kiểm tra vai trò người dùng (`const canAct = role !== 'VIEWER'`).
- **Tab 3 (AI rà soát)**: Ẩn nút **"🤖 AI rà soát cấp GCN lần đầu / chuyển mục đích"** và cụm nút thao tác (Tải phiếu Word, Chấp nhận & Ghi chú, Chấp nhận & Checklist, Từ chối) khi là `VIEWER`. Chỉ giữ lại nút xem trước PDF/in phiếu rà soát cho mục đích tra cứu.
- **Tab 4 (Checklist)**: Ẩn form **"+ Thêm mục"** và vô hiệu hóa tính năng click chuyển đổi trạng thái hoàn thành (`isCompleted`) của checklist item đối với `VIEWER`.
- **Tab 6 (Ghi chú)**: Ẩn form nhập và gửi ý kiến thẩm định / trao đổi nội bộ đối với `VIEWER`.

---

## 5. Kết Quả Kiểm Thử & Xác Nhận (Verification Results)

1. **Kiểm thử tự động Backend (Unit Tests)**:
   - Đã tạo mới và kiểm chứng test suite `src/administrative-procedures/procedure-cases.controller.spec.ts`.
   - Sử dụng Reflection API (`Reflect.getMetadata(ROLES_KEY, ...)`) kiểm tra metadata phân quyền của từng endpoint, đảm bảo chính xác tuyệt đối.
   - Chạy bộ kiểm thử tổng thể `npm test` tại `legalflow-backend`:
     - **Kết quả**: **11/11 Test Suites PASSED**, **129/129 Tests PASSED** (Thời gian chạy: 4.5s).
2. **Kiểm tra đóng gói Backend (NestJS Build)**:
   - Chạy lệnh `npm run build` tại `legalflow-backend`.
   - **Kết quả**: Thành công không có lỗi cú pháp hay kiểu dữ liệu (TypeScript build zero errors).
3. **Kiểm tra đóng gói Frontend (Vite/React Build)**:
   - Chạy lệnh `npm run build` tại `legalflow-docker-uat`.
   - **Kết quả**: Thành công tạo gói production bundle (3177 modules transformed, zero compilation errors).
4. **Kiểm tra tính nguyên vẹn của hệ thống (Integrity Check)**:
   - Kiểm tra `git status`: Xác nhận không có sự thay đổi nào đối với `schema.prisma`, thư mục `prisma/migrations/`, hay các file cấu hình `.env*`.

---

## 6. Kết Luận & Bước Tiếp Theo

Phase 9B-C đã hoàn thành đúng mục tiêu gia cố an ninh phân quyền hai lớp (UI Visibility & Backend RBAC Enforcement). Hệ thống hiện đã sẵn sàng để chuyển sang **Phase 9B-D: Concurrency Locking (Khóa đồng thời phòng ngừa thao tác ghi đè khi nhiều cán bộ cùng thẩm định)**.
