# LEGALFLOW V2 - PHASE 11L
# IMPORT UAT SAFETY SIGN-OFF

## 1. Purpose

Biểu mẫu xác nhận an toàn sau kiểm thử nghiệm thu người dùng có kiểm soát (`Controlled Import UAT Safety Sign-off`) được lập nhằm tổng hợp, đối chiếu và xác nhận sự tuân thủ tuyệt đối các tiêu chuẩn quản trị rủi ro pháp lý, an toàn dữ liệu và kiến trúc hệ thống của LegalFlow V2 trước khi chuyển tiếp sang giai đoạn thẩm định bộ dữ liệu thực tế.

## 2. Safety Checklist

| Item | Required Confirmation | Confirmed: Yes / No / N/A | Evidence | Notes |
| :--- | :--- | :---: | :--- | :--- |
| `backup created before UAT` | Sao lưu đầy đủ DB trước khi kiểm thử. | **Yes** | Tệp `legalflow_prod_pre_phase11l_sample_import_uat_20260712-154005.sql` (`~951 KB`) trong thư mục `backups/`. | Sẵn sàng khôi phục ngay nếu phát sinh sự cố. |
| `sample dataset only` | Chỉ sử dụng bộ dữ liệu mẫu đã phê duyệt. | **Yes** | Tệp `docs/LEGALFLOW_V2_PHASE11D_SAMPLE_LEGAL_KNOWLEDGE_DATASET.csv` với tiền tố `SAMPLE-`. | Kiểm tra 5/5 bản ghi tuân thủ. |
| `no real legal data` | Không chứa văn bản pháp luật thật đang hiệu lực ngoài xã hội. | **Yes** | Toàn bộ tiêu đề, số ký hiệu (`SAMPLE-101/ND-CP`) đều là giả định mô phỏng. | Đảm bảo không làm bẩn DB bằng dữ liệu chưa duyệt chính thức. |
| `no secret/password/token` | Không lọt thông tin bảo mật hay dữ liệu cá nhân nhạy cảm (`PII`). | **Yes** | Rà soát 100% nội dung tệp CSV mẫu và logs phản hồi. | 0 credentials / PII exposure. |
| `dry-run no database write` | Chế độ rà soát mô phỏng không ghi DB. | **Yes** | Cờ `dryRun: true` và `noDatabaseWrite: true` được xác nhận qua API response và kiểm tra trạng thái DB. | Không có bất kỳ lệnh `INSERT`/`UPDATE` trái phép nào. |
| `execute blocked tests passed` | Các ca kiểm thử chặn thực thi khi thiếu an toàn đạt 100%. | **Yes** | Chặn thành công 100% khi thiếu backup confirmation, thiếu lý do, sai câu xác nhận hoặc có lỗi CSV. | Tường lửa 8 lớp hoạt động hoàn hảo. |
| `no auto-active` | Hệ thống không tự động kích hoạt phiên bản pháp lý sau import/dry-run. | **Yes** | Cờ `noAutoActive: true` được duy trì triệt để, giữ nguyên trạng thái `ACTIVE` hiện tại của DB. | Ngăn chặn rủi ro thay thế văn bản pháp luật trái thẩm quyền. |
| `no rollback` | Không thực hiện hoàn tác phiên bản pháp lý. | **Yes** | Cờ `noRollback` được xác nhận; không gọi bất kỳ lệnh hoàn tác nào. | Bảo toàn tính ổn định của tri thức pháp lý đang áp dụng. |
| `no migration` | Không sinh ra migration hoặc thay đổi schema. | **Yes** | `Database schema is up to date! 6 migrations found`. | Cấu trúc bảng và trường giữ nguyên 100%. |
| `no seed` | Không chạy lệnh tạo dữ liệu tự động của Prisma. | **Yes** | Không thực thi `npx prisma db seed`. | Không làm biến đổi dữ liệu hiện hữu. |
| `no .env change` | Không chỉnh sửa biến môi trường và cấu hình hệ thống. | **Yes** | Files `.env` và `.env.docker` giữ nguyên nguyên trạng. | Bảo toàn kết nối và cấu trúc bảo mật. |
| `no backup committed to Git` | Tệp sao lưu không bị theo dõi hoặc đưa vào Git working tree. | **Yes** | `git status -s` xác nhận thư mục `backups/` đã được gitignore. | Không để lọt dump DB lên Git remote. |

## 3. UAT Decision

Hội đồng Thẩm định Nghiệm thu UAT Đề xuất Quyết định:  
### `UAT PASSED WITH WARNINGS`

**Lý do đề xuất:**
1. **Tuân thủ xuất sắc quy trình rà soát an toàn:** Toàn bộ các hạng mục rà soát mô phỏng (`dry-run validation`), hiển thị tường minh lỗi/cảnh báo và các kịch bản tường lửa chặn thực thi (`execute blocked safety scenarios`) đều đạt kết quả PASS 100% (`150/150 backend tests`, `4/4 runtime checks`).
2. **Các cảnh báo nghiệp vụ (Warnings) đi kèm:**
   - Việc kiểm thử kịch bản thực thi thành công (`Execute Success Path`) chưa được thực hiện trực tiếp trên cơ sở dữ liệu hiện tại nhằm đảm bảo an toàn tuyệt đối theo đúng nguyên tắc `noDatabaseWrite` cho phase kiểm chứng lệnh và giao diện (`Phase 11L`).
   - Mọi thao tác nạp dữ liệu thực tế trên môi trường Staging/Production đòi hỏi phải có một môi trường kiểm thử cách ly riêng biệt (`disposable staging environment`) cùng bộ dữ liệu pháp lý thực tế đã được thẩm định chính thức (`Real Legal Dataset Go/No-Go Sign-off`).

## 4. Required Conditions Before Real Dataset Import

Trước khi cho phép nạp tri thức pháp lý thực tế (`Real Dataset Import`) vào cơ sở dữ liệu hệ thống, các điều kiện bắt buộc sau phải được hoàn tất và có văn bản xác nhận:

| Condition | Required Evidence | Owner | Status | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **1. Real dataset reviewed / approved** | Biên bản thẩm định và phê duyệt bộ dữ liệu CSV pháp lý từ Lãnh đạo đơn vị/Vụ Pháp chế (`Dataset Sign-off Form`). | Vụ Pháp chế / Cán bộ chuyên môn (`STAFF`/`MANAGER`) | ⏳ **PENDING** | Sẽ thực hiện trong `Phase 11M`. |
| **2. Backup before import** | Nhật ký sao lưu tự động/thủ công thành công (`Backup Health Report`) và tệp dump lưu trữ an toàn ngoài Git ngay trước thời điểm thực thi. | Quản trị viên hệ thống (`ADMIN` / Ops Team) | ⏳ **PENDING** | Đảm bảo khả năng phục hồi tức thì nếu cần. |
| **3. Import batch review** | Biên bản kiểm tra báo cáo rà soát (`Validation Report`) của từng lô dữ liệu (`Batch CSV`), đảm bảo 0 lỗi (`0 rejected/errors`). | Cán bộ pháp chế phụ trách nạp (`STAFF`) | ⏳ **PENDING** | Thực hiện trước bước bấm xác nhận Execute. |
| **4. Audit trail monitoring** | Nhật ký kiểm toán quản trị (`Admin Audit Logs`) ghi nhận đầy đủ `backupConfirmed`, `reason`, `confirmationText`, `userId` và danh sách `source_id` đã nạp. | Quản trị viên hệ thống (`ADMIN`) | ⏳ **PENDING** | Giám sát tính minh bạch và dấu vết kiểm toán. |
| **5. Active version approval separately** | Phiếu phê duyệt kích hoạt phiên bản pháp lý thông qua module `Version Governance UI` (`Phase 8F-E`). | Lãnh đạo cấp cao (`ADMIN`/`MANAGER`) | ⏳ **PENDING** | Thực hiện trong quy trình 3 bước độc lập sau khi kiểm tra dữ liệu nạp. |
| **6. Rollback plan ready** | Kịch bản khẩn cấp hoàn tác về phiên bản ổn định trước đó (`Rollback Playbook & Disaster Recovery Plan`). | Ops Team + Legal Team | ⏳ **PENDING** | Sẵn sàng hoàn tác về `LAND_KB_V1_2026` nếu phát sinh bất thường nghiệp vụ. |

## 5. Sign-off

| Role | Name | Signature | Date | Decision | Notes |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Phụ trách Kỹ thuật & Kiểm thử (Test Lead)** | *[Chờ bổ sung]* | *[Chờ ký]* | 12/07/2026 | `PASSED WITH WARNINGS` | Xác nhận hệ thống đạt đầy đủ 100% tiêu chí rà soát và tường lửa an toàn. |
| **Cán bộ Chuyên môn Pháp chế (Legal Specialist)** | *[Chờ bổ sung]* | *[Chờ ký]* | 12/07/2026 | `PASSED WITH WARNINGS` | Xác nhận bộ dữ liệu mẫu `SAMPLE` an toàn, không nhầm lẫn với văn bản thật. |
| **Quản trị viên Hệ thống (System Ops Admin)** | *[Chờ bổ sung]* | *[Chờ ký]* | 12/07/2026 | `PASSED WITH WARNINGS` | Xác nhận đã tạo backup an toàn trước UAT, hệ thống 4/4 `OPERATIONAL`. |
| **Chủ tịch Hội đồng Quản trị Dự án (Project Owner)** | *[Chờ bổ sung]* | *[Chờ ký]* | 12/07/2026 | `PASSED WITH WARNINGS` | Phê duyệt chuyển tiếp sang Phase 11M rà soát dữ liệu thật. |

*(Chú thích: Không điền tên thật hoặc chữ ký số cá nhân vào tài liệu Git công khai khi chưa được chủ dự án cung cấp bằng văn bản).*
