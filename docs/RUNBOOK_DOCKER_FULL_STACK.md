# RUNBOOK: DOCKER FULL STACK

## 1. Mục đích
Chạy ứng dụng LegalFlow full stack bằng Docker, bao gồm:
- **PostgreSQL**: Cơ sở dữ liệu chính.
- **MinIO**: Object Storage (S3-compatible).
- **Backend NestJS**: REST API server.
- **Frontend React**: Served bởi Caddy.
- **Caddy**: Reverse proxy cho đường dẫn `/api/*` tới backend.

## 2. Chuẩn bị env
1. Copy file `.env.docker.example` thành `.env.docker`.
2. Người vận hành phải thay thế các giá trị dummy bằng thông tin cấu hình thật.
3. **KHÔNG** commit file `.env.docker` lên source control.

## 3. Validate config
```bash
docker compose -f docker-compose.full.yml --env-file .env.docker config
```

## 4. Build images
```bash
docker compose -f docker-compose.full.yml --env-file .env.docker build
```

## 5. Start infra
```bash
docker compose -f docker-compose.full.yml --env-file .env.docker up -d postgres minio
```

## 6. Migration thủ công
```bash
docker compose -f docker-compose.full.yml --env-file .env.docker run --rm backend npx prisma migrate deploy
```

## 7. Seed core thủ công
```bash
docker compose -f docker-compose.full.yml --env-file .env.docker run --rm backend npx prisma db seed
```

## 8. Start app
```bash
docker compose -f docker-compose.full.yml --env-file .env.docker up -d backend frontend_caddy
```

## 9. Kiểm tra
- Giao diện gốc: [http://127.0.0.1:8080/](http://127.0.0.1:8080/)
- API Health (qua proxy Caddy): [http://127.0.0.1:8080/api/health](http://127.0.0.1:8080/api/health)
- Chuyển hướng Frontend SPA: [http://127.0.0.1:8080/analytics](http://127.0.0.1:8080/analytics)

## 10. Logs
- Xem log Backend:
  ```bash
  docker compose -f docker-compose.full.yml logs --tail=80 backend
  ```
- Xem log Frontend (Caddy):
  ```bash
  docker compose -f docker-compose.full.yml logs --tail=80 frontend_caddy
  ```

## 11. Shutdown an toàn
Tắt toàn bộ stack mà vẫn bảo toàn database volume:
```bash
docker compose -f docker-compose.full.yml down
```
**Cảnh báo:** Tuyệt đối không dùng lệnh `down -v` (trừ khi bạn chủ động muốn xóa vĩnh viễn toàn bộ volume dữ liệu).

## 12. Security notes
- **KHÔNG** dùng dữ liệu thật nếu chưa đến giai đoạn Production UAT.
- **KHÔNG** commit `.env.docker` vào Git.
- **KHÔNG** in `JWT_SECRET`, `DATABASE_URL`, mật khẩu, hoặc token đầy đủ vào console log hay report file.

## 13. Troubleshooting
- **Lỗi `/api/health` 502 (Bad Gateway):** Kiểm tra xem biến môi trường cho backend có chứa `HOST=0.0.0.0` hay chưa.
- **Lỗi Prisma migrate deploy:** Đảm bảo `prisma.config.ts` đã được include vào trong backend Docker image.
- **Lỗi seed thiếu ts-node (`ENOENT`):** Production seed context không dùng ts-node, đảm bảo code đã được compile ra JS và cấu hình Prisma chỉ định thực thi file script `.js`.
