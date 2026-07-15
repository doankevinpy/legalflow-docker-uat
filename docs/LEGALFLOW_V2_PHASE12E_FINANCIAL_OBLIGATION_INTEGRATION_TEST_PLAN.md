# PLAN: LEGALFLOW V2 PHASE 12E - FINANCIAL OBLIGATION INTEGRATION TEST PLAN

## 1. Purpose
Tài liệu này xác định kế hoạch kiểm thử tích hợp (Integration Test Plan) cho Mô-đun hỗ trợ nghĩa vụ tài chính (Financial Obligation Support Module) trong hệ thống LegalFlow v2 thuộc giai đoạn Phase 12E. Mục tiêu là xác minh khả năng liên thông giữa Frontend và Backend, kiểm chứng các quy tắc chặn an toàn (Safety Blocking Rules), và đảm bảo hệ thống vận hành đúng quy trình nghiệp vụ thực tế mà không tự động thực hiện thay con người.

## 2. Baseline
- **Git Tag gốc:** `v2.12.3-frontend-financial-obligation-ui`
- **Tình trạng mã nguồn:** Đã tích hợp đầy đủ giao diện (Phase 12D) và nền tảng dịch vụ API (Phase 12C), đã thực hiện safety hardening các lỗ hổng rò rỉ dữ liệu hoặc vượt qua cơ chế chặn.

## 3. Test Environment
- **Hệ điều hành:** Windows (Local Dev)
- **Container Services (Docker):**
  - PostgreSQL (`legalflow_postgres`) - Cổng `5432`
  - MinIO Storage (`legalflow_minio`) - Cổng `9000` & `9001`
  - Caddy Reverse Proxy (`legalflow_caddy`) - Cổng `8080`
- **Dev Servers:**
  - Backend API: NestJS chạy cổng `3000`
  - Frontend App: Vite/React chạy cổng `5173`

## 4. Backend/Frontend URLs
- **Backend API Base:** `http://localhost:3000`
- **Frontend App URL:** `http://localhost:5173`
- **MinIO Console:** `http://localhost:9001`

## 5. Test Scope
Phạm vi kiểm thử bao gồm luồng tích hợp hoàn chỉnh từ đầu đến cuối (E2E) của hồ sơ Nghĩa vụ tài chính:
1. Hiển thị Tab Nghĩa vụ tài chính trên trang chi tiết hồ sơ.
2. Hiển thị Safety Banner bắt buộc cảnh báo số tiền dự kiến.
3. Trạng thái trống (Empty State) khi chưa khởi tạo đánh giá.
4. Khởi tạo Đánh giá (Assessment) nghĩa vụ tài chính.
5. Tạo Dự thảo gợi ý từ AI (Generate Draft).
6. Kiểm tra cảnh báo số tiền dự kiến (`isEstimate = true` và `warningText` hợp lệ).
7. Kiểm tra dự thảo KHÔNG sinh số tiền chính thức (`officialAmount` và `officialTotalAmount` bằng `null`/trống).
8. Thêm và cập nhật các khoản dự kiến (Estimated Items).
9. Ghi nhận Thông báo nộp tiền thuế chính thức (Tax Notice).
10. Ghi nhận Chứng từ nộp tiền (Payment Evidence).
11. Xác nhận kiểm tra của Cán bộ thụ lý (Officer Verification).
12. Phê duyệt của Lãnh đạo (Manager Verification) đối với hồ sơ rủi ro cao/miễn giảm.
13. Đánh dấu hoàn thành (Mark Completed) khi đủ điều kiện.
14. Chặn Đánh dấu hoàn thành khi thiếu bất kỳ điều kiện bắt buộc nào.
15. Ghi nhận nhật ký thay đổi (Audit Log) đầy đủ.
16. Hiển thị lỗi từ Backend rõ ràng lên giao diện người dùng.

## 6. Test Data Assumptions
- Đã có sẵn Hồ sơ thủ tục hành chính (`ProcedureCase`) trong cơ sở dữ liệu để chạy thử nghiệm.
- Tài khoản người dùng có phân quyền tương ứng:
  - Cán bộ thụ lý: Quyền `STAFF` hoặc `OFFICER`.
  - Quản lý / Lãnh đạo: Quyền `MANAGER` hoặc `ADMIN`.

## 7. Safety Rules (Nguyên tắc an toàn)
- **Không tự động hóa:** Hệ thống chỉ hỗ trợ tính toán dự thảo và lưu trữ chứng từ. Quyết định hoàn thành phải do Cán bộ xác nhận thủ công.
- **Không thay thế cơ quan thuế:** Số tiền chính thức phải được cán bộ nhập tay từ văn bản của cơ quan thuế, không được lấy từ dự thảo ước tính của AI.
- **Không tự động gửi thông báo:** Không gửi Email/SMS/Zalo tự động tới công dân khi chưa có phê duyệt/kiểm tra.
- **Không sửa đổi cấu trúc:** Không thay đổi Prisma Schema, không tạo file Migration mới trong suốt Phase 12E.

## 8. Stop Conditions (Điều kiện dừng khẩn cấp)
Kiểm thử phải **dừng lại ngay lập tức** và ghi nhận lỗi chặn (Blocker) nếu xảy ra bất kỳ điều kiện nào sau đây:
1. **Frontend không thể kết nối tới Backend:** Lỗi kết nối API mạng liên tục.
2. **AI/Draft tự sinh số tiền chính thức:** Dự thảo gợi ý tự điền giá trị vào `officialAmount` hoặc `officialTotalAmount` của Assessment.
3. **Bỏ qua cơ chế chặn:** Cho phép Đánh dấu hoàn thành (`COMPLETED`) khi thiếu thông báo thuế, thiếu chứng từ nộp tiền hợp lệ hoặc chưa được cán bộ xác nhận.
4. **Thiếu Safety Banner:** Trang chi tiết nghĩa vụ tài chính không hiển thị banner cảnh báo theo yêu cầu.
5. **Xuất hiện nút cấm:** Có nút "Phát hành thông báo thuế" hoặc nút "AI phê duyệt số tiền chính thức" trên giao diện.
6. **Tự động gửi thông tin ra ngoài:** Phát hiện log hoặc mã nguồn thực hiện gửi Email/SMS/Zalo tự động cho công dân mà không có sự kiểm soát của cán bộ.
7. **Thay đổi cơ sở dữ liệu:** Phát hiện có sự thay đổi Prisma Schema hoặc file Migration phát sinh ngoài kế hoạch.
