# Phase 8F-E-D-D Completion – Rollback UI & Multi-step Confirmation

**Tên Phase:** Phase 8F-E-D-D – Rollback UI & Multi-step Confirmation  
**Tên tiếng Việt:** Giao diện hoàn tác version pháp lý với xác nhận nhiều lớp (4 bước)  
**Mốc hoàn thành (Tag dự kiến):** `v2.8.16-manual-version-rollback-ui-complete`  
**Ngày hoàn thành:** 06/07/2026  

---

## 1. Mục tiêu Phase 8F-E-D-D

Phase 8F-E-D-D đóng vai trò là tầng giao diện thao tác người dùng (User Interface) và kiểm soát an toàn nhiều lớp cho chức năng khôi phục/hoàn tác (Rollback) trạng thái phiên bản pháp lý, kết nối trực tiếp với nền tảng backend foundation đã xây dựng tại Phase 8F-E-D-C. Mục tiêu cốt lõi của phase bao gồm:
- **Xây dựng UI Rollback trực quan, an toàn:** Triển khai panel và nút "Hoàn tác version" ngay trong trang quản trị tri thức pháp lý, giúp cán bộ quản lý (`ADMIN`, `MANAGER`) thao tác khẩn cấp khi phát hiện phiên bản vừa kích hoạt có sai sót nghiêm trọng.
- **Tích hợp API Rollback Backend:** Kết nối giao diện với REST API endpoint khôi phục phiên bản pháp lý đã được kiểm chứng.
- **Cơ chế xác nhận 4 bước (4-step Multi-step Confirmation):** Thiết lập hàng rào bảo mật kỹ thuật và nghiệp vụ vô cùng chặt chẽ, buộc người dùng rà soát tuần tự từ trạng thái hiện tại, trạng thái khôi phục dự kiến, nhập lý do chi tiết đến gõ chuỗi xác nhận tuyệt đối.
- **Đảm bảo tính bất biến của dữ liệu lịch sử:** Tuân thủ tuyệt đối nguyên tắc không tự động thao tác, không can thiệp hay chỉnh sửa hồ sơ thủ tục hành chính, kết quả thẩm tra AI hay bản chụp pháp lý cũ.

---

## 2. Các file đã sửa

Để triển khai Phase 8F-E-D-D, hệ thống chỉ thực hiện chỉnh sửa chính xác **2 file mã nguồn frontend** (không sửa backend, không sửa cấu trúc dữ liệu):

1. **`src/lib/legalKnowledgeApi.ts`**:
   - Bổ sung hàm API client `rollbackVersion(id: string, payload: { rollbackReason: string; confirmationText: string })` gửi yêu cầu HTTP POST tới backend.
2. **`src/pages/LegalKnowledgePage.tsx`**:
   - Bổ sung state quản lý modal rollback (`showRollbackModal`, `rollbackStep`, `rollbackReason`, `rollbackConfirmationText`, `rollbackError`, `rollbackResult`, `submittingRollback`).
   - Triển khai logic hiển thị nút "Hoàn tác version" độc lập, không bị ràng buộc bởi dữ liệu chẩn đoán phụ trợ.
   - Xây dựng giao diện Panel Rollback nổi bật và Modal xác nhận 4 bước với đầy đủ validation và thông báo phản hồi.

---

## 3. API Client Rollback

Hàm client mới trong `src/lib/legalKnowledgeApi.ts` kết nối trực tiếp tới REST API endpoint của backend:

- **Endpoint:** `POST /api/legal-knowledge/update-logs/:id/rollback-version`
- **Method:** `POST`
- **Payload Input:**
  ```json
  {
    "rollbackReason": "Phát hiện lỗi nghiêm trọng trong quy định về hạn mức, cần hoàn tác khẩn cấp về version trước.",
    "confirmationText": "ROLLBACK VERSION"
  }
  ```
- **Response Data (200 OK):**
  ```json
  {
    "success": true,
    "message": "Rollback version thành công",
    "logId": "uuid-of-log",
    "rolledBackAt": "2026-07-06T16:30:00.000Z",
    "affectedVersions": [
      {
        "type": "PROCEDURE_TYPE_VERSION",
        "oldActiveId": "ver-new-id",
        "restoredActiveId": "ver-old-id"
      }
    ]
  }
  ```

---

## 4. Điều kiện hiển thị nút “Hoàn tác version”

Để tránh tình trạng ẩn nút sai lệch do thiếu dữ liệu kiểm chứng (`verificationData`) hoặc lịch sử (`activationHistory`, `workflowHistory`), logic hiển thị nút rollback (`canShowRollbackButton`) đã được thiết kế tối giản, minh bạch và ổn định tuyệt đối:

```ts
const canShowRollbackButton =
  isLeader &&
  !!selectedLogForDetail &&
  selectedLogForDetail.reviewStatus === 'APPROVED';
```

**Chi tiết điều kiện:**
1. **Quyền hạn (`isLeader`):** Tài khoản đăng nhập phải có vai trò `ADMIN` hoặc `MANAGER`. (Vai trò `STAFF` không thấy nút này).
2. **Trạng thái Nhật ký (`reviewStatus === 'APPROVED'`):** Nhật ký cập nhật pháp lý đang xem phải đạt trạng thái đã phê duyệt/kích hoạt.
3. **Độc lập dữ liệu:** Tuyệt đối không ẩn nút khi thiếu `activationHistory`, `workflowHistory`, `verificationData`, `draftVersions`, hay `simulations`. Nếu thiếu dữ liệu lịch sử trên UI, hệ thống vẫn hiển thị panel kèm lời nhắc: *`Chưa xác định được đầy đủ lịch sử kích hoạt trên giao diện. Backend sẽ kiểm tra lại điều kiện rollback trước khi thực hiện.`*

---

## 5. Modal xác nhận 4 bước (Multi-step Confirmation)

Quy trình xác nhận khôi phục được chia thành 4 bước tuần tự, yêu cầu người dùng đọc và thao tác rõ ràng từng bước trước khi có thể chuyển tiếp:

- **Bước 1: Xem version hiện tại (ACTIVE):** Hiển thị chi tiết phiên bản đang có hiệu lực hiện hành (mã văn bản, số version, loại version) để cán bộ xác nhận đúng đối tượng đang gặp vấn đề.
- **Bước 2: Xem version dự kiến khôi phục (REPLACED):** Hiển thị phiên bản liền trước đó (hiện đang ở trạng thái `REPLACED` hoặc lịch sử trước khi kích hoạt) sẽ được khôi phục lại trạng thái `ACTIVE`.
- **Bước 3: Nhập lý do rollback:** Yêu cầu nhập tường minh căn cứ nghiệp vụ hoặc chỉ đạo khẩn cấp.
- **Bước 4: Nhập confirmationText và xác nhận cuối:** Yêu cầu nhập chuỗi chữ ký xác nhận tuyệt đối để kích hoạt nút gọi API.

---

## 6. Điều kiện nhập lý do rollback

Tại **Bước 3** của Modal, hệ thống áp dụng validation nghiệp vụ đối với trường lý do hoàn tác (`rollbackReason`):
- **Bắt buộc nhập:** Không được bỏ trống.
- **Độ dài tối thiểu:** Phải đạt từ **10 ký tự trở lên** (`rollbackReason.trim().length >= 10`).
- **Chốt chặn UI:** Nếu nhập dưới 10 ký tự, nút **"Tiếp tục (Bước 4/4)"** sẽ bị vô hiệu hóa (`disabled`) và hiển thị lời nhắc màu cam.

---

## 7. Điều kiện confirmationText

Tại **Bước 4** của Modal, hệ thống đặt chốt chặn bảo mật cao nhất để ngăn chặn thao tác vô ý hoặc tự động hóa bằng script/script-bot:
- Người dùng buộc phải tự tay gõ chuỗi chữ ký xác nhận vào ô input.
- **Chuỗi hợp lệ (chấp nhận 1 trong 2 chuỗi chính xác):**
  1. `ROLLBACK VERSION`
  2. `TOI XAC NHAN ROLLBACK VERSION`
- **Chốt chặn UI:** Nút **"Xác nhận rollback version"** (nút màu đỏ gọi API) sẽ ở trạng thái `disabled` cho đến khi chuỗi nhập vào khớp hoàn toàn với quy định.

---

## 8. Cơ chế Loading / Error / Result

Hệ thống cung cấp trải nghiệm phản hồi thời gian thực (Real-time Feedback) rõ ràng trong suốt quá trình xử lý giao dịch:
- **Loading State (`submittingRollback`):** Khi bấm nút xác nhận cuối cùng, nút chuyển sang trạng thái disabled kèm spinner animation `⌛ Đang thực thi rollback...`, ngăn chặn gửi request lặp lại (double-submit).
- **Error Banner (`rollbackError`):** Nếu backend từ chối (ví dụ: không tìm thấy version cũ, lỗi kết nối, hoặc sai điều kiện ACID), thông báo lỗi màu đỏ sẽ hiển thị rõ ràng ngay trong modal để cán bộ nắm bắt nguyên nhân.
- **Result Banner (`rollbackResult`):** Khi giao dịch thành công, hiển thị banner màu xanh lá `✔ Hoàn tác version thành công!`, ghi rõ danh sách các phiên bản đã được chuyển trạng thái (`PROCEDURE_TYPE_VERSION`, `AI_PROMPT_VERSION`...) và thông điệp khẳng định tính an toàn dữ liệu.

---

## 9. Cảnh báo an toàn cho người dùng

Ngay tại Panel Rollback trên trang chi tiết và tại các bước trong Modal, hệ thống luôn hiển thị thông điệp cảnh báo màu đỏ/cam nhằm định hướng đúng kỳ vọng của người dùng:
> ⚠️ **Cảnh báo đỏ:** *`Chức năng này chỉ hoàn tác trạng thái version pháp lý. Không sửa hồ sơ TTHC, không sửa kết quả AI cũ, không sửa legal snapshot cũ.`*

---

## 10. Xác nhận không rollback tự động

- **Khẳng định:** Hệ thống **tuyệt đối không** có bất kỳ cơ chế nào tự động thực hiện rollback (kể cả khi AI phát hiện rủi ro cao hay khi simulation có lỗi).
- Mọi thao tác hoàn tác phiên bản pháp lý bắt buộc phải do con người (Human-in-the-Loop) chủ động kích hoạt và trải qua đầy đủ 4 bước xác nhận thủ công.

---

## 11. Xác nhận không gọi endpoint khi chỉ mở modal hoặc chuyển bước

- **Khẳng định:** Thao tác nhấp nút "Hoàn tác version" trên trang chi tiết, chuyển đổi qua lại giữa các Bước 1, 2, 3, 4, nhập lý do hay nhập chuỗi xác nhận hoàn toàn chỉ thay đổi state cục bộ (React Local State) trên trình duyệt.
- **Tuyệt đối không có request HTTP `POST /rollback-version` nào được phát đi** cho đến khi người dùng nhấn nút bấm cuối cùng **`Xác nhận rollback version`** tại Bước 4.

---

## 12. Xác nhận không sửa hồ sơ TTHC

- **Khẳng định:** Thao tác rollback chỉ thao tác trên các bảng quản lý phiên bản tri thức pháp lý (`ProcedureTypeVersion`, `AiPromptVersion`, `ChecklistVersion`).
- Toàn bộ cơ sở dữ liệu hồ sơ thủ tục hành chính (`Case`, `CaseSubmission`, `CaseProcessingHistory`...) được bảo toàn nguyên vẹn 100%, không bị sửa đổi trạng thái hay xóa bỏ.

---

## 13. Xác nhận không sửa ProcedureAiAnalysis

- **Khẳng định:** Các kết quả phân tích AI đã chạy trước đó trong bảng `ProcedureAiAnalysis` (kể cả các phân tích chạy trong thời gian version bị lỗi có hiệu lực) được giữ nguyên tuyệt đối để phục vụ mục đích kiểm toán và truy vết lịch sử.

---

## 14. Xác nhận không sửa ProcedureAiAnalysisLegalSnapshot

- **Khẳng định:** Bảng bản chụp pháp lý `ProcedureAiAnalysisLegalSnapshot` gắn liền với từng lần phân tích AI là bất biến (Immutable). Thao tác rollback phiên bản không làm thay đổi hay xóa bỏ các bản chụp pháp lý lịch sử này.

---

## 15. Kết quả Build & Health-Check

Sau khi hoàn thiện toàn bộ mã nguồn và gỡ bỏ các marker debug, hệ thống đã trải qua quy trình kiểm thử và xác minh sức khỏe toàn diện:

- **Kiểm tra biên dịch (`npm run build`):**
  ```text
  > legalflow@0.0.0 build
  > tsc -b && vite build
  ✓ 3177 modules transformed.
  dist/index.html                     0.47 kB │ gzip:   0.30 kB
  dist/assets/index-D__Kujhp.css    102.59 kB │ gzip:  15.68 kB
  dist/assets/index-CdOsAtjT.js   1,436.61 kB │ gzip: 380.27 kB
  ✓ built in 1.68s
  ```
- **Khởi động hạ tầng & dịch vụ (`stop-legalflow.ps1` & `start-legalflow.ps1`):**
  - Hạ tầng Docker (PostgreSQL port 5432, MinIO port 9000/9001, Caddy port 8080) khởi động thành công.
  - Backend API Server (Node.js port 3000) & Frontend Dev Server (Vite port 5173) hoạt động ổn định.
- **Kiểm tra sức khỏe hệ thống (`health-check.ps1`):**
  ```text
  =================================================
           LEGALFLOW SYSTEM HEALTH CHECK
  =================================================
  [1/4] Checking Docker Containers...      [PASS]
  [2/4] Checking Backend API (Port 3000)...  [PASS]
  [3/4] Checking Frontend Server (Port 5173)... [PASS]
  [4/4] Checking MinIO Storage (Port 9000)... [PASS]
  =================================================
   STATUS: ALL SYSTEMS HEALTHY & OPERATIONAL
  =================================================
  ```
- **Trạng thái Git (`git status -s`):**
  ```text
   M src/lib/legalKnowledgeApi.ts
   M src/pages/LegalKnowledgePage.tsx
  ```

---

## 16. Ghi chú về an toàn kiểm thử trên dữ liệu hiện tại

> 🔒 **LƯU Ý AN TOÀN NGHIỆP VỤ:**  
> Trong quá trình nghiệm thu chức năng Phase 8F-E-D-D trên môi trường hiện tại, chúng tôi **chỉ kiểm chứng trọn vẹn luồng UI/UX, mở Modal 4 bước, kiểm tra các chốt chặn validation lý do và chuỗi xác nhận**.  
> **Chưa bấm thực thi nút xác nhận cuối cùng để gọi API rollback thật trên dữ liệu hiện tại** vì lý do an toàn bảo vệ trạng thái của các bộ tri thức pháp lý đang `ACTIVE` trong hệ thống UAT. Khả năng thực thi transaction ACID và khôi phục DB đã được kiểm chứng độc lập tại bộ test suite của Phase 8F-E-D-C (Backend Foundation).

---

## 17. Next Phase Đề xuất

Sau khi hoàn thành và nghiệm thu thành công tầng giao diện Rollback UI & Multi-step Confirmation (Phase 8F-E-D-D), bước đi tiếp theo theo lộ trình kiến trúc LegalFlow v2 là:

### 🚀 **Phase 8F-E-D-E: Post-rollback Verification & Audit Dashboard**
- **Mục tiêu:** Xây dựng cơ chế tự động kiểm chứng hậu khôi phục (Tương tự Phase 8F-E-D-A dành cho Activation).
- **Nội dung:**
  - Cung cấp API endpoint read-only thẩm tra trạng thái hệ thống sau khi rollback.
  - Hiển thị bảng điều khiển kiểm toán (Audit Dashboard) ngay trên UI để cán bộ xác nhận phiên bản cũ đã thực sự trở lại `ACTIVE`, phiên bản lỗi đã bị vô hiệu hóa/chuyển trạng thái, và tuyệt đối không có bất kỳ hồ sơ TTHC hay snapshot lịch sử nào bị ảnh hưởng.
