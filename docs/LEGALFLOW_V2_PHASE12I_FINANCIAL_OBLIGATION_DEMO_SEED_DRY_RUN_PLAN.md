# Kế Hoạch Nạp Thử Nghiệm Dữ Liệu Kiểm Thử Mẫu (Demo Data Seed Dry-run Plan) - Giai Đoạn 12I
## Phase 12I: Financial Obligation Demo Data Seed Dry-run Plan

> [!IMPORTANT]
> **TÍNH CHẤT GIAI ĐOẠN 12I (DOCS-ONLY DRY-RUN SEED PLAN):**
> Phase 12I lập kế hoạch chi tiết, kiểm chứng an toàn và chạy thử nghiệm trên quy trình cho việc nạp dữ liệu mô phỏng (Dry-run Seeding) đối với 8 kịch bản kiểm thử mẫu `FO-UAT-01` đến `FO-UAT-08` của phân hệ "Hỗ trợ nghĩa vụ tài chính".
> Giai đoạn này tuân thủ tuyệt đối nguyên tắc **KHÔNG SEED DATABASE THẬT TRONG PHASE NÀY**, **KHÔNG TẠO DỮ LIỆU TRONG DB**, **KHÔNG SỬA CODE** và **KHÔNG TẠO MIGRATION/SCHEMA**. Toàn bộ dữ liệu thiết kế khi chuẩn bị nạp phải được dán các nhãn bắt buộc: **`DEMO ONLY - NOT REAL CITIZEN DATA`**, **`DEMO TAX NOTICE - NOT OFFICIAL`**, **`DEMO PAYMENT EVIDENCE - NOT REAL RECEIPT`** và **`DEMO ESTIMATE - NOT OFFICIAL AMOUNT`**.

---

## 1. Mục Đích (Purpose)
* **Quy chuẩn hóa quy trình nạp thử nghiệm (Standardize Dry-run Seeding):** Xác lập các bước chuẩn bị, rà soát trước nạp (Pre-seed Audit), kịch bản nạp kiểm soát và xác minh sau nạp (Post-seed Verification) cho bộ 8 hồ sơ kiểm thử mẫu.
* **Thiết lập chốt chặn an toàn nhiều lớp (Multi-layer Safety Gates):** Đảm bảo không có bất kỳ rủi ro rò rỉ dữ liệu thật, không ghi đè số tiền pháp lý chính thức và có sẵn cơ chế sao lưu/khôi phục trước khi cho phép chạm vào cơ sở dữ liệu ở giai đoạn tiếp theo.
* **Tạo tiền đề cho nghiệm thu Pilot (Prepare for Pilot UAT E2E):** Chuẩn bị sẵn sàng bộ dữ liệu kiểm thử đạt chuẩn để chuyển sang thi hành seed chính thức tại Phase 12J, qua đó mở khóa (`unblock`) việc rà soát E2E trên giao diện live.

---

## 2. Đường Cơ Sở Hệ Thống (Baseline Check)
* **Git Repository:** `C:\Users\Admin\legalflow-docker-uat`
* **Current Branch:** `main`
* **Latest Tag (Phase 12H Baseline):** `v2.12.7-financial-obligation-demo-data-preparation-plan`
* **Working Tree Status:** Clean (Không có uncommitted code changes trước khi khởi tạo tài liệu Phase 12I).
* **Scope of Changes in Phase 12I:** Chỉ tạo mới 05 tài liệu markdown quy định kế hoạch seed dry-run trong thư mục `docs/`.

---

## 3. Mục Tiêu Nạp Thử Nghiệm Dữ Liệu Demo (Demo Seed Objective)
Mục tiêu cốt lõi của Kế hoạch Seed Dry-run là đảm bảo cấu trúc dữ liệu của 8 case mẫu khi nạp vào các bảng (`financial_obligation_assessments`, `tax_notice_records`, `payment_evidence_records`) sẽ hoàn toàn chính xác về mặt định danh, cờ trạng thái nghiệp vụ và đáp ứng 100% các tiêu chí an toàn trước khi chạy nạp thực tế.

---

## 4. Phạm Vi Nạp Dữ Liệu (Seed Scope)
Phạm vi nạp dữ liệu mô phỏng bao gồm đúng 8 kịch bản kiểm thử nghiệp vụ đã được đặc tả tại Phase 12H:
1. `FO-UAT-01` - Cấp GCN lần đầu, thiếu thông tin nghĩa vụ tài chính (Kiểm thử chốt chặn thiếu thông tin thửa đất tính thuế).
2. `FO-UAT-02` - Chuyển mục đích sử dụng đất, có bản dự kiến AI (Kiểm thử hiển thị nhãn `DEMO ESTIMATE - NOT OFFICIAL AMOUNT`).
3. `FO-UAT-03` - Có thông báo thuế demo nhưng chưa có chứng từ demo (Kiểm thử khóa nút hoàn thành khi chưa nộp tiền).
4. `FO-UAT-04` - Có chứng từ demo nhưng chưa officer verified (Kiểm thử chốt chặn xác nhận con người `isOfficerVerified`).
5. `FO-UAT-05` - Đủ thông báo thuế demo, chứng từ demo, officer verified (Kiểm thử luồng hoàn thành thành công - Happy Path).
6. `FO-UAT-06` - Không phát sinh nghĩa vụ tài chính / miễn nộp (`isExempt = true`).
7. `FO-UAT-07` - Có miễn/giảm/ghi nợ cần cán bộ kiểm tra (`isDebt = true`, chờ phê duyệt kép Lãnh đạo `managerVerify`).
8. `FO-UAT-08` - Chỉ có AI draft, không được completed (Kiểm thử chốt chặn cấm hoàn thành trên bản dự kiến của AI).

---

## 5. Ngoài Phạm Vi (Out of Scope)
* **Không seed database thực tế:** Phase 12I chỉ thiết kế kế hoạch và quy trình Dry-run, tuyệt đối không thực thi lệnh chèn dữ liệu (`INSERT/SEED`) vào bất kỳ container database nào.
* **Không can thiệp cấu trúc DB:** Không tạo mới bảng, không thay đổi trường (`No Schema/Migration Changes`).
* **Không nạp dữ liệu production:** Không nạp vào môi trường sản xuất thật của Chi cục Thuế hay Văn phòng Đăng ký đất đai.
* **Không tạo hồ sơ công dân thật:** Tuyệt đối không import bất kỳ dữ liệu thật nào của công dân.

---

## 6. Quy Tắc An Toàn (Safety Rules)
1. Chỉ tạo/cập nhật tài liệu trong `docs/`.
2. Không sửa backend (`legalflow-backend`).
3. Không sửa frontend (`src`).
4. Không sửa Prisma schema (`schema.prisma`).
5. Không tạo migration.
6. Không chỉnh `.env`.
7. Không reset database.
8. Không restore database.
9. **Không seed database trong phase 12I này.**
10. Không tạo dữ liệu thật của công dân.
11. Không tính toán số tiền chính thức mang tính pháp lý.
12. Không phát hành thông báo thuế.
13. Không thay thế cơ quan thuế.
14. Không tự đánh dấu hồ sơ thật đã hoàn thành nghĩa vụ tài chính.
15. Không tự gửi email/SMS/Zalo cho công dân.
16. Không ghi password/token/secret.
17. Không commit/tag thay cho người dùng.
18. Không đưa backup hoặc dữ liệu thật vào Git.
19. Mọi dữ liệu demo phải có nhãn rõ ràng: `DEMO ONLY - NOT REAL CITIZEN DATA`.

---

## 7. Quy Tắc Bảo Mật & Riêng Tư (Privacy Rules)
* **Không dùng tên thật:** Tất cả hồ sơ nạp thử nghiệm bắt buộc sử dụng tên `Người dân Demo 01` đến `Người dân Demo 08`.
* **Không dùng CCCD thật:** Sử dụng dãy số giả định định dạng `000000000101` đến `000000000108`.
* **Không dùng số thửa thật:** Sử dụng các số thửa giả định (`Thửa số 9901` đến `9908`).
* **Không dùng địa chỉ thật chi tiết:** Sử dụng địa chỉ cấp chung chung (`Khu phố Demo 1..8, Phường Kiểm Thử, TP UAT`).

---

## 8. Yêu Cầu Sao Lưu Trước Khi Seed Thực Tế (Backup Requirement Before Actual Seed)
Trước khi được phép chạy lệnh seed ở Phase tiếp theo (Phase 12J), Quản trị viên hệ thống bắt buộc phải thực hiện sao lưu toàn vẹn dữ liệu database bằng lệnh `pg_dump`:
```powershell
docker exec -t legalflow_postgres pg_dump -U legalflow_admin -d legalflow_prod --clean --if-exists > backups\pre_fo_seed_execution_phase12j.sql
```
*Yêu cầu:* Tệp backup phải được xác minh tồn tại, kích thước > 0KB trước khi cho phép tiến hành seed.

---

## 9. Yêu Cầu Kế Hoạch Khôi Phục (Rollback Requirement)
Kế hoạch seed phải đi kèm một quy trình khôi phục (`Rollback Plan`) rõ ràng và có thể thực thi ngay lập tức trong trường hợp nạp dữ liệu thất bại hoặc cần dọn dẹp sạch môi trường UAT. Có 2 cơ chế Rollback bắt buộc phải chuẩn bị:
1. **Rollback bằng SQL Targeted Cleanup:** Xóa chính xác các bản ghi mang tiền tố `DEMO-FO-UAT-xxx` mà không chạm vào các dữ liệu khác.
2. **Rollback bằng Full Database Restore:** Phục hồi toàn vẹn từ tệp `pre_fo_seed_execution_phase12j.sql`.

---

## 10. Các Điều Kiện Dừng Khẩn Cấp (Mandatory Stop Conditions)
Khi bước sang giai đoạn seed thực thi (Phase 12J), Quản trị viên và Cán bộ kiểm thử **BẮT BUỘC PHẢI DỪNG NGAY LẬP TỨC (`STOP ALL SEEDING ACTIONS`)** nếu phát hiện bất kỳ một trong 8 điều kiện vi phạm dưới đây:
1. **Chưa có backup plan:** Chưa thực hiện hoặc chưa xác minh thành công tệp sao lưu database trước khi seed.
2. **Chưa có rollback plan:** Chưa chuẩn bị sẵn kịch bản và câu lệnh Rollback/Cleanup đã kiểm chứng.
3. **Có dữ liệu thật:** Phát hiện bất kỳ tên công dân, CCCD, số điện thoại hay thông tin thửa đất có thật nào trong tập dữ liệu chuẩn bị nạp.
4. **Thiếu nhãn DEMO:** Hồ sơ demo hoặc payload nạp thiếu chuỗi cảnh báo `DEMO ONLY - NOT REAL CITIZEN DATA`.
5. **Có official amount gây hiểu nhầm:** Trường số tiền chính thức (`officialAmount`) bị điền tự động từ AI draft hoặc số liệu mô phỏng không rõ ràng gây hiểu nhầm là nghĩa vụ thuế có thật.
6. **Có thông báo thuế demo nhưng không ghi `NOT OFFICIAL`:** Tệp hoặc bản ghi thông báo thuế mô phỏng không chứa văn bản cảnh báo `DEMO TAX NOTICE - NOT OFFICIAL`.
7. **Có chứng từ demo nhưng không ghi `NOT REAL RECEIPT`:** Tệp hoặc bản ghi chứng từ thanh toán mô phỏng không chứa văn bản cảnh báo `DEMO PAYMENT EVIDENCE - NOT REAL RECEIPT`.
8. **Seed vào production khi chưa có approval:** Phát hiện môi trường thực thi là cơ sở dữ liệu production thực tế của Chi cục hoặc chưa có văn bản phê duyệt cho phép nạp thử nghiệm từ Lãnh đạo.
