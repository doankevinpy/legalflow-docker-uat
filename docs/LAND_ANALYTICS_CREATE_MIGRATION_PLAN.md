# Kế hoạch Phase 10.0D: Create LandProfile Migration File Only

**Phase**: 10.0D — Create LandProfile Migration File Only  
**Status**: Planning & Design Phase (No actual database schema modifications, file changes, or commands executed yet)  
**Date**: 2026-06-02  
**Wording Standard Compliance**: Strictly using neutral terms like `risk indicator`, `dấu hiệu cần rà soát`, `chỉ báo bất thường`, `khuyến nghị kiểm tra`, `cần xác minh thêm`. Fully avoiding accusatory language.

---

## 1. Phase Split (Phân chia các chặng thực hiện)

Để đảm bảo kiểm soát an toàn tuyệt đối, Phase 10.0D được chia làm 2 chặng độc lập:

1. **`10.0D-A` (Planning/Documentation Only - Chặng hiện tại):**
   * *Mục tiêu:* Chỉ lập kế hoạch, viết tài liệu thiết kế.
   * *Ranh giới an toàn:* Tuyệt đối không chỉnh sửa tệp `schema.prisma`, không chạy bất kỳ lệnh Prisma nào (bao gồm cả lệnh create-only), không tạo tệp migration thực tế, và không commit mã nguồn khi chưa được phê duyệt.
2. **`10.0D-B` (Create Migration File Only - Chặng tiếp theo):**
   * *Mục tiêu:* Thực hiện sửa `schema.prisma`, chạy Prisma validate/generate và chạy lệnh tạo tệp migration SQL nháp.
   * *Ranh giới an toàn:* Chỉ được thực thi khi nhận được phê duyệt độc lập bằng văn bản từ người dùng. Không chạy lệnh `migrate deploy` hoặc áp dụng thay đổi vào cơ sở dữ liệu thật trong Phase 10.0D.

---

## 2. Backup-Before-Migration Preflight (Kiểm tra an toàn bản sao lưu)

Trước khi thực hiện chỉnh sửa tệp `schema.prisma` hoặc chạy lệnh create-only ở chặng `10.0D-B`, hệ thống bắt buộc phải vượt qua các kiểm tra an toàn sau:

1. **Xác minh Git Status:**
   * Trạng thái git của repository phải hoàn toàn sạch sẽ (`working tree clean`).
2. **Kiểm tra sức khỏe bản sao lưu database UAT:**
   * Thư mục backup gần nhất trong `LegalFlow_ARTIFACTS/backups` phải chứa đầy đủ tệp `status.success` và tệp checksum `manifest.sha256`.
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
3. **Quyết định:** Nếu có bất kỳ lỗi hoặc cảnh báo nào trong preflight check, hệ thống bắt buộc phải dừng toàn bộ phase và không thực hiện bất kỳ thay đổi nào.

---

## 3. Schema Patch Plan (Kế hoạch Patch cho schema.prisma)

Dưới đây là mô tả patch dự kiến sẽ được thêm vào tệp `schema.prisma` khi thực thi chặng `10.0D-B`, tuyệt đối không thay đổi tệp thật trong chặng hiện tại:

### A. Danh sách các Enum mới thêm vào (11 Enums):
1. `LandProcedureType`: Loại thủ tục hành chính đất đai.
2. `LandType`: Phân loại nhóm loại đất.
3. `PlanningStatus`: Tình trạng thửa đất nằm trong hay ngoài quy hoạch.
4. `DisputeStatus`: Tình trạng thửa đất có tranh chấp hay không.
5. `OriginOfLandStatus`: Nguồn gốc pháp lý sử dụng đất.
6. `DocumentCompleteness`: Độ hoàn thiện hồ sơ giấy tờ đầu vào.
7. `FinancialObligationStatus`: Trạng thái thực hiện nghĩa vụ thuế/tài chính liên quan.
8. `LandOutcome`: Kết quả giải quyết cuối cùng (chấp thuận, từ chối, chuyển trả).
9. `LandReasonCode`: Mã hóa các lý do chính khiến hồ sơ bị từ chối hoặc chuyển trả.
10. `ComplaintType`: Loại đơn thư khiếu nại, tố cáo, phản ánh đi kèm.
11. `RiskReviewStatus`: Trạng thái rà soát các chỉ báo bất thường của hồ sơ.

### B. Cấu trúc model `LandProfile` đề xuất:
Model này chứa đầy đủ 22 trường thuộc tính cần thiết (`id`, `caseId`, `procedureType`, `landType`, `currentLandUseType`, `requestedLandUseType`, `area`, `neighborhood`, `planningStatus`, `disputeStatus`, `originOfLandStatus`, `documentCompleteness`, `financialObligationStatus`, `outcome`, `reasonCode`, `complaintFlag`, `complaintType`, `processingDays`, `overdueDays`, `riskReviewStatus`, `createdAt`, `updatedAt`).

### C. Mối quan hệ Optional & Tính an toàn dữ liệu:
* Trường `landProfile LandProfile?` trên model `LegalCase` được cấu hình dạng **optional** (nullable).
* Các hồ sơ cũ hoặc vụ việc thuộc lĩnh vực khác không bắt buộc phải có `LandProfile`.
* Migration không phá dữ liệu cũ, hỗ trợ backfill dần dần và hoàn toàn không thay đổi logic xử lý vụ việc hiện tại của hệ thống.
* **Join Strategy:** Đối với phân tích cán bộ thụ lý (`assignedToId` từ `LegalCase`), hệ thống đề xuất sử dụng phép `JOIN` SQL dựa trên indexes đơn thay vì nhân bản trùng lặp trường sang bảng `LandProfile`.

---

## 4. Create-Only Command Plan (Kế hoạch chạy lệnh tạo Migration)

* **Lệnh dự kiến:**
  ```bash
  npx prisma migrate dev --name add_land_profile_model --create-only
  ```
* **Lưu ý quan trọng:**
  * Lệnh này sẽ tạo ra một thư mục migration mới cùng tệp `migration.sql` định nghĩa câu lệnh SQL nháp trong repository.
  * Chỉ được phép chạy lệnh này trong chặng `10.0D-B` sau khi được người dùng phê duyệt riêng.
  * Sau khi tệp SQL nháp được tạo ra, lập tức mở file để review nội dung mã lệnh SQL (đảm bảo chỉ có lệnh `CREATE TABLE`, `CREATE INDEX` an toàn) trước khi tiến hành apply vào database thật.
  * Tuyệt đối không chạy lệnh `npx prisma migrate deploy` hoặc các lệnh apply database thật trong Phase 10.0D.

---

## 5. Rollback Plan (Phương án hoàn tác)

### A. Rollback khi quá trình tạo Migration nháp (Create-only) có vấn đề:
Vì câu lệnh create-only chưa tác động hay ghi bất kỳ thay đổi nào vào cơ sở dữ liệu thật, rollback sẽ được thực hiện trực tiếp trên mã nguồn:
1. Khôi phục tệp `schema.prisma` gốc thông qua lệnh:
   ```bash
   git checkout -- prisma/schema.prisma
   ```
2. Thực hiện xóa thư mục migration nháp mới được sinh ra trong đường dẫn `legalflow-backend/prisma/migrations/`.
3. Chạy `git status` để đảm bảo repo quay về trạng thái sạch sẽ ban đầu.
4. Tuyệt đối không đụng vào database và không thực hiện restore DB trong trường hợp này.

### B. Rollback khi migration thật ở phase sau gặp lỗi nghiêm trọng:
* Chỉ áp dụng restore database UAT từ bản backup preflight đã được xác minh khi quá trình chạy migration thật ở phase tiếp theo xảy ra lỗi nghiêm trọng ảnh hưởng đến hệ thống.

---

## 6. Kế hoạch xác minh dự kiến cho Chặng 10.0D-B (Verification Plan)

Khi được phê duyệt thực hiện chặng `10.0D-B` ở phase tiếp theo, quy trình xác minh bắt buộc bao gồm:
1. Chạy Preflight Check bản backup thành công (`status.success`, `manifest.sha256`, `verify-latest-backup.ps1` PASS, `check-latest-backup-health.ps1` không FAIL) và `git status` clean.
2. Thực hiện sửa đổi tệp `schema.prisma` và chạy lệnh `npx prisma validate` kiểm tra cú pháp.
3. Chạy `npx prisma generate` cập nhật Prisma Client.
4. Chạy lệnh `npx prisma migrate dev --name add_land_profile_model --create-only` sinh SQL nháp.
5. Mở tệp SQL ra để kiểm duyệt nội dung câu lệnh SQL tạo bảng.
6. Chạy `git diff --stat` kiểm tra chính xác các file bị sửa đổi và file mới sinh ra.
7. Chạy quét bảo mật (Secret & PII scan) trên toàn bộ thư mục migration mới.
8. Cam kết không chạy seed dữ liệu và không sửa đổi bất kỳ mã nguồn backend/frontend runtime nào.

---

## 7. Safety Language & Disclaimer (Bảo mật & Ngôn từ an toàn)

* **Nguyên tắc an toàn:** Không sử dụng dữ liệu thật của công dân, không tạo thông tin cá nhân (PII) thật, không dùng tên thật hoặc số điện thoại thật trong bất kỳ kịch bản thử nghiệm nào.
* **Ngôn từ sử dụng:** Mọi chỉ số trên hệ thống phân tích đất đai chỉ tạo ra các `"risk indicator / dấu hiệu cần rà soát"`, `"chỉ báo bất thường"`, `"khuyến nghị kiểm tra"`, `"cần xác minh thêm"`.
* **Cảnh báo:** Hệ thống không tự động đưa ra bất kỳ kết luận hay buộc tội sai phạm cá nhân nào của cán bộ thụ lý.
