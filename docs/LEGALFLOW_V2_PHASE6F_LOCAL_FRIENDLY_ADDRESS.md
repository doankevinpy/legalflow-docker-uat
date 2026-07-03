# LegalFlow v2.4.5 – Hướng Dẫn Truy Cập Local Friendly Address (Phase 6F)

**Tài liệu hướng dẫn cấu hình và sử dụng địa chỉ thân thiện cho môi trường phát triển cục bộ (Local Development)**  
*Phiên bản:* v2.4.5-local-friendly-address  
*Ngày cập nhật:* 03/07/2026  

---

## 1. Mục tiêu

Việc thiết lập **Local Friendly Address (Phase 6F)** nhằm mục đích:
- Cho phép cán bộ và lập trình viên truy cập hệ thống LegalFlow ngay trên laptop cá nhân bằng địa chỉ tên miền thân thiện, dễ nhớ thay vì dùng IP hay `localhost` truyền thống:
  - **Địa chỉ truy cập chính (Khuyến nghị):** `http://kevindoan-legalflow.local:8080`
- Cung cấp thêm địa chỉ truy cập phụ phục vụ phát triển giao diện trực tiếp:
  - **Địa chỉ phụ (Frontend Dev Server):** `http://kevindoan-legalflow.local:5173`
- Đảm bảo toàn bộ hệ sinh thái (Vite Frontend, NestJS Backend, Caddy Gateway Proxy) liên kết mượt mà, chính xác trong môi trường cục bộ mà không cần phụ thuộc vào DNS công cộng hay Internet.

---

## 2. Cách cấu hình Windows hosts

Để phân giải tên miền `kevindoan-legalflow.local` về máy tính cục bộ trên hệ điều hành Windows, thực hiện theo các bước sau:

1. **Mở Notepad với quyền Quản trị viên (Administrator):**
   - Bấm phím `Windows`, gõ `Notepad`.
   - Nhấp chuột phải vào biểu tượng **Notepad** $\rightarrow$ Chọn **Run as administrator**.

2. **Mở file cấu hình hosts của Windows:**
   - Từ menu Notepad, chọn **File** $\rightarrow$ **Open** (hoặc nhấn `Ctrl + O`).
   - Duyệt tới thư mục:
     ```text
     C:\Windows\System32\drivers\etc\hosts
     ```
   - *Lưu ý:* Chọn hiển thị **All Files (*.*)** ở góc dưới bên phải hộp thoại Open để nhìn thấy file `hosts`.

3. **Thêm dòng phân giải tên miền:**
   - Di chuyển con trỏ xuống cuối file và thêm chính xác dòng sau:
     ```text
     127.0.0.1 kevindoan-legalflow.local
     ```

4. **Lưu file:**
   - Nhấn `Ctrl + S` hoặc chọn **File** $\rightarrow$ **Save**.

5. **Xóa bộ nhớ đệm DNS (Flush DNS):**
   - Mở **Windows Terminal** hoặc **Command Prompt / PowerShell** (với quyền Administrator) và chạy lệnh:
     ```cmd
     ipconfig /flushdns
     ```
   - Hệ thống sẽ trả về thông báo: *Successfully flushed the DNS Resolver Cache.*

---

## 3. Cách khởi động LegalFlow

Để khởi động toàn bộ kiến trúc LegalFlow trong môi trường phát triển cục bộ với cấu hình địa chỉ thân thiện mới nhất, thực hiện lần lượt các lệnh sau từ thư mục gốc của dự án (`c:\Users\Admin\legalflow-docker-uat`):

```powershell
# 1. Dừng và dọn dẹp các tiến trình/container đang chạy cũ
.\scripts\stop-legalflow.ps1

# 2. Khởi động toàn bộ hệ sinh thái (Docker Infra + Backend NestJS + Frontend Vite)
.\scripts\start-legalflow.ps1

# 3. Kiểm tra sức khỏe toàn diện của hệ thống
.\scripts\health-check.ps1
```

---

## 4. Địa chỉ truy cập chính

- **URL:** `http://kevindoan-legalflow.local:8080`
- **Vai trò:** **Caddy Local Gateway Proxy**.
- **Giải thích cơ chế:**
  - Đây là cổng truy cập tập trung duy nhất được khuyến nghị cho người dùng trên laptop cá nhân.
  - Caddy hoạt động trong Docker container (`legalflow_caddy`) lắng nghe trên cổng `8080`, nhận toàn bộ request từ trình duyệt với `Host: kevindoan-legalflow.local:8080`.
  - Caddy tự động phân giải và định tuyến request:
    - Các yêu cầu giao diện (`/*`) được chuyển tiếp ngược (reverse proxy) tới Frontend Vite Dev Server (`host.docker.internal:5173`).
    - Các yêu cầu dữ liệu API (`/api/*`) được tự động cắt tiền tố `/api` và chuyển tiếp sang Backend NestJS (`host.docker.internal:3000`).

---

## 5. Địa chỉ phụ

- **URL:** `http://kevindoan-legalflow.local:5173`
- **Vai trò:** **Frontend Vite Development Server**.
- **Giải thích cơ chế:**
  - Đây là cổng truy cập trực tiếp vào máy chủ phát triển của Vite (Node.js running on host).
  - Phù hợp khi lập trình viên muốn theo dõi log trực tiếp trên Vite dev tools, tận dụng tối đa tốc độ Hot Module Replacement (HMR) mà không đi qua tầng proxy Caddy.

---

## 6. Các file đã cấu hình

Để kiến trúc **Local Friendly Address** hoạt động ổn định và bảo mật, 7 file cấu hình quan trọng đã được chuẩn hóa:

1. `proxy/Caddyfile`: Nâng cấp từ Skeleton Proxy sang Reverse Proxy cho Local Dev stack, khai báo khối site chấp nhận `http://kevindoan-legalflow.local:8080` và chuyển tiếp traffic tới `host.docker.internal:5173` và `host.docker.internal:3000`.
2. `proxy/Caddyfile.full`: Cập nhật khối site cấu hình cho production container để hỗ trợ đồng thời `:8080` và các host thân thiện local.
3. `scripts/start-frontend.ps1`: Bổ sung cờ `--host 0.0.0.0 --port 5173` vào lệnh `npm run dev` để Vite bind trên tất cả interface mạng local, cho phép Docker Caddy kết nối mượt mà.
4. `scripts/start-backend.ps1`: Thiết lập biến môi trường `$env:HOST = "0.0.0.0"` trước khi chạy `npm run start:dev` nhằm đảm bảo NestJS lắng nghe kết nối từ Docker host bridge.
5. `scripts/start-legalflow.ps1`: Cập nhật bảng thông báo đầu ra hiển thị rõ cổng chính Caddy (`http://kevindoan-legalflow.local:8080`) và cổng dev trực tiếp.
6. `vite.config.ts`: Cấu hình danh sách `server.allowedHosts` và `preview.allowedHosts` gồm `'kevindoan-legalflow.local'`, `'localhost'`, `'127.0.0.1'` để ngăn chặn lỗi chặn Host header của Vite.
7. `legalflow-backend/src/main.ts`: Cập nhật mảng `defaultLocalOrigins` trong cấu hình CORS, cho phép các request từ cả origin port `5173` và port `8080` (`http://kevindoan-legalflow.local:8080`).

---

## 7. Nguyên tắc an toàn

Mô hình cấu hình Phase 6F tuân thủ nghiêm ngặt các tiêu chuẩn bảo mật nội bộ:

1. **Chỉ dùng local trên laptop:** Tên miền `.local` chỉ phân giải nội bộ qua file `hosts` của máy cá nhân, tuyệt đối không đăng ký hay trỏ DNS công cộng.
2. **Không public Internet:** Các dịch vụ chỉ chạy trong phạm vi mạng loopback/Docker bridge của laptop, không mở port ra Internet.
3. **Không mở PostgreSQL ra ngoài:** Cơ sở dữ liệu Postgres (`5432`) chỉ ánh xạ `127.0.0.1:5432:5432`, không thể truy cập từ mạng LAN hay bên ngoài.
4. **Không mở MinIO console ra ngoài:** Cổng MinIO Console (`9001`) và API (`9000`) chỉ ánh xạ vào `127.0.0.1`, bảo vệ an toàn kho lưu trữ tài liệu.
5. **Không dùng CORS wildcard (`*`):** Backend NestJS duy trì kiểm soát nghiêm ngặt danh sách `allowedOrigins`, tuyệt đối không dùng dấu hoa thị `*` gây rủi ro bảo mật.
6. **Không commit `.env` thật:** Các file mật khẩu, API key thực tế (`.env`, `.env.local`) luôn nằm trong `.gitignore`; tài liệu chỉ tham chiếu file mẫu `.example`.

---

## 8. Lệnh kiểm tra

Để xác minh toàn bộ chuỗi phân giải và kết nối mạng hoạt động chính xác, mở PowerShell và chạy các lệnh chẩn đoán sau:

```powershell
# 1. Kiểm tra phân giải tên miền trong Windows hosts
ping kevindoan-legalflow.local

# 2. Kiểm tra kết nối cổng Caddy Proxy (8080)
Test-NetConnection 127.0.0.1 -Port 8080

# 3. Kiểm tra kết nối cổng Frontend Vite Dev Server (5173)
Test-NetConnection 127.0.0.1 -Port 5173

# 4. Kiểm tra kết nối cổng Backend API Server (3000)
Test-NetConnection 127.0.0.1 -Port 3000

# 5. Kiểm tra danh sách container Docker đang chạy
docker ps

# 6. Xem log chẩn đoán mới nhất của Caddy Gateway
docker logs legalflow_caddy --tail 120
```

---

## 9. Troubleshooting

| Hiện tượng / Lỗi | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| **Port 8080 không mở** (`Test-NetConnection => False`) | Container `legalflow_caddy` chưa chạy hoặc bị dừng đột ngột. | Chạy `docker ps` để kiểm tra. Khởi động lại bằng lệnh: `docker compose -f docker-compose.infra.yml up -d caddy`. |
| **Port 5173 không mở** (`Test-NetConnection => False`) | Tiến trình Vite Dev Server chưa chạy hoặc cửa sổ PowerShell chạy script bị tắt. | Chạy lại lệnh `.\scripts\start-frontend.ps1` trong một cửa sổ PowerShell riêng. |
| **Port 3000 không mở** (`Test-NetConnection => False`) | Tiến trình NestJS Backend chưa chạy hoặc lỗi khi kết nối database PostgreSQL. | Kiểm tra container Postgres đã lên chưa (`docker ps`). Chạy lại `.\scripts\start-backend.ps1`. |
| **Lỗi 502 Bad Gateway** (khi truy cập qua `8080`) | Caddy đang chạy nhưng không kết nối được tới `host.docker.internal:5173` hoặc `:3000`. | Đảm bảo Frontend và Backend đã khởi động thành công và đang lắng nghe trên `0.0.0.0` (không chỉ `127.0.0.1`). Kiểm tra tường lửa Windows Firewall có chặn kết nối từ Docker hay không. |
| **Lỗi CORS** (Block by CORS policy trên trình duyệt) | Trình duyệt gửi `Origin` không khớp với danh sách cho phép của Backend. | Kiểm tra `legalflow-backend/src/main.ts`, đảm bảo origin (ví dụ `http://kevindoan-legalflow.local:8080`) đã nằm trong `defaultLocalOrigins`. Khởi động lại backend sau khi sửa. |
| **Lỗi Host not allowed** (Màn hình trắng/thông báo lỗi của Vite) | Truy cập qua tên miền nhưng Vite chưa cấu hình `allowedHosts`. | Kiểm tra `vite.config.ts`, đảm bảo mảng `server.allowedHosts` có chứa `'kevindoan-legalflow.local'`. Khởi động lại frontend. |
| **Hosts chưa trỏ về 127.0.0.1** (Lỗi `ERR_NAME_NOT_RESOLVED`) | Chưa thêm dòng cấu hình vào file `hosts` hoặc chưa flush DNS. | Mở Notepad với quyền Admin, thêm `127.0.0.1 kevindoan-legalflow.local` vào file `hosts` và chạy `ipconfig /flushdns`. |

---

## 10. Kết luận

- **Từ nay, địa chỉ khuyến nghị để vận hành và kiểm thử LegalFlow trên laptop cá nhân là:**
  $$\text{\textbf{http://kevindoan-legalflow.local:8080}}$$
- Cấu hình này mang lại trải nghiệm chuyên nghiệp, giống với môi trường UAT/Production thực tế mà vẫn giữ nguyên tốc độ và sự tiện lợi của máy chủ phát triển nội bộ.
- **Định hướng mở rộng tương lai:** Nếu sau này muốn loại bỏ hoàn toàn số cổng `:8080` khỏi thanh địa chỉ (để chỉ cần gõ `http://kevindoan-legalflow.local`), có thể thực hiện ánh xạ thêm cổng `80` cho container Caddy trong Docker cấu hình mà không làm ảnh hưởng đến kiến trúc hiện tại.
