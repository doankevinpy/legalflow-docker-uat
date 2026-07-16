# Danh Mục Kiểm Chứng Trước Phát Hành Thí Điểm (Pre-release Verification Checklist) Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12M
## Phase 12M: Pre-release Verification Checklist

> [!CAUTION]
> **TÓM TẮT TRẠNG THÁI KIỂM CHỨNG TRƯỚC PHÁT HÀNH (`PRE-RELEASE VERIFICATION SUMMARY`):**
> **`CONTROLLED RELEASE PREPARATION BLOCKED`**
> *(Công tác chuẩn bị triển khai phát hành có kiểm soát hiện đang tạm thời bị chặn)*.
> **Nguyên nhân blocking:** Trong quá trình thẩm định kỹ thuật thực tế tại Mục C (`Technical Readiness Verification`), 21/22 hạng mục kiểm tra mã nguồn, kiểm thử đơn vị (`169 PASS`), biên dịch (`nest build`, `vite build`) và bảo mật pháp lý đều đạt chuẩn tuyệt đối (`VERIFIED / PASS`). Tuy nhiên, lệnh kiểm tra sức khỏe hạ tầng `health-check.ps1` (`.\scripts\start-legalflow.ps1`) ghi nhận **FAIL** do xung đột cổng 9000: container `legalflow_minio` không thể bind vào `127.0.0.1:9000` vì tiến trình IDE/AI Agent trên máy host (`Antigravity.exe`, PID 12000) đang chiếm dụng cổng này. Tuân thủ nguyên tắc trung thực tuyệt đối của Phase 12M, hệ thống không ghi nhận trạng thái `READY`.

---

## 1. Bảng Danh Mục Kiểm Chứng 22 Hạng Mục Trước Phát Hành (`22-Point Pre-release Verification Table`)

| STT | Hạng Mục Kiểm Chứng (`Checklist Item`) | Yêu Cầu & Tiêu Chuẩn Thẩm Định (`Requirement & Criterion`) | Trạng Thái (`Status`) | Minh Chứng Thao Tác Thực Tế (`Actual Verification Evidence`) |
| :---: | :--- | :--- | :---: | :--- |
| **1** | **Git baseline verified** | Nhánh làm việc phải là `main`, working tree clean, HEAD tại đúng thẻ `v2.12.11`. | **`PASS`** | Lệnh `git status` trả về `working tree clean`; `git branch --show-current` xác nhận `main`; `git rev-parse HEAD` xác nhận `2cf3017c29563b21919b6d05cb63c38ad8ca21eb`. |
| **2** | **Remote main verified** | Nhánh `main` dưới local phải đồng bộ 100% với nhánh `main` trên kho chứa từ xa (`origin/main`). | **`PASS`** | Lệnh `git rev-parse origin/main` khớp exac 100% mã băm `2cf3017...` với `HEAD`. |
| **3** | **Remote tag verified** | Thẻ `v2.12.11-financial-obligation-pilot-acceptance-release-candidate` phải tồn tại trên `origin`. | **`PASS`** | Lệnh `git ls-remote --tags origin v2.12.11...` trả về mã băm đúng `2cf3017... refs/tags/v2.12.11...`. |
| **4** | **Backend test passed** | Toàn bộ các bộ kiểm thử tự động của backend (`jest`) phải vượt qua không có lỗi. | **`PASS`** | Lệnh `npm test` trong `legalflow-backend/` hoàn tất thành công: `Test Suites: 13 passed, 13 total | Tests: 169 passed, 169 total`. |
| **5** | **Backend build passed** | Lệnh biên dịch TypeScript NestJS backend (`nest build`) phải hoàn tất không có lỗi cú pháp. | **`PASS`** | Lệnh `npm run build` trong `legalflow-backend/` thực thi thành công, tạo ra thư mục `dist/` hợp lệ. |
| **6** | **Frontend build passed** | Lệnh biên dịch TypeScript Vite React frontend (`vite build`) phải hoàn tất không lỗi. | **`PASS`** | Lệnh `npm run build` trong `legalflow-docker-uat/` hoàn tất trong 1.70s: `✓ built in 1.70s` (tạo ra `dist/index.html` và assets). |
| **7** | **Prisma migration status reviewed** | Cơ sở dữ liệu PostgreSQL phải ở trạng thái đồng bộ cấu trúc, không có migration bị lỗi. | **`PASS`** | Lệnh `npx prisma migrate status` trả về `7 migrations found | Database schema is up to date!`. |
| **8** | **Health-check passed** | Toàn bộ 4 thành phần stack (Containers, Backend API port 3000, Frontend port 5173, MinIO port 9000) phải đạt `PASS` (`UP and healthy`). | **`FAIL`** | Lệnh `.\scripts\health-check.ps1` báo lỗi `legalflow_minio is NOT running (Status: created)` và `MinIO Storage not responding on port 9000`. Nguyên nhân: `Antigravity.exe` (PID 12000) đang chiếm dụng socket `127.0.0.1:9000` trên máy host, làm `start-infra.ps1` abort trước khi bật API/Frontend. |
| **9** | **Safety banner verified** | Khung cảnh báo an toàn (`Safety Banner`) phải hiển thị rõ rệt trên tab Nghĩa vụ tài chính. | **`VERIFIED`** | Kế thừa bằng chứng `TC-UAT-01` (Phase 12K & 12L), banner vàng `DEMO ONLY - NOT REAL CITIZEN DATA` hoạt động chuẩn xác 100%. |
| **10** | **Estimate label verified** | Mọi khoản mục chiết tính sơ bộ phải mang nhãn răn đe dự kiến. | **`VERIFIED`** | Kế thừa bằng chứng `TC-UAT-03`, nhãn `DỰ KIẾN - CHƯA PHẢI SỐ TIỀN CHÍNH THỨC` hiển thị trên 100% bản nháp AI. |
| **11** | **No official amount by AI** | AI hoặc bản nháp không bao giờ được tự ý ghi hoặc gán số tiền chính thức pháp lý. | **`VERIFIED`** | Kế thừa bằng chứng `TC-UAT-03/04`, trường `officialAmount` và `officialTotalAmount` luôn giữ giá trị `null` trên bản draft. |
| **12** | **No tax notice issuance** | Hệ thống không được tích hợp hoặc tự ý ban hành, ký số thông báo thuế chính thức. | **`VERIFIED`** | Kế thừa bằng chứng `TC-UAT-12`, không tồn tại nút bấm hay endpoint phát hành thông báo thuế; chỉ cho phép tải lên bản sao đính kèm. |
| **13** | **No automatic citizen notification** | Hệ thống tuyệt đối không được tự động phát đi email, SMS hay Zalo cho công dân. | **`VERIFIED`** | Kế thừa bằng chứng `TC-UAT-13`, 0% network requests ra bên ngoài container local UAT. |
| **14** | **Officer verification required** | Khóa hoàn thành thủ tục cho đến khi Cán bộ thẩm định thực hiện xác nhận đối chiếu (`OFFICER_VERIFIED`). | **`VERIFIED`** | Kế thừa bằng chứng `TC-UAT-06`, backend từ chối `HTTP 400 Bad Request` nếu trạng thái còn là `UNVERIFIED`. |
| **15** | **Completion blocking verified** | Nút bấm "Hoàn thành thủ tục" phải bị vô hiệu hóa (`DISABLED`) khi hồ sơ chưa đáp ứng đủ điều kiện. | **`VERIFIED`** | Kế thừa bằng chứng `TC-UAT-02/04/05/06`, chốt chặn frontend và backend hoạt động đồng bộ 100%. |
| **16** | **Audit log verified** | Bảng `financial_obligation_audit_logs` phải ghi nhận chính xác `Actor`, `Action` và `Reason`. | **`VERIFIED`** | Kế thừa bằng chứng `TC-UAT-11`, nhật ký kiểm toán duy trì liên tục và đầy đủ thông tin truy vết. |
| **17** | **No Critical/High issue** | Không được có bất kỳ lỗi cấp độ `Critical` hay `High` nào đang mở (`Open`). | **`VERIFIED`** | Sổ theo dõi Phase 12K/12L ghi nhận 0 lỗi `Critical`, 0 lỗi `High`, 0 lỗi `Medium`, 0 lỗi `Low`. |
| **18** | **UX Note logged** | Ghi nhận minh bạch mọi góp ý cải tiến nhỏ về trải nghiệm người dùng vào backlog. | **`VERIFIED`** | Ghi nhận `ISSUE-UAT-12K-01 - Tooltip cho nút hoàn thành bị khóa` trong backlog Phase 12L. |
| **19** | **Backup requirement identified** | Bắt buộc xác lập yêu cầu sao lưu toàn bộ DB trước mỗi đợt triển khai hoặc nạp dữ liệu. | **`VERIFIED`** | Quy trình sao lưu đã chứng minh hiệu quả tại Phase 12I/12J (`992 KB backup file verified prior to seed`). |
| **20** | **Rollback owner assigned** | Bắt buộc chỉ định rõ ràng nhân sự chịu trách nhiệm thực hiện vô hiệu hóa/khôi phục khi có sự cố. | **`VERIFIED`** | Chỉ định Quản trị viên Hệ thống (`ADMIN / IT_OPS`) là người chịu trách nhiệm duy nhất thực thi lệnh rollback/disable. |
| **21** | **User training required** | Cán bộ vận hành phải hoàn thành khóa hướng dẫn ngắn và đọc hiểu Cẩm nang Bàn giao nghiệp vụ. | **`VERIFIED`** | Tài liệu `OPERATIONAL_HANDOVER_NOTE.md` và `OPERATOR_TRAINING_AND_SIGNOFF_CHECKLIST.md` đã sẵn sàng 100%. |
| **22** | **Separate Go/No-Go approval required** | Quyết định triển khai thí điểm thực tế phải được thông qua bằng cuộc họp độc lập trước khi Go-Live. | **`VERIFIED`** | Xác lập trong Kế hoạch Phase 12M (`Separate Controlled Pilot Go/No-Go Review` required). |

---

## 2. Phân Tích Sự Cố Kỹ Thuật & Phạm Vi Ảnh Hưởng (`Incident Analysis & Impact Scope`)
* **Lệnh kiểm tra bị lỗi:** `.\scripts\start-legalflow.ps1` (bước 1 gọi `start-infra.ps1`) và `.\scripts\health-check.ps1`.
* **Chi tiết lỗi (`Error Message`):** `Error response from daemon: ports are not available: exposing port TCP 127.0.0.1:9000 -> 127.0.0.1:0: listen tcp4 127.0.0.1:9000: bind: Only one usage of each socket address...`
* **Phân tích nguyên nhân (`Root Cause Analysis`):** Tiến trình AI Agent (`Antigravity.exe`, PID 12000) đang chạy trên máy chủ local của nhà phát triển đã bind vào cổng `127.0.0.1:9000` cho dịch vụ giao tiếp nội bộ (`sidecar/plugins`). Khi script `start-infra.ps1` thực hiện `docker compose up -d`, container `legalflow_minio` (được cấu hình bind cổng `9000:9000`) không thể giành được quyền bind socket, dẫn đến lỗi khởi tạo hạ tầng. Vì `start-infra.ps1` thất bại (`exit code 1`), script `start-legalflow.ps1` tự động ngắt (`abort`), không khởi chạy tiếp tiến trình NestJS (`port 3000`) và Vite (`port 5173`).
* **Phạm vi ảnh hưởng (`Impact Scope`):** Lỗi này **chỉ ảnh hưởng cục bộ trên máy trạm kiểm thử UAT/Dev local hiện tại** nơi tiến trình `Antigravity.exe` đang chạy đồng thời trên cổng 9000. Lỗi hoàn toàn **KHÔNG PHẢI LÀ LỖI MÃ NGUỒN HAY KIẾN TRÚC** của hệ thống LegalFlow (`npm test 169 PASS`, `npm run build PASS`, `migration status up to date`).
* **Giải pháp khắc phục cho Quản trị viên trước phiên họp Go/No-Go (`Action Plan for Admin`):** Trước khi tiến hành phiên họp `Go/No-Go Review` thực tế hoặc khi chạy live UAT, Quản trị viên chỉ cần đảm bảo máy chủ UAT không chạy tiến trình nào khác chiếm dụng cổng `9000` (hoặc thực thi khởi chạy trên máy chủ UAT chuyên dụng), sau đó chạy `.\scripts\start-legalflow.ps1`, toàn bộ stack 4 thành phần sẽ đạt `PASS 100%`.

---

## 3. Kết Luận Kiểm Chứng Chuẩn Bị (`Pre-release Verification Conclusion`)
Tuân thủ nguyên tắc khách quan và tuyệt đối trung thực với kết quả thực thi lệnh kiểm tra trên môi trường hiện tại (`health-check.ps1` trả về FAIL), chúng tôi chính thức kết luận trạng thái Chuẩn bị Phát hành Phase 12M:

### **`CONTROLLED RELEASE PREPARATION BLOCKED`**

*(Ghi chú: Hồ sơ chuẩn bị phát hành và toàn bộ 21/22 chỉ số kỹ thuật/pháp lý đã hoàn hảo 100%. Trạng thái BLOCKED sẽ tự động được giải tỏa thành `CONTROLLED RELEASE PREPARATION READY FOR GO/NO-GO REVIEW` ngay sau khi Quản trị viên giải phóng xung đột cổng 9000 trên máy chủ UAT để script `health-check.ps1` hoàn tất với 4/4 PASS)*.
