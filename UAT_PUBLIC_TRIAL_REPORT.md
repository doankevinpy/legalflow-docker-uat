# Báo Cáo Nghiệm Thu UAT Public Trial - LegalFlow

> [!NOTE]
> Tài liệu này tổng kết kết quả kiểm thử môi trường Public Trial của ứng dụng LegalFlow.
> **Kiến trúc:** Public Trial qua ngrok + single-domain reverse proxy.

## 1. Môi Trường Kiểm Thử
- **Public URL (Che giấu):** `https://crudely-apply-***.ngrok-free.dev`
- **Nguyên tắc an toàn dữ liệu:** Quá trình kiểm thử tuyệt đối **không dùng dữ liệu thật** và **không upload tài liệu thật**. Toàn bộ dữ liệu được sử dụng là mock data.

## 2. Kết Quả Nghiệm Thu Tự Động (API-Level - Chặng 5)
Tất cả các bài kiểm tra bảo mật và chức năng tự động đều đạt:

- **Login API:** PASS
- **Role Detection:** STAFF (PASS)
- **Create Case:** PASS
- **Rate Limit 429:** PASS
- **CORS Evil Origin:** PASS
- **Response Security:** PASS (Không lộ mật khẩu/hash)

## 3. Kiểm Thử Thủ Công (UI & Browser)
> [!IMPORTANT]
> Các hạng mục kiểm tra giao diện và bộ nhớ trình duyệt cần được người dùng **kiểm thử thủ công**, bao gồm:
> - Không rò rỉ JWT/Token trên Local Storage hoặc Session Storage.
> - Các request Network không trả về các thông tin cấu hình nhạy cảm.

## 4. Kiểm Toán Bảo Mật Hậu Kỳ (Post-Flight - Chặng 6)
- **Quản lý Tài Khoản:** Tài khoản User Test đã bị khóa an toàn (set `isActive=false`) ngay sau khi kết thúc quá trình Trial.
- **Sao Lưu Cơ Sở Dữ Liệu:** Đã tạo bản sao lưu toàn vẹn sau kiểm thử tại đường dẫn: 
  `legalflow-backend\backups\backup_20260526_083919.db`
- **Quản lý Cấu Hình Nhạy Cảm:** Đảm bảo không có bất kỳ Password, Token, JWT_SECRET, hay authtoken nào bị lộ lọt vào Git hoặc các log công khai. Môi trường local `.trial-test.local` được duy trì bảo mật.
