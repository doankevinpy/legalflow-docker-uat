# LEGALFLOW V2 - PHASE 11G
# TEST, RELEASE & ROLLBACK PLAN

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `Phase 11G Standard`  
**Ngày lập Kế hoạch:** 11/07/2026  
**Trạng thái Tài liệu:** **`OFFICIAL TEST, RELEASE & ROLLBACK PLAN`** *(Kế hoạch Kiểm thử Toàn diện, Phát hành & Phục hồi Hạ cấp Công cụ Nạp Tri thức Pháp lý)*

---

## 1. Purpose

Tài liệu này là Kế hoạch Kiểm thử Toàn diện, Phát hành & Phục hồi Hạ cấp (`Test, Release & Rollback Plan` - Phase 11G) cho công cụ nạp Tri thức Pháp lý của hệ thống LegalFlow V2. Tài liệu xác lập chiến lược kiểm thử đa lớp (`Test Strategy`), chuẩn hóa các câu lệnh kiểm định bắt buộc (`Required Commands`), thiết lập danh mục kiểm tra sẵn sàng phát hành (`Release Readiness Checklist`), ban hành phương án quay lui an toàn (`Rollback Plan`) và đặc tả 8 điều kiện dừng khẩn cấp (`Stop Conditions`) nhằm bảo đảm an toàn tuyệt đối 100% trước, trong và sau mỗi đợt nâng cấp mã nguồn Khối 3.2.

---

## 2. Test Strategy

Bảng đặc tả chiến lược kiểm thử đa lớp trước khi ban hành bản phát hành chính thức (`8-Layer Test Strategy Matrix`):

| Test Layer (`Verification Layer`) | Scope (`Detailed Testing Coverage & Actions`) | Required Before Release | Notes & Technical Gate |
| :--- | :--- | :---: | :--- |
| **1. Unit Test (`Backend Service`)** | Kiểm thử từng hàm trong `CsvParserService` và `ValidationRulesService` với các file CSV hợp lệ, lỗi ngày ISO (`VAL-02`), thiếu trường (`VAL-01`), sai Enum (`VAL-04`). | **YES** | Đạt độ phủ Unit Test `Coverage >= 90%`. Chạy qua lệnh `npm test` trong folder backend. |
| **2. Integration Test (`Backend API`)** | Kiểm thử luồng HTTP endpoints (`/validate`, `/dry-run`, `/execute`) với Supertest, xác minh `Prisma.$transaction rollback` và `0 DB writes` khi Dry-Run. | **YES** | Kiểm chứng trả về đúng HTTP status codes (`200 OK`, `400 Bad Request`, `403 Forbidden`). |
| **3. Permission Test (`RBAC Guard`)** | Kiểm thử `@RolesGuard` khi gọi API `/validate` và `/execute` bằng các JWT tokens mang vai trò `ADMIN`, `MANAGER`, `STAFF`, `VIEWER`. | **YES** | Khẳng định `STAFF` và `VIEWER` không thể gọi API nạp (`403 Forbidden`). |
| **4. Validation Test (`Rule Engine`)** | Kiểm chứng ma trận 14 tình huống lỗi (`VAL-01 -> VAL-14`) với file CSV mẫu Phase 11D, xác minh trả chính xác mã lỗi tiếng Việt. | **YES** | Khẳng định `approval_status != Approved` và `legal_status == Unknown` bị loại bỏ 100%. |
| **5. Frontend Build Verification** | Kiểm chứng quá trình biên dịch mã nguồn giao diện TypeScript/React (`npm run build`), rà soát không lỗi syntax hay broken imports. | **YES** | Chạy trong `legalflow-docker-uat` root directory. Build pass 100%. |
| **6. Backend Build Verification** | Kiểm chứng quá trình biên dịch mã nguồn NestJS (`npm run build`), rà soát không lỗi dependency hay TypeScript errors. | **YES** | Chạy trong `legalflow-backend` directory. Build pass 100%. |
| **7. Runtime Health-Check** | Kiểm tra sức khỏe hạ tầng Docker (`postgres`, `caddy`, `minio`) và trạng thái DB migration trước và sau deploy. | **YES** | Chạy kịch bản `.\scripts\health-check.ps1` và `docker ps`. `postgres` phải đạt `healthy`. |
| **8. UAT Test (`User Acceptance`)** | Lãnh đạo Phòng (`MANAGER`) và Quản trị viên (`ADMIN`) trực tiếp thao tác tải file CSV mẫu, rà soát Dry-Run và thực hiện Execute trên môi trường Staging. | **YES** | Ký biên bản nghiệm thu UAT trước khi ban hành bản Release Candidate lên Production. |

---

## 3. Required Commands

Bộ câu lệnh chuẩn hóa bắt buộc phải thực thi để kiểm chứng kỹ thuật trước khi đóng gói Release (`Standard Technical Verification Commands`):

### 3.1. Backend Verification (`legalflow-backend`):
```powershell
cd C:\Users\Admin\legalflow-docker-uat\legalflow-backend

npx prisma generate
npx prisma migrate status
npm test
npm run build
```

### 3.2. Frontend Verification (`Root / Frontend directory`):
```powershell
cd C:\Users\Admin\legalflow-docker-uat

npm run build
```

### 3.3. Runtime & Infrastructure Verification (`Root directory`):
```powershell
cd C:\Users\Admin\legalflow-docker-uat

.\scripts\health-check.ps1
docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}"
```

---

## 4. Release Readiness Checklist

Bảng kiểm tra 9 tiêu chí sẵn sàng phát hành trước khi triển khai lên máy chủ thực tế (`9-Point Release Readiness Sign-off Table`):

| Item (`Verification Checkpoint`) | Required Result (`Technical Expectation`) | Status | Evidence (`Verification Command / Artifact`) | Notes & Sign-off Requirement |
| :--- | :--- | :---: | :--- | :--- |
| **1. Backend Tests Pass** | 100% Unit & Integration test suites passed (`0 failures`). | *PENDING* | Output của lệnh `npm test` tại `legalflow-backend`. | Thực hiện tại Phase 11H/I trước khi release. |
| **2. Frontend Build Pass** | Production build bundle hoàn tất (`0 errors, 0 warnings`). | *PENDING* | Output của lệnh `npm run build` tại root directory. | Thực hiện tại Phase 11J trước khi release. |
| **3. Migration Status Checked** | DB migrations up-to-date, không có drift hay pending migration bất thường. | *PENDING* | Output của lệnh `npx prisma migrate status`. | Đảm bảo schema đồng bộ tuyệt đối với DB. |
| **4. No Secret Committed** | Không chứa mật khẩu, JWT secret hay DB connection string trong code/env. | *PENDING* | Rà soát `git diff` và tĩnh code trước commit. | Zero Secret Leakage Mandate. |
| **5. Backup Ready (`pg_dump`)** | Đã tạo và xác minh file sao lưu cơ sở dữ liệu production trên máy chủ. | *PENDING* | File dump `.sql` / `.dump` lưu tại folder backup an toàn ngoài Git. | Yêu cầu tiên quyết trước lệnh deploy. |
| **6. Import Validation Pass** | Test case rà soát 16 trường bắt buộc và ma trận lỗi VAL-01->14 hoạt động 100%. | *PENDING* | Output log từ test suite `CsvParserService`. | Khẳng định chốt chặn rà soát định dạng. |
| **7. Permission Tests Pass** | `RolesGuard` chặn chính xác `STAFF` và `VIEWER` (`403 Forbidden`). | *PENDING* | Output log từ e2e test controller. | RBAC Dual-Layer Sign-off. |
| **8. Audit Tests Pass** | Giao dịch nạp ghi nhận trọn vẹn 13 trường kiểm toán Phase 11F vào `UpdateLog`. | *PENDING* | Query kiểm chứng bảng `UpdateLog` trong test DB. | Immutable Logging Compliance. |
| **9. No Auto-Active Verified** | Dữ liệu sau nạp mang trạng thái `DRAFT / PENDING_REVIEW`, `isActive = false`. | *PENDING* | Query kiểm chứng bảng `LegalDocument` trong test DB. | Zero Auto-Activation Mandate. |

---

## 5. Rollback Plan

Chiến lược và nguyên tắc xử lý phục hồi hạ cấp (`Rollback & Disaster Recovery Plan`) khi gặp rủi ro sau khi phát hiện lỗi hoặc sự cố triển khai:
1. 🛡️ **Rollback Lỗi Code (`Frontend / Backend Code Reversion`):** Nếu bản phát hành mã nguồn mới (`Phase 11H/I/J`) gây lỗi runtime hoặc xung đột UI, Quản trị viên thực hiện lệnh `git revert <commit-id>` hoặc chuyển đổi container về image của phiên bản ổn định trước đó (`v2.11.5`). Không cần can thiệp cơ sở dữ liệu nếu chưa có migration.
2. 🛡️ **Rollback Migration (`Schema Downgrade Strategy`):** Nếu trong Phase 11I có tạo migration mới và phát sinh lỗi nghiêm trọng trên Production, Quản trị viên **tuyệt đối không chạy `migrate reset`**. Phải sử dụng file sao lưu `pg_dump` đã chuẩn bị từ trước (`Pre-migration DB Backup`) để khôi phục cơ sở dữ liệu bằng lệnh `pg_restore` dưới sự giám sát và phê duyệt bằng văn bản của Lãnh đạo Phòng.
3. 🛡️ **Rollback Lô Dữ liệu Nạp (`Import Batch Reversal`):** Nếu công cụ import đã hoạt động và Quản trị viên lỡ nạp một lô CSV chứa sai sót nội dung vào vùng chờ Staging, thực hiện gọi API hoặc thao tác nút `[ Rollback Batch ]`. Hệ thống chuyển cờ `status = REJECTED / ROLLBACKED` cho toàn bộ các bản ghi trong lô mà không xóa vật lý (`No DELETE`).
4. 🛡️ **Rollback Không Xóa Audit Trail (`Immutable Audit Preservation`):** Mọi thao tác phục hồi hay quay lui đều bắt buộc phải được ghi nhận thành một bản ghi nhật ký kiểm toán mới (`UpdateLog`) giải thích lý do quay lui (`rollbackReason`). Không bao giờ xóa hoặc sửa đổi lịch sử của các sự kiện import/rollback trước đó.
5. 🛡️ **Không Restore Database Nếu Chưa Phê Duyệt (`Zero Unauthorized DB Restoration`):** Kỹ thuật viên không được tự ý ghi đè hay khôi phục cơ sở dữ liệu production bằng các file backup cũ nếu chưa nhận được sự đồng thuận từ `Role.MANAGER`.

---

## 6. Stop Conditions

Danh mục 8 Điều kiện Dừng Khẩn cấp (`8 Mandatory Release Emergency Stop Conditions`), khi xảy ra bất kỳ điều kiện nào dưới đây, quy trình Phát hành (`Release Process`) hoặc quy trình Nạp Lô (`Batch Ingestion`) phải lập tức bị **hủy bỏ và ngắt kết nối (`Immediate Abort & Circuit Breaker`)**:
1. 🛑 **Test Fail (`Test Suite Failure`):** Phát hiện từ 1 unit test hoặc integration test bị fail (`npm test != pass`).
2. 🛑 **Build Fail (`Compilation Error`):** Lệnh `npm run build` trên backend hoặc frontend trả về lỗi syntax hay broken dependencies.
3. 🛑 **Migration Status Bất thường (`Drift / Broken Migration`):** Lệnh `npx prisma migrate status` báo cáo có thay đổi trái phép trên DB hoặc migration chưa được rà soát.
4. 🛑 **Health-Check Fail (`Core Infrastructure Failure`):** Container `legalflow_postgres` bị down, mất kết nối DB hoặc ổ cứng máy chủ hết dung lượng (`Storage Exhaustion`).
5. 🛑 **Permission Guard Fail (`RBAC Bypass Vulnerability`):** Kiểm thử phát hiện tài khoản `STAFF` hoặc `VIEWER` có thể gọi thành công API `/validate` hoặc `/execute` mà không bị chặn `403`.
6. 🛑 **Import Tự Active (`Auto-Activation Bug Detected`):** Phát hiện lỗi logic khiến văn bản nạp từ CSV bị tự động chuyển cờ `isActive = true` trên DB.
7. 🛑 **Validation Ghi DB Trong Dry-Run (`Dry-Run Side Effect Violation`):** Phát hiện lệnh `/dry-run` hoặc `/validate` để lại bản ghi rác hoặc thay đổi số lượng dòng (`DB.count`) trên DB thực tế.
8. 🛑 **Không Có Backup Trước Import Thật (`Missing DB Backup Challenge`):** Quản trị viên không cung cấp được mã tham chiếu file `pg_dump` hợp lệ hoặc cờ `confirmDbBackup` bị bỏ trống khi gọi `/execute`.

---
*Kế hoạch Kiểm thử Toàn diện, Phát hành & Phục hồi Hạ cấp (Test, Release & Rollback Plan) được lập tự động từ kết quả quy chuẩn Phase 11G.*
