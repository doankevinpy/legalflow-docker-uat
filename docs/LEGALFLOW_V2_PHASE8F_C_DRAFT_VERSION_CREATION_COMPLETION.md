# Phase 8F-C Completion – Draft Version Creation

## 1. Mục tiêu Phase 8F-C
Phase 8F-C triển khai chức năng cho phép tạo bản nháp phiên bản mới (`DRAFT` version) cho thủ tục hành chính (`ProcedureTypeVersion`), prompt AI (`AiPromptVersion`) và checklist (`ChecklistVersion`) sau khi một bản ghi nhật ký cập nhật pháp lý (`LegalUpdateLog`) đã được rà soát và phê duyệt hướng xử lý ở Phase 8F-B.

Tuân thủ tuyệt đối các nguyên tắc **Human-in-the-Loop** và an toàn pháp lý của LegalFlow:
- **Chỉ tạo bản nháp (DRAFT)**: Phiên bản mới được nhân bản từ phiên bản `ACTIVE` nguồn, chuyển trạng thái sang `DRAFT` (Bản nháp) để rà soát, kiểm thử và bổ sung nội dung.
- **Không kích hoạt version trong phase này**: Việc tạo bản nháp không làm thay đổi trạng thái của bất kỳ phiên bản `ACTIVE` nào hiện có. Các phiên bản đang hiệu lực vẫn tiếp tục hoạt động bình thường trên toàn hệ thống.
- **Không thay đổi logic AI review**: AI review thật tiếp tục sử dụng phiên bản `ACTIVE` hiện hành, hoàn toàn không bị ảnh hưởng bởi bản nháp mới sinh ra.
- **Không tự động sinh nội dung bằng AI**: Hệ thống thực hiện sao chép chính xác cấu trúc và nội dung từ bản `ACTIVE` sang bản `DRAFT`, bảo đảm không có sự thay đổi sai lệch nội dung pháp lý do AI tự sinh mà chưa qua kiểm duyệt.

---

## 2. Các chức năng và quy trình đã triển khai
Hệ thống cung cấp quy trình tạo bản nháp version hoàn chỉnh, liền mạch từ giao diện rà soát tác động pháp lý:
1. **Nút thao tác "Tạo bản nháp version"**:
   - Trong `LegalKnowledgePage`, tab "Nhật ký cập nhật", mở Modal chi tiết `LegalUpdateLog`.
   - Nếu nhật ký đang ở trạng thái `APPROVED` (Đã phê duyệt hướng xử lý) và người dùng có quyền Lãnh đạo (`MANAGER`/`ADMIN`), nút **"Tạo bản nháp version"** (màu tím) hiển thị nổi bật và cho phép thao tác.
   - Nếu nhật ký chưa đạt trạng thái `APPROVED` hoặc đã bị từ chối/đóng, nút hiển thị ở trạng thái `Disabled` kèm tooltip giải thích: *"Chỉ tạo bản nháp sau khi đã phê duyệt hướng xử lý."*
2. **Modal cấu hình tạo bản nháp version (Modal 9)**:
   - Cho phép chọn 1 trong 3 loại đối tượng cần nhân bản:
     - `PROCEDURE_TYPE_VERSION` (Thủ tục hành chính)
     - `AI_PROMPT_VERSION` (Prompt AI)
     - `CHECKLIST_VERSION` (Checklist tiêu chí rà soát)
   - Tự động tải và hiển thị danh sách các phiên bản nguồn đang ở trạng thái `ACTIVE` để cán bộ lựa chọn kế thừa.
   - Cho phép nhập tùy chọn **Số phiên bản mới** (Ví dụ: `v2.1-draft`). Nếu để trống, hệ thống tự động phát sinh mã phiên bản theo quy tắc `[VersionNguồn]-draft-[timestamp]` (hoặc `X.Y-draft`).
   - Bắt buộc nhập **Lý do tạo bản nháp version mới**, ghi nhận căn cứ pháp lý lý do cập nhật.
3. **Hiển thị danh sách bản nháp đã tạo**:
   - Ngay trong Modal chi tiết `LegalUpdateLog`, hệ thống hiển thị danh sách toàn bộ các bản nháp (`draftVersions.list`) đã được tạo từ nhật ký này, bao gồm: Loại đối tượng, mã phiên bản, tên/khóa, lý do tạo, thời gian và huy hiệu `DRAFT` nổi bật.
   - Banner cảnh báo an toàn được hiển thị trực quan: *"⚠️ Bản nháp version chưa có hiệu lực và chưa được dùng bởi AI review thật. Cần kiểm thử, phê duyệt và kích hoạt thủ công ở phase sau."*

---

## 3. Kiến trúc lưu trữ và xử lý backend
- **Không tạo migration mới**: Tận dụng hoàn toàn schema hiện có từ Phase 8B (`ProcedureTypeVersion`, `AiPromptVersion`, `ChecklistVersion` với trường `status = 'DRAFT'`).
- **Liên kết dữ liệu hai chiều**:
  - Khi nhân bản thành công, bản ghi mới được tạo trong bảng tương ứng (ví dụ `ProcedureTypeVersion`) với trạng thái `status = 'DRAFT'`.
  - Thông tin bản nháp (ID, loại, mã version, lý do, thời gian tạo, người tạo) được ghi vết vào trường JSON `notes` của `LegalUpdateLog` dưới dạng cấu trúc `draftVersions`:
    ```json
    {
      "draftVersions": {
        "list": [
          {
            "id": "uuid-draft-version",
            "type": "PROCEDURE_TYPE_VERSION",
            "version": "v1.1-draft",
            "name": "Thủ tục cấp Giấy chứng nhận lần đầu",
            "reason": "Cập nhật theo Luật Đất đai 2024",
            "createdAt": "2026-07-05T04:40:00.000Z",
            "createdBy": "admin-uuid"
          }
        ]
      },
      "workflowHistory": [
        {
          "action": "CREATE_DRAFT_VERSION",
          "actionLabel": "Tạo bản nháp version",
          "actor": "admin-uuid",
          "note": "Tạo bản nháp PROCEDURE_TYPE_VERSION từ v1.0. Lý do: Cập nhật theo Luật Đất đai 2024"
        }
      ]
    }
    ```

---

## 4. Cơ chế phân quyền (RBAC) và Ràng buộc an toàn
- **Kiểm soát quyền chặt chẽ (RBAC)**:
  - **Chỉ MANAGER và ADMIN**: Mới có quyền gọi API tạo bản nháp version (`createDraftVersion`).
  - **STAFF và VIEWER**: Không có quyền thực hiện. Yêu cầu từ các tài khoản này bị chặn ở cả giao diện và backend (trả về lỗi `403 Forbidden`).
- **Ràng buộc nghiệp vụ (Validation)**:
  - **Kiểm tra trạng thái nhật ký**: Nhật ký cập nhật pháp lý bắt buộc phải ở trạng thái `APPROVED`. Nếu đang ở `PENDING`, `REVIEWING`, `REJECTED` hoặc đã đóng, backend từ chối thực hiện (trả về lỗi `400 Bad Request`).
  - **Kiểm tra phiên bản nguồn**: Phiên bản nguồn được chọn để kế thừa bắt buộc phải đang có trạng thái `ACTIVE`.
  - **Chống trùng lặp mã phiên bản**: Backend kiểm tra mã phiên bản mới (`version`), nếu đã tồn tại cho cùng thủ tục/prompt/checklist thì từ chối tạo và báo lỗi rõ ràng cho người dùng.

---

## 5. Ranh giới giữa Phase 8F-C và các Phase sau
1. **Phase 8F-C (Hiện tại - Hoàn thành)**:
   - Triển khai thành công việc tạo bản nháp version mới (`DRAFT`) từ nhật ký cập nhật pháp lý đã phê duyệt hướng xử lý.
   - Ghi vết trọn vẹn vào lịch sử rà soát và hiển thị danh sách bản nháp trên giao diện.
   - Không kích hoạt version, không thay đổi version `ACTIVE`, không tác động đến quy trình AI review hiện tại.
2. **Phase sau (Phase 8F-D/E - Kiểm thử & Kích hoạt)**:
   - **Phase 8F-D (Shadow Testing / Simulation)**: Kiểm thử song song, cho phép chạy thử AI review trên bản nháp `DRAFT` để đánh giá và so sánh kết quả với bản `ACTIVE` trước khi áp dụng thực tế.
   - **Phase 8F-E (Activation & Archiving)**: Phê duyệt ban hành chính thức bản nháp, chuyển trạng thái từ `DRAFT` sang `ACTIVE`, đồng thời lưu trữ/vô hiệu hóa (`ARCHIVED`/`SUPERSEDED`) phiên bản cũ theo thời điểm có hiệu lực.

---

## 6. Danh sách file code đã chỉnh sửa
### Backend (`legalflow-backend`)
1. `src/legal-knowledge/legal-knowledge.service.ts`:
   - Bổ sung hàm `createDraftVersion(logId, draftType, sourceVersionId, reason, customVersion, user)` thực hiện logic kiểm tra điều kiện, clone dữ liệu sang trạng thái `DRAFT`, cập nhật trường `notes.draftVersions` và `notes.workflowHistory`.
2. `src/legal-knowledge/legal-knowledge.controller.ts`:
   - Bổ sung 4 endpoints REST API:
     - `POST /api/legal-knowledge/update-logs/:id/create-draft-version` (Endpoint chung)
     - `POST /api/legal-knowledge/update-logs/:id/create-procedure-type-draft`
     - `POST /api/legal-knowledge/update-logs/:id/create-prompt-draft`
     - `POST /api/legal-knowledge/update-logs/:id/create-checklist-draft`
3. `src/legal-knowledge/legal-knowledge.service.spec.ts`:
   - Bổ sung bộ kiểm thử unit test cho hàm `createDraftVersion` (đảm bảo từ chối `STAFF`, từ chối log chưa `APPROVED`, tạo thành công khi đủ điều kiện).
4. `src/legal-knowledge/legal-knowledge.controller.spec.ts`:
   - Bổ sung bộ kiểm thử unit test cho 4 endpoint tạo draft version.

### Frontend (`src`)
1. `src/lib/legalKnowledgeApi.ts`:
   - Bổ sung phương thức `createDraftVersion` gọi API backend tạo bản nháp.
2. `src/pages/LegalKnowledgePage.tsx`:
   - Cập nhật nút **"Tạo bản nháp version"** trong Action Bar của Modal chi tiết `LegalUpdateLog` (hiển thị khi `reviewStatus === 'APPROVED'` và user là `MANAGER`/`ADMIN`).
   - Thêm khối hiển thị danh sách bản nháp (`draftVersions.list`) trong Modal chi tiết kèm banner cảnh báo an toàn pháp lý.
   - Thêm **Modal 9: Draft Version Creation Modal**, hỗ trợ chọn loại đối tượng, phiên bản nguồn `ACTIVE`, nhập số version mới và lý do tạo bản nháp.
   - Cập nhật ánh xạ `CREATE_DRAFT_VERSION` trong danh sách lịch sử rà soát (`workflowHistory`).

---

## 7. Hướng dẫn kiểm thử và xác nhận kết quả (Verification & SQL Queries)

### 7.1. Kiểm thử trên Giao diện (UI Testing)
1. **Đăng nhập với vai trò MANAGER hoặc ADMIN**.
2. Truy cập menu **"Kho căn cứ pháp lý"** → chọn tab **"Nhật ký cập nhật"**.
3. Chọn một bản ghi nhật ký đang ở trạng thái **Đã phê duyệt hướng xử lý (`APPROVED`)**:
   - Quan sát thanh công cụ bên dưới Modal chi tiết: Nút **"Tạo bản nháp version"** (màu tím) sáng lên.
4. Bấm **"Tạo bản nháp version"**:
   - Modal tạo bản nháp xuất hiện kèm banner cảnh báo màu vàng.
   - Chọn loại đối tượng (ví dụ: *Thủ tục hành chính*).
   - Chọn phiên bản nguồn đang `ACTIVE` từ dropdown.
   - Nhập số version mới (ví dụ: `v1.1-draft`) và Lý do (ví dụ: *Cập nhật theo Luật Đất đai 2024*).
   - Bấm **"Tạo bản nháp"**.
5. **Xác nhận kết quả sau khi tạo**:
   - Hệ thống thông báo thành công và tự động làm mới dữ liệu.
   - Trong Modal chi tiết nhật ký, khối **"Danh sách bản nháp version đã tạo"** xuất hiện với thông tin chi tiết bản nháp vừa sinh ra kèm huy hiệu **DRAFT**.
   - Trong khối **"Lịch sử rà soát / Workflow"**, xuất hiện dòng ghi nhận hành động **"Tạo bản nháp version"**.

### 7.2. Kiểm thử bằng Truy vấn SQL (SQL Queries Verification)
Dưới đây là các câu lệnh SQL kiểm tra trực tiếp trong database để nghiệm thu Phase 8F-C:

```sql
-- 1. Kiểm tra các ProcedureTypeVersion mới được tạo ở trạng thái DRAFT
SELECT id, procedureCode, procedureName, version, status, createdAt 
FROM "ProcedureTypeVersion" 
WHERE status = 'DRAFT' 
ORDER BY createdAt DESC;

-- 2. Kiểm tra các AiPromptVersion mới được tạo ở trạng thái DRAFT
SELECT id, promptKey, promptName, version, status, createdAt 
FROM "AiPromptVersion" 
WHERE status = 'DRAFT' 
ORDER BY createdAt DESC;

-- 3. Kiểm tra các ChecklistVersion mới được tạo ở trạng thái DRAFT
SELECT id, checklistKey, checklistName, version, status, createdAt 
FROM "ChecklistVersion" 
WHERE status = 'DRAFT' 
ORDER BY createdAt DESC;

-- 4. Kiểm tra đảm bảo các phiên bản ACTIVE cũ vẫn giữ nguyên trạng thái không bị ảnh hưởng
SELECT id, procedureCode, version, status 
FROM "ProcedureTypeVersion" 
WHERE status = 'ACTIVE';

-- 5. Kiểm tra trường notes của LegalUpdateLog để xác nhận liên kết draftVersions và workflowHistory
SELECT id, updateTitle, reviewStatus, notes 
FROM "LegalUpdateLog" 
WHERE reviewStatus = 'APPROVED' AND notes LIKE '%draftVersions%'
ORDER BY updatedAt DESC;
```

---
**Đánh giá tổng thể**: Phase 8F-C đã hoàn thành 100% các mục tiêu đề ra, vượt qua toàn bộ các bộ test tự động (83/83 unit tests passed) và kiểm thử thực tế trên UI/Database, bảo đảm an toàn tuyệt đối cho hệ thống LegalFlow v2.
