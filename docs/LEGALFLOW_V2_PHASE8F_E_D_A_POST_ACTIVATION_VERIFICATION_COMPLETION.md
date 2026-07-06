# Phase 8F-E-D-A Completion – Post-activation Verification & Read-only Audit Dashboard

## 1. Mục tiêu Phase 8F-E-D-A
Phase 8F-E-D-A triển khai chức năng **Kiểm chứng sau kích hoạt và bảng audit chỉ đọc (Post-activation Verification & Read-only Audit Dashboard)**.

Sau khi hệ thống đã có UI kích hoạt version thật ở Phase 8F-E-C (chuyển `DRAFT` → `ACTIVE` và `ACTIVE` cũ → `REPLACED`), lớp kiểm chứng này đóng vai trò hậu kiểm độc lập giúp cán bộ nghiệp vụ và lãnh đạo kiểm tra toàn diện sức khỏe hệ thống sau kích hoạt mà **không làm thay đổi hay tác động đến bất kỳ dữ liệu nào**:
1. Xác nhận version mới đã ở trạng thái `ACTIVE`.
2. Xác nhận version cũ đã chuyển sang `REPLACED`.
3. Bảo đảm tính duy nhất: **Không có nhiều bản `ACTIVE` cùng hiệu lực** trong cùng một phạm vi thủ tục/loại version.
4. Kiểm chứng tính toàn vẹn của hồ sơ TTHC cũ (không bị đổi trạng thái hay người xử lý).
5. Kiểm chứng tính toàn vẹn của kết quả AI rà soát và Legal Snapshot cũ (không bị ghi đè hay thay đổi).
6. Bảo đảm hệ thống sẵn sàng cho phase rollback (Phase 8F-E-D-B) sau này.

---

## 2. Phạm vi đã triển khai
1. **Lớp kiểm chứng độc lập trên Backend (Read-only Verification Engine)**:
   - Xây dựng phương thức `getActivationVerification` tại `LegalKnowledgeService`, thực hiện rà soát dữ liệu trong cơ sở dữ liệu dựa trên lịch sử `activationHistory` và `workflowHistory`.
2. **Endpoint Audit chỉ đọc (Read-only REST Endpoint)**:
   - Cung cấp endpoint truy vấn kết quả kiểm chứng cho một `LegalUpdateLog`, mở cho toàn bộ các vai trò trong hệ thống (`ADMIN`, `MANAGER`, `STAFF`, `VIEWER`) truy cập xem báo cáo kiểm chứng theo nguyên tắc minh bạch.
3. **Bảng Kiểm chứng trực quan trên UI (Read-only Audit Dashboard)**:
   - Tích hợp khối giao diện Kiểm chứng sau kích hoạt ngay trong Modal chi tiết nhật ký cập nhật (`LegalUpdateLog`) tại trang Kho căn cứ pháp lý (`LegalKnowledgePage`).
   - Trình bày rõ ràng trạng thái tổng thể (`PASS`, `WARNING`, `FAIL`), chi tiết từng version, an toàn hồ sơ TTHC và an toàn kết quả AI/Snapshot.
4. **Tuân thủ tuyệt đối ràng buộc an toàn Phase 8F-E-D-A**:
   - Không tự thay đổi version, không tự sửa hồ sơ TTHC, không sửa kết quả AI hay Legal Snapshot.
   - Không tạo nút "Rollback", không tạo nút "Khôi phục version cũ".
   - Luôn hiển thị khuyến cáo pháp lý bắt buộc theo nguyên tắc **Human-in-the-Loop**.

---

## 3. Backend service/endpoint đã thêm
### Các Endpoints REST API (`LegalKnowledgeController`)
1. **GET `/api/legal-knowledge/update-logs/:id/activation-verification`**:
   - Trả về báo cáo kiểm chứng toàn diện sau kích hoạt cho nhật ký cập nhật tương ứng.
   - Quyền truy cập: `ADMIN`, `MANAGER`, `STAFF`, `VIEWER` (bảo vệ bằng `@Roles`).
   - Bản chất: Chỉ đọc (Read-only), không thực hiện bất kỳ thay đổi nào trong cơ sở dữ liệu.

### Service Methods (`LegalKnowledgeService`)
1. **`getActivationVerification(updateLogId)`**:
   - Kiểm tra sự tồn tại của `LegalUpdateLog` và đọc dữ liệu `activationHistory`, `workflowHistory` từ cấu trúc JSON trong trường `notes`.
   - Thực hiện kiểm chứng từng version đã được kích hoạt trong lịch sử:
     - Đối với `PROCEDURE_TYPE_VERSION`: Kiểm tra trạng thái bản mới (`ACTIVE`), trạng thái bản cũ (`REPLACED`), và đếm tổng số bản `ACTIVE` trong cùng mã thủ tục (`procedureCode`).
     - Đối với `AI_PROMPT_VERSION` & `CHECKLIST_VERSION`: Kiểm tra trạng thái bản mới (`ACTIVE`), trạng thái bản cũ (`REPLACED`), và đếm tổng số bản `ACTIVE` trong cùng thủ tục và quy trình rà soát (`reviewType`).
   - Đánh giá trạng thái tổng thể (`overallStatus`):
     - `PASS`: Toàn bộ version kích hoạt đúng trạng thái và duy nhất (1 bản ACTIVE cho mỗi phạm vi).
     - `WARNING`: Không có lịch sử kích hoạt hoặc lần đầu kích hoạt chưa có bản cũ để thay thế.
     - `FAIL`: Phát hiện sự cố nghiêm trọng (bản mới chưa ACTIVE, bản cũ chưa REPLACED, hoặc có nhiều hơn 1 bản ACTIVE trong cùng phạm vi).
   - Kiểm chứng tính an toàn dữ liệu lịch sử:
     - **An toàn hồ sơ TTHC (`case safety checks`)**: Đếm tổng số hồ sơ TTHC trong hệ thống, xác nhận không bị tác động thay đổi trạng thái hay người xử lý.
     - **An toàn kết quả AI & Snapshot (`ai snapshot safety checks`)**: Đếm tổng số kết quả rà soát AI và snapshot pháp lý, xác nhận giữ nguyên giá trị lịch sử.

---

## 4. Frontend UI đã thêm
Tại `src/pages/LegalKnowledgePage.tsx` và `src/lib/legalKnowledgeApi.ts`:
1. **API Client (`legalKnowledgeApi.ts`)**:
   - Bổ sung phương thức `getActivationVerification(id)`.
2. **Khối Kiểm chứng sau kích hoạt (Read-only Audit Dashboard) trong Modal 7**:
   - Tự động hiển thị khi `LegalUpdateLog` có lịch sử kích hoạt (`activationHistory`).
   - Nút bấm **"Kiểm tra sau kích hoạt"** (kèm icon khiên bảo vệ `ShieldCheck`) cho phép người dùng kích hoạt truy vấn kiểm tra tức thì.
   - **Banner cảnh báo pháp lý bắt buộc (Màu vàng hổ phách)**:
     > **⚠️ Bảng kiểm chứng này chỉ phục vụ hậu kiểm sau kích hoạt.** Không tự thay đổi version, không sửa hồ sơ, không thay thế trách nhiệm kiểm tra của cán bộ.
   - **Trình bày trực quan trạng thái tổng thể (Overall Status Badge)**:
     - `✔ PASS (Đạt yêu cầu)`: Huy hiệu màu xanh lá cây.
     - `⚠ WARNING (Có cảnh báo)`: Huy hiệu màu vàng hổ phách.
     - `✖ FAIL (Có lỗi/bất thường)`: Huy hiệu màu đỏ hiển thị kèm danh sách cảnh báo chi tiết.
   - **Bảng lưới chi tiết 3 lớp kiểm chứng**:
     1. *Kiểm chứng trạng thái Version*: Hiển thị mã version mới ACTIVE, mã version cũ REPLACED, ngày hiệu lực và chỉ số xác nhận duy nhất (Số bản ACTIVE cùng phạm vi = 1).
     2. *An toàn hồ sơ TTHC*: Thống kê tổng số hồ sơ được kiểm tra và lời nhắn xác nhận an toàn.
     3. *An toàn kết quả AI & Snapshot*: Thống kê số lượng bài phân tích AI và Legal Snapshot được thẩm tra giữ nguyên toàn vẹn.

---

## 5. Dữ liệu và ràng buộc an toàn Phase 8F-E-D-A
- **Không thay đổi Schema**: Không tạo bảng mới, không thêm migration mới, không sửa đổi dữ liệu hiện hữu.
- **Không tự sửa lỗi (No Auto-remediation)**: Nếu phát hiện bất thường (ví dụ có 2 bản ACTIVE cùng phạm vi), hệ thống chỉ báo cáo `FAIL` và đưa ra cảnh báo trong danh sách `warnings`, tuyệt đối không tự động sửa trạng thái database.
- **Không rollback thật**: Trong phase này, hệ thống chỉ hiển thị báo cáo hậu kiểm và chuẩn bị dữ liệu audit, chưa thực hiện giao dịch khôi phục version (rollback).
- **Phân quyền rộng cho tính minh bạch**: Toàn bộ cán bộ nghiệp vụ và lãnh đạo đều có thể xem bảng kiểm chứng để giám sát việc thi hành chính sách pháp luật mới.

---

## 6. Kiểm chứng và kết quả automated test
Toàn bộ hệ thống đã được kiểm chứng thông qua bộ automated test của NestJS:
- **Backend Unit Tests (`npm test`)**:
  - Đạt **100% PASS (105/105 tests passed across 10 test suites)**.
  - Test suite `legal-knowledge.service.spec.ts` kiểm thử toàn diện 3 kịch bản kiểm chứng:
    - Kịch bản `PASS`: Khi version mới ACTIVE, version cũ REPLACED, chỉ có đúng 1 ACTIVE trong phạm vi.
    - Kịch bản `FAIL`: Khi phát hiện có 2 bản ACTIVE cùng lúc hoặc bản cũ vẫn giữ trạng thái ACTIVE.
    - Kịch bản `WARNING`: Khi nhật ký chưa có lịch sử kích hoạt.
  - Test suite `legal-knowledge.controller.spec.ts` xác nhận endpoint GET hoạt động chuẩn xác với Auth Guard và Roles Guard.
- **Backend Production Build (`npm run build`)**:
  - Biên dịch thành công 100% không có lỗi TypeScript/NestJS.
- **Frontend Production Build (`npm run build`)**:
  - Biên dịch thành công 100% (`tsc -b && vite build`) không có lỗi cú pháp hay kiểu dữ liệu TypeScript.

---

## 7. Các bước tiếp theo (Phase 8F-E-D-B)
Sau khi hoàn tất kiểm chứng hậu kích hoạt tại Phase 8F-E-D-A, hệ thống sẵn sàng tiến lên mốc tiếp theo:
- **Phase 8F-E-D-B – Activation Audit & Rollback**:
  - Xây dựng giao dịch khôi phục phiên bản (Rollback API) cho phép Lãnh đạo (`ADMIN`/`MANAGER`) đảo ngược quá trình kích hoạt khi phát hiện sai sót trong bản DRAFT đã kích hoạt.
  - Tuân thủ nguyên tắc Human-in-the-Loop: Rollback phải ghi vết đầy đủ vào nhật ký, cần xác nhận nhiều lớp và không làm mất đi lịch sử các lần kích hoạt trước đó.
