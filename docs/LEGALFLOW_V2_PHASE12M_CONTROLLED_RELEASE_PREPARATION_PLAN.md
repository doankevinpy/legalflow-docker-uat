# Kế Hoạch Chuẩn Bị Triển Khai Phát Hành Có Kiểm Soát (Controlled Release Preparation Plan) Phân Hệ Nghĩa Vụ Tài Chính - Giai Đoạn 12M
## Phase 12M: Controlled Financial Obligation Release Preparation Plan

> [!WARNING]
> **TÚYÊN BỐ PHÁP LÝ TỐI THƯỢNG BẮT BUỘC GHI NHỚ (`ABSOLUTE LEGAL DISCLAIMER`):**
> **`Phase 12M is preparation only, not production release.`**
> *(Giai đoạn 12M chỉ thực hiện công tác lập kế hoạch, chuẩn bị hồ sơ tài liệu rào chắn và kiểm tra tính sẵn sàng kỹ thuật cho môi trường thí điểm kiểm soát. Hoàn toàn KHÔNG phải là phát hành chính thức lên môi trường Production, KHÔNG mở cổng truy cập công cộng và KHÔNG tự ý quyết định GO-LIVE)*.

---

## 1. Mục Đích & Đường Cơ Sở (`Purpose & Baseline`)
* **Mục Đích (`Purpose`):** Chuẩn bị đầy đủ hệ thống văn bản quản trị, danh mục kiểm tra trước phát hành, ma trận phân quyền truy cập, phương án ứng phó sự cố/khôi phục khẩn cấp và cẩm nang đào tạo nghiệp vụ cho việc triển khai thí điểm có kiểm soát (`Controlled Pilot Release`) phân hệ Nghĩa vụ tài chính trên hệ thống LegalFlow.
* **Đường Cơ Sở (`Baseline Tag`):** `v2.12.11-financial-obligation-pilot-acceptance-release-candidate` (trên nhánh `main`, working tree clean, đồng bộ hoàn toàn với `origin/main`).

---

## 2. Phạm Vi Công Việc (`Scope` & `Out of Scope`)

### A. Phạm Vi Công Việc (`Scope`)
* Lập tài liệu Kế hoạch Chuẩn bị Triển khai Phát hành Có Kiểm soát (`Preparation Plan`).
* Định nghĩa Ma trận Phạm vi Thí điểm và Phân quyền Truy cập (`Pilot Scope & Access Matrix`).
* Kiểm tra và rà soát Danh mục Kiểm chứng Trước Phát hành (`Pre-release Verification Checklist`).
* Xây dựng Kế hoạch Vô hiệu hóa Tính năng, Khôi phục và Ứng phó Sự cố Khẩn cấp (`Rollback, Disable & Incident Response Plan`).
* Soạn thảo Cẩm nang Đào tạo Nghiệp vụ và Bảng Xác nhận cho Cán bộ Vận hành (`Operator Training & Signoff Checklist`).
* Thực thi kiểm tra tính sẵn sàng kỹ thuật (`Technical Readiness Verification`): kiểm thử đơn vị backend, biên dịch backend/frontend và rà soát trạng thái migration.

### B. Ngoài Phạm Vi (`Out of Scope - Prohibited Actions`)
* **Không triển khai production:** Không tự ý đưa mã nguồn lên máy chủ Production hoặc mở cho công dân thao tác.
* **Không mở public tunnel:** Tuyệt đối không sử dụng `ngrok`, `localtunnel` hay expose cổng cơ sở dữ liệu (`5432`), kho lưu trữ (`9000`) hay ứng dụng ra mạng Internet công cộng.
* **Không sử dụng dữ liệu thật:** Không nhập dữ liệu công dân thật, CCCD thật, tên thật, địa chỉ thật hay số thông báo thuế thực tế vào hệ thống trong Phase 12M.
* **Không sửa đổi mã nguồn hay cấu trúc DB:** Không can thiệp chỉnh sửa backend (`src/`), frontend (`src/`), Prisma schema, `.env`, và không chạy lệnh nạp dữ liệu (`seed`), migration mới, hoặc reset/restore database.
* **Không can thiệp nghiệp vụ thuế:** Không tự ý tính toán hay xác nhận số tiền chính thức, không tự phát hành thông báo thuế, không thay thế cơ quan thuế và không gửi email/SMS/Zalo cho công dân.

---

## 3. Bằng Chứng Kế Thừa Từ Giai Đoạn 12L (`Phase 12L Evidence Summary`)
* **Quyết định Nghiệm thu Phase 12L:** `ACCEPTED FOR CONTROLLED RELEASE WITH CONDITIONS` *(Chấp thuận triển khai phát hành có kiểm soát kèm theo 11 điều kiện rào chắn an toàn)*.
* **Trạng thái Ứng viên Phát hành (`Release Candidate Status`):** `RC READY WITH CONDITIONS` *(Toàn bộ 16/16 hạng mục kiểm tra kỹ thuật và bảo mật đạt chuẩn `VERIFIED`)*.
* **Thống kê Lỗi Phase 12K/12L:** `14 PASS | 0 FAIL | 0 BLOCKED | 0 Critical | 0 High | 0 Medium | 0 Low`.
* **Ghi Nhận UX Note Còn Mở (`Remaining UX Note`):** `ISSUE-UAT-12K-01 - Tooltip cho nút hoàn thành bị khóa` *(Được quản lý an toàn trong Backlog / Controlled Release Condition để cải tiến sau Release Candidate, không sửa code tại Phase 12M)*.

---

## 4. Mô Hình Thí Điểm Có Kiểm Soát Được Đề Xuất (`Proposed Controlled Pilot Model`)
* **Môi trường Triển khai Thí điểm (`Pilot Environment`):** Môi trường kiểm thử nghiệm thu nội bộ biệt lập (`UAT / Internal Pilot Environment`, port `8080/5173`).
* **Đơn vị Tham gia (`Participating Unit`):** Bộ phận Tiếp nhận và Trả kết quả (`Một cửa`) và Phòng Tài nguyên & Môi trường thuộc đơn vị thí điểm nội bộ được chỉ định (`Pilot Unit UAT`).
* **Phương thức Vận hành:** Chạy song song (`Parallel Run`) cùng quy trình đối chiếu giấy truyền thống. Cán bộ dùng hệ thống LegalFlow để số hóa chứng từ và theo dõi chốt chặn, nhưng mọi quyết định hành chính cuối cùng phải căn cứ vào thông báo thuế gốc do Chi cục Thuế ban hành.

---

## 5. Phê Duyệt Bắt Buộc & Tiêu Chí Đầu Vào / Đầu Ra (`Approvals, Entry & Exit Criteria`)

### A. Phê Duyệt Bắt Buộc (`Required Approvals`)
Để chuyển từ giai đoạn Chuẩn bị (`Preparation`) sang giai đoạn Triển khai Thí điểm thực tế (`Pilot Execution - Go-Live`), hệ thống bắt buộc phải có thông qua bằng văn bản tại một cuộc họp độc lập (**`Separate Controlled Pilot Go/No-Go Review`**) với sự phê duyệt của:
1. **Lãnh đạo Cơ quan / Đơn vị Thí điểm (`Head of Pilot Unit`).**
2. **Quản trị viên Hệ thống & Bảo mật (`System Admin / IT Security Lead`).**
3. **Đại diện Đội ngũ Phát triển LegalFlow (`Tech Lead`).**

### B. Tiêu Chí Đầu Vào (`Entry Criteria`)
- [x] Đường cơ sở Git đạt chuẩn tại `v2.12.11-financial-obligation-pilot-acceptance-release-candidate`, working tree clean, đồng bộ với `origin/main`.
- [x] Hồ sơ rà soát nghiệm thu Phase 12L đạt `ACCEPTED FOR CONTROLLED RELEASE WITH CONDITIONS`.
- [x] Không tồn tại bất kỳ lỗi `Critical` hay `High` nào cản trở an toàn hệ thống.

### C. Tiêu Chí Đầu Ra (`Exit Criteria`)
- [x] Hoàn tất 06 bộ tài liệu chuẩn bị phát hành trong `docs/`.
- [x] Tất cả các bộ kiểm thử tự động backend (`169 tests`) và biên dịch hệ thống (`nest build`, `vite build`) đạt `PASS`.
- [x] Ghi nhận trung thực các kết quả kiểm tra sức khỏe hạ tầng (`Health Check Results`) và phân định rõ ràng kết luận tính sẵn sàng.

---

## 6. Rủi Ro Còn Lại (`Remaining Risks`)
* **Rủi ro vận hành thủ công (`Human Verification Error`):** Cán bộ có thể sơ suất bỏ qua việc đối chiếu kỹ số tiền ghi trên Giấy nộp tiền của Kho bạc với Thông báo thuế gốc, dẫn đến duyệt nhầm. Rào chắn khắc phục: Bảng nhật ký kiểm toán (`Audit Logs`) ghi vết vĩnh viễn trách nhiệm người duyệt và cơ chế kiểm soát kép (`Dual Control`) của Lãnh đạo đối với ca rủi ro cao.
* **Rủi ro xung đột cổng môi trường local (`Local Port Conflict Risk`):** Trong môi trường local dev/test, nếu tiến trình khác (như AI IDE/Sidecar) chiếm dụng cổng `9000`, container MinIO sẽ không thể khởi chạy. Quản trị viên cần đảm bảo hạ tầng cổng sạch trước khi khởi động stack docker.
