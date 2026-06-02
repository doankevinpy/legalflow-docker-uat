# Execution Plan: Apply LandProfile Migration to UAT (Phase 10.0E)

Tài liệu này mô tả chi tiết quy trình chuẩn bị và áp dụng bản nháp migration `20260602065611_add_land_profile_model` vào cơ sở dữ liệu Postgres UAT.

---

## 1. Phân Chia Giai Đoạn (Phase Split)

Quy trình triển khai Phase 10.0E được phân chia nghiêm ngặt thành 2 giai đoạn:
* **Giai đoạn `10.0E-A` (Bước Hiện Tại):** Planning & Documentation only. Chỉ lập và phê duyệt tài liệu kế hoạch này. Tuyệt đối không chạy lệnh áp dụng database, không sửa mã nguồn runtime, không commit/push/tag.
* **Giai đoạn `10.0E-B` (Bước Thực Thi Tiếp Theo):** Apply Migration to UAT. Giai đoạn này chỉ được bắt đầu thực thi sau khi người dùng phê duyệt Phase `10.0E-A` và ra quyết định thực thi Phase `10.0E-B` riêng biệt.

---

## 2. Preflight Checklist Bắt Buộc Trước Giai Đoạn `10.0E-B`

Trước khi chạy lệnh deploy migration trên môi trường UAT, bắt buộc phải vượt qua toàn bộ các bước kiểm tra (nếu có bất kỳ bước nào thất bại, quá trình triển khai phải **dừng lập tức**, không được chạy deploy):

1. **Trạng thái Git:** Git status phải hoàn toàn sạch sẽ (`nothing to commit, working tree clean`).
2. **Docker Daemon:** Docker daemon hoạt động bình thường trên máy host.
3. **Docker Stack UAT:** Stack container Docker (Caddy, Postgres, Backend, MinIO) đang chạy healthy, postgres container map cổng 5432 cục bộ hoạt động ổn định.
4. **Xác Minh Bản Backup Gần Nhất:** Chạy script xác minh tính toàn vẹn:
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts/verify-latest-backup.ps1
   ```
   *(Yêu cầu kết quả trả về: PASS)*
5. **Kiểm Tra Sức Khỏe Backup:** Chạy script kiểm tra sức khỏe backup:
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts/check-latest-backup-health.ps1
   ```
   *(Yêu cầu kết quả trả về: PASS hoặc không báo lỗi FAIL)*
6. **Kiểm Tra Log Backup Chi Tiết:**
   * Bản backup gần nhất phải chứa tệp đánh dấu thành công `status.success`.
   * Bản backup gần nhất phải chứa tệp manifest `manifest.sha256`.
   * Không có bất kỳ tệp tin báo lỗi `status.failed` nào được tạo ra mới hơn so với bản backup thành công gần nhất.
7. **Bản Nháp Migration Có Sẵn:** Bản nháp migration `20260602065611_add_land_profile_model` tồn tại đúng cấu trúc trong repo tại thư mục `legalflow-backend/prisma/migrations/`.
8. **Trạng Thái Trước Khi Apply:** Chạy lệnh sau để xác định bản migration đang ở trạng thái pending (chưa được áp dụng):
   ```bash
   cd legalflow-backend
   npx prisma migrate status
   ```

---

## 3. Lệnh Thực Thi Migration Apply (Chỉ Áp Dụng Cho Giai Đoạn `10.0E-B`)

Lệnh áp dụng migration được lên kế hoạch thực hiện như sau (tuyệt đối không chạy ở bước `10.0E-A` hiện tại):

```powershell
cd legalflow-backend
npx prisma migrate deploy
```

> [!CAUTION]
> **Các lệnh bị CẤM tuyệt đối:**
> * `npx prisma db push`
> * `npx prisma migrate dev`
> * `npx prisma db seed`
> Không được chạy bất kỳ lệnh nạp dữ liệu hay thay đổi schema động nào khác trên DB UAT.

---

## 4. Verification Checklist (Sau Khi Áp Dụng Ở Giai Đoạn `10.0E-B`)

Sau khi thực thi lệnh deploy thành công, thực hiện quy trình xác minh tính đúng đắn:

1. **Trạng Thái Migration:** Chạy `npx prisma migrate status` và xác nhận bản migration `20260602065611_add_land_profile_model` báo cáo đã được áp dụng (`applied`).
2. **Sự Tồn Tại Bảng Cấu Trúc:** Truy vấn SQL trực tiếp để xác minh bảng `LandProfile` tồn tại:
   ```sql
   SELECT EXISTS (
       SELECT FROM information_schema.tables 
       WHERE table_schema = 'public' AND table_name = 'LandProfile'
   );
   ```
3. **Sự Tồn Tại Các Enum/Type:** Truy vấn SQL xác minh 11 enums nghiệp vụ mới tồn tại:
   ```sql
   SELECT typname FROM pg_type 
   WHERE typname IN ('LandProcedureType', 'LandType', 'PlanningStatus', 'DisputeStatus', 'OriginOfLandStatus', 'DocumentCompleteness', 'FinancialObligationStatus', 'LandOutcome', 'LandReasonCode', 'ComplaintType', 'RiskReviewStatus');
   ```
4. **Unique Index Ràng Buộc:** Xác minh unique index `LandProfile_caseId_key` tồn tại:
   ```sql
   SELECT indexname FROM pg_indexes 
   WHERE tablename = 'LandProfile' AND indexname = 'LandProfile_caseId_key';
   ```
5. **Foreign Key Liên Kết:** Xác minh foreign key `LandProfile_caseId_fkey` tới bảng `LegalCase` tồn tại:
   ```sql
   SELECT constraint_name FROM information_schema.table_constraints 
   WHERE table_name = 'LandProfile' AND constraint_name = 'LandProfile_caseId_fkey';
   ```
6. **Các Chỉ Mục (Indexes) Đơn và Composite:** Xác minh các indexes sau tồn tại trên bảng `LandProfile`:
   * Đơn: `procedureType`, `landType`, `neighborhood`, `outcome`, `reasonCode`, `complaintFlag`, `planningStatus`.
   * Composite: `(procedureType, outcome)`, `(neighborhood, outcome)`, `(landType, outcome)`, `(complaintFlag, outcome)`.
7. **Toàn Vẹn Dữ Liệu Cũ:** Số lượng bản ghi trong bảng `LegalCase` trước và sau khi deploy phải không đổi:
   ```sql
   SELECT COUNT(*) FROM "LegalCase";
   ```
8. **Không Seed Dữ Liệu Giả:** Xác nhận không có dữ liệu `LandProfile` giả nào được tạo tự động/seed trong phase này.
9. **Prisma Validate:** Lệnh `npx prisma validate` trả về trạng thái hợp lệ (PASS).
10. **Prisma Generate:** Chạy `npx prisma generate` thành công.
11. **Backend Build:** Thực hiện chạy `npm run build` trên backend thành công (PASS).
12. **Health Check:** Endpoint health `/api/health` của backend trả về trạng thái Healthy.

---

## 5. Kế Hoạch Rollback (Rollback Plan)

* **Không Rollback Tự Động:** Prisma không hỗ trợ rollback tự động cho lệnh `migrate deploy`.
* **Sự Cố Lúc Đang Áp Dụng (Migration Fail Nửa Chừng):** Dừng ngay lập tức, báo cáo chi tiết log lỗi gốc lên giao diện UAT. **Không tự ý chạy các lệnh chỉnh sửa trực tiếp DB** hoặc sửa schema thủ công.
* **Sự Cố Sau Khi Đã Áp Dụng Thành Công:** Khôi phục (restore) cơ sở dữ liệu Postgres UAT về trạng thái trước deploy từ bản backup preflight đã được xác minh (`20260602_091424`).
  * Thực hiện khôi phục chính thức qua scripts:
    ```powershell
    powershell -ExecutionPolicy Bypass -File scripts/restore-postgres-drill.ps1 -BackupName 20260602_091424
    powershell -ExecutionPolicy Bypass -File scripts/restore-minio-drill.ps1 -BackupName 20260602_091424
    ```
* **Ranh giới an toàn:**
  * Tuyệt đối không drop bảng, drop cột hoặc revert migration thủ công bằng câu lệnh SQL trực tiếp nếu chưa có phê duyệt bằng văn bản riêng.
  * Tuyệt đối không xóa bất kỳ tệp tin backup artifact nào trong quá trình xử lý sự cố.

---

## 6. Bảo Mật & Ranh Giới Dữ Liệu (Security & PII Constraints)

* **Không In Thông Tin Nhạy Cảm:** Tuyệt đối không in hoặc lưu trữ `DATABASE_URL` hoặc bất kỳ password/credential nào vào tài liệu này, log hoặc mô tả commit.
* **Không Dùng Dữ Liệu Thật:** Mọi kiểm tra không sử dụng thông tin thật của công dân, cán bộ hoặc số điện thoại thật.
* **Không Seed và Không Export PII:** Không thực hiện seed dữ liệu và không trích xuất thông tin cá nhân.
* **Wording Standards:** Không đưa ra bất kỳ kết luận buộc tội hay đánh giá mang tính phán xét cá nhân. Hệ thống phân tích Land Analytics chỉ thiết lập các `risk indicator` hoặc các `dấu hiệu cần rà soát` để hỗ trợ nghiệp vụ xác minh thêm.
