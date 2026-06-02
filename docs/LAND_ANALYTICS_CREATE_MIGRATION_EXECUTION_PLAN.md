# Kế hoạch thực thi Phase 10.0D-B: Create LandProfile Migration File Only

**Phase**: 10.0D-B — Create LandProfile Migration File Only  
**Status**: Planning & Execution Design (No actual schema patches, migration creation, or validation commands executed yet)  
**Date**: 2026-06-02  
**Wording Standard Compliance**: Strictly using neutral terms like `risk indicator`, `dấu hiệu cần rà soát`, `chỉ báo bất thường`, `khuyến nghị kiểm tra`, `cần xác minh thêm`. Fully avoiding accusatory language.

---

## 1. Chia nhỏ Execution thành 2 bước (Phase Split)

Để đảm bảo kiểm soát an toàn tối đa cho hệ thống, quá trình thực thi Phase 10.0D-B được phân tách thành 2 bước riêng biệt:

1. **`10.0D-B1` (Tạo Execution Plan Document Only - Bước hiện tại):**
   * *Mục tiêu:* Chỉ thiết lập tài liệu kế hoạch thực thi.
   * *Ranh giới an toàn:* Tuyệt đối không chỉnh sửa tệp `schema.prisma`, không chạy bất kỳ lệnh Prisma nào (validate, generate, hay migrate dev), không tạo tệp migration thực tế, và không commit mã nguồn khi chưa được phê duyệt.
2. **`10.0D-B2` (Thực thi Create Migration File Only):**
   * *Mục tiêu:* Thực hiện sửa `schema.prisma`, chạy Prisma validate/generate và chạy lệnh tạo tệp migration SQL nháp.
   * *Ranh giới an toàn:* Chỉ chạy khi được phê duyệt riêng biệt bằng văn bản từ người dùng. Không chạy lệnh `migrate deploy` hoặc áp dụng thay đổi vào cơ sở dữ liệu thật trong Phase 10.0D-B.

---

## 2. Preflight bắt buộc trước 10.0D-B2 (Yêu cầu kiểm tra trước)

Trước khi thực hiện chỉnh sửa tệp `schema.prisma` hoặc chạy bất kỳ câu lệnh nào trong bước `10.0D-B2`, hệ thống bắt buộc phải vượt qua các kiểm tra an toàn sau:

1. **Xác minh Git Status:**
   * Trạng thái git của repository phải hoàn toàn sạch sẽ (`working tree clean`).
2. **Kiểm tra sức khỏe bản sao lưu database UAT:**
   * Thư mục backup gần nhất trong `LegalFlow_ARTIFACTS/backups` phải chứa đầy đủ tệp `status.success` và tệp checksum `manifest.sha256`.
   * **Kiểm tra trạng thái lỗi:** Đảm bảo không có thư mục chứa tệp trạng thái lỗi (`status.failed`) nào được tạo ra mới hơn bản sao lưu thành công gần nhất.
   * Thực thi script kiểm tra tính toàn vẹn:
     ```powershell
     powershell -ExecutionPolicy Bypass -File scripts/verify-latest-backup.ps1
     ```
     -> Kết quả trả về phải đạt trạng thái **`PASS`**.
   * Thực thi script giám sát lịch trình và tuổi đời backup:
     ```powershell
     powershell -ExecutionPolicy Bypass -File scripts/check-latest-backup-health.ps1
     ```
     -> Kết quả trả về phải **thành công (không báo FAIL, exit code = 0)**.
3. **Quyết định:** Nếu có bất kỳ lỗi hoặc backup không hợp lệ nào, hệ thống bắt buộc phải dừng toàn bộ phase.

---

## 3. Phạm vi Patch khi thực thi 10.0D-B2

* **Các file được phép sửa đổi:**
  * Tệp `legalflow-backend/prisma/schema.prisma`.
  * Thư mục và tệp tin migration mới do Prisma tạo ra sau lệnh create-only.
* **Các file TUYỆT ĐỐI KHÔNG được sửa đổi:**
  * Mã nguồn backend (services, controllers, modules, v.v.).
  * Giao diện frontend.
  * Tệp seed dữ liệu (`seed.ts` hoặc các tệp tin seed bổ sung).
  * Cấu hình Docker, Dockerfile, docker-compose files.
  * Cấu hình proxy / Caddyfile.
  * Các tệp tin cấu hình môi trường (`.env`, `.env.docker`, v.v.).

---

## 4. Schema Patch Expected (Patch cấu trúc dữ liệu dự kiến)

Tệp `schema.prisma` khi sửa đổi dự kiến sẽ bao gồm:

### A. Danh sách 11 Enums nghiệp vụ mới:
1. `LandProcedureType`
2. `LandType`
3. `PlanningStatus`
4. `DisputeStatus`
5. `OriginOfLandStatus`
6. `DocumentCompleteness`
7. `FinancialObligationStatus`
8. `LandOutcome`
9. `LandReasonCode`
10. `ComplaintType`
11. `RiskReviewStatus`

### B. Cấu trúc model `LandProfile`:
Model này chứa đầy đủ các trường nghiệp vụ tối thiểu: `id`, `caseId`, `procedureType`, `landType`, `currentLandUseType`, `requestedLandUseType`, `area`, `neighborhood`, `planningStatus`, `disputeStatus`, `originOfLandStatus`, `documentCompleteness`, `financialObligationStatus`, `outcome`, `reasonCode`, `complaintFlag`, `complaintType`, `processingDays`, `overdueDays`, `riskReviewStatus`, `createdAt`, `updatedAt`.

### C. Mối quan hệ Optional & Tính an toàn dữ liệu:
* Trường `landProfile LandProfile?` trên model `LegalCase` được cấu hình dạng **optional 1-1** (nullable).
* `LegalCase` cũ không bắt buộc có `LandProfile`.
* Mối quan hệ optional đảm bảo migration không phá dữ liệu cũ, hỗ trợ backfill dần dần và hoàn toàn không thay đổi logic xử lý vụ việc hiện tại của hệ thống.
* **Join Strategy:** Đối với phân tích cán bộ thụ lý (`assignedToId` từ `LegalCase`), hệ thống đề xuất sử dụng phép `JOIN` SQL dựa trên indexes đơn thay vì nhân bản trùng lặp trường sang bảng `LandProfile`.

---

## 5. Command Plan cho 10.0D-B2 (Kế hoạch thứ tự lệnh)

Khi được phê duyệt thực thi riêng biệt ở bước `10.0D-B2`, thứ tự câu lệnh bắt buộc phải tuân thủ nghiêm ngặt:

1. **Preflight Check:**
   * `git status`
   * `powershell -ExecutionPolicy Bypass -File scripts/verify-latest-backup.ps1`
   * `powershell -ExecutionPolicy Bypass -File scripts/check-latest-backup-health.ps1`
2. **Patch tệp `schema.prisma`** (Áp dụng bản patch cấu trúc dữ liệu đã thiết kế).
3. **Validate / Generate:**
   * `cd legalflow-backend`
   * `npx prisma validate`
   * `npx prisma generate`
4. **Create Migration File Only:**
   * `npx prisma migrate dev --name add_land_profile_model --create-only`
5. **Tuyệt đối không chạy:**
   * Lệnh `npx prisma migrate deploy` hoặc `npx prisma db push` (để tránh tự động apply vào database UAT).
   * Lệnh `npx prisma db seed` (không thực hiện seed dữ liệu).
6. **Review kết quả:**
   * Kiểm duyệt tệp `migration.sql` mới sinh ra.
   * `git diff --stat`
   * `git status`

---

## 6. SQL Review Requirements (Yêu cầu kiểm duyệt SQL)

Sau khi chạy lệnh create-only, tệp SQL mới sinh ra phải được mở ra rà soát thủ công theo các tiêu chí:
* Chỉ tạo các enums mới, tạo bảng mới `LandProfile`, tạo các chỉ mục đơn/composite, và thiết lập relation optional với `LegalCase`.
* **Tuyệt đối không** chứa câu lệnh drop bảng cũ hoặc drop cột cũ.
* **Tuyệt đối không** thực hiện bất kỳ thay đổi mang tính phá hủy (destructive alter) nào trên bảng `LegalCase`.
* Không xóa dữ liệu.
* Không tác động hay thay đổi các bảng `User`, `CaseNote`, `CaseHistory`, `CaseChecklistItem`, v.v. ngoại trừ cấu hình quan hệ optional mới.
* Đảm bảo tệp SQL không chứa bất kỳ secrets, credentials hay dữ liệu thật nào của dự án.

---

## 7. Rollback Plan (Phương án hoàn tác)

### A. Hoàn tác khi chặng create-only gặp vấn đề ở 10.0D-B2:
Vì chưa apply vào database thật, rollback chỉ thực hiện trên mã nguồn:
1. Khôi phục tệp `schema.prisma` gốc thông qua lệnh:
   ```bash
   git checkout -- prisma/schema.prisma
   ```
2. Thực hiện xóa thư mục migration nháp mới sinh ra trong `legalflow-backend/prisma/migrations/`.
3. Chạy `git status` để đảm bảo repo quay về trạng thái sạch sẽ ban đầu.
4. Tuyệt đối không đụng vào database và không thực hiện restore DB trong trường hợp này.

### B. Hoàn tác khi migration thật ở các phase sau gặp lỗi nghiêm trọng:
* Chỉ sử dụng khôi phục (restore) toàn bộ cơ sở dữ liệu từ bản backup đã xác minh preflight ở Bước 2 khi migration thật ở phase sau đã apply vào database UAT và xảy ra lỗi nghiêm trọng.

---

## 8. Security & Privacy Constraints (Bảo mật & Quyền riêng tư)

* **Nguyên tắc an toàn:** Không sử dụng dữ liệu thật của công dân, không thực hiện seed dữ liệu, không tạo thông tin cá nhân (PII) thật, không dùng tên thật hoặc số điện thoại thật của công dân và cán bộ.
* **Ngôn từ sử dụng:** Mọi chỉ số trên hệ thống phân tích đất đai chỉ tạo ra các `"risk indicator / dấu hiệu cần rà soát"`, `"chỉ báo bất thường"`, `"khuyến nghị kiểm tra"`, `"cần xác minh thêm"`.
* **Cảnh báo:** Hệ thống không tự động đưa ra bất kỳ kết luận hay buộc tội sai phạm cá nhân nào của cán bộ thụ lý.
