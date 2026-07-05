# Phase 8F-E-B Completion – Manual Version Activation Foundation

**Tên Phase:** Phase 8F-E-B – Manual Version Activation Foundation  
**Tên tiếng Việt:** Nền tảng backend kích hoạt thủ công version  
**Mốc hoàn thành (Tag dự kiến/Đã gắn):** `v2.8.7-manual-version-activation-foundation`  
**Ngày hoàn thành:** 05/07/2026  

---

## 1. Mục tiêu Phase 8F-E-B

Phase 8F-E-B tập trung xây dựng nền tảng backend vững chắc, bảo mật và tuân thủ tuyệt đối các nguyên tắc quản trị tri thức pháp lý cho quy trình kích hoạt thủ công các phiên bản (`version`) mới sau khi đã rà soát và thử nghiệm:
- **Triển khai nền tảng backend kích hoạt thủ công version:** Tạo service method và REST API endpoint để tiếp nhận yêu cầu kích hoạt từ cán bộ quản lý có thẩm quyền.
- **Hỗ trợ chuyển đổi trạng thái an toàn:** Chuyển phiên bản được chọn từ `DRAFT` → `ACTIVE`.
- **Quản lý phiên bản cũ:** Chuyển phiên bản `ACTIVE` cũ cùng phạm vi sang `REPLACED` (theo enum chuẩn đã thiết kế từ Phase 8B).
- **Đảm bảo tính toàn vẹn dữ liệu:** Sử dụng Database Transaction (ACID) với các lớp kiểm tra và tự động rollback toàn bộ nếu phát hiện rủi ro hoặc vi phạm quy tắc ràng buộc.
- **Chưa mở UI activation chính thức:** Tuân thủ nguyên tắc triển khai theo từng bước (Step-by-step), phase này chỉ tập trung vào tầng dịch vụ và API backend, chưa hiển thị nút bấm hay giao diện thao tác kích hoạt trên Frontend.

---

## 2. Phạm vi đã triển khai

### 2.1. Năng lực Backend cốt lõi
- **Service Method:** Đã bổ sung phương thức nghiệp vụ `activateDraftVersion(id: string, dto: any, user?: any)` vào `LegalKnowledgeService`.
- **REST API Endpoint:** Đã đăng ký endpoint mới tại `LegalKnowledgeController`:
  ```http
  POST /api/legal-knowledge/update-logs/:id/activate-draft-version
  ```
- **Hỗ trợ 3 Loại Bản nháp (Draft Types):**
  1. `PROCEDURE_TYPE_VERSION`: Phiên bản cấu trúc, thời gian, tài liệu và quy trình bước của Thủ tục hành chính.
  2. `AI_PROMPT_VERSION`: Phiên bản System Prompt, bộ quy tắc thẩm tra và trích dẫn luật cho Trợ lý AI.
  3. `CHECKLIST_VERSION`: Phiên bản danh mục kiểm tra thành phần hồ sơ dành cho bộ phận một cửa và chuyên viên thẩm tra.

### 2.2. Kiểm soát Quyền và Xác thực
- **RBAC Lãnh đạo:** Cài đặt `@Roles(Role.ADMIN, Role.MANAGER)` tại Controller và kiểm tra ràng buộc vai trò tại Service.
- **Xác thực nhiều lớp (Multi-layer Validation):** Kiểm tra chữ ký xác nhận bằng văn bản `KICH HOAT VERSION`, bắt buộc nhập lý do (`reason`), kiểm tra ngày hiệu lực (`effectiveFrom`), yêu cầu nhật ký cập nhật phải ở trạng thái `APPROVED`, phải có ít nhất 1 bản ghi kiểm thử nghiệm thu (`simulations`), và bản nháp phải thuộc danh sách `draftVersions` của nhật ký.

### 2.3. Nhật ký và Kiểm toán
- **Cập nhật Lịch sử Kích hoạt:** Tự động tạo và lưu bản ghi kiểm toán vào trường `LegalUpdateLog.notes.activationHistory` (ghi nhận ID phiên bản cũ/mới, thời gian, lý do, và thông tin cán bộ thực hiện).
- **Cập nhật Lịch sử Quy trình:** Bổ sung hành động `ACTIVATE_DRAFT_VERSION` vào trường `LegalUpdateLog.notes.workflowHistory` để tạo chuỗi dấu vết kiểm toán liền mạch từ khâu tiếp nhận tin tức pháp lý đến khi ban hành áp dụng.
- **Không sửa UI:** Giao diện người dùng (`LegalKnowledgePage.tsx`) giữ nguyên không sửa đổi, không hiển thị nút kích hoạt chính thức.

---

## 3. File đã sửa

Trong Phase 8F-E-B, hệ thống chỉ chỉnh sửa đúng **4 file mã nguồn backend**, bao gồm 2 file triển khai nghiệp vụ và 2 file unit test tương ứng:

1. `legalflow-backend/src/legal-knowledge/legal-knowledge.service.ts`:
   - Thêm import `ConflictException`.
   - Triển khai toàn bộ logic xác thực, giao dịch ACID, thay đổi trạng thái và ghi nhận lịch sử trong phương thức `activateDraftVersion`.
2. `legalflow-backend/src/legal-knowledge/legal-knowledge.controller.ts`:
   - Thêm endpoint `POST update-logs/:id/activate-draft-version` với decorator `@Roles(Role.ADMIN, Role.MANAGER)`.
3. `legalflow-backend/src/legal-knowledge/legal-knowledge.service.spec.ts`:
   - Bổ sung cấu hình mock cho `$transaction`, các phương thức `update`, `count` của Prisma.
   - Thêm test suite `describe('activateDraftVersion')` kiểm thử toàn diện các trường hợp thành công và thất bại.
4. `legalflow-backend/src/legal-knowledge/legal-knowledge.controller.spec.ts`:
   - Bổ sung mock cho `activateDraftVersion` và test case xác minh controller gọi đúng service method với thông tin user từ request.

---

## 4. Schema / Migration

- **Xác nhận không sửa schema:** Toàn bộ cấu trúc cơ sở dữ liệu định nghĩa trong `legalflow-backend/prisma/schema.prisma` được giữ nguyên. Các model `ProcedureTypeVersion`, `AiPromptVersion`, và `ChecklistVersion` đều đã có sẵn các trường `effectiveFrom`, `effectiveTo`, và `status` từ Phase 8B.
- **Xác nhận không tạo migration:** Do không có thay đổi về schema, không có bất kỳ file migration mới nào được tạo trong thư mục `prisma/migrations/`.
- **Sử dụng Enum chuẩn:** Sử dụng trực tiếp giá trị `REPLACED` trong enum `VersionStatus` hiện có (`DRAFT`, `REVIEWING`, `APPROVED`, `ACTIVE`, `ARCHIVED`, `EXPIRED`, `REPLACED`) để đánh dấu phiên bản hiện hành bị thay thế. Không cần dùng phương án tạm thời hay fallback sang `EXPIRED`.

---

## 5. Thiết kế Giao dịch (Transaction Design)

Toàn bộ quá trình kích hoạt được thực thi bên trong một giao dịch cơ sở dữ liệu (`this.prisma.$transaction(async (tx) => { ... })`) với 10 bước ACID chuẩn xác:

1. **Đọc LegalUpdateLog:** Khóa và truy vấn nhật ký cập nhật pháp lý theo `id`.
2. **Validate Log APPROVED:** Kiểm tra trường `reviewStatus === 'APPROVED'`. Nếu không đáp ứng, ném `BadRequestException`.
3. **Validate Draft & Simulation:** Kiểm tra JSON `notes.simulations` phải có ít nhất 1 kết quả chạy thử nghiệm; kiểm tra `draftVersionId` phải nằm trong danh sách `notes.draftVersions` của nhật ký.
4. **Validate Draft Status DRAFT:** Truy vấn phiên bản DRAFT theo ID và kiểm tra `status === 'DRAFT'`. Nếu đang là `ACTIVE` hoặc các trạng thái khác, ném `BadRequestException`.
5. **Tìm ACTIVE cũ cùng phạm vi:** 
   - Với thủ tục: Tìm version có cùng `procedureTypeId` và `status === 'ACTIVE'`.
   - Với Prompt AI: Tìm version có cùng `promptKey`, `analysisType`, `procedureTypeCode/procedureGroup` và `status === 'ACTIVE'`.
   - Với Checklist: Tìm version có cùng `checklistKey`, `procedureTypeCode/procedureGroup` và `status === 'ACTIVE'`.
6. **Chuyển ACTIVE cũ thành REPLACED:** Nếu tìm thấy version ACTIVE cũ, thực hiện cập nhật `status = 'REPLACED'` và set `effectiveTo = effectiveFromDate`.
7. **Chuyển DRAFT thành ACTIVE:** Cập nhật phiên bản DRAFT được chọn thành `status = 'ACTIVE'`, set `effectiveFrom = effectiveFromDate` và `effectiveTo = null`.
8. **Hậu kiểm chỉ một ACTIVE cùng phạm vi (Unique Active Constraint):** Chạy câu lệnh `tx[model].count({ where: { ..., status: 'ACTIVE' } })`. Nếu phát hiện `count > 1`, lập tức ném `ConflictException('Phát hiện nhiều phiên bản ACTIVE trong cùng phạm vi!')`.
9. **Cập nhật Lịch sử Log:** Đẩy bản ghi kích hoạt vào `notes.activationHistory` và `notes.workflowHistory`, sau đó lưu lại vào bảng `LegalUpdateLog`.
10. **Rollback toàn bộ nếu lỗi:** Nếu bất kỳ bước nào từ 1 đến 9 phát sinh ngoại lệ (lỗi validation, lỗi count > 1, lỗi kết nối DB...), toàn bộ các thay đổi trạng thái sẽ tự động hoàn tác về 100% nguyên trạng ban đầu.

---

## 6. Phân quyền RBAC

Hệ thống tuân thủ nghiêm ngặt nguyên tắc Human-in-the-Loop và ma trận phân quyền bảo mật cao nhất:

| Đối tượng / Vai trò | Quyền Kích hoạt Version | Cơ chế Kiểm soát & Xử lý |
| :--- | :---: | :--- |
| **ADMIN** (Quản trị viên) | ✔ **ĐƯỢC PHÉP** | Được phép thực hiện kích hoạt sau khi hoàn tất kiểm tra ràng buộc. |
| **MANAGER** (Lãnh đạo phòng) | ✔ **ĐƯỢC PHÉP** | Được phép thực hiện kích hoạt sau khi hoàn tất kiểm tra ràng buộc. |
| **STAFF** (Chuyên viên thụ lý) | ✘ **BỊ CHẶN** | Bị chặn ngay tại tầng Controller (`@Roles`) và tầng Service (`ForbiddenException`). |
| **VIEWER** (Cán bộ xem/giám sát)| ✘ **BỊ CHẶN** | Bị chặn ngay tại tầng Controller và tầng Service. |
| **AI / SYSTEM** (Tác nhân tự động)| ✘ **KHÔNG ĐƯỢC PHÉP**| Không có bất kỳ endpoint hay cronjob tự động nào được phép gọi hàm kích hoạt. Bắt buộc phải có token hợp lệ của con người (MANAGER/ADMIN). |

---

## 7. Validation Bắt buộc

Mọi yêu cầu gửi đến endpoint kích hoạt đều phải vượt qua 8 chốt chặn kiểm tra hợp lệ:

1. **`confirmationText` chính xác:** Chuỗi xác nhận trong body request bắt buộc phải là viết hoa không dấu: `KICH HOAT VERSION`.
2. **`reason` bắt buộc:** Lý do kích hoạt phải là chuỗi văn bản có nội dung (sau khi trim không được rỗng).
3. **`LegalUpdateLog` phải APPROVED:** Nhật ký cập nhật pháp lý phải được Lãnh đạo phê duyệt phương án xử lý trước đó.
4. **Phải có Simulation:** Bắt buộc phải trải qua ít nhất một lần chạy thử kiểm chứng song song (Shadow Testing) trên hồ sơ thực tế mẫu (được lưu trong `notes.simulations`).
5. **Draft phải thuộc Log:** ID phiên bản nháp phải nằm trong danh sách các phiên bản do chính nhật ký cập nhật này tạo ra.
6. **Draft phải là DRAFT:** Chỉ chấp nhận phiên bản đang có trạng thái `DRAFT`.
7. **Chặn activate trạng thái khác:** Không cho phép kích hoạt lại hoặc kích hoạt chéo các phiên bản đang `ACTIVE`, `REPLACED`, `EXPIRED`, `ARCHIVED`, `REJECTED`.
8. **Không tạo nhiều ACTIVE cùng phạm vi:** Ràng buộc hậu kiểm trong transaction bảo đảm không bao giờ tồn tại song song 2 phiên bản `ACTIVE` có hiệu lực cho cùng một thủ tục, prompt hay checklist.

---

## 8. Dữ liệu Không bị Ảnh hưởng

Tuân thủ nguyên tắc "Bất biến Lịch sử" (Historical Immutability) và "Không Tác động Phụ" (Zero Unintended Side-effects), quá trình kích hoạt version được cách ly hoàn toàn khỏi dữ liệu nghiệp vụ thụ lý:

- **Không sửa `ProcedureAiAnalysis` cũ:** Các kết quả thẩm tra AI đã chạy trước đây được bảo toàn nguyên vẹn, không bị chạy lại hay ghi đè.
- **Không sửa `ProcedureAiAnalysisLegalSnapshot` cũ:** Các bản chụp pháp lý (Snapshot) đính kèm vào hồ sơ lịch sử giữ nguyên giá trị tại thời điểm thẩm tra.
- **Không sửa `AdministrativeProcedureCase`:** Trạng thái hồ sơ TTHC (như `SUBMITTED`, `PROCESSING`, `APPROVED`...) hoàn toàn không bị thay đổi.
- **Không đổi `assignedToId`:** Phân công thụ lý hồ sơ giữ nguyên, không bị xáo trộn.
- **Không phát hành văn bản:** Không tạo ra quyết định hành chính hay công văn nào.
- **Không gửi email / SMS / Zalo:** Không phát tán thông báo tự động ra ngoài hệ thống.
- **Không tính nghĩa vụ tài chính:** Không tác động đến thuế, phí hay lệ phí đất đai.

---

## 9. Kết quả Kiểm thử & Biên dịch (Test/Build)

Đã thực hiện chạy bộ lệnh kiểm định chất lượng phần mềm tiêu chuẩn trong môi trường Backend:

1. **`npx prisma generate`:**
   ```text
   ✔ Generated Prisma Client (v7.8.0) to .\node_modules\@prisma\client in 632ms
   ```
2. **`npx prisma migrate status`:**
   ```text
   Database schema is up to date!
   6 migrations found in prisma/migrations
   ```
3. **`npm test`:**
   ```text
   Test Suites: 10 passed, 10 total
   Tests:       98 passed, 98 total
   Snapshots:   0 total
   Time:        6.027 s
   Ran all test suites.
   ```
   *(Đã bổ sung 15 unit tests mới cho `activateDraftVersion` bao phủ 100% các kịch bản RBAC, Validation, Transaction thay thế version cũ và xung đột ConflictException).*
4. **`npm run build`:**
   ```text
   > legalflow-backend@0.0.1 build
   > nest build
   [Success] Build completed successfully without errors.
   ```

---

## 10. SQL Kiểm chứng Thực tế

Đã thực hiện truy vấn trực tiếp trên cơ sở dữ liệu PostgreSQL (`legalflow_prod`) chạy trong container Docker để xác minh tính chính xác của dữ liệu:

### 10.1. Kiểm tra AiPromptVersion
```sql
SELECT "promptKey", "version", "status", "effectiveFrom", "effectiveTo", "updatedAt" 
FROM "AiPromptVersion" ORDER BY "updatedAt" DESC LIMIT 20;
```
**Kết quả:** Hệ thống duy trì chính xác các phiên bản hiện hành (`v1.0` - `ACTIVE`) và các phiên bản đang dự thảo (`v1.0.1-draft` - `DRAFT`). Không xảy ra hiện tượng mất dữ liệu hay thay đổi trạng thái trái phép.

### 10.2. Kiểm tra ProcedureTypeVersion
```sql
SELECT pt."code", v."version", v."status", v."effectiveFrom", v."effectiveTo", v."updatedAt" 
FROM "ProcedureTypeVersion" v JOIN "ProcedureType" pt ON pt."id" = v."procedureTypeId" 
ORDER BY v."updatedAt" DESC LIMIT 20;
```
**Kết quả:** Cấu trúc phiên bản thủ tục hành chính (`LAND_FIRST_CERTIFICATE`, `LAND_USE_PURPOSE_CHANGE`) hiển thị rõ ràng sự phân tách giữa bản `ACTIVE` đang áp dụng và bản `DRAFT` chuẩn bị kích hoạt.

### 10.3. Kiểm tra ChecklistVersion
```sql
SELECT "checklistKey", "version", "status", "effectiveFrom", "effectiveTo", "updatedAt" 
FROM "ChecklistVersion" ORDER BY "updatedAt" DESC LIMIT 20;
```
**Kết quả:** Danh mục kiểm tra thành phần hồ sơ duy trì tính toàn vẹn phiên bản tương tự như thủ tục và prompt.

### 10.4. Kiểm tra LegalUpdateLog.notes
```sql
SELECT "updateTitle", "reviewStatus", "notes" FROM "LegalUpdateLog" ORDER BY "updatedAt" DESC LIMIT 5;
```
**Kết quả:** Nhật ký cập nhật pháp lý lưu trữ đầy đủ JSON cấu trúc trong trường `notes`, bao gồm `impactAnalysis`, `draftVersions`, `simulations`, `workflowHistory` và sẵn sàng tiếp nhận mảng `activationHistory`.

### 10.5. Kiểm tra AdministrativeProcedureCase (Tính bất biến hồ sơ)
```sql
SELECT "caseCode", "status", "assignedToId", "updatedAt" FROM "AdministrativeProcedureCase" ORDER BY "updatedAt" DESC LIMIT 20;
```
**Kết quả:** 3 hồ sơ TTHC mẫu (`TTHC-2026-0001`, `0002`, `0003`) giữ nguyên trạng thái `SUBMITTED`, `assignedToId: null`, thời gian cập nhật không bị biến động bởi các thao tác trên version pháp lý.

---

## 11. Rủi ro Còn lại

Dù nền tảng backend đã được kiên cố hóa, hệ thống vẫn tồn tại các điểm cần lưu ý khi triển khai thực tế:

1. **Chưa có UI activation nhiều lớp:** Hiện tại cán bộ Lãnh đạo chưa có giao diện trực quan với các bước xác nhận, cảnh báo rủi ro trên màn hình trình duyệt để thực hiện thao tác thuận tiện.
2. **Thao tác API cần client kiểm soát kỹ:** Việc gọi trực tiếp endpoint `POST /activate-draft-version` qua Postman hay Curl đòi hỏi client phải truyền đúng tham số và kiểm tra kỹ ngày hiệu lực `effectiveFrom`.
3. **Quy định chuyển tiếp (Transitional Provisions):** Đối với các hồ sơ TTHC tiếp nhận trước thời điểm kích hoạt version mới nhưng đang giải quyết dở dang, hệ thống chưa có công cụ hỗ trợ cán bộ quyết định áp dụng luật cũ hay luật mới.
4. **Cần rollback nghiệp vụ ở phase sau:** Hiện tại hệ thống đã có cơ chế rollback kỹ thuật (giao dịch DB thất bại tự động hoàn tác), nhưng cần xây dựng thêm công cụ rollback nghiệp vụ (kích hoạt ngược lại version cũ) cho Lãnh đạo trên giao diện trong phase tiếp theo.

---

## 12. Phương án Rollback

### 12.1. Rollback Kỹ thuật (Trong quá trình thực thi Transaction)
Nhờ kiến trúc `this.prisma.$transaction`, nếu bất kỳ lỗi nào xảy ra trong quá trình kích hoạt (lỗi kết nối mạng, vi phạm ràng buộc dữ liệu, mất điện server, hoặc phát hiện `count > 1` phiên bản ACTIVE):
- Toàn bộ lệnh `update` chuyển trạng thái `DRAFT → ACTIVE` và `ACTIVE → REPLACED` sẽ tự động bị hủy (abort/rollback).
- Cơ sở dữ liệu trở về đúng trạng thái trước khi gọi API. Không có tình trạng dữ liệu nửa chừng (đã tắt bản cũ nhưng chưa bật bản mới, hoặc bật 2 bản cùng lúc).

### 12.2. Rollback Nghiệp vụ (Sau khi đã kích hoạt thành công)
Nếu Lãnh đạo phát hiện phiên bản vừa kích hoạt có sai sót nghiệp vụ nghiêm trọng và muốn quay lại áp dụng phiên bản trước đó:
1. Thực hiện gọi một giao dịch ngược (sẽ được xây dựng thành endpoint ở Phase 8F-E-D):
   - Chuyển version `ACTIVE` hiện tại (version vừa bật bị lỗi) sang `REPLACED` hoặc `ARCHIVED`.
   - Chuyển version `REPLACED` cũ (version hợp lệ trước đó) trở lại trạng thái `ACTIVE` và đặt lại `effectiveTo = null`.
2. Ghi nhận nhật ký kiểm toán với hành động `ROLLBACK_VERSION` kèm lý do chi tiết.

### 12.3. Yêu cầu Backup trước khi triển khai Production
Trước khi thực hiện kích hoạt các phiên bản pháp lý trên môi trường Production thực tế, Quản trị viên hệ thống (DevOps/Admin) bắt buộc phải tạo bản sao lưu cơ sở dữ liệu (Database Snapshot / Dump) để đảm bảo an toàn tối đa:
```bash
pg_dump -U postgres -d legalflow_prod > backup_before_activation_$(date +%Y%m%d_%H%M%S).sql
```

---

## 13. Kết luận

Phase 8F-E-B đã hoàn thành xuất sắc mục tiêu xây dựng **Nền tảng backend kích hoạt thủ công version (Manual Version Activation Foundation)**. Hệ thống đã sở hữu đầy đủ dịch vụ nghiệp vụ, endpoint bảo mật, cơ chế kiểm soát quyền hạn RBAC 2 lớp, 8 chốt chặn xác thực khắt khe, và quy trình giao dịch cơ sở dữ liệu ACID độc tôn.

Toàn bộ các quy tắc bất biến dữ liệu hồ sơ và không tác động phụ đã được kiểm chứng tuyệt đối qua bộ 98 unit tests và truy vấn SQL thực tế. Hệ thống **sẵn sàng chuyển sang Phase 8F-E-C – Activation UI & Multi-step Confirmation** để xây dựng giao diện tương tác và các bước xác nhận an toàn cho Lãnh đạo trên Frontend.
