# Phase 8F-B Completion – Legal Update Review Workflow Foundation

## 1. Mục tiêu Phase 8F-B
Phase 8F-B triển khai nền tảng quy trình xử lý và rà soát các bản ghi nhật ký cập nhật pháp lý (`LegalUpdateLog`) sau khi AI đã thực hiện phân tích tác động ở Phase 8E.
Tuân thủ tuyệt đối nguyên tắc **Human-in-the-Loop** và các chỉ đạo về an toàn pháp lý của LegalFlow:
- **Chỉ phê duyệt hướng xử lý**: Quy trình trong Phase 8F-B tập trung vào việc rà soát, lấy ý kiến, bổ sung thông tin và phê duyệt/từ chối hướng xử lý cập nhật pháp lý.
- **Chưa tạo draft version mới**: Hệ thống **không** tự động tạo các phiên bản dự thảo mới (`ProcedureTypeVersion` DRAFT, `AiPromptVersion` DRAFT, `ChecklistVersion` DRAFT).
- **Chưa kích hoạt version pháp lý**: Việc phê duyệt hướng xử lý không làm thay đổi trạng thái hiệu lực của bất kỳ văn bản pháp luật hay thủ tục hành chính nào đang có trong hệ thống.

---

## 2. Các bước xử lý đã hỗ trợ
Hệ thống cung cấp trọn bộ 6 bước xử lý nghiệp vụ chuẩn trong vòng đời rà soát tác động pháp lý:
1. **Bắt đầu rà soát (`START_REVIEW`)**: Chuyển trạng thái nhật ký từ `PENDING` sang `REVIEWING` (Đang rà soát), ghi nhận cán bộ bắt đầu tiếp nhận xử lý.
2. **Thêm ghi chú rà soát (`ADD_NOTE`)**: Cán bộ nghiệp vụ hoặc lãnh đạo thêm ý kiến, nhận xét, đánh giá chuyên môn vào nhật ký mà không làm thay đổi trạng thái chính.
3. **Yêu cầu bổ sung thông tin (`REQUEST_MORE_INFO`)**: Chuyển trạng thái phụ (`subStatus`) thành `PENDING_MORE_INFO` khi cần làm rõ thêm tác động từ các phòng ban liên quan.
4. **Phê duyệt hướng xử lý (`APPROVE_FOR_VERSIONING`)**: Chuyển trạng thái sang `APPROVED`, xác nhận đồng ý với đánh giá tác động và đề xuất cập nhật. Bắt buộc kèm ghi chú chỉ đạo.
5. **Từ chối hướng xử lý (`REJECT`)**: Chuyển trạng thái sang `REJECTED`, chấm dứt quy trình rà soát do đánh giá tác động không chính xác hoặc không áp dụng. Bắt buộc kèm lý do từ chối.
6. **Đóng nhật ký (`CLOSE`)**: Chuyển trạng thái phụ (`subStatus`) thành `CLOSED` khi đã hoàn tất toàn bộ chu trình xử lý hoặc lưu trữ theo dõi.

---

## 3. Kiến trúc lưu trữ lịch sử
Để bảo đảm tính toàn vẹn dữ liệu, không gây phình schema database và tương thích hoàn toàn với kiến trúc đã thiết lập từ Phase 8B/8E:
- **Sử dụng trường `notes` dạng JSON**: Toàn bộ chuỗi sự kiện rà soát (`workflowHistory`) và trạng thái chi tiết (`subStatus`) được lưu trữ cấu trúc trong trường `notes` của bảng `LegalUpdateLog`.
- **Cấu trúc JSON Log Vết**:
  ```json
  {
    "impactSummary": "Tóm tắt đánh giá tác động từ Phase 8E...",
    "disclaimer": "BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA",
    "subStatus": "REVIEWING",
    "workflowHistory": [
      {
        "action": "START_REVIEW",
        "actionLabel": "Bắt đầu rà soát",
        "actor": "user-uuid",
        "actorName": "Nguyễn Văn A",
        "actorRole": "STAFF",
        "timestamp": "2026-07-05T02:50:00.000Z"
      },
      {
        "action": "APPROVE_FOR_VERSIONING",
        "actionLabel": "Phê duyệt hướng xử lý (Chờ tạo Version)",
        "actor": "admin-uuid",
        "actorName": "Trần Văn B",
        "actorRole": "MANAGER",
        "note": "Đồng ý hướng xử lý, chuẩn bị tạo draft ở Phase sau.",
        "timestamp": "2026-07-05T02:55:00.000Z"
      }
    ]
  }
  ```
- **Không tạo migration mới**: Giữ nguyên schema database, không thêm bảng phụ, bảo đảm tính ổn định tuyệt đối cho hệ thống đang vận hành.

---

## 4. Cơ chế kiểm soát quyền (RBAC) và Cảnh báo
- **Phân quyền chặt chẽ theo vai trò (Role-Based Access Control)**:
  - **STAFF / MANAGER / ADMIN**: Có quyền thao tác Bắt đầu rà soát (`START_REVIEW`), Thêm ghi chú (`ADD_NOTE`), Yêu cầu bổ sung (`REQUEST_MORE_INFO`).
  - **Chỉ MANAGER / ADMIN (Lãnh đạo)**: Mới có quyền Phê duyệt hướng xử lý (`APPROVE_FOR_VERSIONING`), Từ chối (`REJECT`), hoặc Đóng nhật ký (`CLOSE`). Thao tác từ tài khoản STAFF sẽ bị chặn ở cả frontend và backend (`ForbiddenException`).
- **Ràng buộc nghiệp vụ bắt buộc**:
  - Khi **Từ chối (`REJECT`)**: Hệ thống bắt buộc người dùng phải nhập **Lý do từ chối**.
  - Khi **Phê duyệt hướng xử lý (`APPROVE_FOR_VERSIONING`)**: Hệ thống bắt buộc người dùng phải nhập **Ghi chú / Ý kiến chỉ đạo**.
- **Cảnh báo an toàn pháp lý hiển thị rõ ràng**:
  - Tại cửa sổ xác nhận Phê duyệt và Từ chối, hệ thống luôn hiển thị banner cảnh báo nổi bật:
    > **CẢNH BÁO HỆ THỐNG**: Phê duyệt hướng xử lý không đồng nghĩa với kích hoạt version pháp lý. Hệ thống chưa tự thay đổi ProcedureTypeVersion, AiPromptVersion, ChecklistVersion hoặc LegalDocument.

---

## 5. Ranh giới với Phase sau (Phase 8F-C/D/E)
Để đảm bảo kiểm soát rủi ro pháp lý, ranh giới giữa Phase 8F-B và các phase tiếp theo được phân định rạch ròi:
1. **Phase 8F-B (Hiện tại)**:
   - Chỉ chuẩn hóa quy trình rà soát, ghi vết lịch sử ý kiến chuyên môn và phê duyệt **hướng xử lý**.
   - **Chưa** tạo bản sao dự thảo (`DRAFT`) cho thủ tục, prompt AI hay checklist.
   - **Chưa** thay đổi trạng thái của văn bản pháp luật hay tự động thay thế phiên bản cũ.
   - Trên giao diện Modal chi tiết nhật ký, nút **"Tạo version mới (Phase sau)"** luôn hiển thị ở trạng thái **Disabled**, viền đứt đoạn kèm thông báo tooltip: *"Phase sau mới hỗ trợ tạo draft version mới"*.
2. **Phase sau (Phase 8F-C/D/E)**:
   - Sẽ triển khai chức năng bấm nút "Tạo version mới" từ các nhật ký đã ở trạng thái `APPROVED`.
   - Tự động nhân bản (clone) `ProcedureTypeVersion`, `AiPromptVersion`, `ChecklistVersion` sang trạng thái `DRAFT` kèm liên kết với `LegalUpdateLog`.
   - Tiến hành kiểm thử song song (Shadow Testing / A-B Testing) giữa version hiện hành và version dự thảo trước khi chính thức ban hành.

---

## 6. Danh sách file code đã chỉnh sửa/tạo mới

### Backend (`legalflow-backend`)
1. `src/legal-knowledge/legal-knowledge.service.ts`:
   - Bổ sung hàm `handleWorkflowAction(id, action, note, reason, user)` xử lý logic chuyển trạng thái workflow.
   - Xử lý đọc, merge và lưu lịch sử `workflowHistory`, `subStatus` vào trường JSON `notes`.
   - Kiểm tra quyền truy cập theo role (`STAFF`, `MANAGER`, `ADMIN`) và validate các điều kiện bắt buộc (lý do từ chối, ghi chú phê duyệt).
2. `src/legal-knowledge/legal-knowledge.controller.ts`:
   - Bổ sung 7 endpoints REST API phục vụ workflow:
     - `POST /legal-knowledge/update-logs/:id/start-review`
     - `POST /legal-knowledge/update-logs/:id/add-review-note`
     - `POST /legal-knowledge/update-logs/:id/request-more-info`
     - `POST /legal-knowledge/update-logs/:id/approve-for-versioning`
     - `POST /legal-knowledge/update-logs/:id/reject`
     - `POST /legal-knowledge/update-logs/:id/close`
     - `POST /legal-knowledge/update-logs/:id/workflow-action`
3. `src/legal-knowledge/legal-knowledge.service.spec.ts`:
   - Bổ sung bộ Unit Test đầy đủ kiểm thử các kịch bản chuyển trạng thái workflow, kiểm tra phân quyền RBAC, kiểm tra bẫy lỗi khi thiếu lý do từ chối/ghi chú phê duyệt.
4. `src/legal-knowledge/legal-knowledge.controller.spec.ts`:
   - Bổ sung Unit Test kiểm thử các endpoint controller workflow mới.

### Frontend (`legalflow-web` / `src`)
1. `src/types/legalKnowledge.ts`:
   - Bổ sung thông tin trường `reviewedBy`, `reviewedById`, `reviewedAt` vào interface `LegalUpdateLog`.
2. `src/lib/legalKnowledgeApi.ts`:
   - Bổ sung 7 phương thức gọi API tương ứng với các endpoint workflow của backend (`startReview`, `addReviewNote`, `requestMoreInfo`, `approveForVersioning`, `rejectUpdate`, `closeUpdate`, `workflowAction`).
3. `src/pages/LegalKnowledgePage.tsx`:
   - **Bảng Nhật ký Cập nhật (Tab 6)**: Hiển thị badge trạng thái chuẩn màu sắc (`PENDING`: vàng amber, `REVIEWING`: xanh dương, `APPROVED`: xanh lá emerald, `REJECTED`: đỏ, `APPLIED`: tím) và hiển thị thêm trạng thái phụ (`subStatus`) nếu có.
   - **Modal Chi tiết Nhật ký (Modal 7)**:
     - Hiển thị khối **"Lịch sử rà soát / Workflow"**, liệt kê chi tiết từng bước xử lý theo thời gian thực (người thực hiện, vai trò, thời gian, ý kiến ghi chú).
     - Bố trí thanh công cụ hành động (Action Bar) ở footer với các nút bấm phân quyền động theo Role và Trạng thái nhật ký.
     - Nút **"Tạo version mới (Phase sau)"** hiển thị ở trạng thái Disabled.
   - **Modal Xác nhận Workflow (Modal 8)**: Cửa sổ nhập ý kiến/lý do bắt buộc kèm banner cảnh báo hệ thống trước khi thực hiện thao tác rà soát/phê duyệt.

---

## 7. Hướng dẫn kiểm thử và nghiệm thu nhanh

### Bước 1: Tạo nhật ký cập nhật (Khởi tạo dữ liệu Phase 8E)
1. Đăng nhập vào hệ thống với tài khoản `ADMIN` hoặc `MANAGER`.
2. Truy cập menu **Kho Căn cứ Pháp lý (Legal Knowledge Base)** -> Chọn tab **Nhật ký cập nhật**.
3. Bấm nút **"Phân tích tác động" (ShieldAlert icon)** -> Chọn một văn bản nguồn (ví dụ: Luật Đất đai sửa đổi) hoặc nhập tiêu đề cập nhật -> Bấm **"Phân tích tác động AI"**.
4. Hệ thống tạo ra một bản ghi nhật ký mới ở trạng thái **Chờ rà soát (PENDING)**.

### Bước 2: Kiểm thử luồng rà soát của Cán bộ (STAFF / MANAGER)
1. Bấm vào tiêu đề nhật ký vừa tạo để mở **Modal Chi tiết Nhật ký**.
2. Bấm nút **"Bắt đầu rà soát"** -> Bấm **"Xác nhận bắt đầu"**.
   - *Kết quả*: Trạng thái nhật ký chuyển thành **Đang rà soát (REVIEWING)**. Trong khối Lịch sử rà soát xuất hiện dòng ghi vết *"Bắt đầu rà soát"*.
3. Bấm nút **"Thêm ghi chú"** -> Nhập ý kiến: *"Đã kiểm tra sơ bộ, các điều khoản sửa đổi khớp với văn bản gốc"* -> Bấm **"Lưu ghi chú"**.
   - *Kết quả*: Lịch sử ghi nhận thêm ý kiến của cán bộ.
4. Bấm nút **"Yêu cầu bổ sung"** -> Nhập ý kiến: *"Đề nghị Phòng Pháp chế làm rõ tác động đến quy trình định giá đất"* -> Bấm **"Gửi yêu cầu"**.
   - *Kết quả*: Trạng thái phụ hiển thị `(PENDING_MORE_INFO)`.

### Bước 3: Kiểm thử luồng phê duyệt / từ chối của Lãnh đạo (MANAGER / ADMIN)
1. Bấm nút **"Phê duyệt hướng xử lý"**:
   - *Kiểm tra UI*: Xuất hiện banner cảnh báo màu vàng: *"CẢNH BÁO HỆ THỐNG: Phê duyệt hướng xử lý không đồng nghĩa với kích hoạt version pháp lý..."*.
   - *Kiểm tra Validate*: Để trống ô ghi chú và bấm **"Phê duyệt"** -> Hệ thống hiện alert yêu cầu nhập ghi chú bắt buộc.
   - *Thực hiện*: Nhập ghi chú *"Đồng ý với phân tích tác động. Giao bộ phận kỹ thuật chuẩn bị tạo draft version trong Phase sau"* -> Bấm **"Phê duyệt"**.
   - *Kết quả*: Trạng thái chuyển thành **Đã phê duyệt (APPROVED)**. Nút "Phê duyệt" ẩn đi, nút **"Tạo version mới (Phase sau)"** vẫn ở trạng thái Disabled.
2. Kiểm thử thao tác **"Từ chối"**:
   - Bấm nút **"Từ chối"** -> Để trống lý do -> Hệ thống chặn và yêu cầu nhập lý do bắt buộc. Nhập lý do *"Văn bản này không áp dụng cho lĩnh vực của đơn vị"* -> Bấm **"Từ chối"**. Trạng thái chuyển thành **REJECTED**.

### Bước 4: Kiểm tra tính toàn vẹn dữ liệu
1. Kiểm tra trường `notes` trong database (bảng `LegalUpdateLog`): Toàn bộ mảng `workflowHistory` được lưu đầy đủ dưới dạng JSON, không làm sai lệch các trường `impactSummary`, `affectedLegalDocuments`, `riskFlags`.
2. Kiểm tra các bảng `LegalDocument`, `ProcedureTypeVersion`, `AiPromptVersion`, `ChecklistVersion`: Xác nhận **không có bất kỳ bản ghi nào bị thay đổi trạng thái hay tạo mới**, tuân thủ tuyệt đối phạm vi của Phase 8F-B.
