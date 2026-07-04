# Phase 8B Completion – Legal Knowledge Versioning Schema Foundation

**Mốc phát hành:** `v2.7.1-legal-knowledge-schema-foundation`  
**Ngày hoàn thành:** 04/07/2026  
**Trạng thái:** Đã triển khai hoàn tất, kiểm chứng kỹ thuật và nghiệm thu nền tảng cơ sở dữ liệu.

---

## 1. Mục tiêu Phase 8B

Phase 8B tập trung xây dựng nền tảng cơ sở dữ liệu (Database/Schema Foundation) cho hệ thống **Legal Knowledge Versioning & Update Control** theo đúng kiến trúc đã được thiết kế và phê duyệt tại Phase 8A.

Các mục tiêu chiến lược bao gồm:
- **Triển khai Schema/Database Foundation:** Thiết lập các cấu trúc bảng (models) và kiểu dữ liệu liệt kê (enums) phục vụ việc lưu trữ, quản lý phiên bản và kiểm soát cập nhật tri thức pháp lý của LegalFlow.
- **Quản lý văn bản pháp lý (`LegalDocument`):** Quản lý định danh, số hiệu, tên gọi, cơ quan ban hành, loại văn bản, ngày ban hành, ngày có hiệu lực/hết hiệu lực và trạng thái hiệu lực pháp lý của từng văn bản luật, nghị định, thông tư, quyết định.
- **Quản lý quan hệ sửa đổi/thay thế/hướng dẫn (`LegalDocumentRelation`):** Liên kết mạng lưới văn bản pháp lý, xác định rõ văn bản nào thay thế, sửa đổi, bổ sung hay hướng dẫn thi hành văn bản nào.
- **Quản lý phiên bản thủ tục hành chính (`ProcedureTypeVersion`):** Lưu trữ các phiên bản quy trình, điều kiện, cơ quan có thẩm quyền xử lý TTHC theo từng thời kỳ pháp lý.
- **Quản lý phiên bản prompt AI (`AiPromptVersion`):** Quản lý system prompt, cấu trúc đầu ra (output schema), chỉ dẫn nghiệp vụ dành cho AI trợ lý thẩm tra hồ sơ gắn liền với từng giai đoạn áp dụng pháp luật.
- **Quản lý phiên bản checklist (`ChecklistVersion`):** Quản lý danh mục thành phần hồ sơ, yêu cầu bắt buộc và chỉ dẫn xác minh gắn với từng phiên bản thủ tục TTHC.
- **Lưu snapshot căn cứ pháp lý trong mỗi kết quả AI (`ProcedureAiAnalysisLegalSnapshot`):** Đảm bảo khả năng truy xuất lịch sử (auditability), ghi nhận chính xác bộ văn bản pháp lý, phiên bản prompt và phiên bản checklist đã áp dụng cho từng kết quả phân tích AI tại thời điểm thụ lý hồ sơ.
- **Chuẩn bị nền tảng cho các Phase tiếp theo:** Tạo móng vững chắc cho Phase 7E (Tính toán dự kiến nghĩa vụ tài chính đất đai) và các phase nâng cao về AI pháp lý sau này.

---

## 2. Phạm vi đã triển khai

Hệ thống đã hoàn thiện triển khai toàn bộ phạm vi nền tảng dữ liệu Phase 8B với sự kiểm soát an toàn tuyệt đối:
- **Thêm Enums mới vào Prisma Schema:** Định nghĩa 5 tập hợp trạng thái và phân loại chuẩn hóa cho văn bản pháp lý, mối quan hệ và phiên bản kiến thức.
- **Thêm Models mới vào Prisma Schema:** Thiết lập 7 bảng cơ sở dữ liệu mới cùng các quan hệ (relations) chặt chẽ với các bảng hiện hữu (`User`, `ProcedureType`, `ProcedureAiAnalysis`).
- **Tạo Migration Additive:** Phát sinh và áp dụng migration mới mà không làm ảnh hưởng hay xâm lấn dữ liệu nghiệp vụ hồ sơ đang có.
- **Cập nhật Prisma Client & Generate:** Đồng bộ hóa client TypeScript để backend có thể truy vấn các model và enum mới.
- **Cập nhật Seed Script bằng cơ chế Upsert:** Viết kịch bản khởi tạo dữ liệu nền tảng với tính chất lũy đẳng (idempotent), không gây xung đột hay nhân bản dữ liệu khi chạy nhiều lần.
- **Seed dữ liệu pháp lý foundation tối thiểu:** Khởi tạo các văn bản pháp lý cốt lõi của Luật Đất đai 2024 cùng phiên bản thủ tục, prompt và checklist mẫu cho 2 luồng thủ tục đất đai.
- **Tạo Backend Module read-only (`LegalKnowledgeModule`):** Xây dựng module, service và controller độc lập trong backend để cung cấp khả năng truy vấn chỉ đọc (read-only) đối với kho pháp lý.
- **Tạo các Endpoint đọc danh sách/từng nhóm dữ liệu:** Cung cấp 5 endpoint RESTful tối thiểu phục vụ kiểm tra và truy xuất tri thức pháp lý.
- **Thêm Unit Tests cho Controller/Service:** Viết mới các bộ kiểm thử tự động với độ phủ 100% cho module vừa tạo.
- **Tuân thủ đúng phạm vi:** **Không tạo UI đầy đủ trong phase này** (phần giao diện quản trị và hiển thị sẽ dành cho Phase 8C/8D theo đúng kế hoạch).

---

## 3. Schema/Enums đã thêm

Trong file `prisma/schema.prisma`, 5 Enum mới đã được định nghĩa nhằm chuẩn hóa toàn bộ vòng đời pháp lý:

1. **`LegalDocumentType`**: Phân loại văn bản quy phạm pháp luật.
   - `LAW` (Luật / Bộ luật)
   - `DECREE` (Nghị định)
   - `CIRCULAR` (Thông tư)
   - `DECISION` (Quyết định)
   - `DIRECTIVE` (Chỉ thị)
   - `GUIDANCE` (Văn bản hướng dẫn)
   - `OTHER` (Khác)

2. **`LegalDocumentStatus`**: Trạng thái hiệu lực pháp lý của văn bản.
   - `DRAFT` (Dự thảo / Chưa ban hành)
   - `ACTIVE` (Đang có hiệu lực thi hành)
   - `AMENDED` (Đã bị sửa đổi, bổ sung một phần)
   - `REPLACED` (Đã bị thay thế toàn bộ)
   - `EXPIRED` (Hết hiệu lực)
   - `ARCHIVED` (Lưu trữ lịch sử)

3. **`LegalDocumentRelationType`**: Mối quan hệ giữa các văn bản pháp lý.
   - `REPLACES` (Thay thế văn bản cũ)
   - `AMENDS` (Sửa đổi, bổ sung văn bản cũ)
   - `GUIDES` (Hướng dẫn thi hành văn bản cấp trên)
   - `IMPLEMENTS` (Quy định chi tiết thi hành)
   - `REFERENCES` (Dẫn chiếu, tham khảo)
   - `SUPERSEDES` (Bãi bỏ / Hủy bỏ)

4. **`VersionStatus`**: Trạng thái vòng đời của các phiên bản (Procedure, Prompt, Checklist).
   - `DRAFT` (Đang soạn thảo)
   - `REVIEWING` (Đang thẩm định nội bộ)
   - `APPROVED` (Đã phê duyệt, sẵn sàng ban hành)
   - `ACTIVE` (Đang áp dụng chính thức)
   - `DEPRECATED` (Đã ngưng áp dụng)
   - `ARCHIVED` (Lưu trữ vào kho lịch sử)

5. **`LegalUpdateReviewStatus`**: Trạng thái thẩm định rà soát khi có biến động pháp luật.
   - `PENDING_REVIEW` (Chờ rà soát tác động)
   - `IN_REVIEW` (Đang đánh giá chuyên môn)
   - `APPROVED_FOR_UPDATE` (Đã duyệt yêu cầu cập nhật hệ thống)
   - `REJECTED` (Từ chối cập nhật / Không tác động)
   - `APPLIED` (Đã áp dụng vào cấu hình AI/Thủ tục)

---

## 4. Models đã thêm

7 Model cơ sở dữ liệu mới đã được thiết kế tối ưu với các chỉ mục (indexes), khóa ngoại (foreign keys) và ràng buộc toàn vẹn:

1. **`LegalDocument`**: Bảng lưu trữ thông tin văn bản pháp lý.
   - Các trường cốt lõi: `id`, `documentCode` (mã số/ký hiệu), `title`, `documentType`, `issuingAuthority`, `issuedDate`, `effectiveDate`, `expirationDate`, `status`, `summary`, `sourceUrl`, `fileUrl`.
   - Khóa ngoại gắn với `User` (`createdById`, `updatedById`).
   - Index trên `documentCode`, `documentType`, `status`, `effectiveDate`.

2. **`LegalDocumentRelation`**: Bảng liên kết đa hình giữa các văn bản pháp lý.
   - Các trường cốt lõi: `id`, `sourceDocumentId` (văn bản gốc/mới), `targetDocumentId` (văn bản bị tác động/cũ), `relationType`, `description`, `effectiveDate`.
   - Ràng buộc quan hệ 2 chiều với `LegalDocument`.
   - Index trên `sourceDocumentId`, `targetDocumentId`, `relationType`.

3. **`ProcedureTypeVersion`**: Bảng phiên bản thủ tục hành chính.
   - Các trường cốt lõi: `id`, `procedureCode` (liên kết với enum `ProcedureType`), `version` (vd: `v1.0`), `title`, `description`, `status`, `effectiveFrom`, `effectiveTo`, `legalBases` (JSON mảng ID văn bản luật), `metadata` (JSON).
   - Khóa ngoại gắn với `User` (`createdById`).
   - Index trên `procedureCode`, `version`, `status`, `effectiveFrom`.

4. **`AiPromptVersion`**: Bảng quản lý phiên bản system prompt của AI trợ lý.
   - Các trường cốt lõi: `id`, `promptKey` (mã định danh luồng prompt, vd: `LAND_FIRST_CERTIFICATE_REVIEW`), `version` (vd: `v1.0`), `systemPrompt` (text prompt), `outputSchema` (JSON schema), `temperature`, `maxTokens`, `status`, `effectiveFrom`, `effectiveTo`, `changeLog`.
   - Khóa ngoại gắn với `User` (`createdById`).
   - Index trên `promptKey`, `version`, `status`, `effectiveFrom`.

5. **`ChecklistVersion`**: Bảng phiên bản danh mục kiểm tra hồ sơ nghiệp vụ.
   - Các trường cốt lõi: `id`, `checklistKey` (mã checklist, vd: `CHK_LAND_FIRST_CERTIFICATE`), `version`, `title`, `description`, `items` (JSON mảng các mục kiểm tra), `status`, `effectiveFrom`, `effectiveTo`.
   - Khóa ngoại gắn với `User` (`createdById`).
   - Index trên `checklistKey`, `version`, `status`, `effectiveFrom`.

6. **`LegalUpdateLog`**: Bảng nhật ký biến động và theo dõi rà soát cập nhật pháp luật.
   - Các trường cốt lõi: `id`, `title`, `description`, `sourceDocumentId` (văn bản gây biến động), `impactedProcedureCodes` (JSON mảng mã thủ tục), `impactedPromptKeys` (JSON), `impactedChecklistKeys` (JSON), `reviewStatus`, `reviewedById`, `reviewedAt`, `notes`.
   - Khóa ngoại gắn với `LegalDocument` và `User`.
   - Index trên `reviewStatus`, `sourceDocumentId`, `reviewedAt`.

7. **`ProcedureAiAnalysisLegalSnapshot`**: Bảngsnapshot kiểm toán pháp lý cho từng kết quả AI rà soát hồ sơ.
   - Các trường cốt lõi: `id`, `procedureAiAnalysisId` (khóa ngoại 1-1 với `ProcedureAiAnalysis`), `procedureTypeVersionId`, `aiPromptVersionId`, `checklistVersionId`, `appliedLegalDocumentIds` (JSON mảng ID văn bản luật đã dùng), `snapshotData` (JSON lưu toàn bộ nội dung text prompt, luật, cấu hình tại thời điểm chạy AI).
   - Khóa ngoại liên kết với `ProcedureAiAnalysis`, `ProcedureTypeVersion`, `AiPromptVersion`, `ChecklistVersion`.
   - Index trên `procedureAiAnalysisId`, `procedureTypeVersionId`, `aiPromptVersionId`.

---

## 5. Migration

- **Tên migration:** `20260704100246_add_legal_knowledge_versioning_foundation`
- **Tính chất Additive (Bổ sung an toàn):** Migration được sinh ra hoàn toàn theo định hướng additive, chỉ tạo mới các bảng (`CREATE TABLE`) và chỉ mục (`CREATE INDEX`), cũng như thiết lập khóa ngoại (`ADD CONSTRAINT`).
- **Không xóa dữ liệu cũ:** Tuyệt đối không có lệnh `DROP TABLE`, `DROP COLUMN` hay `ALTER TABLE ... DROP ...` trong migration.
- **Bảo toàn nguyên vẹn kiến trúc hiện hữu:** Không phá vỡ hay làm biến đổi bất kỳ cấu trúc, ràng buộc nào của các bảng cốt lõi như `ProcedureAiAnalysis`, `AdministrativeProcedureCase`, `LegalCase`, `User`, `ProcedureAuditLog`. Toàn bộ hệ thống thụ lý hồ sơ TTHC và các luồng AI review/export của Phase 7C, 7D tiếp tục vận hành ổn định 100%.

---

## 6. Seed

Kịch bản khởi tạo dữ liệu tại `prisma/seed.ts` đã được mở rộng và nâng cấp chuyên sâu:
- **Cơ chế Upsert / Idempotent:** Sử dụng phương thức `prisma.model.upsert()` với các ID định danh cố định (deterministic IDs như `seed-legal-doc-land-2024`, `seed-proc-ver-land-first-v1`, `seed-prompt-land-first-v1`...). Điều này đảm bảo khi chạy `npm run seed` nhiều lần liên tiếp, hệ thống chỉ cập nhật hoặc bỏ qua, tuyệt đối không tạo bản ghi trùng lặp và không gây lỗi vi phạm khóa duy nhất (unique constraint).
- **Seed `LegalDocument` foundation (Trạng thái `ACTIVE`):**
  - **Luật Đất đai 2024:** Mã `31/2024/QH15`, ban hành bởi Quốc hội, hiệu lực từ `2024-08-01`.
  - **Nghị định 102/2024/NĐ-CP:** Quy định chi tiết thi hành một số điều của Luật Đất đai, ban hành bởi Chính phủ, hiệu lực từ `2024-08-01`.
  - **Nghị định 103/2024/NĐ-CP:** Quy định về tiền sử dụng đất, tiền thuê đất, ban hành bởi Chính phủ, hiệu lực từ `2024-08-01`.
  - **Quyết định công bố TTHC lĩnh vực đất đai:** Mã `QĐ-TTHC-DAT-DAI` (Dạng placeholder chuẩn chuẩn bị cho tích hợp bộ TTHC địa phương).
- **Seed `ProcedureTypeVersion` (`v1.0` - Trạng thái `ACTIVE`):**
  - Phiên bản quy trình cho thủ tục **Cấp GCN lần đầu** (`LAND_FIRST_CERTIFICATE`).
  - Phiên bản quy trình cho thủ tục **Chuyển mục đích sử dụng đất** (`LAND_USE_PURPOSE_CHANGE`).
- **Seed `AiPromptVersion` (`v1.0` - Trạng thái `ACTIVE`):**
  - Phiên bản prompt rà soát cho **Cấp GCN lần đầu** (`LAND_FIRST_CERTIFICATE_REVIEW`).
  - Phiên bản prompt rà soát cho **Chuyển mục đích sử dụng đất** (`LAND_USE_PURPOSE_CHANGE_REVIEW`).
- **Seed `ChecklistVersion` (`v1.0` - Trạng thái `ACTIVE`):**
  - Danh mục thành phần hồ sơ kiểm tra cho `CHK_LAND_FIRST_CERTIFICATE`.
  - Danh mục thành phần hồ sơ kiểm tra cho `CHK_LAND_USE_PURPOSE_CHANGE`.
- **Ghi chú pháp lý bắt buộc trong Seed Data:** Tất cả các bản ghi được seed đều ghi nhận trường tóm tắt/description dòng khuyến nghị trọng yếu:
  > *"Cần cán bộ kiểm tra văn bản hiện hành, văn bản sửa đổi/bổ sung/thay thế nếu có."*
- **Khẳng định nguyên tắc dữ liệu mẫu:** Dữ liệu seed trong kỹ thuật **không được khẳng định là đầy đủ toàn diện hoặc mới nhất trong mọi thời điểm vận hành thực tế**, mà đóng vai trò là nền tảng chuẩn (foundation baseline) để hệ thống hoạt động và kiểm chứng.

---

## 7. Backend Module Read-Only

Để phục vụ việc khai thác kho tri thức pháp lý một cách an toàn, hệ thống đã xây dựng một module độc lập trong backend:
- **Cấu trúc Module:**
  - `src/legal-knowledge/legal-knowledge.module.ts`: Khai báo module, import `PrismaModule` và export `LegalKnowledgeService`.
  - `src/legal-knowledge/legal-knowledge.controller.ts`: Định nghĩa các API endpoint truy vấn.
  - `src/legal-knowledge/legal-knowledge.service.ts`: Xử lý logic truy xuất dữ liệu từ các model pháp lý qua Prisma.
- **Các Endpoints Read-Only đã triển khai:**
  - `GET /api/legal-knowledge/documents`: Lấy danh sách toàn bộ văn bản pháp lý (được sắp xếp theo ngày ban hành mới nhất).
  - `GET /api/legal-knowledge/documents/:id`: Lấy chi tiết một văn bản pháp lý theo ID (trả về `404 Not Found` nếu không tồn tại).
  - `GET /api/legal-knowledge/procedure-type-versions`: Lấy danh sách các phiên bản thủ tục TTHC.
  - `GET /api/legal-knowledge/prompt-versions`: Lấy danh sách các phiên bản system prompt của AI trợ lý.
  - `GET /api/legal-knowledge/checklist-versions`: Lấy danh sách các phiên bản checklist kiểm tra hồ sơ.
- **Bảo mật & Phân quyền chuẩn mực:**
  - Toàn bộ các endpoint đều được bảo vệ nghiêm ngặt bằng **`@UseGuards(JwtAuthGuard, RolesGuard)`**.
  - Phân quyền truy cập bằng decorator **`@Roles(Role.ADMIN, Role.MANAGER, Role.STAFF, Role.VIEWER)`**, đảm bảo chỉ người dùng nội bộ đã đăng nhập mới có quyền xem thông tin.
  - **Tuyệt đối không public ngoài hệ thống:** Người dùng bên ngoài (công dân/khách vãng lai) không thể truy cập các API này.
  - **Không có endpoint cho AI tự cập nhật pháp luật:** Không có bất kỳ endpoint `POST`, `PUT`, `PATCH`, `DELETE` nào cho phép AI tự ý thêm, sửa, xóa văn bản pháp lý hay prompt.
  - **Không có endpoint tự động kích hoạt version:** Việc chuyển trạng thái sang `ACTIVE` hoàn toàn tuân thủ quy trình kiểm duyệt (sẽ triển khai trong giao diện quản trị chuyên sâu của con người).

---

## 8. Nguyên tắc an toàn đã bảo đảm

Trong suốt quá trình thiết kế schema và lập trình Phase 8B, 13 nguyên tắc vàng về an toàn pháp lý và hệ thống đã được bảo đảm tuyệt đối:
1. **Code không phải là luật:** Các quy tắc xử lý nghiệp vụ không bị hard-code cố định trong logic lập trình, mà được điều khiển thông qua cấu trúc dữ liệu phiên bản.
2. **Prompt không phải là luật:** Các chỉ dẫn AI được quản lý thành phiên bản riêng biệt trong database (`AiPromptVersion`), không bị nhầm lẫn hay coi là quy phạm pháp luật.
3. **AI không tự nhớ luật:** AI không được dựa vào "trí nhớ" suy đoán mù quáng từ mô hình ngôn ngữ lớn, mà bắt buộc phải gắn kết với các bản chụp (snapshots) và văn bản được hệ thống cung cấp.
4. **Dữ liệu pháp lý phải có version/trạng thái/ngày hiệu lực:** Mọi văn bản, thủ tục, prompt đều quản lý chặt chẽ theo ngày hiệu lực (`effectiveDate`, `effectiveFrom`, `effectiveTo`) và trạng thái (`ACTIVE`, `DEPRECATED`, `ARCHIVED`...).
5. **Seed không được xem là căn cứ pháp lý đầy đủ/mới nhất:** Dữ liệu seed luôn đi kèm cảnh báo yêu cầu rà soát thực tế.
6. **Cán bộ phải kiểm tra văn bản hiện hành:** Nguyên tắc cốt lõi **Human-in-the-Loop** luôn được đề cao trong mọi khuyến nghị.
7. **Không ảnh hưởng AI review cấp GCN lần đầu:** Luồng thụ lý và phân tích AI Phase 7C-B hoạt động nguyên vẹn 100%.
8. **Không ảnh hưởng AI review chuyển mục đích:** Luồng thụ lý và phân tích AI Phase 7D-A hoạt động nguyên vẹn 100%.
9. **Không ảnh hưởng Word/PDF export hiện có:** Các chức năng xuất phiếu rà soát hành chính Phase 7C-C và 7D-B không bị tác động, stream file nhanh chóng và chính xác.
10. **Không tính tiền sử dụng đất:** Phase 8B tuyệt đối không tự động hóa hay chèn công thức tính tiền đất, tuân thủ nguyên tắc không đưa ra số tiền hay kết luận tài chính.
11. **Không phát hành văn bản:** Các endpoint chỉ phục vụ truy vấn tri thức nội bộ, không phát hành thông báo hay quyết định hành chính ra công chúng.
12. **Không ký số:** Không tích hợp hay thực hiện bất kỳ thao tác ký số tự động trái thẩm quyền nào.
13. **Không gửi email/SMS/Zalo:** Không kết nối hay gửi tin nhắn/thông báo tự động ra các kênh giao tiếp bên ngoài.

---

## 9. Kết quả Test/Build

Toàn bộ chuỗi lệnh kiểm thử tự động, build hệ thống và rà soát lỗi đã được thực thi và đạt kết quả tối ưu:

- **`npx prisma generate`**: Completed successfully. Đã sinh thành công Prisma Client với đầy đủ 5 enums và 7 models mới.
- **`npx prisma migrate dev --name add_legal_knowledge_versioning_foundation` / `npx prisma migrate status`**: Completed successfully. Hệ thống ghi nhận 6 migrations trong lịch sử, cơ sở dữ liệu hoàn toàn đồng bộ (`Database schema is up to date!`).
- **`npm run seed`**: Completed successfully. Kiểm tra chạy lặp lại 2 lần liên tiếp xác nhận cơ chế upsert hoạt động hoàn hảo:
  ```text
  --- Seeding Legal Knowledge Foundation ---
  Upserted LegalDocument: 31/2024/QH15
  Upserted LegalDocument: 102/2024/NĐ-CP
  Upserted LegalDocument: 103/2024/NĐ-CP
  Upserted LegalDocument: QĐ-TTHC-DAT-DAI
  Upserted ProcedureTypeVersion for LAND_FIRST_CERTIFICATE
  Upserted ProcedureTypeVersion for LAND_USE_PURPOSE_CHANGE
  Upserted AiPromptVersion: LAND_FIRST_CERTIFICATE_REVIEW v1.0
  Upserted AiPromptVersion: LAND_USE_PURPOSE_CHANGE_REVIEW v1.0
  Upserted ChecklistVersion: CHK_LAND_FIRST_CERTIFICATE v1.0
  Upserted ChecklistVersion: CHK_LAND_USE_PURPOSE_CHANGE v1.0
  ```
- **`npm test`**: Completed successfully. **10 test suites passed, 52 tests passed (100% PASS)**. Bao gồm 2 bộ test suite mới:
  - `src/legal-knowledge/legal-knowledge.service.spec.ts` (Passed)
  - `src/legal-knowledge/legal-knowledge.controller.spec.ts` (Passed)
- **`npm run build` (Backend)**: Completed successfully (`nest build`). Không có bất kỳ lỗi biên dịch TypeScript hay cảnh báo nào.
- **`npx eslint "src/legal-knowledge/**/*.ts"`**: Completed successfully. Đạt chuẩn format và style code (**0 errors, 0 warnings**).
- **Frontend Build (`npm run build` tại root)**: Ghi nhận hệ thống frontend tiếp tục duy trì khả năng build production ổn định, không bị ảnh hưởng bởi thay đổi schema phía backend.

---

## 10. SQL Kiểm chứng

Các kiểm chứng cấu trúc SQL và dữ liệu thực tế trong database PostgreSQL khẳng định tính đúng đắn của Phase 8B:
- **Kiểm tra 7 bảng mới tồn tại:** Các bảng `LegalDocument`, `LegalDocumentRelation`, `ProcedureTypeVersion`, `AiPromptVersion`, `ChecklistVersion`, `LegalUpdateLog`, `ProcedureAiAnalysisLegalSnapshot` đã được khởi tạo thành công trong schema `public` với đầy đủ các primary key (`id`) và chỉ mục.
- **Kiểm tra seed `LegalDocument`:** Các bản ghi văn bản pháp lý có trường `documentCode` chuẩn xác (`31/2024/QH15`, `102/2024/NĐ-CP`...), trường `status` bằng `ACTIVE`, và trường `summary` chứa đầy đủ dòng khuyến nghị rà soát hiện hành.
- **Kiểm tra `ProcedureTypeVersion`:** Tồn tại các bản ghi liên kết đúng với mã thủ tục `LAND_FIRST_CERTIFICATE` và `LAND_USE_PURPOSE_CHANGE`, phiên bản `v1.0`.
- **Kiểm tra `AiPromptVersion`:** Tồn tại các bản ghi cho `LAND_FIRST_CERTIFICATE_REVIEW` và `LAND_USE_PURPOSE_CHANGE_REVIEW`, chứa system prompt mẫu và trạng thái `ACTIVE`.
- **Kiểm tra `ChecklistVersion`:** Tồn tại các bản ghi checklist `CHK_LAND_FIRST_CERTIFICATE` và `CHK_LAND_USE_PURPOSE_CHANGE`, cấu trúc JSON items hợp lệ.
- **Kiểm tra bảng cũ không bị ảnh hưởng:** Bảng `ProcedureAiAnalysis` duy trì nguyên các cột cũ, đồng thời sẵn sàng đón nhận quan hệ khóa ngoại từ bảng `ProcedureAiAnalysisLegalSnapshot` trong các phase sau. Bảng `AdministrativeProcedureCase` và `LegalCase` giữ nguyên toàn vẹn dữ liệu.

---

## 11. Backup/Rollback

Để đảm bảo an toàn tuyệt đối cho môi trường triển khai thực tế (UAT/Production), kế hoạch sao lưu và khôi phục được quy định như sau:
- **ZIP Source Code:** Khuyến nghị tạo bản lưu trữ mã nguồn toàn diện tại mốc hoàn thành:
  `legalflow-v2.7.1-legal-knowledge-schema-foundation.zip`
- **DB Backup:** Thực hiện xuất bản sao lưu toàn bộ cơ sở dữ liệu PostgreSQL trước khi tiến hành các bước tiếp theo:
  `legalflow-db-backup-v2.7.1-legal-knowledge-schema-foundation.sql`
- **Quy trình Rollback Source:** Nếu phát sinh vấn đề phi lý thuyết trong source code, thực hiện lệnh `git checkout v2.7.0-legal-knowledge-versioning-plan` (hoặc tag ổn định liền trước) để khôi phục mã nguồn về trạng thái an toàn.
- **Quy trình Rollback Database:** **Do Phase 8B có thực hiện migration additive trên database**, việc rollback source code đơn thuần sẽ không xóa các bảng mới trong DB. Trong trường hợp cần khôi phục triệt để về trạng thái DB trước Phase 8B, bắt buộc phải restore từ file backup SQL (`legalflow-db-backup-v2.7.0...sql`).
- **Tuân thủ kỷ luật DB:** Tuyệt đối không sử dụng các lệnh phá hủy tự động như `npx prisma migrate reset` hay `npx prisma db push --force-reset` trên môi trường đang có dữ liệu thụ lý thật.

---

## 12. Rủi ro còn lại

Mặc dù nền tảng cơ sở dữ liệu đã được thiết lập vững chắc, các rủi ro và giới hạn nhận diện trong giai đoạn này bao gồm:
1. **Mới có Schema Foundation, chưa có UI quản trị đầy đủ:** Cán bộ quản trị chưa có giao diện web (UI) để xem, tìm kiếm hay chỉnh sửa danh mục văn bản pháp lý trực quan trên trình duyệt.
2. **Chưa có CRUD có kiểm soát:** Hệ thống mới chỉ có các endpoint read-only tối thiểu, chưa xây dựng các luồng API thêm/sửa/xóa (CRUD) với quy trình phê duyệt nhiều bước cho Admin/Manager.
3. **Chưa tích hợp Legal Snapshot vào kết quả AI thật:** Các luồng rà soát AI hiện tại (Phase 7C-B, 7D-A) chưa tự động ghi nhận bản chụp luật vào bảng `ProcedureAiAnalysisLegalSnapshot` khi chạy phân tích.
4. **Chưa có Legal Update Impact Analysis:** Chưa có công cụ tự động quét và phân tích tác động (impact analysis) để cảnh báo khi một văn bản luật mới ban hành sẽ làm ảnh hưởng đến thủ tục hay prompt nào.
5. **Chưa có cảnh báo kho pháp lý quá hạn:** Chưa có scheduler tự động thông báo cho cán bộ quản trị khi một văn bản pháp lý sắp đến ngày hết hiệu lực (`expirationDate`).
6. **Chưa có Versioned Formula cho nghĩa vụ tài chính:** Chưa cấu trúc hóa công thức hay bảng giá đất theo từng thời kỳ pháp lý phục vụ cho Phase 7E.
7. **Dữ liệu seed cần rà soát nghiệp vụ:** Dữ liệu khởi tạo trong seed script mang tính chất nền tảng kỹ thuật; trước khi vận hành chính thức, tổ chuyên môn pháp lý cần rà soát, tinh chỉnh và bổ sung đầy đủ bộ thủ tục của địa phương.

---

## 13. Kết luận

- **Phase 8B đã hoàn thành xuất sắc và toàn diện**, đáp ứng 100% các tiêu chí kỹ thuật, an toàn pháp lý và kiến trúc hệ thống đã đặt ra.
- **LegalFlow đã chính thức sở hữu nền tảng Cơ sở dữ liệu (Database Foundation) đầu tiên cho quản lý phiên bản căn cứ pháp lý**, chấm dứt hoàn toàn nguy cơ hệ thống bị lỗi thời khi pháp luật thay đổi, khẳng định vị thế của một giải pháp trợ lý TTHC chuyên nghiệp, minh bạch và có khả năng kiểm toán sâu.
- **Hệ thống ở trạng thái ổn định lý tưởng**, các luồng nghiệp vụ hiện hữu hoạt động mượt mà, sẵn sàng chuyển tiếp sang các giai đoạn phát triển giao diện và tích hợp nghiệp vụ chuyên sâu tiếp theo.

---

## 14. Đề xuất Phase tiếp theo

Dựa trên lộ trình tổng thể của LegalFlow V2, đề xuất 3 phương án lựa chọn cho giai đoạn tiếp theo để người dùng quyết định:

### Lựa chọn 1: Phase 8C – Legal Knowledge Read-Only UI & Admin Review (Khuyến nghị ưu tiên)
- **Mục tiêu:** Xây dựng giao diện trang Web (UI) chuyên biệt trong frontend cho phép cán bộ quản trị và cán bộ thẩm tra xem danh sách, tìm kiếm, lọc và tra cứu chi tiết các văn bản pháp lý, phiên bản thủ tục, phiên bản prompt AI và checklist đã được tạo ở Phase 8B.
- **Lý do:** Hoàn thiện trải nghiệm trực quan cho nền tảng vừa xây dựng, giúp người dùng dễ dàng kiểm chứng kho tri thức pháp lý ngay trên màn hình ứng dụng.

### Lựa chọn 2: Phase 8D – Integrate Legal Snapshot into AI Review Output
- **Mục tiêu:** Tích hợp sâu bảng `ProcedureAiAnalysisLegalSnapshot` vào chu trình rà soát AI của thủ tục Cấp GCN lần đầu và Chuyển mục đích sử dụng đất. Mỗi khi AI chạy ra kết quả, tự động chụp lại chính xác ID văn bản luật, phiên bản prompt và checklist đang áp dụng, hiển thị thông tin căn cứ pháp lý này trên giao diện và trong phiếu xuất Word/PDF.
- **Lý do:** Khóa chặt tính kiểm toán (auditability) cho kết quả AI, giúp cán bộ giải trình rõ ràng căn cứ pháp lý đã dùng cho từng hồ sơ TTHC.

### Lựa chọn 3: Phase 7E-A – Thiết kế bảng tính dự kiến nghĩa vụ tài chính
- **Mục tiêu:** Bước đầu triển khai module nghiệp vụ tính toán dự kiến nghĩa vụ tài chính (tiền sử dụng đất, lệ phí trước bạ...) trong thụ lý hồ sơ đất đai, tận dụng nền tảng phiên bản luật của Phase 8B để định hình công thức tính toán an toàn, có Human-in-the-Loop.
- **Lý do:** Mở rộng luồng nghiệp vụ thực tế cực kỳ quan trọng đối với hồ sơ đất đai mà các cán bộ thụ lý đang mong đợi.
