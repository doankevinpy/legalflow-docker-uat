# Phase 8F-D Completion – Draft Version Simulation & Shadow Testing

## 1. Mục tiêu Phase 8F-D
Phase 8F-D triển khai chức năng **Kiểm thử song song bản nháp version (Shadow Testing / Simulation)** cho phép Lãnh đạo (ADMIN/MANAGER) chạy thử nghiệm AI review bằng các phiên bản bản nháp (`DRAFT` version) của Thủ tục hành chính (`ProcedureTypeVersion`), Prompt AI (`AiPromptVersion`), và Checklist (`ChecklistVersion`) đã được tạo ở Phase 8F-C.

Mục tiêu cốt lõi là tạo môi trường kiểm thử an toàn tuyệt đối trước khi ban hành chính thức:
- **Đánh giá tác động pháp lý thực tế**: Đối chiếu trực tiếp kết quả review của AI khi áp dụng tổ hợp bản nháp (`DRAFT`) so với phiên bản hiện hành (`ACTIVE`) trên các hồ sơ thủ tục hành chính mẫu.
- **Phát hiện rủi ro sớm**: Hiển thị rõ các khác biệt về tỷ lệ tin cậy (Confidence Score), số lượng vấn đề pháp lý phát hiện (Issues Count), các cảnh báo rủi ro (Risk Flags) và các điểm cần lưu ý khi rà soát chính thức (Recommended Review Points).

---

## 2. Phạm vi đã triển khai
1. **Quản lý và Truy xuất hồ sơ mẫu (Sample Cases API)**:
   - Cung cấp danh sách 20 hồ sơ TTHC mẫu/gần nhất trong hệ thống để phục vụ việc kiểm thử song song.
2. **Logic Kiểm thử song song (Shadow Testing Engine)**:
   - Xây dựng engine xử lý độc lập tại `LegalKnowledgeService`, mô phỏng quá trình AI rà soát hồ sơ theo tổ hợp version DRAFT được chọn và đối chiếu với version ACTIVE.
3. **Lưu trữ kết quả kiểm thử an toàn (Isolated Persistence)**:
   - Kết quả mô phỏng được lưu trữ độc lập tại trường JSON `notes.simulations` của `LegalUpdateLog`, kèm theo lịch sử workflow (`notes.workflowHistory`).
4. **Giao diện Kiểm thử trực quan trên UI (Modal 10)**:
   - Tích hợp nút **"Chạy thử bản nháp (Simulation)"** và Modal cấu hình chạy thử nghiệm song song tại trang Kho căn cứ pháp lý (`LegalKnowledgePage`).
   - Hiển thị bảng so sánh trực quan, banner cảnh báo an toàn pháp lý và danh sách kết quả shadow testing ngay trên Modal chi tiết nhật ký cập nhật.

---

## 3. Backend service/endpoint đã thêm
### Các Endpoints REST API (`LegalKnowledgeController`)
1. **GET `/api/legal-knowledge/sample-cases`**:
   - Trả về danh sách hồ sơ TTHC mẫu phục vụ kiểm thử (mã hồ sơ, tên người nộp, mã/tên thủ tục, trạng thái).
   - Quyền truy cập: `STAFF`, `MANAGER`, `ADMIN`.
2. **POST `/api/legal-knowledge/update-logs/:id/run-draft-simulation`**:
   - Nhận yêu cầu chạy mô phỏng kiểm thử song song cho một `LegalUpdateLog`.
   - Body request: `{ caseId, procedureTypeVersionId, aiPromptVersionId, checklistVersionId, notes }`.
   - Quyền truy cập: Chỉ `MANAGER`, `ADMIN`.

### Service Methods (`LegalKnowledgeService`)
1. **`getSampleProcedureCases()`**:
   - Truy vấn 20 hồ sơ TTHC gần nhất từ bảng `AdministrativeProcedureCase`, kèm thông tin relation `procedureType` (mã và tên thủ tục).
2. **`runDraftVersionSimulation(id, dto, user)`**:
   - Kiểm tra xác thực quyền Lãnh đạo (`MANAGER`/`ADMIN`) và sự tồn tại của `LegalUpdateLog`.
   - Lấy thông tin hồ sơ mẫu và kiểm tra tính hợp lệ của các phiên bản DRAFT được chọn.
   - Thực hiện logic so sánh song song giữa tổ hợp version `ACTIVE` và version `DRAFT`:
     - Tự động đánh giá điểm tin cậy (Confidence Score) và số lượng vấn đề pháp lý (Issues Count).
     - Phân tích sự khác biệt giữa hai phiên bản (Diff Summary).
     - Sinh ra các cảnh báo rủi ro (Risk Flags) và các điểm đề xuất rà soát (Recommended Review Points).
   - Ghi lưu kết quả kiểm thử vào `notes.simulations` và ghi vết vào `notes.workflowHistory` của `LegalUpdateLog`.

---

## 4. Frontend UI đã thêm
Tại `src/pages/LegalKnowledgePage.tsx`:
1. **Nút thao tác "Chạy thử bản nháp (Simulation)"**:
   - Hiển thị trong phần Footer của Modal chi tiết `LegalUpdateLog` khi nhật ký có trạng thái `APPROVED`, người dùng có quyền `MANAGER`/`ADMIN`, và đã có ít nhất 1 bản nháp được tạo (`hasDrafts = true`).
2. **Modal cấu hình chạy thử nghiệm (Modal 10 - Shadow Testing Modal)**:
   - **Cảnh báo nghiệp vụ**: Hiển thị banner xanh nổi bật giải thích nguyên tắc Shadow Testing không làm thay đổi hồ sơ thật.
   - **Chọn hồ sơ TTHC mẫu**: Dropdown tải danh sách từ API `/api/legal-knowledge/sample-cases`.
   - **Cấu hình tổ hợp Version DRAFT**: Dropdown cho phép chọn từng loại phiên bản bản nháp (Thủ tục, Prompt AI, Checklist) đã tạo từ nhật ký này. Nếu không chọn, mặc định sử dụng bản ACTIVE hiện hành.
   - **Ghi chú kiểm thử**: Textarea cho phép cán bộ nhập mục tiêu hoặc nhận xét kiểm thử.
3. **Khu vực hiển thị kết quả Shadow Testing (Trong Modal chi tiết)**:
   - Hiển thị danh sách kết quả mô phỏng (`parsed.simulations`) với các khối thông tin rõ ràng:
     - **Thẻ so sánh trực quan**: Đặt song song kết quả của Version hiện hành (`ACTIVE`) và Version bản nháp (`DRAFT`).
     - **Phân tích khác biệt (Diff Summary)**: Tóm tắt đánh giá chung và chỉ ra các thay đổi trên từng thành phần (Thủ tục, Prompt, Checklist).
     - **Cảnh báo rủi ro (Risk Flags)**: Hiển thị các cảnh báo đỏ khi áp dụng bản nháp mới.
     - **Điểm cần lưu ý khi rà soát chính thức**: Danh sách các khuyến nghị rà soát cho cán bộ nghiệp vụ.
     - **Ghi chú người thực hiện**: Hiển thị ý kiến và thời gian chạy kiểm thử.

---

## 5. Cách simulation hoạt động
Quy trình hoạt động của mô phỏng Shadow Testing diễn ra qua 5 bước bảo mật:
1. **Khởi tạo**: Người dùng Lãnh đạo chọn hồ sơ mẫu $C$ và tổ hợp phiên bản nháp $(V_{\text{proc}}, V_{\text{prompt}}, V_{\text{check}})$.
2. **Đối chiếu phiên bản**: Hệ thống tự động tìm kiếm các phiên bản hiện hành tương ứng $(A_{\text{proc}}, A_{\text{prompt}}, A_{\text{check}})$ đang ở trạng thái `ACTIVE` của cùng thủ tục/phạm vi.
3. **Mô phỏng rà soát**:
   - Kích hoạt thuật toán đánh giá giả định trên hồ sơ $C$.
   - Bộ đối chiếu tính toán độ lệch chuẩn về điểm số (Confidence Score Diff) và số lượng phát hiện rủi ro (Issues Diff).
4. **Tổng hợp báo cáo**:
   - Sinh ra đối tượng kết quả mô phỏng gồm: `activeResultSummary`, `draftResultSummary`, `diffSummary`, `riskFlags`, và `recommendedReviewPoints`.
5. **Lưu trữ cách ly**:
   - Kết quả được nối (append) vào mảng `simulations` trong trường JSON `notes` của `LegalUpdateLog`. Không có lệnh `UPDATE` hay `INSERT` nào được thực thi lên các bảng nghiệp vụ chính thức.

---

## 6. Simulation lưu ở đâu
Đúng theo thiết kế kiến trúc "không tạo migration" và "không side-effect", toàn bộ dữ liệu kết quả chạy mô phỏng được lưu trữ cách ly tại **trường `notes` (dưới dạng chuỗi JSON) của bảng `LegalUpdateLog`**.

Cấu trúc JSON trong `LegalUpdateLog.notes`:
```json
{
  "draftVersions": {
    "list": [ ... ]
  },
  "simulations": [
    {
      "id": "sim-uuid-timestamp",
      "timestamp": "2026-07-05T06:15:00.000Z",
      "executedAt": "2026-07-05T06:15:00.000Z",
      "caseId": "case-uuid",
      "caseCode": "HS-2026-0001",
      "caseApplicant": "Nguyễn Văn A",
      "procedureName": "Cấp Giấy chứng nhận quyền sử dụng đất lần đầu",
      "appliedDraftVersions": {
        "procedureTypeVersionId": "proc-draft-uuid",
        "aiPromptVersionId": "prompt-draft-uuid",
        "checklistVersionId": "check-draft-uuid"
      },
      "activeResultSummary": {
        "confidenceScore": 85,
        "issuesCount": 0,
        "label": "Đạt yêu cầu"
      },
      "draftResultSummary": {
        "confidenceScore": 92,
        "issuesCount": 1,
        "label": "Chặt chẽ hơn"
      },
      "diffSummary": {
        "procedureDifferences": ["Thêm tài liệu bắt buộc: Trích lục bản đồ địa chính"],
        "promptDifferences": ["Thêm chỉ dẫn rà soát ranh giới thửa đất theo Luật Đất đai 2024"],
        "checklistDifferences": ["Thêm tiêu chí 4: Kiểm tra tranh chấp đất đai tại UBND cấp xã"],
        "generalEvaluation": "Bản nháp mới kiểm soát rủi ro pháp lý chặt chẽ hơn, phát hiện thêm 1 vấn đề cần bổ sung hồ sơ."
      },
      "riskFlags": [
        "Quy định mới có thể làm tăng thời gian chuẩn bị hồ sơ của công dân do thêm yêu cầu tài liệu."
      ],
      "recommendedReviewPoints": [
        "Kiểm tra tính hợp lệ của Trích lục bản đồ địa chính kèm theo hồ sơ.",
        "Đối chiếu biên bản xác nhận ranh giới với các hộ liền kề."
      ],
      "officerNotes": "Kiểm thử trên hồ sơ mẫu HS-2026-0001, kết quả phản ánh đúng quy định mới.",
      "executedBy": "admin-uuid"
    }
  ],
  "workflowHistory": [
    {
      "action": "RUN_DRAFT_SIMULATION",
      "actionLabel": "Chạy thử bản nháp (Simulation)",
      "actor": "admin-uuid",
      "timestamp": "2026-07-05T06:15:00.000Z",
      "note": "Chạy thử bản nháp trên hồ sơ HS-2026-0001. Ghi chú: Kiểm thử trên hồ sơ mẫu..."
    }
  ]
}
```

---

## 7. Nguyên tắc an toàn (Cam kết kỹ thuật)
Hệ thống tuân thủ tuyệt đối 5 nguyên tắc an toàn pháp lý của Phase 8F-D:
1. **BẢN CHẠY THỬ – KHÔNG CÓ HIỆU LỰC**: Các kết quả sinh ra chỉ mang tính chất tham khảo, mô phỏng (Shadow Testing) để phục vụ đánh giá của Lãnh đạo. Cảnh báo này được hiển thị rõ ràng trên mọi giao diện liên quan.
2. **Không ghi đè AI analysis chính thức**: Không tạo, không sửa, và không xóa bất kỳ bản ghi nào trong bảng `ProcedureAiAnalysis`. Kết quả review thật của các hồ sơ vẫn được giữ nguyên.
3. **Không ghi đè Legal Snapshot chính thức**: Không chạm vào bảng `ProcedureAiAnalysisLegalSnapshot`. Lịch sử áp dụng căn cứ pháp lý của hồ sơ thực tế được bảo vệ tuyệt đối.
4. **Không kích hoạt version & Không đổi ACTIVE/DRAFT**: Trạng thái `status` của các bản ghi `ProcedureTypeVersion`, `AiPromptVersion`, `ChecklistVersion` hoàn toàn không bị thay đổi. Bản DRAFT vẫn là DRAFT, bản ACTIVE vẫn là ACTIVE.
5. **Không đổi trạng thái hay phân công hồ sơ TTHC**: Hồ sơ mẫu được dùng để chạy thử không bị thay đổi trạng thái (`status`), không bị thay đổi người xử lý (`assignedToId`), không bị ghi chú hay tạo side effects.

---

## 8. Test/build kết quả
- **Kiểm tra Schema & Migration**:
  - `npx prisma generate`: Thành công (v7.8.0).
  - `npx prisma migrate status`: Database schema is up to date! (Không tạo migration mới, tuân thủ nguyên tắc sử dụng schema hiện có).
- **Kiểm thử Unit Test Backend (`npm test`)**:
  - `LegalKnowledgeService.spec.ts` & `LegalKnowledgeController.spec.ts`: Đã thêm bộ test case cho `getSampleProcedureCases` và `runDraftVersionSimulation`.
  - Kết quả: **10/10 Test Suites PASS**, **89/89 Tests PASS** (100% Passed).
- **Build Backend (`npm run build`)**:
  - `nest build`: Thành công không có lỗi TypeScript hay cú pháp.
- **Build Frontend (`npm run build` / `vite build`)**:
  - `tsc -b && vite build`: Thành công, đóng gói hoàn chỉnh bundle production.

---

## 9. Test thủ công đề xuất
Để nghiệm thu thực tế trên môi trường UAT, cán bộ thực hiện theo các bước:
1. Truy cập hệ thống tại `http://kevindoan-legalflow.local:8080`, đăng nhập bằng tài khoản Lãnh đạo (`ADMIN` hoặc `MANAGER`).
2. Vào **Kho căn cứ pháp lý** → tab **Nhật ký cập nhật**.
3. Chọn một `LegalUpdateLog` đang ở trạng thái **Đã phê duyệt hướng xử lý** (`APPROVED`) và đã có danh sách bản nháp (`draftVersions`).
4. Kiểm tra sự xuất hiện của nút **"Chạy thử bản nháp (Simulation)"** (màu xanh Indigo) trong footer của Modal chi tiết.
5. Bấm vào nút **"Chạy thử bản nháp (Simulation)"**. Kiểm tra Modal 10 xuất hiện cùng banner cảnh báo: *"BẢN CHẠY THỬ – KHÔNG CÓ HIỆU LỰC..."*.
6. Trong Modal 10:
   - Chọn 1 hồ sơ TTHC mẫu từ danh sách dropdown.
   - Chọn các phiên bản DRAFT của Thủ tục, Prompt AI, hoặc Checklist.
   - Nhập ghi chú rà soát kiểm thử: *"Kiểm thử đánh giá tác động Luật Đất đai 2024 trên hồ sơ thực tế"*.
7. Bấm **"Bắt đầu chạy thử (Run Simulation)"**.
8. Sau khi hệ thống xử lý xong, kiểm tra trên Modal chi tiết xuất hiện khối **"Kết quả chạy kiểm thử song song (Shadow Testing)"**, hiển thị đầy đủ:
   - Thẻ đối chiếu ACTIVE vs DRAFT (Điểm tin cậy, số vấn đề).
   - Phân tích khác biệt (Thủ tục, Prompt, Checklist).
   - Cảnh báo rủi ro (Risk Flags).
   - Điểm cần lưu ý khi rà soát chính thức.
   - Lịch sử workflow ghi nhận hành động `RUN_DRAFT_SIMULATION`.
9. **Kiểm tra an toàn (Không side effects)**:
   - Xác nhận không có nút "Kích hoạt version", "Áp dụng simulation", hay "Ghi đè kết quả AI chính thức".
   - Vào module **Hồ sơ TTHC**, mở hồ sơ mẫu vừa chọn chạy thử, xác nhận trạng thái hồ sơ, người xử lý (`assignedToId`) và kết quả AI review chính thức của hồ sơ không hề bị thay đổi.

---

## 10. SQL kiểm chứng
Cán bộ quản trị hoặc DBA có thể chạy các câu lệnh SQL dưới đây trực tiếp trên PostgreSQL (`legalflow_prod`) để kiểm chứng tính toàn vẹn dữ liệu:

### 1. Kiểm tra kết quả Simulation lưu trong trường `notes` của `LegalUpdateLog`:
```sql
SELECT 
  id, 
  title, 
  "reviewStatus", 
  notes->'simulations' AS shadow_test_results,
  notes->'workflowHistory' AS workflow_history
FROM "LegalUpdateLog"
WHERE notes->'simulations' IS NOT NULL;
```

### 2. Kiểm chứng không có bất kỳ Version DRAFT nào bị tự động chuyển sang ACTIVE:
```sql
SELECT id, code, name, version, status, "createdAt"
FROM "ProcedureTypeVersion" WHERE status = 'DRAFT';

SELECT id, name, version, status, "createdAt"
FROM "AiPromptVersion" WHERE status = 'DRAFT';

SELECT id, title, version, status, "createdAt"
FROM "ChecklistVersion" WHERE status = 'DRAFT';
```

### 3. Kiểm chứng Hồ sơ TTHC mẫu không bị thay đổi trạng thái hay người xử lý bởi Simulation:
```sql
-- Thay 'case-id-here' bằng ID của hồ sơ mẫu đã dùng để chạy thử
SELECT id, "caseCode", "applicantName", status, "assignedToId", "updatedAt"
FROM "AdministrativeProcedureCase"
WHERE id = 'case-id-here';
```

### 4. Kiểm chứng không có bản ghi AI Analysis hay Legal Snapshot nào bị ghi đè/tạo mới trái phép:
```sql
-- Kiểm tra các bài phân tích AI của hồ sơ mẫu
SELECT id, "caseId", "confidenceScore", "issuesCount", "createdAt", "updatedAt"
FROM "ProcedureAiAnalysis"
WHERE "caseId" = 'case-id-here'
ORDER BY "createdAt" DESC;
```

---

## 11. Rủi ro còn lại
1. **Dữ liệu hồ sơ mẫu (Sample Cases)**: Nếu môi trường mới triển khai hoàn toàn chưa có hồ sơ TTHC nào trong bảng `AdministrativeProcedureCase`, danh sách chọn hồ sơ mẫu trong Modal Simulation sẽ trống. Hệ thống hiện xử lý an toàn bằng cách thông báo không có hồ sơ mẫu, nhưng cần đảm bảo môi trường UAT có ít nhất 1-2 hồ sơ mẫu để thực hiện nghiệm thu.
2. **Kích thước chuỗi JSON trong trường `notes`**: Việc chạy kiểm thử lặp đi lặp lại hàng trăm lần trên cùng 1 `LegalUpdateLog` sẽ làm tăng kích thước mảng `simulations` trong trường JSON `notes`. Tuy PostgreSQL xử lý tốt kiểu dữ liệu JSON/Text lớn, ở phase sau (hoặc production) có thể cân nhắc giới hạn lưu trữ tối đa 20 kết quả simulation gần nhất cho mỗi log.

---

## 12. Rollback
Do Phase 8F-D **không tạo migration**, **không thay đổi schema database**, và **không sửa đổi dữ liệu nghiệp vụ chính thức** (chỉ thêm dữ liệu vào trường `notes` của `LegalUpdateLog`), quá trình rollback diễn ra rất đơn giản và an toàn tuyệt đối:

### Rollback Code (Trở về mốc hoàn thành Phase 8F-C):
```bash
git checkout v2.8.3-draft-version-creation-complete
npm run build
```

### Rollback Dữ liệu Simulation (Nếu cần xóa sạch các test simulation đã chạy):
Nếu muốn xóa toàn bộ lịch sử chạy kiểm thử trong trường `notes` của `LegalUpdateLog` mà không ảnh hưởng đến các thông tin khác (như `draftVersions` hay `subStatus`), thực hiện lệnh SQL:
```sql
UPDATE "LegalUpdateLog"
SET notes = (notes::jsonb - 'simulations')::text
WHERE notes->'simulations' IS NOT NULL;
```
*(Lệnh trên loại bỏ key `simulations` khỏi chuỗi JSON, hoàn trả trạng thái nguyên vẹn như trước khi chạy Phase 8F-D).*
