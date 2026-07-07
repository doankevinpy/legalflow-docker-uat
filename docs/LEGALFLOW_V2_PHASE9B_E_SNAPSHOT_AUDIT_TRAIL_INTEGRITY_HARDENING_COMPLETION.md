# LEGALFLOW V2 - PHASE 9B-E COMPLETION REPORT
**Phase 9B-E: Snapshot & Audit Trail Integrity Hardening (Gia cố tính toàn vẹn của Legal Snapshot & Audit Trail)**

---

## 1. Mục Tiêu Phase
Mục tiêu cốt lõi của **Phase 9B-E** là gia cố tính toàn vẹn của dữ liệu căn cứ pháp lý (Legal Snapshot) và nhật ký kiểm toán (Audit Trail) trong suốt vòng đời xử lý hồ sơ thủ tục hành chính (TTHC) và hồ sơ vụ việc pháp lý. Bảo đảm rằng:
- Mọi kết quả phân tích AI luôn truy vết được chính xác phiên bản văn bản pháp luật, quy trình, prompt và checklist đã áp dụng tại thời điểm rà soát.
- Căn cứ pháp lý đã áp dụng cho hồ sơ là bất khả xâm phạm, tuyệt đối không bị ảnh hưởng hay ghi đè khi kho tri thức pháp lý cập nhật phiên bản mới, kích hoạt hay hoàn tác (rollback).
- Trải nghiệm người dùng (UI/UX) hiển thị rõ ràng, minh bạch 3 trạng thái căn cứ pháp lý (Có snapshot / Thiếu snapshot / Chưa có AI analysis), chấm dứt hoàn toàn tình trạng khu vực căn cứ pháp lý bị biến mất im lặng.

---

## 2. Danh Sách Các File Đã Sửa
Trong toàn bộ Phase 9B-E, chỉ có đúng 4 file mã nguồn được tác động theo nguyên tắc xâm lấn tối thiểu (minimal invasion):
1. **`legalflow-backend/src/legal-knowledge/legal-knowledge.service.ts`**: Cập nhật hàm `activateDraftVersion`, bổ sung trường `affectedVersions` và `safetyStatement` vào cấu trúc audit log của `activationHistory`, bảo đảm cấu trúc đồng nhất 100% với `rollbackHistory`.
2. **`src/lib/apiClient.ts`**: Bổ sung hàm tiện ích `getApiErrorMessage(error)` chuẩn hóa thông điệp báo lỗi từ Backend (401/403/404/500/mất kết nối) sang tiếng Việt trực quan.
3. **`src/pages/CaseDetail.tsx`**: Đưa section Căn cứ pháp lý ra ngoài điều kiện render AI review, tích hợp 3 trạng thái chuẩn, khuyến cáo pháp lý bắt buộc và xử lý lỗi API. Xóa thẻ badge marker debug `LF-LEGAL-SNAPSHOT-SECTION-20260705` trước khi nghiệm thu.
4. **`src/pages/ProcedureCaseDetail.tsx`**: Đồng bộ section Căn cứ pháp lý ra ngoài điều kiện render AI review, tích hợp 3 trạng thái chuẩn, khuyến cáo pháp lý bắt buộc và xử lý lỗi API. Xóa thẻ badge marker debug `LF-LEGAL-SNAPSHOT-SECTION-20260705` trước khi nghiệm thu.

---

## 3. Gia cố Tính Toàn Vẹn Của Legal Snapshot (Snapshot Integrity Hardening)
- **Kiến trúc dữ liệu bất biến (Immutable Snapshot Architecture)**: Khi AI rà soát một hồ sơ, hệ thống tạo bản ghi trong bảng `ProcedureAiAnalysisLegalSnapshot` có khóa ngoại chỉ định tới `ProcedureAiAnalysis`. Các bản ghi này lưu trữ định danh tĩnh (`kbVersionId`, `procedureVersionId`, `promptVersionId`, `checklistVersionId`, `legalReferences`).
- **Phân tách rõ ràng giữa Snapshot chính thức và Metadata gợi ý**: Loại bỏ việc tự động fallback lấy `legalKnowledgeMetadata` trong payload AI hiển thị như một snapshot chính thức. Hệ thống quy định rõ: Chỉ dữ liệu truy vấn từ bảng snapshot mới là pháp lý chính thức; metadata trong payload chỉ có giá trị tham khảo/gợi ý.
- **Tuân thủ nguyên tắc Human-in-the-Loop**: Bổ sung khuyến cáo pháp lý bắt buộc trên toàn bộ các giao diện hiển thị căn cứ pháp lý, nhắc nhở cán bộ không ỷ lại hoàn toàn vào AI.

---

## 4. Bổ Sung & Giữ Ổn Định Section UI “Căn cứ pháp lý đã sử dụng”
- **Cơ chế Luôn hiển thị (Always-Visible Section)**: Trước đây, khu vực căn cứ pháp lý bị bao bọc bởi điều kiện `if (analysis && analysis.legalSnapshot)`. Trong Phase 9B-E, khối giao diện này đã được chuyển ra vị trí độc lập ngay đầu Tab AI rà soát với tiêu đề chuẩn: **"🏛️ Căn cứ pháp lý đã sử dụng"**.
- **Chấm dứt hiện tượng biến mất im lặng**: Dù hồ sơ ở bất kỳ trạng thái nào (mới tiếp nhận, chưa chạy AI, lỗi API, hay thiếu dữ liệu snapshot), section vẫn hiện diện vững chắc trong cây DOM với thông điệp phản hồi tương ứng.

---

## 5. Hiển Thị Trường hợp Có Legal Snapshot Hợp Lệ
Khi API trả về dữ liệu snapshot hợp lệ từ bảng `ProcedureAiAnalysisLegalSnapshot`, UI hiển thị:
- **Bảng lưới thông tin phiên bản tri thức**: Mã phiên bản tri thức chung (`KB Version`), Mã phiên bản quy trình TTHC (`Procedure Version`), Mã phiên bản Prompt AI (`Prompt Version`), và Mã phiên bản Checklist (`Checklist Version`) kèm badge trạng thái hiệu lực.
- **Danh sách văn bản pháp luật áp dụng (`legalReferences`)**: Hiển thị danh sách các luật, nghị định, thông tư, quyết định địa phương đã được AI căn cứ để đối chiếu hồ sơ.
- **Khung khuyến cáo pháp lý (Amber Alert)**: Hiển thị lời nhắc màu vàng hổ phách:
  > **BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA:** Căn cứ pháp lý hiển thị là phiên bản dữ liệu hệ thống ghi nhận tại thời điểm AI rà soát; cán bộ phải kiểm tra văn bản pháp luật hiện hành, văn bản sửa đổi/bổ sung/thay thế nếu có, quy hoạch/kế hoạch sử dụng đất và quy trình nội bộ địa phương tại thời điểm xử lý hồ sơ.

---

## 6. Hiển Thị Trường hợp Thiếu Snapshot (Warning State)
Khi hồ sơ đã chạy AI review nhưng không tìm thấy bản ghi trong bảng snapshot trong CSDL:
- **Khung cảnh báo đỏ (Red Warning Banner)**: Hiển thị dòng thông báo trực quan:
  > **⚠️ Chưa tìm thấy legal snapshot gắn với kết quả AI này. Cán bộ cần kiểm tra căn cứ pháp lý thủ công.**
- **Xử lý Metadata gợi ý (nếu có)**: Nếu trong `outputPayload` có chứa `legalKnowledgeMetadata`, hệ thống hiển thị thêm một khối màu vàng với dòng chú thích rạch ròi:
  > **⚠️ Căn cứ gợi ý từ metadata AI, chưa xác nhận là legal snapshot đã lưu.**

---

## 7. Hiển Thị Trường hợp Chưa Có AI Analysis (Empty State)
Khi hồ sơ mới tiếp nhận hoặc chưa từng bấm nút chạy "AI rà soát":
- **Khung trạng thái rỗng chuẩn (Empty State Box)**: Hiển thị hộp thông điệp viền vàng nhạt nền trắng với biểu tượng thông tin:
  > **ℹ️ Chưa có kết quả AI để xác định legal snapshot. Sau khi chạy AI review, hệ thống sẽ hiển thị căn cứ pháp lý đã sử dụng nếu có.**

---

## 8. Gia Cố Audit Trail (Audit Trail Hardening)
- **Đồng bộ hóa metadata kiểm toán**: Cập nhật phương thức `activateDraftVersion()` trong `LegalKnowledgeService`. Khi quản trị viên kích hoạt một phiên bản tri thức mới, bản ghi kiểm toán ghi vào trường `notes.activationHistory` của `LegalUpdateLog` được bổ sung 2 thuộc tính quan trọng:
  - `affectedVersions`: Danh sách các phiên bản quy trình, prompt, checklist chịu tác động và thay đổi trạng thái hiệu lực.
  - `safetyStatement`: Cam kết an toàn hệ thống (ghi nhận việc đã kiểm tra sung đột và bảo toàn dữ liệu lịch sử).
- **Phục vụ trọn vẹn hậu kiểm (Post-Verification)**: Cấu trúc audit log của thao tác Kích hoạt (Activation) nay đã hoàn toàn đồng nhất với thao tác Hoàn tác (Rollback), giúp các endpoint `GET .../activation-verification` và `GET .../rollback-verification` cung cấp báo cáo kiểm toán đầy đủ, không bị khuyết thiếu metadata.

---

## 9. CÁC XÁC NHẬN BẤT KHẢ XÂM PHẠM (VERIFICATION & COMPLIANCE ASSERTIONS)

| STT | Mục cam kết / Ràng buộc | Trạng thái | Ghi chú minh chứng |
| :---: | :--- | :---: | :--- |
| **1** | **Xác nhận đã xóa marker `LF-LEGAL-SNAPSHOT-SECTION-20260705`** | **ĐÃ XÓA** | Kiểm tra `grep_search` toàn bộ mã nguồn trả về 0 kết quả. Marker debug đã được gỡ bỏ sạch sẽ khỏi `CaseDetail.tsx` và `ProcedureCaseDetail.tsx`. |
| **2** | **Xác nhận không tạo snapshot mới khi chỉ xem trang** | **TUÂN THỦ** | Các endpoint `GET .../legal-snapshot` và logic render UI chỉ thực hiện thao tác Đọc (Read-only), tuyệt đối không có lệnh `INSERT`/`CREATE` ngầm khi load trang. |
| **3** | **Xác nhận không ghi đè snapshot cũ** | **TUÂN THỦ** | Các thao tác thay đổi phiên bản pháp lý (activate/rollback) chỉ tác động lên bảng catalog phiên bản, không thực hiện lệnh `UPDATE` trên bảng `ProcedureAiAnalysisLegalSnapshot`. |
| **4** | **Xác nhận không sửa `ProcedureAiAnalysis` cũ** | **TUÂN THỦ** | Dữ liệu lịch sử rà soát AI của các hồ sơ TTHC trong quá khứ được bảo toàn nguyên vẹn 100%. |
| **5** | **Xác nhận không sửa `ProcedureAiAnalysisLegalSnapshot` cũ** | **TUÂN THỦ** | Không alter hay mutate bất kỳ bản ghi snapshot nào đã lưu trước đó trong cơ sở dữ liệu. |
| **6** | **Xác nhận không sửa trạng thái hồ sơ TTHC** | **TUÂN THỦ** | Luồng trạng thái TTHC (`SUBMITTED`, `IN_REVIEW`, `APPROVED`, `REJECTED`, v.v.) không bị tác động bởi logic giao diện hay kiểm toán pháp lý. |
| **7** | **Xác nhận không sửa schema / migration / `.env`** | **TUÂN THỦ** | File `schema.prisma`, thư mục `prisma/migrations/`, và các file `.env*` giữ nguyên 100%. `git status -s` không có thay đổi tầng database. |
| **8** | **Xác nhận không tự ý commit / tag thay người dùng** | **TUÂN THỦ** | Toàn bộ quyền thực hiện lệnh `git commit` và `git tag` (e.g., `v2.9.8-snapshot-audit-trail-integrity-hardening`) được dành trọn cho Lãnh đạo. |

---

## 10. Kết Quả Kiểm Thử, Build & Health-Check
- **Backend Unit Tests (`npm test` tại `legalflow-backend`)**:
  - **Kết quả**: **100% PASS** (11/11 Test Suites Passed, 129/129 Tests Passed).
  - **Phạm vi bảo phủ**: Kiểm chứng trọn vẹn logic AI review, legal knowledge service, docx export templates, activation/rollback workflow.
- **Frontend Production Build (`npm run build`)**:
  - **Kết quả**: **SUCCESS** (0 lỗi TypeScript/Vite, đóng gói 3,177 modules trong 1.61s).
- **Backend Production Build (`nest build`)**:
  - **Kết quả**: **SUCCESS** (0 lỗi cú pháp hay dependency).
- **System Health Check (`.\scripts\health-check.ps1`)**:
  - **Kết quả**: **ALL SYSTEMS HEALTHY & OPERATIONAL** (100% PASS cho Postgres Container, MinIO Container, Caddy Gateway, Backend API Port 3000, Frontend Dev Server Port 5173, MinIO Port 9000).

---

## 11. Các Giới Hạn Còn Lại (Known Limitations)
- **Tải trọng file nhị phân khi xuất báo cáo**: Hiện tại thao tác xuất file Word/PDF rà soát TTHC được xử lý đồng bộ qua REST API. Với hồ sơ có dung lượng tài liệu đính kèm cực lớn hoặc kết quả rà soát phức tạp, thời gian phản hồi có thể phụ thuộc vào băng thông mạng và hiệu năng CPU của máy chủ tải trang.
- **Kiểm chứng chữ ký số cho Snapshot**: Phiên bản hiện tại đảm bảo tính bất biến của snapshot ở tầng kiến trúc ứng dụng (ORM & Database constraints). Trong các giai đoạn mở rộng tương lai, có thể nghiên cứu tích hợp thêm mã băm cryptographic (hash/digital signature) để chống làm giả dữ liệu ở tầng truy cập vật lý trực tiếp vào CSDL.

---

## 12. Đề Xuất Phase Tiếp Theo: Phase 9B-F – Export Safety Hardening
Để tiếp tục nâng cấp độ tin cậy và an toàn toàn diện cho hệ thống LegalFlow V2, đề xuất bước tiến tiếp theo là **Phase 9B-F: Export Safety Hardening (Gia cố an toàn xuất tài liệu & Báo cáo)**.
- **Mục tiêu dự kiến**:
  1. Gia cố độ an toàn và chống thất thoát thông tin (DLP) khi xuất file Word/PDF (nhằm ngăn chặn xuất dữ liệu nhạy cảm hoặc chưa được thẩm định).
  2. Bổ sung watermark / nhãn bảo mật động (e.g., *"Bản thảo - Chưa ký duyệt"*, *"Tài liệu nội bộ"*) vào tài liệu xuất ra tùy thuộc vào trạng thái hồ sơ và vai trò người xuất.
  3. Kiểm soát cặn kẽ quyền tải xuống tài liệu đính kèm gốc của hồ sơ TTHC theo phân cấp bảo mật.
  4. Ghi nhận nhật ký kiểm toán xuất file (Export Audit Logging) chi tiết đến từng địa chỉ IP và định danh thiết bị.
