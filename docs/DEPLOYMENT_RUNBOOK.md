# Sổ tay Vận hành Triển khai (DEPLOYMENT_RUNBOOK)

Tài liệu hướng dẫn triển khai thủ công từng bước lên môi trường Staging/Production bằng Docker Compose.

## 1. Cảnh báo Quan trọng (Quy tắc an toàn)
- **Quy tắc tắt ứng dụng (Shutdown rules)**: Tuyệt đối KHÔNG BAO GIỜ sử dụng lệnh `docker compose down -v` trên môi trường Staging hoặc Production. Nó sẽ phá hủy toàn bộ volume cơ sở dữ liệu và dữ liệu lưu trữ. Chỉ sử dụng `down` hoặc `stop`.
- **Xử lý khóa bảo mật (Secret handling)**: Không in giá trị của các biến môi trường (`echo $JWT_SECRET`, v.v.) vào file text hay xuất ra màn hình console trong bất kỳ hoàn cảnh nào.

## 2. Danh sách kiểm tra trước triển khai (Pre-deploy Checklist)
- [ ] Xác nhận Production/Staging Readiness Checklist đều Pass.
- [ ] Xác nhận các file môi trường `.env` hoặc hệ thống quản lý Secret đã được cấu hình tại host đích.

## 3. Các Bước Triển Khai Thủ Công (Manual Deploy Steps)

**Bước 3.1: Sao lưu trước khi cập nhật (Backup before migrate)**
Chạy pg_dump lưu snapshot để phòng hờ sự cố.
```bash
docker compose -f docker-compose.full.yml exec -t legalflow_postgres pg_dump -U $POSTGRES_USER -d $POSTGRES_DB -F c -f /tmp/backup_pre_deploy.dump
```

**Bước 3.2: Lấy mã nguồn/Image mới nhất (Pull/update code or image tag)**
```bash
git checkout main
git pull origin main
```
*(Hoặc update docker image tags trong file yml nếu dùng registry)*

**Bước 3.3: Khởi động hệ thống (Build/start Docker Compose)**
Build lại image cho service frontend, backend (nếu có cập nhật) và khởi động:
```bash
docker compose -f docker-compose.full.yml up -d --build
```

**Bước 3.4: Chạy Migration (Run migrate deploy)**
Cập nhật cấu trúc database bằng chế độ deploy an toàn:
```bash
docker compose -f docker-compose.full.yml exec backend npx prisma migrate deploy
```

## 4. Xác nhận sau triển khai (Verification)

**Bước 4.1: Kiểm tra sức khỏe hệ thống (Health check)**
- Giao diện console: `docker compose ps` báo mọi thứ đang `Up`.
- HTTP GET: `https://<domain>/api/health` trả về HTTP 200.

**Bước 4.2: Chạy Smoke Verification**
Xác nhận cơ bản bằng tay:
- Giao diện frontend load lên.
- Có thể đăng nhập (Login) bằng tài khoản nhân viên/admin.
- Thực hiện CRUD cơ bản trên 1 Case.
- Thực hiện Upload 1 file thử nghiệm và Download lại file đó.

## 5. Quy trình Hoàn tác (Rollback steps)
Nếu `Smoke Verification` thất bại:
1. `git checkout <previous_commit_hash>` (lùi về trạng thái code cũ).
2. `docker compose -f docker-compose.full.yml up -d --build` (build và chạy bản code cũ).
3. (Nếu database migration phá vỡ cấu trúc và không tương thích bản cũ): Restore lại bản `backup_pre_deploy.dump` (đã tạo ở bước 3.1).
