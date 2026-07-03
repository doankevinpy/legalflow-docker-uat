# Tổng kết hệ thống LegalFlow AI v2.3 – End-to-End AI Draft Workflow Complete

**Ngày phát hành tài liệu:** 03/07/2026  
**Phiên bản hệ thống:** LegalFlow AI v2.3  
**Trạng thái:** Hoàn tất chuỗi phát triển nghiệp vụ End-to-End AI Draft Workflow (Từ Phase 1 đến Phase 5D).

---

## 1. Mục tiêu tổng thể của LegalFlow AI

Hệ thống **LegalFlow AI** được thiết kế như một **Trợ lý Thông minh Chuyên sâu (AI Legal Assistant)** nhằm cách mạng hóa và tối ưu hóa năng suất cho cán bộ thụ lý trong công tác giải quyết đơn thư khiếu nại, tố cáo, kiến nghị, phản ánh về đất đai:
- **Hỗ trợ xử lý đơn thư:** Giảm tải công sức rà soát thủ công các hồ sơ phức tạp, tài liệu dài và đa dạng.
- **Hỗ trợ đọc nhanh, tóm tắt, phân loại:** Tự động trích xuất nội dung cốt lõi, xác định yêu cầu trọng tâm và gợi ý phân loại đơn thư theo đúng quy định pháp luật.
- **Hỗ trợ gợi ý checklist nghiệp vụ:** Đề xuất các bước quy trình, danh mục tài liệu cần đối chiếu, bộ phận phối hợp, thời hạn pháp lý và rủi ro tiềm ẩn.
- **Hỗ trợ soạn bản nháp văn bản:** Tự động dự thảo các văn bản hành chính và nghiệp vụ nội bộ dựa trên thông tin vụ việc đã thụ lý.
- **Hỗ trợ xuất Word `.docx` và xem/in PDF nháp:** Cho phép xuất tệp tin văn bản có thể chỉnh sửa dễ dàng hoặc xem trước trang A4 chuẩn thể thức hành chính để trình ký nội bộ.
- **Tuân thủ tuyệt đối nguyên tắc Human-in-the-Loop:** Bảo đảm AI luôn làm việc dưới sự giám sát, thẩm định và quyết định cuối cùng của con người.

---

## 2. Tuyên ngôn nguyên tắc vận hành

> **“LegalFlow AI không thay thế cán bộ xử lý đơn. Hệ thống hỗ trợ đọc nhanh, tóm tắt, phân loại, gợi ý checklist và tạo bản nháp văn bản. Cán bộ vẫn kiểm tra, chỉnh sửa, quyết định và chịu trách nhiệm. Mọi thao tác chấp nhận/từ chối đều được ghi nhận bằng audit log.”**

---

## 3. Tổng kết theo từng Phase

### Phase 1 – AI Backend & Audit Log
- **Xây dựng nền tảng AI Backend:** Thiết lập kiến trúc xử lý AI mô-đun hóa trong NestJS (`AiModule`, `AiService`, `PromptBuilderService`).
- **Endpoint tóm tắt / phân loại:** Xây dựng API `/ai/summarize` và `/ai/classify` phục vụ trích xuất ý chính và phân loại nghiệp vụ.
- **Mock Gemini Service:** Tích hợp bộ giả lập thông minh (Mock Gemini Engine) mô phỏng độ trễ, token và dữ liệu hoàn chỉnh, sẵn sàng tích hợp Google Gemini thực tế qua biến môi trường.
- **Ẩn danh hóa dữ liệu (PII Anonymization):** Bộ lọc tự động thay thế thông tin nhạy cảm (tên, CCCD, số điện thoại, địa chỉ cụ thể) trước khi đưa vào prompt.
- **Ghi kiểm toán `AiAuditLog`:** Lưu vết minh bạch 100% các lần gọi AI, độ trễ, lượng token và kết quả phản hồi.

### Phase 2 – AI Assistant UI
- **Tích hợp AI vào luồng hồ sơ:** Đưa giao diện trợ lý AI vào trang chi tiết hồ sơ thụ lý (`CaseDetail.tsx`).
- **Tóm tắt / phân loại đơn:** Cho phép cán bộ kích hoạt phân tích AI với một cú nhấp chuột để nhận về bản tóm tắt và phân loại gợi ý.
- **Cán bộ chấp nhận / từ chối:** Thiết lập luồng tương tác rõ ràng, cán bộ đánh giá phản hồi AI là Hợp lý (Accept) hay Chưa đạt (Reject).
- **Cập nhật hồ sơ khi chấp nhận:** Khi cán bộ bấm "Chấp nhận", hệ thống tự động điền nội dung tóm tắt vào `caseSummary` hoặc phân loại vào `caseType`/`field`.
- **Ghi nhận Audit Log:** Cập nhật chính xác `userFeedback` (`ACCEPTED`/`REJECTED`) vào bản ghi kiểm toán tương ứng.

### Phase 3 – AI Checklist
- **AI gợi ý quy trình xử lý:** Tự động phân tích hồ sơ để đề xuất danh sách công việc chi tiết cần thực hiện.
- **Cấu trúc Checklist đa chiều:** Gợi ý các hạng mục chuyên sâu gồm: Nhóm việc cần làm, Tài liệu pháp lý cần kiểm tra, Bộ phận/Cơ quan phối hợp, Thời hạn giải quyết, Rủi ro pháp lý tiềm ẩn và Bước tiếp theo.
- **Lưu trữ vào `CaseChecklistItem`:** Cho phép cán bộ bấm "Áp dụng vào hồ sơ", chuyển toàn bộ các bước gợi ý thành các mục công việc thực tế trong CSDL.
- **An toàn tuyệt đối:** Trợ lý AI chỉ bổ sung danh mục công việc, **không tự động thay đổi trạng thái hồ sơ (`status`)**.

### Phase 4A – AI Drafting Nội Bộ
- **Soạn thảo Phiếu xử lý đơn:** Tự động tạo bản nháp Phiếu đề xuất xử lý đơn thư kèm đánh giá pháp lý sơ bộ.
- **Soạn thảo Giấy mời làm việc / đối thoại:** Tự động soạn dự thảo giấy mời công dân làm việc dựa trên nội dung khiếu nại/kiến nghị.
- **Lưu bản nháp vào `CaseNote`:** Khi cán bộ duyệt nháp, hệ thống lưu trữ dưới dạng ghi chú nội bộ với tiền tố nhận diện `[AI Dự thảo - ...]`.
- **Cảnh báo an toàn:** Bản nháp luôn đính kèm dòng thông báo bắt buộc: *“⚠️ BẢN NHÁP AI – CHƯA PHÁT HÀNH. Cán bộ phải kiểm tra trước khi sử dụng.”*

### Phase 4B – Mở Rộng AI Drafting
- **Bổ sung 4 loại mẫu văn bản mới:** Mở rộng năng lực soạn thảo cho các tình huống điển hình:
  1. *Thông báo thụ lý* (khi đơn đủ điều kiện).
  2. *Thông báo không thụ lý* (khi đơn sai thẩm quyền / hết thời hiệu).
  3. *Văn bản chuyển đơn* (chuyển cơ quan có thẩm quyền giải quyết).
  4. *Trả lời công dân dự thảo* (công văn giải thích, hướng dẫn).
- **Tuân thủ luồng dữ liệu:** Tất cả 6 loại văn bản đều là bản nháp nội bộ, được lưu trữ an toàn trong `CaseNote`.

### Phase 4C – UAT UI Polish
- **Cải thiện giao diện khối soạn thảo:** Tối ưu hóa UI/UX widget Trợ lý AI (`AiAssistantWidget.tsx`), phân chia bố cục rõ ràng, chuyên nghiệp.
- **Nút gợi ý nhanh (Quick Chips):** Bổ sung dải nút bấm tạo nháp nhanh cho 6 loại văn bản, giúp thao tác 1 chạm tiện lợi.
- **Tăng chiều cao khung soạn thảo:** Mở rộng không gian hiển thị textarea, hỗ trợ cuộn mượt mà khi chỉnh sửa các văn bản dài.
- **Banner Human-in-the-Loop nổi bật:** Làm nổi bật thông điệp nhắc nhở trách nhiệm cán bộ ngay trên đầu khu vực soạn thảo.

### Phase 5A – Xuất Word `.docx`
- **Xuất bản nháp AI từ `CaseNote` ra file Word:** Cho phép tải về tệp tin `.docx` chuẩn nhị phân từ các ghi chú nháp AI.
- **Cơ chế Streaming trực tiếp:** Backend sử dụng `docx` library tạo file trong bộ nhớ (buffer) và stream trực tiếp qua HTTP response về trình duyệt.
- **Không lưu MinIO / Không phát hành:** File Word tải về chỉ phục vụ cán bộ chỉnh sửa offline, không ghi đè lên hệ thống tài liệu chính thức.
- **Audit Log đầy đủ:** Ghi nhận hành động `EXPORT_DOCX` vào `AiAuditLog` mỗi lần cán bộ thực hiện kết xuất file.

### Phase 5B – Chuẩn Hóa Template Word
- **Chuẩn hóa bố cục Word theo thể thức hành chính:** Nâng cấp chất lượng dàn trang `.docx` theo Nghị định 30/2020/NĐ-CP.
- **Phân nhóm Template chuyên biệt (`TemplateGroup`):**
  - `INTERNAL_NOTE`: Phiếu xử lý nội bộ (Bỏ Quốc hiệu/Tiêu ngữ, thêm dòng Kèm theo hồ sơ vụ việc).
  - `NAMED_DOC`: Văn bản có tên loại (Giấy mời, Thông báo thụ lý/không thụ lý - Canh giữa tên văn bản).
  - `OFFICIAL_LETTER`: Công văn hành chính (Văn bản chuyển đơn, Trả lời công dân - Cấu trúc Kính gửi, Nơi nhận chuẩn mực).
- **Làm nổi bật Placeholder:** Định dạng các vùng thiếu thông tin `[Cán bộ bổ sung...]` bằng chữ đậm in nghiêng dễ nhận biết.
- **Giữ nguyên nhãn bảo vệ:** Khóa cố định nhãn “BẢN NHÁP AI – CHƯA PHÁT HÀNH” trên đầu mọi tài liệu xuất ra.

### Phase 5C – Cấu Hình Cơ Quan
- **Quản lý cấu hình qua biến môi trường (`.env`):** Bổ sung bộ biến `AGENCY_PARENT_NAME`, `AGENCY_NAME`, `AGENCY_LOCATION`, `AGENCY_SIGNER_TITLE`, `AGENCY_SIGNER_NAME`, `AGENCY_DOC_PREFIX`, `AGENCY_DEFAULT_RECIPIENTS`.
- **Kiến trúc Zero-Database-Touch:** Hoàn toàn **không sửa đổi database schema**, **không tạo migration**, đảm bảo độ ổn định cao nhất cho hệ thống đang vận hành.
- **Fallback thông minh:** Hệ thống tự động thay thế cấu hình vào văn bản; nếu thiếu trường nào sẽ tự động fallback về placeholder `[Cán bộ bổ sung...]`.
- **Chấm dứt Hardcode:** Xóa bỏ triệt để việc hardcode tên xã/phường cụ thể trong mã nguồn.

### Phase 5D-A – Print Preview & Browser PDF
- **Modal xem trước trang A4:** Xây dựng `AiDraftPrintModal.tsx` hiển thị văn bản mô phỏng chính xác tờ giấy A4 (210x297mm) với phông chữ `Times New Roman`.
- **In / Lưu PDF qua trình duyệt:** Tận dụng công cụ in gốc của trình duyệt (`window.print()`), cho phép cán bộ chọn "Save as PDF".
- **Không dùng package nặng:** Kiên quyết **không dùng LibreOffice, Puppeteer hay pdfkit** phía máy chủ, giữ container nhẹ nhàng.
- **Không sửa Dockerfile / Không lưu MinIO:** Bản PDF in ra phục vụ kiểm tra, trình ký nháp ngoài hệ thống.

---

## 4. Mô tả luồng nghiệp vụ End-to-End

Toàn bộ chu trình nghiệp vụ được kết nối liền mạch, chặt chẽ qua 11 bước tiêu chuẩn:
1. **Mở hồ sơ:** Cán bộ thụ lý truy cập trang chi tiết vụ việc khiếu nại/tố cáo/kiến nghị (`CaseDetail`).
2. **AI tóm tắt / phân loại:** Bấm nút yêu cầu AI đọc hồ sơ, nhận về bản tóm tắt ngắn gọn và gợi ý phân loại đơn thư.
3. **Cán bộ chấp nhận / từ chối:** Cán bộ thẩm định phản hồi AI. Nếu "Chấp nhận", dữ liệu được áp dụng vào trường thông tin chính thức của hồ sơ.
4. **AI tạo checklist:** Bấm yêu cầu AI gợi ý quy trình giải quyết, AI phân tích để đề xuất các bước công việc và rủi ro.
5. **Cán bộ áp dụng checklist:** Cán bộ rà soát checklist, bấm "Áp dụng vào hồ sơ" để tạo các mục việc cần làm (`CaseChecklistItem`).
6. **AI tạo bản nháp văn bản:** Cán bộ chọn mẫu văn bản cần soạn thảo (1 trong 6 loại mẫu), AI tự động tạo dự thảo chi tiết.
7. **Cán bộ chỉnh sửa & lưu `CaseNote`:** Cán bộ rà soát, chỉnh sửa câu chữ ngay trên màn hình rồi bấm "Lưu vào ghi chú hồ sơ".
8. **Cán bộ tải Word `.docx`:** Tại danh sách ghi chú, cán bộ bấm nút **"📄 Tải Word (.docx)"** để tải tệp tin Word đã chuẩn hóa thể thức hành chính và cấu hình cơ quan.
9. **Cán bộ xem trước & in PDF:** Bấm nút **"🖨️ Xem & In PDF"** để mở giao diện A4 mô phỏng, bấm in và chọn "Save as PDF" để xuất bản nháp PDF.
10. **Hệ thống ghi nhận Audit Log:** Mọi hành động gọi AI, duyệt kết quả, tải Word hay xem trước PDF đều được tự động lưu vết vào `AiAuditLog`.
11. **Bảo đảm tính bất biến của trạng thái:** Trong suốt toàn bộ 10 bước trên, **trạng thái hồ sơ (`status`) và cán bộ thụ lý (`assignedToId`) tuyệt đối không tự động thay đổi**.

---

## 5. Mô tả dữ liệu / Bảng chính liên quan

- **`LegalCase`**: Bảng lưu trữ thông tin gốc của vụ việc (mã hồ sơ, tiêu đề, tóm tắt, phân loại, trạng thái xử lý). **Hệ thống AI tuyệt đối không tự ý thay đổi `status` và `assignedToId` tại bảng này.**
- **`CaseNote`**: Bảng lưu trữ ghi chú thụ lý nội bộ. Nơi lưu giữ các bản nháp AI sau khi cán bộ duyệt (được đánh dấu bằng tiền tố `[AI Dự thảo - ...]`). Nội dung trong bảng này chỉ thay đổi khi cán bộ chủ động chỉnh sửa và nhấn lưu.
- **`CaseChecklistItem`**: Bảng lưu trữ danh sách công việc của hồ sơ. Trợ lý AI chỉ thêm bản ghi mới vào đây khi cán bộ bấm nút áp dụng gợi ý.
- **`AiAuditLog`**: Bảng kiểm toán trung tâm của phân hệ AI. Ghi nhận toàn bộ thông số: `userId`, `caseId`, `actionType` (`SUMMARIZE`, `CLASSIFY`, `CHECKLIST`, `DRAFT`), `modelName`, `promptTokens`, `completionTokens`, `latencyMs`, `status`, và `userFeedback` (`ACCEPTED`, `REJECTED`, `MODIFIED`).
- **`AiCaseSuggestion`**: Bảng lưu trữ kết quả phân tích gợi ý định kỳ hoặc tham khảo cho hồ sơ, hỗ trợ truy xuất nhanh cấu trúc gợi ý AI.
- **Cam kết an toàn dữ liệu:** Hệ thống **hoàn toàn không tự động phát hành văn bản** ra công chúng hoặc tích hợp gửi tự động vào các bảng quản lý văn bản đi/đến bên ngoài mà không có sự phê duyệt thủ công của cán bộ có thẩm quyền.

---

## 6. Mô tả cơ chế an toàn Human-in-the-Loop

Cơ chế **Human-in-the-Loop (Con người là trung tâm kiểm soát)** được thực thi triệt do qua 11 chốt chặn bảo mật:
1. **AI chỉ có vai trò hỗ trợ, tư vấn:** Không thay thế vai trò phán quyết nghiệp vụ.
2. **Cán bộ là người quyết định duy nhất:** Mọi output của AI đều ở trạng thái chờ duyệt (Pending / Suggestion).
3. **Bản nháp luôn có cảnh báo:** Luôn gắn liền banner *“⚠️ BẢN NHÁP AI – CHƯA PHÁT HÀNH”* trong giao diện, trong file Word và trên tệp PDF.
4. **Placeholder bắt buộc:** Khi thiếu thông tin cấu hình hoặc dữ liệu hồ sơ, AI bắt buộc dùng placeholder `[Cán bộ bổ sung...]`, tuyệt đối không tự suy đoán bịa đặt.
5. **Không tự gửi văn bản / email:** Không có bất kỳ API tự động phát hành hay gửi tin nhắn cho công dân khi soạn nháp xong.
6. **Không tự ký số:** Bản xuất ra để trống vùng chữ ký hoặc ghi rõ `(Ký, ghi rõ họ tên)`, chờ quy trình trình ký thực tế.
7. **Không tự phát hành:** Không tự kết nối cổng thông tin điện tử hay hệ thống văn bản của chính quyền.
8. **Không tự kết luận pháp lý:** Văn bản AI luôn mang tính chất "Dự thảo đề xuất", đặt quyền thẩm định pháp lý cho cán bộ thụ lý.
9. **Không tự đổi `LegalCase.status`:** Hồ sơ không bị tự động chuyển từ "Đang xử lý" sang "Đã giải quyết".
10. **Không tự đổi `assignedToId`:** Quyền phụ trách hồ sơ không bị tự động điều chuyển hay thay đổi.
11. **Audit Log toàn diện:** Ghi nhận trách nhiệm rạch ròi, ai là người gọi AI, ai là người duyệt hay tải tài liệu nháp.

---

## 7. Mô tả các mốc Tag / Phiên bản đã hoàn thành

Toàn bộ lịch sử phát triển phân hệ AI v2 được đóng gói qua 18 mốc Git Tag chuẩn xác:
- `v2.1.0-ai-phase3-checklist`: Hoàn thành tính năng AI gợi ý quy trình & Checklist nghiệp vụ.
- `v2.2.0-ai-phase4a-drafting`: Hoàn thành Phase 4A - Soạn thảo Phiếu xử lý đơn & Giấy mời làm việc.
- `v2.2.1-ai-phase4a-complete`: Kiểm thử, tinh chỉnh và nghiệm thu hoàn tất Phase 4A.
- `v2.2.2-ai-phase4b-complete`: Hoàn thành Phase 4B - Mở rộng đủ 6 mẫu văn bản dự thảo AI.
- `v2.2.3-ai-uat-demo-ready`: Chuẩn bị sẵn sàng kịch bản, dữ liệu và giao diện phục vụ UAT Demo.
- `v2.2.4-ai-demo-package`: Đóng gói bộ công cụ demo nghiệp vụ trọn gói.
- `v2.2.5-ai-uat-feedback-ready`: Hoàn thiện biểu mẫu thu thập ý kiến đánh giá UAT (`LEGALFLOW_AI_UAT_FEEDBACK_FORM.md`).
- `v2.2.6-ai-uat-result-summary`: Tổng hợp kết quả UAT đợt 1, định hướng nâng cấp Polish UI.
- `v2.2.7-ai-phase4c-ui-polish`: Hoàn thành Phase 4C - Cải tiến giao diện AI Assistant Widget & Quick Chips.
- `v2.2.8-ai-phase4c-complete`: Kiểm thử toàn diện và đóng gói chính thức Phase 4C.
- `v2.3.0-ai-phase5a-docx-export`: Hoàn thành Phase 5A - Xuất bản nháp AI từ `CaseNote` ra file Word `.docx`.
- `v2.3.1-ai-phase5a-complete`: Nghiệm thu hoàn tất Phase 5A, đảm bảo không hardcode tên cơ quan.
- `v2.3.2-ai-phase5b-word-templates`: Hoàn thành Phase 5B - Chuẩn hóa bố cục thể thức Word hành chính theo Nghị định 30.
- `v2.3.3-ai-phase5b-complete`: Nghiệm thu hoàn tất Phase 5B với 3 nhóm Template chuyên biệt.
- `v2.3.4-ai-phase5c-agency-config`: Hoàn thành Phase 5C - Cấu hình thông tin cơ quan qua biến môi trường `.env`.
- `v2.3.5-ai-phase5c-complete`: Nghiệm thu hoàn tất Phase 5C, triệt tiêu placeholder thủ công.
- `v2.3.6-ai-phase5d-browser-pdf-preview`: Hoàn thành Phase 5D-A - Modal xem trước trang A4 & in/lưu PDF qua trình duyệt.
- `v2.3.7-ai-phase5d-complete`: Nghiệm thu hoàn tất Phase 5D và hoàn tất toàn bộ chuỗi phát triển v2.3.

---

## 8. Tổng kết các tài liệu đã có trong thư mục `docs`

Hệ thống tài liệu dự án được xây dựng đồ sộ, mạch lạc trong thư mục `docs/`:
- **Tài liệu Kế hoạch Kỹ thuật (Technical Plans):** `LEGALFLOW_V2_AI_TECHNICAL_PLAN.md`, `LEGALFLOW_V2_AI_PHASE2_PLAN.md`, `LEGALFLOW_V2_AI_PHASE3_PLAN.md`, `LEGALFLOW_V2_AI_PHASE4_PLAN.md`, `LEGALFLOW_V2_AI_PHASE4B_PLAN.md`, `LEGALFLOW_V2_AI_PHASE4C_PLAN.md`, `LEGALFLOW_V2_AI_PHASE5A_PLAN.md`, `LEGALFLOW_V2_AI_PHASE5B_PLAN.md`, `LEGALFLOW_V2_AI_PHASE5C_PLAN.md`, `LEGALFLOW_V2_AI_PHASE5D_PLAN.md`.
- **Tài liệu Hoàn thành & Nghiệm thu (Completion Reports):** `LEGALFLOW_V2_AI_PHASE2_COMPLETION.md`, `LEGALFLOW_V2_AI_PHASE3_COMPLETION.md`, `LEGALFLOW_V2_AI_PHASE4A_COMPLETION.md`, `LEGALFLOW_V2_AI_PHASE4B_COMPLETION.md`, `LEGALFLOW_V2_AI_PHASE4C_COMPLETION.md`, `LEGALFLOW_V2_AI_PHASE5A_COMPLETION.md`, `LEGALFLOW_V2_AI_PHASE5B_COMPLETION.md`, `LEGALFLOW_V2_AI_PHASE5C_COMPLETION.md`, `LEGALFLOW_V2_AI_PHASE5D_COMPLETION.md`.
- **Tài liệu Demo & UAT (UAT & Guidance):** `LEGALFLOW_AI_UAT_DEMO_SCRIPT.md` (Kịch bản trình diễn), `LEGALFLOW_DEMO_SAMPLE_CASE_GUIDE.md` (Hướng dẫn hồ sơ mẫu), `LEGALFLOW_AI_UAT_FEEDBACK_FORM.md` (Biểu mẫu khảo sát), `LEGALFLOW_AI_UAT_RESULT_SUMMARY.md` (Báo cáo kết quả UAT).
- **Tài liệu Vận hành & Nền tảng:** Các tài liệu runbook deployment, backup, rbac, observability.
- **Tài liệu Tổng kết Hệ thống:** Chính là tài liệu `LEGALFLOW_AI_V2_3_SYSTEM_SUMMARY.md` này.

---

## 9. Rủi ro còn lại

1. **Bản nháp AI cần rà soát kỹ lưỡng:** AI (kể cả Gemini thực tế hay Mock Engine) vẫn có xác suất hiểu sai một chi tiết tình tiết vụ việc nhỏ nếu đơn thư có từ ngữ địa phương hoặc mâu thuẫn phức tạp, đòi hỏi cán bộ thụ lý luôn phải đọc lại văn bản.
2. **Thể thức văn bản cần kiểm chứng nghiệp vụ:** Các mẫu văn bản xuất ra theo Nghị định 30/2020/NĐ-CP là khung chuẩn mực chung; tùy thuộc vào quy chế làm việc đặc thù từng địa phương, bộ phận văn thư/pháp chế cần rà soát trước khi ban hành chính thức.
3. **Phụ thuộc vào trình duyệt khi in PDF:** Chức năng in PDF của Phase 5D-A phụ thuộc vào driver in ấn và cài đặt lề trang (Margin) của từng trình duyệt trên máy khách.
4. **Chưa ký số & Chưa phát hành:** Hệ thống chưa tích hợp USB Token/CA Server để ký điện tử trực tiếp lên PDF.
5. **Chưa quản lý phiên bản file (File Versioning):** Các tệp `.docx` và `.pdf` tải về client chưa được tự động lưu trữ và đánh chỉ mục phiên bản trên kho tài liệu (`Document`) hoặc MinIO của hồ sơ.
6. **Chưa có giao diện GUI quản trị cấu hình cơ quan:** Cấu hình Phase 5C hiện tại đang quản lý qua file `.env`, cần quản trị viên hệ thống can thiệp khi muốn đổi tên cơ quan thay vì đổi trên giao diện Admin.
7. **Quản lý tài nguyên khi tích hợp Gemini thật:** Khi chuyển từ Mock Engine sang LLM thương mại, cần giám sát chặt chẽ API Key, hạn mức chi phí (Quota/Billing), tốc độ phản hồi và tuân thủ bảo mật dữ liệu công dân (GDPR/NDPL).

---

## 10. Khuyến nghị bước tiếp theo

1. **Tổ chức UAT lần 2 mở rộng:** Đưa toàn bộ chu trình mới (soạn thảo nhanh 6 mẫu văn bản $\rightarrow$ tải Word chuẩn hóa $\rightarrow$ xem trước & in PDF A4) ra trình diễn và đánh giá nghiệp vụ với các cán bộ thụ lý thực tế.
2. **Rà soát chất lượng 6 mẫu văn bản:** Thẩm định sâu về mặt từ ngữ pháp lý nghiệp vụ đất đai cho 6 bộ template dự thảo.
3. **Chuẩn hóa cấu hình cơ quan:** Hoàn thiện bộ thông số cấu hình `.env` cho đơn vị triển khai thí điểm trước khi đưa vào vận hành thực tế.
4. **Nghiên cứu lộ trình phát triển các Phase tiếp theo (v2.4+):**
   - **Giao diện quản trị cấu hình cơ quan (UI Agency Config Dashboard):** Xây dựng trang Admin cho phép thay đổi Quốc hiệu, Tiêu ngữ, Tên cơ quan ban hành, Người ký ngay trên UI.
   - **Quản lý phiên bản file văn bản (Draft Document Versioning):** Tự động đính kèm file Word/PDF xuất ra vào tab Tài liệu (`documents`) của hồ sơ với số phiên bản (v1, v2...).
   - **Tích hợp kho lưu trữ MinIO:** Lưu trữ bền vững các bản nháp quan trọng trên đám mây nội bộ.
   - **Dashboard giám sát Audit Log AI:** Xây dựng màn hình thống kê lượng token tiêu thụ, tỷ lệ chấp nhận/từ chối (Acceptance Rate) của AI theo từng phòng ban.
   - **Cấu hình kết nối Google Gemini Pro thực tế:** Chuyển đổi cờ biến môi trường để kết nối LLM thực tế trong môi trường Staging/Production.
   - **Phân quyền nâng cao (Advanced RBAC):** Giới hạn quyền sử dụng AI drafting cho từng cấp bậc cán bộ cụ thể.

---

## 11. Kết luận

Hệ thống **LegalFlow AI v2.3** đã hoàn thành toàn diện chu trình hỗ trợ xử lý đơn thư thông minh từ đầu đến cuối (**End-to-End AI Draft Workflow**): Từ bước tiếp nhận, đọc hiểu, tóm tắt, phân loại tự động, đến gợi ý checklist công việc và kết xuất văn bản nháp ra Word/PDF chuẩn thể thức hành chính.

Hệ thống đã đạt độ chín muồi cao về kiến trúc kỹ thuật, tính ổn định và sự sẵn sàng cho các đợt kiểm thử UAT nâng cao cũng như vận hành thực tiễn. Trong đó, nguyên tắc **Human-in-the-Loop – Cán bộ luôn là người kiểm soát, thẩm định và chịu trách nhiệm cuối cùng** tiếp tục là kim chỉ nam bất di bất dịch cho mọi bước tiến phát triển hiện tại và tương lai.
