# Phase 7C-A Completion – Procedure Core Foundation

**Mốc phát hành (Tag):** `v2.5.2-procedure-core-foundation`  
**Ngày hoàn thành:** 03/07/2026  
**Lĩnh vực áp dụng:** Thủ tục Hành chính (TTHC) Đất đai & Xây dựng  

---

## 1. Mục tiêu Phase 7C-A

Phase 7C-A tập trung xây dựng **nền tảng kỹ thuật tối thiểu** cho module mới mang tên **“Trợ lý thẩm tra hồ sơ TTHC”** (Administrative Procedure AI Analysis Assistant). Các mục tiêu trọng tâm bao gồm:

1. **Tách biệt kiến trúc độc lập**: Xây dựng module hồ sơ TTHC chuyên sâu độc lập khỏi module quản lý đơn thư khiếu nại, tố cáo (`LegalCase`) hiện có.
2. **Thiết lập nền móng kỹ thuật**: Xây dựng toàn bộ hạ tầng cơ sở dữ liệu (Prisma Schema), Backend API chuẩn RESTful, và cấu trúc Frontend UI dạng khung (skeleton/tabs).
3. **Giới hạn phạm vi nghiêm ngặt**:
   - **Chưa** triển khai mô hình AI phân tích chuyên sâu tài liệu TTHC.
   - **Chưa** triển khai thuật toán hay logic tính toán tiền sử dụng đất/nghĩa vụ tài chính.
   - **Chưa** triển khai tính năng phát hành hay xuất văn bản, phiếu thẩm tra tự động ra file Word/PDF.

---

## 2. Phạm vi đã triển khai

Trong Phase 7C-A, hệ thống đã hoàn tất triển khai các hạng mục nền tảng sau:

1. **Schema & Migration nền tảng**: Bổ sung các model mới cho module TTHC vào `schema.prisma` và khởi tạo migration cơ sở.
2. **Backend Module**: Dựng trọn vẹn kiến trúc NestJS chuyên biệt (`AdministrativeProceduresModule`, Controller, Service, DTOs).
3. **API CRUD cơ bản**: Phục vụ tiếp nhận hồ sơ mới, tra cứu danh sách, xem chi tiết, cập nhật thông tin và quản lý ghi chú/checklist nghiệp vụ.
4. **Frontend Navigation**: Thêm menu/route mới **"Thẩm tra TTHC"** (`/procedure-cases`) trên Sidebar và cấu hình routing trong `App.tsx`.
5. **Trang Danh sách Hồ sơ TTHC**: Hỗ trợ tìm kiếm theo từ khóa (mã hồ sơ, tên người nộp, SĐT), bộ lọc theo lĩnh vực (`DAT_DAI`, `XAY_DUNG`) và trạng thái xử lý.
6. **Form Tiếp nhận Hồ sơ TTHC**: Popup form chuẩn hóa thu thập thông tin người nộp, số tờ bản đồ, số thửa đất, diện tích và ghi chú tiếp nhận ban đầu.
7. **Trang Chi tiết Hồ sơ TTHC**: Bố trí không gian làm việc chuyên nghiệp với **7 tab chức năng**.
8. **Seed Dữ liệu Chuẩn**: Tự động hóa khởi tạo 4 loại thủ tục trọng tâm trong lĩnh vực đất đai và xây dựng.
9. **Audit Log TTHC**: Cơ chế ghi nhận nhật ký truy vết tự động cho mọi thao tác tạo mới và cập nhật hồ sơ TTHC.

---

## 3. Các model/bảng đã thêm

Hệ thống đã mở rộng `schema.prisma` với **6 model mới** và **6 enum chuyên biệt**:

### 3.1. Danh sách Model mới
- `ProcedureType`: Danh mục chuẩn các loại thủ tục hành chính (Mã thủ tục, tên, lĩnh vực, thời gian giải quyết...).
- `AdministrativeProcedureCase`: Bảng dữ liệu cốt lõi lưu trữ hồ sơ TTHC (liên kết với `ProcedureType` và thông tin thửa đất/công trình).
- `ProcedureDocument`: Quản lý tài liệu đính kèm hồ sơ (trường `fileUrl` để tùy chọn tùy theo mức độ số hóa).
- `ProcedureChecklistItem`: Tiêu chí rà soát thành phần hồ sơ theo từng nhóm (`checklistGroup`).
- `ProcedureNote`: Ghi chú ý kiến thẩm định chuyên môn nội bộ.
- `ProcedureAuditLog`: Nhật ký minh bạch ghi nhận lịch sử thao tác trên hồ sơ TTHC.

### 3.2. Danh sách Enum mới
- `ProcedureField`: Phân loại lĩnh vực (`DAT_DAI`, `XAY_DUNG`, `KHAC`).
- `ProcedureGroup`: Phânóm nghiệp vụ (`CAP_GCN_LAN_DAU`, `CHUYEN_MUC_DICH_SDD`, `NGHIA_VU_TAI_CHINH`, `CAP_PHEP_XAY_DUNG`, `KHAC`).
- `ProcedureStatus`: Trạng thái luồng xử lý (`SUBMITTED`, `IN_REVIEW`, `SUPPLEMENT_REQUIRED`, `PENDING_APPROVAL`, `COMPLETED`, `REJECTED`).
- `ProcedureDocReviewStatus`: Trạng thái kiểm tra tài liệu (`VALID`, `MISSING`, `NEEDS_VERIFICATION`).
- `ProcedurePriority`: Mức độ ưu tiên kiểm tra (`HIGH`, `MEDIUM`, `LOW`).
- `ProcedureNoteType`: Phân loại ghi chú (`GENERAL`, `OFFICER_REVIEW`, `FIELD_INSPECTION`).

---

## 4. Migration

- **Tên migration chính thức:** `20260703131657_init_procedure_core_foundation`
- **Đặc điểm bảo đảm an toàn dữ liệu:**
  - Migration **chỉ tạo mới** các bảng và enum thuộc module TTHC cùng quan hệ ngược trên bảng `User`.
  - **Không sửa đổi, không xóa hoặc làm thay đổi cấu trúc** các bảng thuộc module đơn thư hiện tại:
    - `LegalCase` (giữ nguyên 100%).
    - `CaseNote`, `CaseHistory`.
    - `CaseChecklistItem`, `CaseDocument`.
    - `AiAuditLog`, `AiCaseSuggestion`.

---

## 5. Backend đã triển khai

Module NestJS mới `AdministrativeProceduresModule` đã được tích hợp vào `AppModule` với chuẩn API prefix `/api/...`, bao gồm:

1. **Kiến trúc Module**:
   - `AdministrativeProceduresModule`: Khai báo providers và controllers.
   - `ProcedureTypesController`: Xử lý endpoint danh mục loại thủ tục.
   - `ProcedureCasesController`: Xử lý endpoint hồ sơ TTHC và các tài nguyên con.
   - `AdministrativeProceduresService`: Xử lý nghiệp vụ lõi và tương tác cơ sở dữ liệu qua Prisma.
2. **Danh sách Endpoint API**:
   - `GET /api/procedure-types`: Truy xuất danh sách loại thủ tục đang hoạt động.
   - `POST /api/procedure-cases`: Tiếp nhận hồ sơ mới (tự động sinh mã `TTHC-YYYY-XXXX` và ghi log `CREATE_PROCEDURE_CASE`).
   - `GET /api/procedure-cases`: Truy xuất danh sách hồ sơ có hỗ trợ phân trang (`page`, `limit`) và bộ lọc (`field`, `procedureTypeId`, `status`, `keyword`).
   - `GET /api/procedure-cases/:id`: Lấy thông tin chi tiết hồ sơ kèm quan hệ nested (Tài liệu, Checklist, Ghi chú, Nhật ký).
   - `PATCH /api/procedure-cases/:id`: Cập nhật thông tin/trạng thái hồ sơ (ghi log `UPDATE_PROCEDURE_CASE`).
   - `POST /api/procedure-cases/:id/notes`: Thêm ý kiến thẩm tra chuyên môn.
   - `POST /api/procedure-cases/:id/checklists`: Thêm tiêu chí kiểm tra thành phần hồ sơ.
   - `PATCH /api/procedure-cases/:id/checklists/:itemId`: Cập nhật trạng thái hoàn thành mục rà soát theo nguyên tắc Human-in-the-Loop.
3. **Bảo mật & Chuẩn hóa**: Tích hợp đầy đủ DTO validation (`class-validator`), `JwtAuthGuard` và `RolesGuard`.

---

## 6. Frontend đã triển khai

Giao diện người dùng được mở rộng mạch lạc, giữ đúng ngôn ngữ thiết kế của LegalFlow:

1. **Điều hướng (Navigation)**:
   - Thêm menu **"Thẩm tra TTHC"** trên Sidebar (`Sidebar.tsx`).
   - Cập nhật tiêu đề trang động trên Header (`Header.tsx`).
   - Đăng ký routing bảo mật trong `App.tsx`.
2. **Trang Danh sách (`ProcedureCaseList.tsx`)**:
   - Thanh công cụ tìm kiếm nhanh theo mã hồ sơ, tên người nộp, số điện thoại.
   - Bộ lọc kép theo Lĩnh vực (Đất đai/Xây dựng) và Trạng thái hồ sơ.
   - Modal popup "Tiếp nhận hồ sơ TTHC" cho phép thao tác nhanh chóng.
3. **Trang Chi tiết (`ProcedureCaseDetail.tsx`) với 7 tab chuyên biệt**:
   - **Tab 1 - Tổng quan**: Hiển thị thông tin người nộp, tiếp nhận, tóm tắt thông tin thửa đất (Tờ bản đồ, số thửa, diện tích).
   - **Tab 2 - Tài liệu**: Danh sách file đính kèm hồ sơ.
   - **Tab 3 - AI rà soát**: Khung hiển thị giao diện mẫu kèm banner cảnh báo nổi bật quy định trách nhiệm kiểm tra của cán bộ chuyên môn.
   - **Tab 4 - Checklist**: Quản lý danh sách tiêu chí kiểm tra thành phần hồ sơ, cho phép cán bộ tick chọn hoàn thành và lưu thông tin người thẩm định.
   - **Tab 5 - Nghĩa vụ tài chính dự kiến**: Khung placeholder hiển thị thông tin giới thiệu tính năng tính tiền sử dụng đất cho Phase 7E.
   - **Tab 6 - Ghi chú**: Không gian thảo luận và lưu ý kiến thẩm định chuyên môn nội bộ.
   - **Tab 7 - Audit log**: Bảng theo dõi chi tiết thời gian, hành động và tài khoản thực hiện trên hồ sơ.
4. **Quy định Placeholder**:
   - Tab **AI rà soát** và Tab **Nghĩa vụ tài chính dự kiến** hiện thiết kế ở dạng khung/placeholder chuẩn, cam kết chưa chạy logic AI chuyên sâu hay tự động tính toán tài chính tại Phase 7C-A.

---

## 7. Seed dữ liệu

Hệ thống cung cấp script seed (`prisma/seed.ts`) an toàn, thực thi thông qua lệnh `npm run seed`:

- **4 loại thủ tục mẫu được seed tự động**:
  1. `LAND_FIRST_CERTIFICATE`: Cấp Giấy chứng nhận quyền sử dụng đất lần đầu (Lĩnh vực Đất đai).
  2. `LAND_USE_PURPOSE_CHANGE`: Chuyển mục đích sử dụng đất (Lĩnh vực Đất đai).
  3. `LAND_FINANCIAL_OBLIGATION_REVIEW`: Kiểm tra/xác định nghĩa vụ tài chính đất đai (Lĩnh vực Đất đai).
  4. `CONSTRUCTION_PERMIT`: Cấp giấy phép xây dựng nhà ở riêng lẻ (Lĩnh vực Xây dựng).
- **Cơ chế `upsert` theo `code`**: Đảm bảo không tạo bản ghi trùng lặp khi chạy seed nhiều lần.
- **An toàn thông tin**: Dữ liệu seed chỉ là danh mục thủ tục hành chính mẫu chuẩn theo pháp luật, tuyệt đối **không chứa dữ liệu cá nhân hay hồ sơ thật**.

---

## 8. Nguyên tắc an toàn đã bảo đảm

Toàn bộ kiến trúc Phase 7C-A tuân thủ nghiêm ngặt các nguyên tắc kiểm soát an toàn AI trong lĩnh vực hành chính công:

1. **Chưa triển khai AI chuyên sâu**: Nền tảng chỉ chuẩn bị sẵn cấu trúc dữ liệu và API cho các phase tiếp theo.
2. **Không tự kết luận thay cán bộ**: Hệ thống tuyệt đối không tự động đánh giá hồ sơ đủ điều kiện hay không đủ điều kiện.
3. **Không tự tính nghĩa vụ tài chính chính thức**: Chưa áp dụng bất kỳ công thức hay bảng giá đất tự động nào vào quyết định hành chính.
4. **Không tự phát hành văn bản**: Không tự động sinh phiếu trình, quyết định hay giấy chứng nhận.
5. **Không tự ký số**: Không kết nối hay tự động thực thi chữ ký số.
6. **Không tự gửi văn bản/email**: Không có luồng tự động thông báo kết quả thẩm định ra bên ngoài.
7. **Không tự chuyển đổi trạng thái hồ sơ bởi AI**: Mọi chuyển dịch trạng thái (`IN_REVIEW`, `SUPPLEMENT_REQUIRED`...) đều phải do cán bộ có thẩm quyền thực hiện.
8. **Tuân thủ quy định placeholder**: Giữ nguyên nguyên tắc cốt lõi được thể hiện qua banner:
   > **“⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA”**

---

## 9. Kết quả test/build

Các bước kiểm chứng đã thực hiện thành công trên môi trường chuẩn:

1. **Prisma & Database**:
   - `npx prisma generate`: Cập nhật thành công Prisma Client với các model mới.
   - `npx prisma migrate dev --name init_procedure_core_foundation`: Đồng bộ thành công cấu trúc database.
   - `npm run seed`: Khởi tạo thành công 4 danh mục thủ tục chuẩn.
2. **Backend Verification**:
   - `npm test`: **PASS 100%** (8 Test Suites, 39 Unit Tests passed).
   - `npm run build`: Biên dịch NestJS thành công, zero TypeScript errors.
3. **Frontend Verification**:
   - `npm run build`: Đóng gói thành công bundle Vite production.
4. **Kiểm thử thủ công (End-to-End Local UAT)**:
   - Truy cập mượt mà qua địa chỉ local friendly address: `http://kevindoan-legalflow.local:8080`.
   - Tạo hồ sơ TTHC mẫu mới qua form modal thành công (hệ thống sinh mã `TTHC-2026-0001`).
   - Mở trang chi tiết hồ sơ TTHC, điều hướng mượt mà qua đủ **7 tab chức năng**.
   - Thử nghiệm tạo mới Checklist, đánh dấu hoàn thành Checklist và gửi Ghi chú chuyên môn đều ghi nhận phản hồi chính xác tức thì.
   - Kiểm tra module quản lý đơn thư cũ (`LegalCase`) tại `/cases`: Không bị ảnh hưởng, hoạt động hoàn toàn bình thường.

---

## 10. Lệnh SQL kiểm chứng

Cán bộ quản trị hệ thống hoặc DBA có thể chạy các câu lệnh SQL dưới đây trong PostgreSQL để nghiệm thu hiện trạng cơ sở dữ liệu:

```sql
-- 1. Kiểm tra danh sách 6 bảng mới thuộc module TTHC đã được tạo thành công
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'ProcedureType', 
    'AdministrativeProcedureCase', 
    'ProcedureDocument', 
    'ProcedureChecklistItem', 
    'ProcedureNote', 
    'ProcedureAuditLog'
  );

-- 2. Kiểm tra 4 danh mục loại thủ tục mẫu (ProcedureType) đã được seed
SELECT code, name, field, group, "processingTimeDays", "isActive" 
FROM "ProcedureType" 
ORDER BY code;

-- 3. Kiểm tra các hồ sơ TTHC mẫu đã tiếp nhận vào hệ thống
SELECT "caseCode", field, "applicantName", "applicantPhone", status, "receivedAt" 
FROM "AdministrativeProcedureCase" 
ORDER BY "createdAt" DESC;

-- 4. Kiểm tra nhật ký truy vết hệ thống TTHC (ProcedureAuditLog)
SELECT "actionType", "entityType", "entityId", "createdAt" 
FROM "ProcedureAuditLog" 
ORDER BY "createdAt" DESC 
LIMIT 10;
```

---

## 11. Backup/Rollback

Để bảo đảm an toàn cho hệ thống khi triển khai trên các môi trường thử nghiệm và UAT, phương án sao lưu và phục hồi được xác định như sau:

- **Gói mã nguồn phát hành:** `legalflow-v2.5.2-procedure-core-foundation.zip`
- **File bản sao lưu cơ sở dữ liệu:** `legalflow-db-backup-v2.5.2-procedure-core-foundation.sql`
- **Quy trình Phục hồi (Rollback Code):**
  - Thực hiện lệnh Git để quay về mốc tag an toàn:
    ```bash
    git checkout v2.5.2-procedure-core-foundation
    # Hoặc quay về mốc trước đó nếu cần:
    # git checkout v2.5.1-procedure-module-design
    ```
- **Quy trình Phục hồi (Rollback Database):**
  - Khôi phục cơ sở dữ liệu từ file backup SQL tương ứng thông qua tiện ích `psql` hoặc `pg_restore`:
    ```bash
    psql -U postgres -d legalflow_db -f legalflow-db-backup-v2.5.2-procedure-core-foundation.sql
    ```

---

## 12. Rủi ro còn lại

Nhằm chuẩn bị tốt cho các giai đoạn tiếp theo, cần lưu ý các giới hạn kỹ thuật hiện tại của Phase 7C-A:

1. **Chỉ là nền tảng khung**: Module TTHC hiện tại mới hoàn thiện về mặt kiến trúc lưu trữ, API quản lý và giao diện luồng thao tác.
2. **Chưa có AI rà soát thực tế**: Các tính năng bóc tách, đối chiếu tài liệu bằng AI chưa được tích hợp vào tab "AI rà soát".
3. **Chưa có xử lý OCR tài liệu**: Việc tải file lên hiện tại lưu trữ đường dẫn cơ bản, chưa bóc tách ký tự hay kiểm tra tính hợp lệ tự động.
4. **Chưa có bảng tính nghĩa vụ tài chính**: Tab tài chính đang chờ bộ công thức và cấu hình bảng giá đất tại Phase 7E.
5. **Chưa xuất phiếu thẩm tra**: Chưa hỗ trợ kết xuất báo cáo kết quả rà soát hồ sơ TTHC ra file Word/PDF.
6. **Yêu cầu UAT nghiệp vụ**: Cần tổ chức kiểm thử người dùng thực tế (UAT) với chuyên viên đất đai/xây dựng trước khi đưa vào khai thác chính thức.

---

## 13. Kết luận

Giai đoạn **Phase 7C-A – Procedure Core Foundation** đã hoàn thành toàn diện và đạt 100% mục tiêu đề ra. 

Hệ thống LegalFlow đã sở hữu **một nền tảng module Quản lý & Thẩm tra hồ sơ TTHC độc lập, kiến trúc rõ ràng, giao diện chuẩn mực, hoạt động ổn định và tách biệt hoàn toàn khỏi luồng đơn thư khiếu nại tố cáo cũ**.

Hạ tầng kỹ thuật của LegalFlow tại mốc `v2.5.2-procedure-core-foundation` đã sẵn sàng 100% để bước tiếp sang **Phase 7C-B: AI rà soát chuyên sâu nghiệp vụ Cấp Giấy chứng nhận quyền sử dụng đất lần đầu**.
