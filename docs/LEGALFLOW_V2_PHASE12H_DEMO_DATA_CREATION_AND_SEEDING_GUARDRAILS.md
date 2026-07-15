# Hàng Rào Bảo Vệ An Toàn Tạo và Nạp Dữ Liệu Demo (Demo Data Creation & Seeding Guardrails) - Giai Đoạn 12H
## Phase 12H: Demo Data Creation and Seeding Guardrails

> [!CAUTION]
> **QUY ĐỊNH HÀNG RÀO AN TOÀN TUYỆT ĐỐI (STRICT SEEDING GUARDRAILS):**
> **Giai đoạn 12H KHÔNG THỰC HIỆN SEED DATABASE**.
> Lệnh tạo hoặc nạp dữ liệu (Seeding) chỉ được phép xem xét và thực thi tại **Phase 12I** sau khi đã có Kế hoạch Nạp Thử nghiệm (Dry-run Plan) chính thức, đã thực hiện Backup an toàn và có sự phê duyệt bằng văn bản từ Lãnh đạo/Hội đồng kỹ thuật.
> Tài liệu này thiết lập các ranh giới và quy tắc bắt buộc cho toàn bộ quy trình chuẩn bị và thao tác dữ liệu mô phỏng trong tương lai.

---

## 1. Điều Kiện Tiên Quyết Trước Khi Tạo Dữ Liệu Demo (Preconditions for Demo Data Creation)
Trước khi bất kỳ tệp dữ liệu hay script mô phỏng (`seed-uat-fo-cases.ts`) nào được khởi tạo ở giai đoạn tiếp theo, các điều kiện sau phải được đáp ứng 100%:
1. **Hoàn tất Đặc tả (Completed Specification):** Toàn bộ cấu trúc hồ sơ (`LEGALFLOW_V2_PHASE12H_DEMO_CASE_DATA_SPEC.md`) và đặc tả chứng từ (`LEGALFLOW_V2_PHASE12H_DEMO_TAX_NOTICE_AND_PAYMENT_EVIDENCE_SPEC.md`) đã được rà soát không chứa bất kỳ thông tin thực tế nào.
2. **Tuân thủ Nhãn An toàn (Safety Label Compliance):** Các mẫu dữ liệu phải tích hợp sẵn các cờ, watermark và văn bản cảnh báo `DEMO ONLY - NOT REAL CITIZEN DATA`.
3. **Môi trường Phân lập (Isolated Environment Verified):** Xác nhận rõ ràng biến môi trường `NODE_ENV` hoặc cấu hình kết nối database đang trỏ tới `legalflow_uat` hoặc `legalflow_docker_local`, tuyệt đối không kết nối với cơ sở dữ liệu production thực tế của Chi cục.

---

## 2. Điều Kiện Tiên Quyết Trước Khi Được Seed (Preconditions Before Seeding in Phase 12I)
Trước khi thực thi lệnh seed trên môi trường UAT ở Phase 12I, Quản trị viên hệ thống (DevOps/Admin) phải thực hiện tuần tự:
1. **Phê duyệt chính thức (Formal Approval):** Có quyết định hoặc biên bản phê duyệt Go/No-Go cho phép thực hiện Dry-run Seed từ Hội đồng kiểm thử UAT.
2. **Kiểm tra ranh giới dữ liệu (Data Separation Audit):** Rà soát lại script seed để đảm bảo script chỉ chèn các bản ghi có mã bắt đầu bằng `DEMO-FO-2026-xxx`.
3. **Thực hiện Sao lưu bắt buộc (Mandatory Pre-seed Backup):** Chạy lệnh sao lưu đầy đủ cơ sở dữ liệu hiện tại trước khi seed:
   ```powershell
   docker exec -t legalflow_postgres pg_dump -U legalflow_admin -d legalflow_prod -F c -b -v -f /var/lib/postgresql/data/pre_fo_seed_backup_phase12i.dump
   ```
4. **Kiểm chứng tính toàn vẹn của bản Backup:** Đảm bảo tệp dump đã được tạo thành công và có kích thước hợp lệ trước khi cho phép chạy bất kỳ thao tác `INSERT` nào.

---

## 3. Cách Tách Biệt Dữ Liệu Demo Khỏi Dữ Liệu Production (Data Isolation Strategy)
Để đảm bảo dữ liệu mô phỏng không bao giờ bị pha trộn hay gây ảnh hưởng đến dữ liệu hành chính thật, hệ thống áp dụng 3 quy tắc phân lập:
1. **Phân lập bằng Mã định danh (`Namespace Isolation`):** Mọi hồ sơ UAT phải mang tiền tố riêng biệt: `DEMO-FO-2026-xxx`. Các truy vấn báo cáo thống kê chính thức của cơ quan quản lý sẽ tự động loại trừ (exclude) các mã có tiền tố `DEMO-`.
2. **Phân lập bằng Cờ Metadata (`Metadata Flagging`):** Thêm thuộc tính `isDemoRecord = true` hoặc ghi nhận rõ nhãn `DEMO ONLY` vào trường `caseCode` và `notes` trong cơ sở dữ liệu.
3. **Phân lập bằng Tài khoản Thao tác (`Role & User Isolation`):** Dữ liệu demo chỉ được gắn cho các tài khoản kiểm thử chuyên biệt (`officer_uat`, `manager_uat`), không gắn cho tài khoản làm việc chính thức của Cán bộ thụ lý thực tế.

---

## 4. Các Lệnh Cấm Tuyệt Đối (Absolute Prohibitions)
1. **Cấm dùng dữ liệu thật:** Nghiêm cấm mọi hành vi sao chép, import hoặc gõ lại thông tin hồ sơ đất đai có thật của công dân vào bộ dữ liệu kiểm thử.
2. **Cấm seed vào Production nếu chưa có Approval:** Nghiêm cấm chạy lệnh `npm run seed` hoặc execute script chèn dữ liệu vào cơ sở dữ liệu production chính thức khi chưa hoàn tất quy trình phê duyệt an toàn.
3. **Cấm commit file chứa dữ liệu nhạy cảm hoặc mật khẩu:** Nghiêm cấm đưa các tệp `.env`, `.dump`, `.sql` chứa mật khẩu database, token xác thực hay bí mật quốc gia/cơ quan lên Git repository.
4. **Cấm phát hành Thông báo thuế thật từ dữ liệu Demo:** Nghiêm cấm sử dụng các con số chiết tính hay thông báo mô phỏng trong hệ thống để in ra giấy gửi cho người dân nộp tiền ngoài đời thực.

---

## 5. Kế Hoạch Sao Lưu và Phục Hồi (Backup & Rollback Plan cho Phase 12I)

### A. Kế hoạch Sao lưu (Pre-seed Backup Procedure)
Tại Phase 12I, trước khi thực hiện seed, Admin chạy lệnh sau để tạo bản sao lưu an toàn:
```powershell
# Chuyển vào thư mục gốc dự án
cd C:\Users\Admin\legalflow-docker-uat

# Thực hiện pg_dump lưu vào thư mục local backups/
docker exec -t legalflow_postgres pg_dump -U legalflow_admin -d legalflow_prod --clean --if-exists > backups\pre_fo_demo_seed_phase12i.sql
```

### B. Kế hoạch Khôi phục Khẩn cấp (Emergency Rollback Procedure)
Nếu quá trình seed dữ liệu demo tại Phase 12I gặp lỗi, làm sai lệch cấu trúc bảng hoặc cần dọn dẹp sạch sẽ môi trường UAT sau khi kiểm thử xong, Admin thực hiện Rollback theo 2 phương án:

#### Phương án 1: Khôi phục toàn diện từ bản sao lưu (Full Database Restore)
```powershell
# Khôi phục lại trạng thái DB sạch chính xác thời điểm trước khi seed
cat backups\pre_fo_demo_seed_phase12i.sql | docker exec -i legalflow_postgres psql -U legalflow_admin -d legalflow_prod
```

#### Phương án 2: Dọn dẹp có mục tiêu các bản ghi Demo (Targeted Demo Cleanup SQL)
Nếu chỉ muốn xóa bỏ chính xác 8 hồ sơ demo mà không làm ảnh hưởng đến các vụ việc khác trong DB:
```sql
-- Chạy bên trong psql để dọn dẹp riêng dữ liệu demo Phase 12I
BEGIN;
DELETE FROM financial_obligation_audit_logs WHERE assessment_id IN (SELECT id FROM financial_obligation_assessments WHERE "caseCode" LIKE 'DEMO-FO-%');
DELETE FROM financial_obligation_items WHERE assessment_id IN (SELECT id FROM financial_obligation_assessments WHERE "caseCode" LIKE 'DEMO-FO-%');
DELETE FROM tax_notice_records WHERE assessment_id IN (SELECT id FROM financial_obligation_assessments WHERE "caseCode" LIKE 'DEMO-FO-%');
DELETE FROM payment_evidence_records WHERE assessment_id IN (SELECT id FROM financial_obligation_assessments WHERE "caseCode" LIKE 'DEMO-FO-%');
DELETE FROM financial_obligation_assessments WHERE "caseCode" LIKE 'DEMO-FO-%';
COMMIT;
```

---

## 6. Khẳng Định Lại Nguyên Tắc Cho Phase 12H (Summary)
* **Phase 12H hiện tại:** Chỉ tạo tài liệu hàng rào bảo vệ (Guardrails doc), **chưa chạy bất kỳ lệnh backup, seed hay rollback nào ở trên**.
* **Phase 12I tiếp theo:** Sẽ căn cứ vào Kế hoạch Sao lưu và Hàng rào bảo vệ này để thực hiện Dry-run Seed một cách an toàn và chuẩn xác.
