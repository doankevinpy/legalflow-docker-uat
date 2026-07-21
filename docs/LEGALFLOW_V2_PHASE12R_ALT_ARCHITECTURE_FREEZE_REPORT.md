# Báo Cáo Đóng Băng Kiến Trúc (`Architecture Freeze Report`) - Giai Đoạn 12R-ALT
## Phase 12R-ALT: Architecture Freeze Report

> [!CAUTION]
> **TÚYÊN BỐ ĐÓNG BĂNG (`FREEZE DECLARATION`):**
> Kể từ thẻ baseline v2.12.17, toàn bộ cấu trúc dữ liệu, API, và logic nghiệp vụ của phân hệ Nghĩa vụ tài chính được thiết lập trạng thái đóng băng (`FROZEN`). Hệ thống được xác nhận là `TECHNICAL READY` cho mục đích kiểm thử và thẩm định. Việc sửa đổi kiến trúc từ thời điểm này requires controlled change approval.

---

## 1. Purpose (Mục Đích)
Xác nhận tính toàn vẹn của mã nguồn hiện tại và thiết lập điểm neo kỹ thuật cố định (`Architecture Freeze`), ngăn ngừa tình trạng trôi dạt phạm vi (`Scope Creep`) trong thời gian chờ hoàn thiện thủ tục pháp lý hành chính.

## 2. Scope (Phạm Vi)
Tài liệu này xác định trạng thái đóng băng cho các thành phần cốt lõi của phân hệ Nghĩa vụ tài chính, bao gồm: API, Schema, Workflow, Security Model và Audit Model.

## 3. Baseline (Đường Cơ Sở)
* **Thẻ tham chiếu:** `v2.12.17-financial-obligation-deferred-evidence-preparation`
* Không phát sinh thay đổi mới về mã nguồn so với Phase 12P/12Q.

## 4. Evidence Reference (Bằng Chứng Tham Chiếu)
* Lịch sử Git Tree không ghi nhận commit liên quan đến code kể từ `v2.12.15`.
* `LEGALFLOW_V2_PHASE12P_INTERIM_SAFETY_REVIEW.md` (Xác nhận độ ổn định kỹ thuật).

## 5. Current Status (Trạng Thái Hiện Tại)
Hệ thống đạt chuẩn `TECHNICAL READY` trong phạm vi thiết kế ban đầu. Các thành phần kiến trúc đã được kiểm định ổn định trong môi trường mô phỏng.

---

## 6. API Contract Freeze

* **Endpoint structure:** Cấu trúc các API REST nội bộ liên quan đến tải lên chứng từ và đối chiếu số liệu đã được chốt phiên bản.
* **Request/response contract:** Cấu trúc payload giao tiếp giữa Frontend và Backend không được phép thay đổi, đảm bảo tính ổn định của các điểm tích hợp.
* **Validation rules:** Các quy tắc xác thực dữ liệu đầu vào (Data Validation) được duy trì nguyên trạng, đảm bảo chặn đứng các truy vấn sai định dạng.
* **Authorization requirements:** Cấu hình cấp quyền truy cập API (RBAC Token Requirements) đã được thiết lập tĩnh.

**Status:** `FROZEN`
**Future changes:** Move to LegalFlow v2.13 Development Stream.

---

## 7. Database Schema Freeze

* **Tables:** Các bảng dữ liệu phục vụ lưu trữ thông báo thuế, chứng từ nộp tiền và chiết tính nháp được giữ nguyên cấu trúc thiết kế.
* **Relations:** Các liên kết khóa ngoại (Foreign Keys) giữa bảng thủ tục và dữ liệu tài chính không được phép điều chỉnh.
* **Constraints:** Các ràng buộc toàn vẹn dữ liệu (Data Integrity Constraints), bao gồm quy tắc `officialAmount` chỉ hỗ trợ truy vấn đọc/báo cáo nháp, được giữ ổn định.
* **Migration history:** Lịch sử tập lệnh chuyển đổi cơ sở dữ liệu (Prisma Migrations) được khóa sổ ở thời điểm kết thúc Phase 12E.
* **Verification:** Schema integrity verified within tested restore drill scope.

**Status:** `FROZEN`

---

## 8. Workflow Freeze

* **Financial obligation lifecycle:** Vòng đời hồ sơ tài chính từ lúc chờ thông báo thuế đến khi hoàn thành thủ tục được chuẩn hóa cố định.
* **Evidence submission:** Luồng tải lên và lưu trữ bản scan chứng từ nộp tiền tuân thủ quy trình không thay đổi.
* **Validation:** Cơ chế kiểm tra tính hợp lệ của chứng từ do cán bộ chuyên trách thực hiện.
* **Estimation output:** Giao diện chiết tính (Draft Output) hiển thị cố định nhãn cảnh báo dự kiến.
* **Human verification:** Bước rà soát đối chiếu kép (`Dual Control Review`) của Lãnh đạo trên các ca rủi ro đã được thiết lập cứng trong luồng chạy.
* **Audit recording:** Mọi thao tác chuyển trạng thái hồ sơ tự động kích hoạt tiến trình ghi vết (Audit Trigger).

**Status:** `FROZEN`

---

## 9. Security Model Freeze

* **Authentication:** Quy trình xác thực danh tính người dùng thông qua hệ thống định danh nội bộ.
* **Authorization:** Phân quyền theo nguyên tắc đặc quyền tối thiểu (`Least Privilege`), cấm vượt cấp rà soát.
* **Role separation:** Sự phân tách 04 vai trò (`RECEIVING_OFFICER`, `REVIEWING_OFFICER`, `APPROVAL_MANAGER`, `ADMIN`) được duy trì trong phạm vi mô hình đã xác nhận.
* **Access control:** Danh mục kiểm soát truy cập đối với dữ liệu hồ sơ và chức năng hệ thống được cấu hình tĩnh.
* **Audit logging:** Lớp theo dõi an toàn thông tin để phát hiện sớm và chặn đứng lệnh API HTTP 403 không hợp lệ.

**Status:** `FROZEN`

---

## 10. Audit Model Freeze

* **Audit events:** Các sự kiện kiểm toán trọng yếu (tải lên tài liệu, xác nhận chứng từ, khóa nút hoàn thành) được định nghĩa đầy đủ.
* **Traceability:** Khả năng truy xuất ngược (`Traceability`) toàn bộ lịch sử tương tác của hồ sơ.
* **Evidence references:** Sự liên kết định danh (`Reference Links`) giữa bản ghi kiểm toán và các tệp văn bản scan được giữ vững, phục vụ việc hậu kiểm tra minh bạch.

**Status:** `FROZEN`

---

## 11. Limitations (Hạn Chế)
Sự sẵn sàng về kiến trúc này không tự động cấp quyền tiếp nhận dữ liệu thật do trạng thái chung của hệ thống vẫn là `EXPANSION DEFERRED`. Mọi thay đổi kỹ thuật nhằm cải tiến hiệu năng hoặc UX yêu cầu lập kế hoạch cho các phiên bản phát hành độc lập trong tương lai.

## 12. Summary Table (`Bảng Tổng Hợp Đóng Băng Kiến Trúc`)

| Component | Freeze Status |
| :--- | :--- |
| **API Contract** | `FROZEN` |
| **Database Schema** | `FROZEN` |
| **Workflow** | `FROZEN` |
| **Security Model** | `FROZEN` |
| **Audit Model** | `FROZEN` |
