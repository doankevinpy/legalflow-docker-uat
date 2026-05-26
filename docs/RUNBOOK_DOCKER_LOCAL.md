# Runbook: Local Docker Infrastructure (Phase 7.1)

Tài liệu này hướng dẫn cách vận hành độc lập hạ tầng (Postgres, MinIO, Caddy) tại môi trường phát triển cục bộ (Local Development).

> **Runtime verification status:** Đã vượt qua kiểm thử Runtime Verification trên máy trạm (PASS). Hạ tầng sẵn sàng vận hành.

## 1. Khởi động (Up)
Lệnh này sẽ tải image và khởi động các services ở chế độ nền (detached):
```bash
docker compose -f docker-compose.infra.yml --env-file .env.docker.example config
docker compose -f docker-compose.infra.yml --env-file .env.docker.example up -d
```

## 2. Kiểm tra trạng thái (Status)
```bash
docker compose -f docker-compose.infra.yml ps
```
Nếu `STATUS` báo `(healthy)`, dịch vụ đã sẵn sàng.

## 3. Kiểm tra Caddy config (Validate)
```bash
docker compose -f docker-compose.infra.yml --env-file .env.docker.example exec caddy caddy validate --config /etc/caddy/Caddyfile
```

## 4. Dừng (Down)
Dừng toàn bộ dịch vụ nhưng **giữ lại dữ liệu** (volumes):
```bash
docker compose -f docker-compose.infra.yml down
```

## 5. Xóa sạch dữ liệu (Wipe Volumes)
**CẢNH BÁO:** Lệnh này sẽ xóa toàn bộ database Postgres và tệp tin MinIO đã lưu trong volume. Chỉ dùng khi muốn làm sạch hoàn toàn hệ thống:
```bash
docker compose -f docker-compose.infra.yml down -v
```

## 6. Các Port nội bộ (Chỉ truy cập từ localhost)
- **PostgreSQL:** `127.0.0.1:5432`
- **MinIO S3 API:** `127.0.0.1:9000`
- **MinIO Web Console:** `127.0.0.1:9001`
- **Caddy Proxy:** `127.0.0.1:8080`
