# Kế hoạch Thực hiện UAT và Phân loại Lỗi Phân hệ Hỗ trợ Nghĩa vụ Tài chính - Giai đoạn 12G
## Phase 12G: Financial Obligation Pilot UAT Execution & Issue Triage Plan

> [!IMPORTANT]
> **TÍNH CHẤT GIAI ĐOẠN 12G (DOCS-ONLY & SAFETY TRIAGE):**
> Phase 12G tập trung hoàn toàn vào việc thực thi kiểm thử người dùng cuối (UAT Execution), ghi nhận kết quả rà soát, phân loại các phát hiện/lỗi (Issue Triage) và đánh giá an toàn pháp lý đối với module "Hỗ trợ nghĩa vụ tài chính".
> Giai đoạn này tuân thủ nghiêm ngặt nguyên tắc **KHÔNG SỬA CODE** (backend/frontend), **KHÔNG SỬA SCHEMA**, **KHÔNG SEED/RESET DB** và **KHÔNG TẠO DỮ LIỆU THẬT CỦA CÔNG DÂN**. Mọi quan sát, phát hiện lỗ hổng hoặc thiếu hụt dữ liệu mẫu đều được ghi nhận vào báo cáo và chuyển tiếp cho Phase 12H xử lý.

---

## 1. Mục đích (Purpose)
* **Thực thi và Kiểm chứng (Execution & Verification):** Rà soát trạng thái hoạt động thực tế của phân hệ Nghĩa vụ tài chính trên môi trường UAT dựa trên bộ hồ sơ kiểm thử mẫu và kịch bản đã xây dựng tại Phase 12F.
* **Đánh giá An toàn Pháp lý (Safety Verification):** Kiểm tra triệt để 14 tiêu chí an toàn bắt buộc (Safety Banner, không tự điền số tiền chính thức, không phát hành thông báo thuế, chốt chặn hoàn thành hồ sơ, nhật ký kiểm toán...).
* **Phân loại Lỗi và Phát hiện (Issue Triage):** Ghi nhận, đánh giá mức độ nghiêm trọng (Critical/High/Medium/Low/Note) và tác động an toàn (Safety Impact) của các phát hiện trong quá trình kiểm tra để lên kế hoạch xử lý tại Phase 12H.
* **Xác nhận Trạng thái Dữ liệu Mẫu (Sample Data Status):** Đánh giá tình trạng sẵn sàng của dữ liệu kiểm thử trong hệ thống và đưa ra kết luận chặn luồng (BLOCKED) nếu thiếu dữ liệu mô phỏng cần thiết.

---

## 2. Đường cơ sở Hệ thống (Baseline Check)
* **Git Repository:** `C:\Users\Admin\legalflow-docker-uat`
* **Current Branch:** `main`
* **Latest Tag (Phase 12F Baseline):** `v2.12.5-financial-obligation-pilot-uat-sample-cases`
* **Working Tree Status:** Clean (Không có uncommitted changes trước khi thực hiện tạo tài liệu Phase 12G).
* **Scope of Changes in Phase 12G:** Chỉ tạo mới 5 tài liệu markdown trong thư mục `docs/`.

---

## 3. Môi trường Thực thi (Runtime Environment)
Hệ thống được vận hành trên hạ tầng Docker và Node.js cục bộ với cấu hình UAT chuẩn:
1. **Docker Infrastructure:**
   - `legalflow_postgres`: Container PostgreSQL 15 (Port `5432`) - trạng thái `Up (healthy)`.
   - `legalflow_minio`: Container MinIO Object Storage (Port `9000/9001`) - trạng thái `Up (healthy)`.
   - `legalflow_caddy`: Container Caddy Reverse Proxy (Port `8080`) - trạng thái `Up`.
2. **Application Services:**
   - **Backend API Server:** NestJS running on Port `3000` (`npm run start:dev`).
   - **Frontend Client:** React + Vite dev server running on Port `5173` (`npm run dev`).
3. **Health Check Verification (`.\scripts\health-check.ps1`):**
   - Đạt 100% kiểm tra sức khỏe hệ thống (`STATUS: ALL SYSTEMS HEALTHY & OPERATIONAL`).

---

## 4. Phạm vi Thực thi UAT (UAT Execution Scope)
Phạm vi thực thi rà soát bao gồm 8 hồ sơ mẫu (Sample Cases) được định nghĩa tại `docs/LEGALFLOW_V2_PHASE12F_SAMPLE_CASE_CATALOG.md`:
1. `FO-UAT-01`: Cấp GCN lần đầu, thiếu thông tin nghĩa vụ tài chính (Test chốt chặn dữ liệu đầu vào).
2. `FO-UAT-02`: Chuyển mục đích sử dụng đất, có bản dự kiến (Test giao diện chiết tính AI & nhãn dự kiến).
3. `FO-UAT-03`: Có thông báo thuế nhưng chưa có chứng từ nộp tiền (Test chốt chặn thiếu chứng từ).
4. `FO-UAT-04`: Có chứng từ nhưng chưa officer verified (Test chốt chặn xác nhận của Cán bộ thụ lý).
5. `FO-UAT-05`: Đủ thông báo thuế, chứng từ, officer verified (Test luồng hoàn thành thành công lý tưởng - Happy Path).
6. `FO-UAT-06`: Không phát sinh nghĩa vụ tài chính (Test trường hợp miễn thuế/tặng cho).
7. `FO-UAT-07`: Có miễn/giảm/ghi nợ cần cán bộ kiểm tra (Test cơ chế phối hợp duyệt miễn giảm giữa Officer & Manager).
8. `FO-UAT-08`: Chỉ có AI draft, không được completed (Test chốt chặn an toàn cốt lõi ngăn chặn lạm dụng AI).

> [!WARNING]
> **QUY ĐỊNH VỀ DỮ LIỆU THẢO TÁC:**
> Nếu không có dữ liệu demo/test case tương ứng trong cơ sở dữ liệu hệ thống (`legalflow_prod`) để thao tác tương tác trực tiếp, kiểm thử viên phải ghi nhận chính xác trạng thái:
> `UAT EXECUTION BLOCKED - SAMPLE CASE DATA NOT AVAILABLE`
> **Tuyệt đối không** tự seed DB hoặc tạo dữ liệu thực trong Phase 12G này.

---

## 5. Vai trò Kiểm thử viên (Tester Roles)
1. **Cán bộ Thụ lý (`OFFICER`):**
   - Thực hiện thao tác mở tab Nghĩa vụ tài chính, tạo bản dự thảo AI, rà soát cảnh báo, cập nhật tài liệu Thông báo thuế và Chứng từ nộp tiền (khi có dữ liệu).
   - Thực hiện thẩm định và đối chiếu hồ sơ gốc (`officerVerify`).
   - Thử nghiệm các thao tác hoàn thành hồ sơ để kiểm chứng các chốt chặn an toàn.
2. **Lãnh đạo Chi cục / Quản lý (`MANAGER`):**
   - Rà soát các yêu cầu xin miễn giảm, ghi nợ thuế sử dụng đất (`managerVerify`).
   - Kiểm tra nhật ký kiểm toán (Audit Log) để rà soát toàn bộ lịch sử thao tác của Cán bộ thụ lý.
3. **Quản trị viên Hệ thống (`ADMIN` / `DEV`):**
   - Kiểm tra kỹ thuật API contract, kiểm chứng phản hồi lỗi HTTP 400 từ backend khi cố tình gửi request sai quy trình.
   - Rà soát log hệ thống và trạng thái database read-only.

---

## 6. Điều kiện Dừng Kiểm thử (Stop Conditions)
Kiểm thử viên hoặc AI rà soát **phải lập tức dừng toàn bộ quá trình UAT** và báo cáo khẩn cấp nếu phát hiện bất kỳ điều kiện dừng nào sau đây:
1. **Không có Safety Banner:** Giao diện phân hệ Hỗ trợ nghĩa vụ tài chính không hiển thị hoặc bị che khuất Safety Banner cảnh báo tính chất dự kiến và pháp lý.
2. **AI/Draft tạo Official Amount:** Bản dự thảo chiết tính (`generateDraft`) tự động điền giá trị vào các trường `officialAmount` hoặc `officialTotalAmount` trong cơ sở dữ liệu.
3. **Hệ thống phát hành Thông báo thuế:** Phát hiện nút chức năng, API hoặc wording cho phép hệ thống "Phát hành thông báo thuế" thay cho cơ quan thuế có thẩm quyền.
4. **Hệ thống tự Completed khi thiếu chứng từ:** Nút hoàn thành hoặc API cho phép chuyển trạng thái `COMPLETED` khi hồ sơ chưa có Thông báo thuế hợp lệ, chưa có Chứng từ nộp tiền hợp lệ hoặc chưa được `OFFICER_VERIFIED`.
5. **Hệ thống tự gửi thông báo cho công dân:** Phát hiện luồng tự động gửi email, SMS, Zalo hoặc thông báo thanh toán đến công dân mà không qua quy trình hành chính nhà nước chuẩn.
6. **Không có Audit Log cho thao tác quan trọng:** Các thao tác khởi tạo dự thảo, tải tài liệu, xác nhận thẩm định hoặc hoàn thành không được ghi lại vào bảng `financial_obligation_audit_logs`.
7. **Không có dữ liệu demo/test case để chạy UAT:** Cơ sở dữ liệu UAT không chứa dữ liệu mẫu chuẩn của các hồ sơ `FO-UAT-01` đến `FO-UAT-08` để thao tác trực tiếp trên UI (Trạng thái dừng kỹ thuật để chuẩn bị dữ liệu tại Phase 12H).

---

## 7. Quy tắc An toàn Tuyệt đối (Safety Rules for Phase 12G)
1. Chỉ tạo/cập nhật tài liệu trong thư mục `docs/`.
2. Không sửa code backend (`legalflow-backend`).
3. Không sửa code frontend (`src`).
4. Không sửa Prisma schema (`schema.prisma`).
5. Không tạo migration database.
6. Không chỉnh sửa bất kỳ tệp cấu hình `.env` nào.
7. Không reset database.
8. Không restore database.
9. Không seed database.
10. Không tạo dữ liệu thật của công dân vào hệ thống.
11. Không tính toán số tiền chính thức (chỉ dùng số liệu giả lập/dự kiến trong docs).
12. Không phát hành thông báo thuế dưới mọi hình thức.
13. Không thay thế vai trò và thẩm quyền của cơ quan thuế.
14. Không tự ý đánh dấu hồ sơ thật đã hoàn thành nghĩa vụ tài chính.
15. Không gửi email / SMS / Zalo cho công dân.
16. Không ghi mật khẩu, token hay bí mật thực tế vào tài liệu.
17. Không thực hiện lệnh commit hoặc tag thay cho người dùng.
18. Không đưa backup hoặc tệp dữ liệu thật vào Git repository.
19. AI chỉ hỗ trợ rà soát, gợi ý và nhắc nhở thiếu thông tin; cán bộ chuyên trách phải trực tiếp rà soát và kiểm chứng thực tế.
