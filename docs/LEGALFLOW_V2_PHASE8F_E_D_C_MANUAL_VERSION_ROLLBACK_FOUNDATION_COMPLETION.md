# LEGALFLOW V2 - PHASE 8F-E-D-C COMPLETION REPORT
**Manual Version Rollback Foundation (Backend Service, Controller & Unit Tests)**

## 1. Tổng quan
Phase **8F-E-D-C** đã hoàn thành việc triển khai tầng nền tảng Backend (Service, Controller và Unit Test) cho cơ chế **Manual Version Rollback sau kích hoạt** theo đúng thiết kế tại Phase 8F-E-D-B. Toàn bộ triển khai tuân thủ tuyệt đối các nguyên tắc an toàn dữ liệu, tính toàn vẹn lịch sử (Audit Trail), và phân quyền RBAC.

> [!IMPORTANT]
> **Tuân thủ tuyệt đối nguyên tắc không xâm lấn:**
> - **CHƯA** làm UI rollback trên frontend, chưa tạo nút rollback.
> - **KHÔNG** tự gọi endpoint rollback, không chạy rollback thật trên dữ liệu sản xuất.
> - **KHÔNG** sửa database schema, không tạo migration mới, không chỉnh sửa file `.env`.
> - **KHÔNG** tự động commit hay tạo git tag thay cho người dùng.

---

## 2. Chi tiết triển khai kỹ thuật

### 2.1. Backend Service (`LegalKnowledgeService`)
Đã bổ sung lớp `RollbackVersionDto` và phương thức `rollbackActivatedVersion(id: string, dto: RollbackVersionDto, user: any)` với logic kiểm tra an toàn 5 lớp và thực thi trong giao dịch nguyên tử (`Prisma.$transaction`):
1. **Kiểm tra RBAC:** Chỉ cho phép người dùng có vai trò `ADMIN` hoặc `MANAGER`. Các vai trò `STAFF`, `VIEWER` bị từ chối với lỗi `ForbiddenException (403)`.
2. **Kiểm tra văn bản xác nhận:** Yêu cầu `dto.confirmationText` phải khớp chính xác với chuỗi `"ROLLBACK VERSION"` hoặc `"TOI XAC NHAN ROLLBACK VERSION"` và `dto.rollbackReason` không được rỗng.
3. **Kiểm tra trạng thái hồ sơ nhật ký (`LegalUpdateLog`):** Hồ sơ phải tồn tại và đang ở trạng thái `APPROVED`.
4. **Kiểm tra lịch sử kích hoạt (`activationHistory`):** Hồ sơ phải có lịch sử kích hoạt (`notes.activationHistory`). Logic tìm ra phiên bản vừa được kích hoạt (`newActiveVersionId`) và phiên bản đã bị thay thế (`previousActiveVersionId`). Nếu thiếu thông tin, từ chối không phán đoán (`BadRequestException (400)`).
5. **Kiểm tra an toàn trạng thái phiên bản & Duplicate Protection:**
   - Phiên bản hiện tại phải đang ở trạng thái `ACTIVE`.
   - Phiên bản trước đó phải đang ở trạng thái `REPLACED`.
   - Thực hiện kiểm tra đếm số lượng phiên bản `ACTIVE` cùng phạm vi (theo `procedureTypeId`, `promptKey`, hoặc `checklistKey`). Nếu phát hiện > 1 phiên bản ACTIVE (Duplicate ACTIVE version), từ chối thực hiện rollback với `ConflictException (409)`.

#### Atomic Version State Switching (Trong `$transaction`)
- Đưa phiên bản hiện tại từ `ACTIVE` $\rightarrow$ `REPLACED` (đồng thời gán `effectiveTo = now()`).
- Khôi phục phiên bản trước đó từ `REPLACED` $\rightarrow$ `ACTIVE` (đồng thời gán `effectiveTo = null`).

#### Audit Trail Logging
Ghi lại đầy đủ lịch sử vào trường `notes` (JSON) và lịch sử quy trình:
- Bổ sung vào danh sách `rollbackHistory` (bao gồm `id`, `timestamp`, `rollbackByUserId`, `rollbackByRole`, `reason`, `confirmationText`, `affectedVersions`).
- Thêm sự kiện `ROLLBACK_VERSION` vào `workflowHistory`.

---

### 2.2. Backend Controller (`LegalKnowledgeController`)
Đã đăng ký REST endpoint mới:
- **Method:** `POST /api/legal-knowledge/update-logs/:id/rollback-version`
- **Guards:** `@UseGuards(JwtAuthGuard, RolesGuard)`
- **Roles Allowed:** `@Roles(Role.ADMIN, Role.MANAGER)`
- **Body:** `RollbackVersionDto` (chứa `rollbackReason` và `confirmationText`)

---

### 2.3. Bộ kiểm thử tự động (Unit Tests)
Đã bổ sung 12 kịch bản kiểm thử toàn diện vào `legal-knowledge.service.spec.ts` và `legal-knowledge.controller.spec.ts`:
1. `ADMIN`/`MANAGER` rollback hợp lệ $\rightarrow$ Thành công (`success: true`).
2. `STAFF`/`VIEWER` gọi rollback $\rightarrow$ Bị từ chối (`ForbiddenException`).
3. Sai `confirmationText` $\rightarrow$ Bị từ chối (`BadRequestException`).
4. `rollbackReason` rỗng hoặc không cung cấp $\rightarrow$ Bị từ chối (`BadRequestException`).
5. `LegalUpdateLog` không tồn tại $\rightarrow$ Bị từ chối (`NotFoundException`).
6. `LegalUpdateLog` chưa ở trạng thái `APPROVED` (ví dụ `REVIEWING`) $\rightarrow$ Bị từ chối (`BadRequestException`).
7. Hồ sơ không có `activationHistory` $\rightarrow$ Bị từ chối (`BadRequestException`).
8. Không xác định được `previousActiveVersionId` trong lịch sử $\rightarrow$ Bị từ chối không phán đoán (`BadRequestException`).
9. Phát hiện duplicate `ACTIVE` version trong cùng phạm vi $\rightarrow$ Bị từ chối (`ConflictException`).
10. Rollback thành công kiểm tra có ghi nhận vào `notes.rollbackHistory`.
11. Rollback thành công kiểm tra có ghi nhận action `ROLLBACK_VERSION` vào `notes.workflowHistory`.
12. Kiểm chứng tuyệt đối không sửa đổi hay tác động đến các bảng hồ sơ TTHC và AI (`AdministrativeProcedureCase`, `ProcedureAiAnalysis`, `ProcedureAiAnalysisLegalSnapshot`).

---

## 3. Kết quả kiểm tra hệ thống (Verification Results)

| Lệnh kiểm tra | Thư mục thực thi | Kết quả | Chi tiết |
| :--- | :--- | :--- | :--- |
| `npx prisma generate` | `legalflow-backend/` | **PASS** | Generated Prisma Client (v7.8.0) |
| `npx prisma migrate status` | `legalflow-backend/` | **PASS** | 6 migrations found, Database schema is up to date! |
| `npm test` | `legalflow-backend/` | **PASS** | **116/116 tests passed** across 10 test suites (4.67s) |
| `npm run build` | `legalflow-backend/` | **PASS** | NestJS build completed successfully with 0 errors |
| `npm run build` | Root (`./`) | **PASS** | Root Vite & TSC build completed successfully |
| `git status -s` | Root (`./`) | **CHECKED** | 4 modified files (controller, service and specs) |

### Danh sách file đã thay đổi (`git diff --stat`):
```text
 legalflow-backend/src/legal-knowledge/legal-knowledge.controller.spec.ts |  12 +
 legalflow-backend/src/legal-knowledge/legal-knowledge.controller.ts      |  13 +-
 legalflow-backend/src/legal-knowledge/legal-knowledge.service.spec.ts    | 150 +++++++++++
 legalflow-backend/src/legal-knowledge/legal-knowledge.service.ts         | 276 +++++++++++++++++++++
 4 files changed, 450 insertions(+), 1 deletion(-)
```

---

## 4. Hướng dẫn bước tiếp theo (Next Steps)
- **Kiểm tra manual & Review:** Người dùng có thể review code tại `legal-knowledge.service.ts` và `legal-knowledge.controller.ts`.
- **Thực hiện commit/tag:** Theo yêu cầu nghiêm ngặt *"Không commit/tag thay tôi"*, người dùng sẽ tự thực hiện lệnh git commit và tạo tag (ví dụ: `v2.8.14-manual-version-rollback-foundation`).
- **Phase tiếp theo (Phase 8F-E-D-D):** Sau khi hoàn tất nghiệm thu tầng Backend Foundation, sẽ tiến hành thiết kế và xây dựng giao diện Rollback UI trên Frontend (Nút Rollback, Modal xác nhận nhiều bước, cảnh báo an toàn).
