# LEGALFLOW V2 - PHASE 10I
# CONTROLLED PRODUCTION DEPLOYMENT PREPARATION PLAN

**Dự án:** Hệ thống Quản lý & Hỗ trợ Thẩm định Hồ sơ Thủ tục Hành chính Đất đai & Xây dựng (LegalFlow V2)  
**Phiên bản hệ thống:** `v2.10.8-pilot-uat-retest-stabilization-acceptance` -> `v2.10.9-controlled-production-deployment-preparation`  
**Ngày thực hiện:** 11/07/2026  
**Trạng thái Kế hoạch:** `READY FOR GO / NO-GO REVIEW`

---

## 1. Purpose

Tài liệu này thiết lập kế hoạch chuẩn bị triển khai production có kiểm soát (`Controlled Production Deployment Preparation`) cho hệ thống LegalFlow V2 sau khi đã hoàn thành các đợt kiểm thử thực tế (`Pilot UAT`) và rà soát nghiệm thu độ ổn định (`Stabilization Acceptance` tại Phase 10H). Kế hoạch xác định rõ lộ trình, giới hạn phạm vi, đối tượng người dùng, cơ chế quản trị AI (`AI Governance`) và các bước chuẩn bị kỹ thuật an toàn trước khi vận hành thực tế.

---

## 2. Deployment Objective

Mục tiêu cốt lõi của lần triển khai có kiểm soát:
* **Đưa hệ thống vào vận hành có kiểm soát:** Chuyển đổi từ môi trường chạy thử nghiệm sang môi trường xử lý công việc thực tế với quy trình kiểm soát chặt chẽ từng bước.
* **Giới hạn phạm vi người dùng ban đầu:** Chỉ mở quyền truy cập cho một nhóm nhỏ cán bộ/lãnh đạo cốt lõi nhằm giảm thiểu rủi ro vận hành diện rộng.
* **Bảo đảm backup & rollback:** Kiểm tra đầy đủ cơ chế sao lưu dữ liệu và sẵn sàng phương án khôi phục phiên bản trước (`Rollback by Git Tag`) trong trường hợp xảy ra sự cố.
* **Bảo đảm AI Governance:** Quản lý chặt chẽ hành vi của Trợ lý AI, tuyệt đối tuân thủ nguyên tắc `Human-in-the-Loop`.
* **Bảo đảm phân quyền (`RBAC`):** Kiểm soát nghiêm ngặt thẩm quyền xem, rà soát và xuất văn bản dựa trên vai trò nghiệp vụ thực tế của cán bộ.
* **Bảo đảm không dùng AI thay kết luận cán bộ:** Khẳng định rõ AI chỉ đóng vai trò tham mưu chuyên môn sơ bộ; kết quả phân tích và bản in/xuất chỉ là bản dự thảo gợi ý, không có giá trị thay thế quyết định hành chính của người có thẩm quyền.

---

## 3. Deployment Scope

Phạm vi chức năng được cho phép triển khai và giám sát trong Phase 10I:
* **Hồ sơ TTHC (`Procedure Cases`):** Tiếp nhận, tra cứu, lọc và theo dõi trạng thái hồ sơ (đặc biệt là 2 nhóm thủ tục Cấp GCN lần đầu và Chuyển mục đích sử dụng đất).
* **AI Review (`Khối 3.1`):** Khung rà soát chuyên môn sơ bộ theo nguyên tắc tham mưu Human-in-the-Loop.
* **Legal Snapshot (`Khối 3.2`):** Ghi nhận và hiển thị minh bạch bộ căn cứ pháp lý đang hiệu lực (`Active Version: v2.0-2024-LAND-LAW`) cùng khung cảnh báo trách nhiệm đối chiếu quy trình địa phương/quy hoạch.
* **Export Draft (`Khối 3.3`):** Chức năng xem trước bản dự thảo, in phiếu gợi ý AI, xuất Word (.docx) và PDF với tiêu đề bắt buộc `DU_THAO_GOI_Y_AI_`.
* **Legal Knowledge (`Knowledge Base`):** Tra cứu điều khoản luật, quy định hướng dẫn và quản lý phiên bản tri thức pháp lý.
* **Permission (`RBAC`):** Hệ thống phân quyền cho các vai trò `ADMIN`, `MANAGER`, `STAFF`, `VIEWER`.
* **Error / Empty State:** Các thẻ trạng thái rỗng và xử lý lỗi kỹ thuật thân thiện với người dùng (`CASELIST-01`, `DETAIL-02`).
* **Health-check:** Công cụ tự động giám sát tình trạng dịch vụ backend, frontend và hạ tầng Docker.
* **Backup / Restore readiness:** Đảm bảo sẵn sàng kịch bản sao lưu và phục hồi dữ liệu khi có sự đồng ý của lãnh đạo.

---

## 4. Out of Scope

Các hạng mục **KHÔNG THUỘC PHẠM VI** triển khai hoặc bị cấm kích hoạt trong phase này:
* **Không triển khai đại trà toàn đơn vị ngay:** Chưa mở rộng cho toàn bộ các phòng/ban hay toàn xã/huyện/tỉnh khi chưa hoàn thành giai đoạn chạy kiểm soát ban đầu.
* **Không tự động ký / ban hành / gửi văn bản:** Hệ thống tuyệt đối không ký số tự động, không chuyển trạng thái ban hành chính thức và không tự động gửi email/SMS/Zalo/văn bản cho công dân hoặc cơ quan khác.
* **Không thay thế cán bộ xử lý hồ sơ:** Không cho phép bất kỳ luồng xử lý tự động hoàn toàn (`Zero-touch processing`) nào đối với hồ sơ TTHC. Cán bộ thẩm quyền bắt buộc phải trực tiếp kiểm tra và ra quyết định.
* **Không kích hoạt các module Backlog chưa hoàn thiện:** Không bật các tính năng chưa được rà soát đầy đủ như upload file kèm OCR tự động, trình soạn thảo trực tiếp trước khi export (`Rich Text Editor`), hay quy trình phê duyệt nhiều bước phức tạp (`Multi-step approval workflow`).
* **Không restore production nếu không có phê duyệt riêng:** Nghiêm cấm mọi hành vi chạy lệnh khôi phục hay reset cơ sở dữ liệu (`Database Restore / Reset`) trên môi trường thực tế khi chưa có lệnh bằng văn bản của người có thẩm quyền.

---

## 5. Deployment Baseline

Thông số nền tảng kỹ thuật chuẩn bị cho triển khai (không ghi nhận mật khẩu hay bí mật thực tế):
* **Git tag hiện tại:** `v2.10.8-pilot-uat-retest-stabilization-acceptance`
* **Proposed deployment preparation tag:** `v2.10.9-controlled-production-deployment-preparation`
* **Root repo directory:** `C:\Users\Admin\legalflow-docker-uat`
* **Backend directory:** `C:\Users\Admin\legalflow-docker-uat\legalflow-backend`
* **Local Frontend URL:** `http://localhost:5173`
* **Local Proxy URL:** `http://kevindoan-legalflow.local:8080`
* **Backend API URL:** `http://127.0.0.1:3000`
* **Docker Postgres container:** `legalflow_postgres`
* **Production Database Name:** `legalflow_prod`

---

## 6. Controlled Deployment Strategy

Chiến lược triển khai có kiểm soát theo 8 bước tuần tự vững chắc:
1. **Chuẩn bị backup:** Thực hiện sao lưu an toàn toàn bộ cơ sở dữ liệu hiện hữu (`Database Backup / Snapshot`) trước giờ G.
2. **Xác nhận tag triển khai:** Kiểm tra chính xác mã nguồn đang ở mốc tag ổn định `v2.10.8-pilot-uat-retest-stabilization-acceptance`.
3. **Chạy build/test:** Kiểm tra lại toàn bộ unit test (`npm test`) và đóng gói static bundle (`npm run build`) cho cả Backend và Frontend.
4. **Restart stack:** Thực hiện khởi động lại tuần tự hạ tầng dịch vụ theo kịch bản chuẩn hóa.
5. **Health-check:** Chạy tập lệnh `health-check.ps1` để xác nhận các dịch vụ lõi đều đạt trạng thái sẵn sàng.
6. **Mở hệ thống cho nhóm người dùng giới hạn:** Cấp quyền truy cập cho danh sách cán bộ thử nghiệm lõi đã được chỉ định trước.
7. **Theo dõi lỗi trong 1-3 ngày đầu:** Giám sát chặt chẽ nhật ký hệ thống (`Audit Logs / Application Logs`) và tiếp nhận phản hồi thực tế hàng ngày.
8. **Quyết định mở rộng:** Chỉ tiến hành mở rộng phạm vi người dùng sau 3 ngày khi không phát sinh bất kỳ lỗi `Critical` hay `High` nào.

---

## 7. Initial Production User Scope

Danh sách nhóm người dùng được cấp quyền tham gia giai đoạn triển khai có kiểm soát:

| User Group | Role | Permission Level | Deployment Day | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **Quản trị hệ thống** | `ADMIN` | Toàn quyền cấu hình, giám sát log, quản trị tài khoản | Ngày `T-0` | Giới hạn 1-2 cán bộ kỹ thuật chuyên trách. |
| **Lãnh đạo Phòng/Bộ phận** | `MANAGER` | Quyền xem toàn bộ hồ sơ, kiểm tra rà soát AI, duyệt bản gợi ý | Ngày `T-0` | Giới hạn 2-3 lãnh đạo phòng chuyên môn Đất đai & Xây dựng. |
| **Chuyên viên Thụ lý cốt lõi** | `STAFF` | Quyền tiếp nhận hồ sơ, chạy AI Review, xuất bản dự thảo Word/PDF | Ngày `T-0` | Giới hạn 3-5 chuyên viên có kinh nghiệm nghiệp vụ cao tham gia Pilot. |
| **Cán bộ Tra cứu/Định kỳ** | `VIEWER` | Quyền xem chi tiết hồ sơ, xem văn bản luật (không thao tác AI/xuất) | Ngày `T+1` | Mở cho bộ phận giám sát/văn phòng theo yêu cầu thực tế. |
| **Bộ phận Hỗ trợ Kỹ thuật** | `SUPPORT` | Quyền theo dõi health-check, thu thập log lỗi, hỗ trợ người dùng | Ngày `T-0` | Nhóm hỗ trợ trực tiếp không can thiệp nghiệp vụ. |

---

## 8. Deployment Day Timeline

Lịch trình chi tiết các mốc thời gian thực hiện triển khai:
* **`T-1 Ngày` (Chuẩn bị):** Chạy backup toàn diện, kiểm tra danh sách tài khoản hợp lệ, họp rà soát checklist `Go / No-Go`.
* **`T-0 Sáng` (Kiểm tra cuối):** Kiểm tra health-check môi trường máy chủ, xác nhận tag git `HEAD` khớp chuẩn `v2.10.8`.
* **`T-0 Triển khai` (Giờ G):** Thực thi lệnh khởi động dịch vụ, kiểm tra tính sẵn sàng của proxy và đường dẫn URL nội bộ.
* **`T-0 Sau triển khai` (Khớp nối):** Nhóm chuyên viên thử nghiệm tiếp nhận 1-2 hồ sơ thực tế đầu tiên, kiểm tra trọn vẹn luồng AI Review & Export Draft.
* **`T+1 Ngày` (Giám sát ngày đầu):** Họp đánh giá nhanh 15 phút đầu ngày, ghi nhận và triage các góp ý/lỗi phát sinh.
* **`T+3 Ngày` (Đánh giá mở rộng):** Lãnh đạo nghiệp vụ và kỹ thuật họp đánh giá kết quả 3 ngày vận hành kiểm soát để quyết định mở rộng hay tiếp tục giữ phạm vi.

---

## 9. Required Evidence Before Go

Danh sách 11 bằng chứng bắt buộc phải xác nhận bằng văn bản/hình ảnh trước khi bấm nút `GO`:
1. [x] **Git status clean:** Working tree sạch 100%, không có file code modification chưa được quản lý.
2. [x] **Đúng tag baseline:** `HEAD` trỏ chính xác vào tag `v2.10.8-pilot-uat-retest-stabilization-acceptance`.
3. [x] **Backend Unit Test pass:** Bằng chứng log 129/129 unit tests đạt kết quả xanh (`0 errors`).
4. [x] **Backend Build pass:** Bằng chứng `nest build` hoàn tất không có cảnh báo lỗi.
5. [x] **Frontend Build pass:** Bằng chứng `vite build` tạo static bundle thành công trong thời gian chuẩn.
6. [x] **Migrate Status clean:** Bằng chứng `npx prisma migrate status` báo `Database schema is up to date!`.
7. [x] **Health-check pass:** Bằng chứng các container lõi (Postgres, Caddy) và API hoạt động ổn định.
8. [x] **Backup file tồn tại:** Xác nhận file sao lưu `.sql / .dump` của database `legalflow_prod` đã nằm an toàn trên ổ cứng.
9. [x] **Rollback tag xác định:** Có sẵn kịch bản quay lui về tag ổn định liền trước khi cần thiết.
10. [x] **Tài khoản production chuẩn hóa:** Cấu hình phân quyền `RBAC` chính xác cho đúng 5-10 tài khoản Pilot lõi.
11. [x] **Quán triệt nguyên tắc AI Governance:** Toàn bộ cán bộ tham gia đã được quán triệt AI chỉ là gợi ý, cán bộ chịu trách nhiệm 100% khi ban hành.

---

## 10. Next Phase

Sau khi hoàn tất kế hoạch chuẩn bị và bộ tài liệu điều kiện kèm theo, đề xuất chuyển sang bước diễn tập:
&rarr; **`Phase 10J: Controlled Production Deployment Dry Run`** *(Diễn tập triển khai thực tế trên môi trường lập sẵn trước giờ vận hành chính thức).*
