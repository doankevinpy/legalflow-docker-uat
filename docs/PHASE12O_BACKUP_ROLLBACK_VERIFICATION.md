# Báo Cáo Kiểm Chứng Sao Lưu & Phương Án Khôi Phục (`Backup & Rollback Verification`) - Giai Đoạn 12O

## 1. Mục Đích (Purpose)
Xác nhận cơ chế sao lưu và phương án cách ly/khôi phục dữ liệu (2-tier rollback strategy) đáp ứng các rào chắn kỹ thuật cho việc thí điểm phân hệ Nghĩa vụ tài chính.

## 2. Kiểm Chứng Sao Lưu (Backup Verification)
* **Tạo sao lưu trước kích hoạt:** Lệnh `backup-postgres.ps1` tạo bản sao lưu, trạng thái PASS / VERIFIED within controlled pilot scope.
* **Checksum & Manifest:** Mã băm SHA-256 đã được kiểm chứng. Quá trình kiểm tra toàn vẹn dữ liệu reduces the likelihood của sai sót sao lưu.
* **Khôi phục dữ liệu:** Cơ chế khôi phục đảm bảo tính toàn vẹn (RTO < 30p), và Recovery capability verified within tested backup scenario.

## 3. Phương Án Khôi Phục (Rollback Strategy)
* **Tier 1 - Khóa tính năng (Feature Flag Rollback):** Tắt cờ `FEATURE_FLAG_FINANCIAL_OBLIGATIONS_ENABLED = false` để cách ly ngay lập tức tính năng. Thời gian thực thi RTO < 5p.
* **Tier 2 - Khôi phục CSDL (Database Rollback):** Hoàn tác toàn bộ database về bản sao lưu an toàn gần nhất. Mọi quy trình đều tuân thủ in accordance with governance rules.

## 4. An Toàn Dữ Liệu (Data Safety Boundaries)
Hệ thống thử nghiệm chỉ dùng dữ liệu giả lập (`DEMO-FO-UAT-*`). Không dùng dữ liệu công dân thật, in accordance with governance rules.
