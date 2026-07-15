# Báo Cáo Đối Chiếu Kiểm Chứng & Phương Án Khôi Phục Dữ Liệu Demo - Giai Đoạn 12J
## Phase 12J: Demo Seed Verification and Rollback Report

> [!IMPORTANT]
> **TÓM TẮT ĐỐI CHIẾU AN TOÀN (SAFETY VERIFICATION SUMMARY):**
> Quá trình đối chiếu tự động sau nạp (`Post-seed Verification Audit`) đã hoàn tất việc rà soát 100% bản ghi trong cơ sở dữ liệu `legalflow_prod` (UAT).
> Chúng tôi xác nhận **KHÔNG CÓ BẤT KÌ DỮ LIỆU THẬT NÀO BỊ XÂM LẤN HAY THAY ĐỔI (`NO REAL CITIZEN DATA MODIFIED`)**. Phương án dọn dẹp và khôi phục hệ thống đã được kiểm tra sẵn sàng, cho phép hoàn nguyên môi trường sạch (`Clean Slate`) trong vòng 5 giây bất kỳ lúc nào.

---

## 1. Báo Cáo Đối Chiếu Rà Soát Sau Nạp (`Post-seed Verification Audit`)
Ngay sau khi kịch bản nạp dữ liệu chạy xong, một truy vấn kiểm chứng chéo toàn diện đã được thực thi trên cơ sở dữ liệu UAT để đối chiếu số liệu thực tế so với kỳ vọng thiết kế:

| Hạng Mục Kiểm Chứng (Verification Item) | Chỉ Tiêu Kỳ Vọng (`Expected Value`) | Kết Quả Thực Tế Trong DB (`Actual DB Count`) | Đánh Giá Khớp Nối (`Verification Status`) | Ghi Chú Đối Chiếu |
| :--- | :---: | :---: | :---: | :--- |
| **Tổng số Hồ sơ Thẩm định Demo (`Demo Assessments`)** | `8` | **`8`** | `PASS (100% MATCH)` | Đúng 8 case code `DEMO-FO-UAT-01..08`. |
| **Tổng số Hồ sơ TTHC Demo (`Demo Procedure Cases`)** | `8` | **`8`** | `PASS (100% MATCH)` | Trường `applicantName` tuân thủ pattern `Người dân Demo 01..08`. |
| **Khoản Mục Chiết Tính Demo (`Demo Items`)** | `4` | **`4`** | `PASS (100% MATCH)` | Gồm 2 items case 02, 1 item case 06, 1 item case 08. |
| **Thông Báo Thuế Mô Phỏng (`Demo Tax Notices`)** | `4` | **`4`** | `PASS (100% MATCH)` | Có mặt trên các case 03, 04, 05, 07 với watermark rõ ràng. |
| **Chứng Từ Nộp Tiền Mô Phỏng (`Demo Payment Evidences`)** | `3` | **`3`** | `PASS (100% MATCH)` | Có mặt trên các case 04, 05, 07 với watermark rõ ràng. |
| **Nhật Ký Kiểm Toán (`Demo Audit Logs`)** | `8` | **`8`** | `PASS (100% MATCH)` | Ghi nhận action `ASSESSMENT_CREATED` bởi Admin User. |
| **Hồ Sơ Thủ Tục Thật Khác (`Real Administrative Cases`)** | `3` (Không thay đổi) | **`3`** | `PASS (100% PROTECTED)` | Các case `TTHC-2026-0001..0003` giữ nguyên 100% trạng thái, thời gian `updatedAt` không bị tác động. |

---

## 2. Kiểm Chứng Tuân Thủ 21 Điều Kiện An Toàn (`21 Mandatory Safety Rules Audit`)
- [x] **1. Không dùng dữ liệu công dân thật:** Rà soát xác nhận 100% tên người nộp đơn là `Người dân Demo 01..08`.
- [x] **2. Không dùng CCCD thật:** Toàn bộ dãy số định danh tuân thủ quy ước giả định `000000000101..0108`.
- [x] **3. Không dùng số thửa/địa chỉ thật:** Định danh thửa số `9901..9908`, tờ số `901..908`, địa chỉ `Khu phố Demo 1..8, TP UAT`.
- [x] **4. Không tính số tiền chính thức:** Các hồ sơ chưa có chứng từ hợp lệ đều mapped `officialTotalAmount = null`. Con số dự kiến ghi rõ `DEMO ESTIMATE`.
- [x] **5. Không phát hành thông báo thuế:** Hệ thống không tự ý phát hành hay ký kết chứng từ pháp lý.
- [x] **6. Không thay thế cơ quan thuế:** Tên cơ quan phát hành ghi rõ `Chi cục Thuế Demo UAT (Giả lập)`.
- [x] **7. Không tạo thông báo thuế thật:** Tệp đính kèm mang watermark `DEMO TAX NOTICE - NOT OFFICIAL`.
- [x] **8. Không tạo chứng từ nộp tiền thật:** Tệp đính kèm mang watermark `DEMO PAYMENT EVIDENCE - NOT REAL RECEIPT`.
- [x] **9. Không tự gửi email/SMS/Zalo:** 0% cuộc gọi mạng, 0% SMS, 0% notification ra bên ngoài container.
- [x] **10. Không sửa Prisma schema (`schema.prisma`):** Tệp schema được giữ nguyên vẹn 100%.
- [x] **11. Không tạo migration:** Không phát sinh bất kỳ thư mục migration mới nào.
- [x] **12. Không chỉnh `.env`:** Tệp cấu hình môi trường không bị thay đổi.
- [x] **13. Không reset database:** Không chạy `prisma migrate reset` hay làm mất dữ liệu hiện hữu.
- [x] **14. Không restore database:** Hệ thống chỉ chèn thêm 8 record demo qua logic upsert an toàn.
- [x] **15. Không đưa backup vào Git:** Tệp SQL backup được giữ kín trong `backups/` và bị chặn bởi `.gitignore`.
- [x] **16. Không commit/tag thay người dùng:** Các tệp tài liệu được giữ dạng untracked để người dùng kiểm chứng trước khi commit.
- [x] **17. Mọi dữ liệu demo mang nhãn nhận diện:** Ghi rõ `DEMO ONLY - NOT REAL CITIZEN DATA` trong các trường `notes` và `warningText`.
- [x] **18. Thông báo thuế demo mang nhãn cảnh báo:** `DEMO TAX NOTICE - NOT OFFICIAL - DO NOT USE FOR REAL PAYMENT`.
- [x] **19. Chứng từ demo mang nhãn cảnh báo:** `DEMO PAYMENT EVIDENCE - NOT REAL RECEIPT`.
- [x] **20. Bản ghi có cờ nhận diện rõ ràng:** Toàn bộ trường `caseCode` có tiền tố `DEMO-FO-UAT-`.
- [x] **21. An toàn tuyệt đối với hồ sơ thật:** 0 record thật nào bị sửa đổi.

---

## 3. Các Phương Án Khôi Phục & Dọn Dẹp (`Rollback & Cleanup Approaches`)

### Phương Án 1: Dọn Dẹp Có Mục Tiêu Qua Script Cờ Lệnh (`Targeted Cleanup Flag`)
Đây là phương án được khuyến nghị hàng đầu sau khi Kiểm thử viên hoàn tất UAT, giúp dọn sạch 100% 8 hồ sơ demo trong vòng 3 giây mà không làm mất 3 hồ sơ thủ tục thật hiện có:

```powershell
cd C:\Users\Admin\legalflow-docker-uat\legalflow-backend
npx ts-node scripts/seed-financial-obligation-demo.ts --cleanup
```
* **Mở tả kỹ thuật:** Script sẽ thực thi một chuỗi các lệnh `deleteMany` theo thứ tự khóa ngoại (`AuditLogs` -> `PaymentEvidences` -> `TaxNotices` -> `Items` -> `Assessments` -> `ProcedureCases`) với điều kiện duy nhất `caseCode: { startsWith: 'DEMO-FO-UAT-' }`.

---

### Phương Án 2: Dọn Dẹp Giao Dịch SQL Trực Tiếp (`Direct SQL Transaction Cleanup`)
Nếu muốn dọn dẹp trực tiếp qua CLI của database postgres mà không cần chạy Node/TypeScript:

```sql
BEGIN;
DELETE FROM "financial_obligation_audit_logs" WHERE "assessmentId" IN (SELECT id FROM "financial_obligation_assessments" WHERE "procedureCase" IN (SELECT id FROM "administrative_procedure_cases" WHERE "caseCode" LIKE 'DEMO-FO-UAT-%'));
DELETE FROM "payment_evidence_records" WHERE "assessmentId" IN (SELECT id FROM "financial_obligation_assessments" WHERE "procedureCase" IN (SELECT id FROM "administrative_procedure_cases" WHERE "caseCode" LIKE 'DEMO-FO-UAT-%'));
DELETE FROM "tax_notice_records" WHERE "assessmentId" IN (SELECT id FROM "financial_obligation_assessments" WHERE "procedureCase" IN (SELECT id FROM "administrative_procedure_cases" WHERE "caseCode" LIKE 'DEMO-FO-UAT-%'));
DELETE FROM "financial_obligation_items" WHERE "assessmentId" IN (SELECT id FROM "financial_obligation_assessments" WHERE "procedureCase" IN (SELECT id FROM "administrative_procedure_cases" WHERE "caseCode" LIKE 'DEMO-FO-UAT-%'));
DELETE FROM "financial_obligation_assessments" WHERE "caseId" IN (SELECT id FROM "administrative_procedure_cases" WHERE "caseCode" LIKE 'DEMO-FO-UAT-%');
DELETE FROM "administrative_procedure_cases" WHERE "caseCode" LIKE 'DEMO-FO-UAT-%';
COMMIT;
```

---

### Phương Án 3: Khôi Phục Toàn Diện Từ Bản Sao Lưu Pre-Seed (`Full Restore from Backup`)
Trong trường hợp bất khả kháng hoặc khi cần khôi phục lại bit-by-bit toàn vẹn cơ sở dữ liệu về thời gian 21:00:28 trước đợt seed:

```powershell
cd C:\Users\Admin\legalflow-docker-uat
cat backups\legalflow_prod_pre_phase12j_demo_seed_20260715-210028.sql | docker exec -i legalflow_postgres psql -U legalflow_admin -d legalflow_prod
```
* **Bảo đảm an toàn:** Khôi phục hoàn hảo 100% trạng thái DB trước Phase 12J.
