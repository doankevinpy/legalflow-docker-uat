# Phase 8E Completion – Legal Update Impact Analysis

**Dự án:** LegalFlow - Nền tảng Hỗ trợ Nghiệp vụ & Rà soát Pháp lý Đất đai  
**Phiên bản:** v2.8.0-legal-update-impact-analysis-complete  
**Ngày hoàn thành:** 04/07/2026  
**Trạng thái:** HOÀN THÀNH (COMPLETED)

---

## 1. Mục tiêu Phase 8E

Phase 8E (Legal Update Impact Analysis – AI phân tích tác động khi văn bản pháp luật thay đổi) được triển khai nhằm giải quyết thách thức lớn nhất trong chuyển đổi số nghiệp vụ pháp lý: **tính lỗi thời của hệ thống khi pháp luật và thủ tục hành chính biến động**.

Khi Luật Đất đai 2024 có hiệu lực, kéo theo hàng loạt Nghị định, Thông tư hướng dẫn và Quyết định công bố thủ tục hành chính mới tại địa phương, hệ thống cần một công cụ thông minh hỗ trợ cán bộ nghiệp vụ và quản trị viên (Admin/Manager) đánh giá nhanh chóng, chính xác phạm vi tác động của văn bản mới.

### Các câu hỏi nghiệp vụ Phase 8E giải quyết:
1. **Văn bản mới / sửa đổi ảnh hưởng đến văn bản pháp lý nào đang có trong kho?** (Quan hệ thay thế, sửa đổi, hướng dẫn).
2. **Ảnh hưởng đến thủ tục hành chính nào?** (Cấp GCN lần đầu, Chuyển mục đích sử dụng đất, v.v.).
3. **Ảnh hưởng đến prompt AI nào?** (Các bộ quy tắc rà soát hồ sơ của AI có bị lỗi thời không?).
4. **Ảnh hưởng đến checklist nghiệp vụ nào?** (Các tiêu chí kiểm tra hồ sơ cần bổ sung hay loại bỏ?).
5. **Có hồ sơ TTHC đang xử lý (Open Cases) nào bị tác động bởi quy định mới không?** (Lưu ý điều khoản chuyển tiếp).
6. **Lịch sử và nhật ký cập nhật được quản lý ra sao để phục vụ thanh tra, kiểm toán?**

---

## 2. Nguyên tắc An toàn & Tuân thủ Nghiệp vụ (Core Legal Principles)

Phase 8E được thiết kế và triển khai tuân thủ tuyệt đối các nguyên tắc an toàn pháp lý của LegalFlow:
- **Human-in-the-Loop (Cán bộ là người quyết định cuối cùng):** AI chỉ đóng vai trò phân tích, tổng hợp và đề xuất gợi ý rà soát.
- **Không tự động hóa thay đổi pháp lý (No Auto-Update / No Auto-Activate):** Hệ thống **KHÔNG BAO GIỜ** tự động kích hoạt phiên bản mới, tự động sửa đổi căn cứ pháp lý trong kho, hay tự động thay đổi kết quả rà soát của các hồ sơ đang xử lý.
- **Khuyến cáo pháp lý bắt buộc (Mandatory Disclaimer):** Mọi kết quả phân tích tác động trả về từ API và hiển thị trên giao diện đều đi kèm thông điệp cảnh báo nổi bật:  
  > **"BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA. AI chỉ tạo bản gợi ý phân tích tác động. Cán bộ nghiệp vụ phải kiểm tra, đối chiếu toàn văn bản pháp luật hiện hành trước khi áp dụng vào thực tế."**
- **Quy trình kiểm soát trạng thái cập nhật (Audit & Review Workflow):** Mỗi lần phân tích tác động được ghi nhận thành một nhật ký cập nhật (`LegalUpdateLog`) với vòng đời trạng thái chặt chẽ: `PENDING` (Chờ rà soát) -> `REVIEWING` (Đang đánh giá) -> `APPROVED` (Đã phê duyệt phương án) -> `APPLIED` (Đã áp dụng thay đổi thủ công).

---

## 3. Kiến trúc & Thiết kế Kỹ thuật

### 3.1. Nền tảng Dữ liệu (Schema & Data Foundation)
Phase 8E tận dụng triệt để nền tảng kiến trúc được xây dựng từ Phase 8B và 8D:
- **Bảng `LegalUpdateLog`:** Được sử dụng làm trung tâm lưu trữ toàn bộ lịch sử phân tích tác động và theo dõi rà soát cập nhật.
- **Trường `notes (Text)` trong `LegalUpdateLog`:** Lưu trữ toàn bộ kết quả phân tích tác động chi tiết dưới dạng cấu trúc JSON chuẩn hóa (JSON Schema), bao gồm:
  - `impactSummary`: Tóm tắt tác động bằng ngôn ngữ nghiệp vụ.
  - `affectedLegalDocuments`: Danh sách văn bản pháp lý chịu tác động kèm ghi chú cụ thể.
  - `affectedProcedureTypes`: Danh sách TTHC chịu tác động.
  - `affectedPromptVersions` & `affectedChecklistVersions`: Các phiên bản AI prompt và checklist cần cập nhật.
  - `affectedOpenProcedureCases`: Các hồ sơ TTHC đang giải quyết có khả năng chịu ảnh hưởng.
  - `recommendedActions`: Danh sách hành động khuyến nghị cán bộ thực hiện.
  - `riskFlags`: Các cảnh báo rủi ro pháp lý cao (ví dụ: thay đổi thẩm quyền, thời hạn, nghĩa vụ tài chính).

### 3.2. Backend Services & REST API
Module `LegalKnowledgeModule` được mở rộng với các endpoint mới phục vụ phân tích tác động:
- `POST /api/legal-knowledge/update-logs/analyze-impact`: Khởi tạo phân tích tác động từ một văn bản mới hoặc thông tin biến động pháp lý nhập tự do.
- `POST /api/legal-knowledge/documents/:id/analyze-impact`: Phân tích tác động trực tiếp cho một văn bản hiện có trong kho căn cứ.
- `GET /api/legal-knowledge/update-logs/:id`: Truy xuất chi tiết nhật ký cập nhật kèm kết quả phân tích JSON đã lưu.

---

## 4. Phạm vi Đã Triển khai & Kết quả Thực hiện

### 4.1. Backend Implementation (`LegalKnowledgeService` & Controller)
- Triển khai phương thức `analyzeImpact(sourceDocumentId, title, notes)` thực hiện logic rà soát chéo 5 tầng dữ liệu trong hệ thống:
  1. **Tầng Văn bản pháp lý:** Kiểm tra các văn bản có mối quan hệ (REPLACES, AMENDS, GUIDES) hoặc cùng lĩnh vực đất đai.
  2. **Tầng Thủ tục hành chính:** Đối chiếu mã thủ tục (`LAND_FIRST_CERTIFICATE`, `LAND_PURPOSE_CHANGE`, v.v.) đang ACTIVE.
  3. **Tầng AI Prompt & Checklist:** Nhận diện các phiên bản prompt và checklist đang được sử dụng cho các thủ tục liên quan.
  4. **Tầng Hồ sơ TTHC (Open Cases):** Kiểm tra bảng `AdministrativeProcedureCase` để liệt kê các hồ sơ đang ở trạng thái xử lý (`RECEIVING`, `PROCESSING`, `ADDITIONAL_REQUESTED`, v.v.) có khả năng bị ảnh hưởng để cán bộ lưu ý chuyển tiếp.
- Tự động khởi tạo bản ghi `LegalUpdateLog` mới với trạng thái `PENDING` và lưu toàn bộ JSON phân tích vào trường `notes`.
- Viết bộ Test Suite hoàn chỉnh (`legal-knowledge.service.spec.ts` & `legal-knowledge.controller.spec.ts`) đạt **23/23 tests passed**.

### 4.2. Frontend Read/Analyze UI (`LegalKnowledgePage.tsx`)
- **Tích hợp Quyền truy cập (RBAC):** Chỉ người dùng có vai trò `ADMIN` hoặc `MANAGER` mới nhìn thấy và sử dụng nút **"Phân tích tác động"** tại Tab 6 (Nhật ký cập nhật). Vai trò `STAFF` và `VIEWER` tiếp tục truy cập ở chế độ Read-only.
- **Modal Phân tích Tác động AI (Modal 6):**
  - Cho phép chọn văn bản nguồn từ kho căn cứ hoặc nhập tiêu đề/nội dung văn bản mới quy định.
  - Hiển thị khối cảnh báo pháp lý "BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA" màu hổ phách (Amber alert) nổi bật ngay đầu giao diện.
  - Trình bày kết quả phân tích trực quan theo 6 phân vùng rõ ràng:
    1. Tóm tắt đánh giá tác động AI.
    2. Văn bản pháp lý chịu ảnh hưởng / liên quan (kèm badge trạng thái).
    3. Thủ tục hành chính chịu tác động.
    4. Prompt AI & Checklist nghiệp vụ cần cập nhật.
    5. Hồ sơ TTHC đang xử lý cần lưu ý chuyển tiếp (cảnh báo đỏ).
    6. Đề xuất hành động rà soát nghiệp vụ (dạng checklist tương tác) & Cảnh báo rủi ro (Risk flags).
- **Modal Chi tiết Nhật ký Cập nhật (Modal 7):**
  - Cho phép bấm vào tiêu đề hoặc biểu tượng xem (Eye icon) trên bảng nhật ký để xem lại toàn bộ kết quả phân tích tác động đã lưu trong quá khứ.
  - Tự động parse JSON từ trường `notes` và hiển thị giao diện đồ họa đẹp mắt, chuẩn nghiệp vụ.

---

## 5. Kiểm định & Xác nhận Chất lượng

1. **Backend Unit Testing:**  
   - Chạy lệnh: `npm test -- legal-knowledge` (tại `legalflow-backend`).
   - Kết quả: **PASS 100% (23/23 tests successfully executed)**.
2. **Backend Build Verification:**  
   - Chạy lệnh: `npm run build` (tại `legalflow-backend`).
   - Kết quả: **NestJS build thành công, không có lỗi TypeScript hay dependency**.
3. **Frontend Build Verification:**  
   - Chạy lệnh: `npm run build` (tại root directory `legalflow-docker-uat`).
   - Kết quả: **Vite build thành công, bundle bundle production hợp lệ**.

---

## 6. Bước tiếp theo (Next Steps / Phase 8F)

Sau khi hoàn thành Phase 8E, hệ thống đã có đầy đủ khả năng phát hiện và đánh giá tác động của thay đổi pháp luật. Các phase tiếp theo có thể triển khai:
- **Phase 8F – Legal Knowledge Update Application & Version Activation:** Triển khai quy trình phê duyệt (Approval Workflow) cho phép Admin/Manager áp dụng các thay đổi: tạo phiên bản Draft mới cho Prompt/Checklist/Procedure, rà soát và chính thức chuyển trạng thái từ `DRAFT` sang `ACTIVE` (đồng thời chuyển phiên bản cũ sang `DEPRECATED`/`ARCHIVED`).
- **Phase 7E-A – Financial Obligation Calculation:** Tích hợp AI hỗ trợ tính toán nghĩa vụ tài chính đất đai (tiền sử dụng đất, lệ phí trước bạ, thuế thu nhập cá nhân) dựa trên bảng giá đất mới.
