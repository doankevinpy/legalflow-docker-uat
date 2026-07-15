# Kế Hoạch Khôi Phục & Dọn Dẹp Dữ Liệu Demo Nạp Thử Nghiệm (Rollback & Cleanup Plan) - Giai Đoạn 12I
## Phase 12I: Demo Seed Rollback and Cleanup Plan

> [!IMPORTANT]
> **NGUYÊN TẮC KHÔI PHỤC VÀ DỌN DẸP (ROLLBACK PRINCIPLES):**
> Kế hoạch Rollback và Cleanup được xây dựng dựa trên nguyên tắc **AN TOÀN TUYỆT ĐỐI VÀ KHÔNG XÂM LẤN (`ABSOLUTE SAFETY & NON-INVASIVE PRINCIPLE`)**.
> Khi tiến hành xóa bỏ dữ liệu thử nghiệm, hệ thống **CHỈ ĐƯỢC PHÉP XÓA CÁC BẢN GHI DEMO (`DEMO-FO-UAT-xxx`)**, tuyệt đối không được xóa nhầm hay làm sai lệch bất kỳ bản ghi hồ sơ hành chính thật nào (`TTHC-xxx`) đang tồn tại trong cơ sở dữ liệu.

---

## 1. Cách Nhận Diện & Quy Ước Đặt Tên Bản Ghi Demo (Demo Data Naming Convention & Identification)
Toàn bộ bản ghi mô phỏng được tạo ra trong quá trình seed dry-run (tại Phase 12J) bắt buộc phải tuân thủ nghiêm ngặt quy ước mã hóa định danh phân lập:
* **Tiền tố chuẩn cho trường `caseCode` (Mandatory Namespace Prefix):**
  - `DEMO-FO-UAT-01`
  - `DEMO-FO-UAT-02`
  - `DEMO-FO-UAT-03`
  - `DEMO-FO-UAT-04`
  - `DEMO-FO-UAT-05`
  - `DEMO-FO-UAT-06`
  - `DEMO-FO-UAT-07`
  - `DEMO-FO-UAT-08`
* **Quy tắc cấm (Prohibition):** Không được dùng các định dạng mã dễ gây nhầm lẫn với hồ sơ thực tế (ví dụ: cấm dùng `2026-0001`, `FO-001`, `HS-123`).
* **Cách nhận diện bằng SQL Audit:** Mọi truy vấn kiểm toán và dọn dẹp sẽ căn cứ duy nhất vào điều kiện `WHERE "caseCode" LIKE 'DEMO-FO-UAT-%'`.

---

## 2. Các Điều Kiện Kích Hoạt Dọn Dẹp (Cleanup & Rollback Trigger Conditions)
Quy trình Rollback hoặc Cleanup sẽ được Quản trị viên kích hoạt ngay lập tức khi xảy ra một trong 4 tình huống sau:
1. **Hoàn tất kiểm thử UAT (Post-UAT Clean Slate):** Sau khi Kiểm thử viên đã hoàn thành rà soát và nghiệm thu 14 bài kiểm thử E2E trên giao diện live, cần dọn dẹp trả lại môi trường sạch sẽ.
2. **Nạp dữ liệu bị lỗi (Seeding Failure / Partial Seed):** Quá trình chạy script seed bị gián đoạn giữa chừng gây ra trạng thái dữ liệu rác hoặc không nhất quán.
3. **Phát hiện cấu trúc sai lệch (Schema/Payload Mismatch):** Phát hiện số liệu hoặc cờ trạng thái không khớp với bảng ánh xạ (`LEGALFLOW_V2_PHASE12I_DEMO_SEED_DATA_MAPPING.md`).
4. **Vi phạm điều kiện an toàn (Safety Violation Alert):** Phát hiện có tệp tin hoặc ghi chú bị thiếu nhãn `DEMO ONLY` hoặc có dấu hiệu lẫn thông tin nhạy cảm.

---

## 3. Các Phương Án Khôi Phục & Dọn Dẹp (Rollback Options)

### Phương Án 1: Khôi Phục Toàn Diện Từ Bản Sao Lưu (`Full Backup Restore Option`)
Khuyến nghị áp dụng khi quá trình seed gây lỗi nghiêm trọng toàn hệ thống hoặc khi muốn khôi phục cơ sở dữ liệu về chính xác thời điểm 100% trước khi chạy lệnh nạp.

```powershell
# Bước 1: Ngắt kết nối các session đang mở vào DB (nếu cần thiết) hoặc restart container
docker restart legalflow_postgres

# Bước 2: Phục hồi toàn vẹn từ tệp backup đã tạo trước seed (Pre-seed Backup)
cat backups\pre_fo_seed_execution_phase12j.sql | docker exec -i legalflow_postgres psql -U legalflow_admin -d legalflow_prod
```
*Ghi chú:* Phương án này bảo đảm hoàn nguyên `100% bit-by-bit state` của database.

---

### Phương Án 2: Dọn Dẹp Có Mục Tiêu (`Targeted Delete Option`)
Khuyến nghị áp dụng khi cơ sở dữ liệu có chứa cả các hồ sơ thủ tục hành chính thật khác (không thuộc module nghĩa vụ tài chính demo) và Quản trị viên **chỉ muốn xóa chính xác 08 hồ sơ `DEMO-FO-UAT-01..08`** cùng các bản ghi con liên quan (`Cascade Delete`).

Thực hiện chạy đoạn script SQL giao dịch an toàn sau đây bên trong container `postgres`:

```sql
-- Kịch bản dọn dẹp có mục tiêu an toàn (Targeted Demo Cleanup Transaction)
BEGIN;

-- 1. Xóa nhật ký kiểm toán của các hồ sơ demo
DELETE FROM "financial_obligation_audit_logs"
WHERE "assessment_id" IN (
    SELECT "id" FROM "financial_obligation_assessments"
    WHERE "caseCode" LIKE 'DEMO-FO-UAT-%'
);

-- 2. Xóa các khoản mục chiết tính chi tiết của hồ sơ demo
DELETE FROM "financial_obligation_items"
WHERE "assessment_id" IN (
    SELECT "id" FROM "financial_obligation_assessments"
    WHERE "caseCode" LIKE 'DEMO-FO-UAT-%'
);

-- 3. Xóa các bản ghi thông báo thuế mô phỏng của hồ sơ demo
DELETE FROM "tax_notice_records"
WHERE "assessment_id" IN (
    SELECT "id" FROM "financial_obligation_assessments"
    WHERE "caseCode" LIKE 'DEMO-FO-UAT-%'
);

-- 4. Xóa các bản ghi chứng từ nộp tiền mô phỏng của hồ sơ demo
DELETE FROM "payment_evidence_records"
WHERE "assessment_id" IN (
    SELECT "id" FROM "financial_obligation_assessments"
    WHERE "caseCode" LIKE 'DEMO-FO-UAT-%'
);

-- 5. Cuối cùng, xóa chính 8 bản ghi hồ sơ thẩm định gốc
DELETE FROM "financial_obligation_assessments"
WHERE "caseCode" LIKE 'DEMO-FO-UAT-%';

-- Xác nhận hoàn tất giao dịch
COMMIT;
```

---

## 4. Kiểm Chứng Sau Khôi Phục & Ghi Chú Kiểm Toán (Post-Cleanup Verification & Audit Note)
Sau khi thực thi `Full Restore` hoặc `Targeted Delete`, Quản trị viên bắt buộc phải chạy lệnh SQL xác minh số lượng bản ghi demo còn lại trong hệ thống:

```sql
SELECT count(*) AS remaining_demo_records 
FROM "financial_obligation_assessments" 
WHERE "caseCode" LIKE 'DEMO-FO-UAT-%';
```
* **Kỳ vọng bảo đảm (Safety Guarantee):** Kết quả trả về phải chính xác bằng `0`.
* **Khẳng định bảo vệ dữ liệu thật (No Real Data Deletion Guarantee):** Các truy vấn dọn dẹp trên được ràng buộc khóa ngoại lệ chặt chẽ với mẫu chuỗi `'DEMO-FO-UAT-%'`, bảo đảm tuyệt đối không chạm vào hay làm mất mát bất kỳ vụ việc thực tế nào của công dân.
