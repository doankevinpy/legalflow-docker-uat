# LEGALFLOW V2 - PHASE 9A

# TTHC AI GOVERNANCE UAT & HARDENING PLAN

**Ngày phát hành:** 06/07/2026  
**Mô-đun:** Quản trị Trí tuệ Nhân tạo & Thủ tục Hành chính Đất đai (TTHC AI Governance & Hardening Track)  
**Trạng thái:** ĐÃ HOÀN THÀNH (100% Comprehensive UAT & Hardening Architecture Plan)  

---

## 1. Purpose

Tài liệu này thiết lập **Kế hoạch Kiểm thử Nghiệm thu Người dùng Tổng thể (Comprehensive UAT Plan) và Danh mục Gia cố Kỹ thuật (Hardening Backlog)** cho toàn bộ hệ sinh thái trí tuệ nhân tạo (AI) hỗ trợ rà soát và xử lý thủ tục hành chính (TTHC) về đất đai trong hệ thống LegalFlow V2.

Mục tiêu tối thượng của kế hoạch là chuẩn hóa quy trình thẩm định, bảo đảm mọi mô-đun AI vận hành trong khuôn khổ pháp lý khắt khe của cơ quan quản lý nhà nước, tuân thủ tuyệt đối 6 nguyên tắc quản trị AI tối cao:

1. **AI chỉ hỗ trợ (AI Assistance Only)**: Trí tuệ nhân tạo chỉ đóng vai trò trợ lý công nghệ giúp tổng hợp hồ sơ, phân tích rủi ro và gợi ý rà soát; AI không có thẩm quyền tư pháp hay quyền lực hành chính.
2. **Cán bộ phải kiểm tra (Mandatory Human Verification)**: Toàn bộ kết quả rà soát, điểm tin cậy và dự thảo văn bản do AI sinh ra bắt buộc phải được chuyên viên nghiệp vụ và lãnh đạo rà soát, kiểm chứng, đối chiếu thực tế.
3. **AI không kết luận thay cán bộ**: AI không bao giờ được đưa ra phán quyết hay kết luận pháp lý cuối cùng trên hồ sơ TTHC (không thay thế kết luận thẩm định hợp lệ/không hợp lệ của cán bộ).
4. **AI không tự thay đổi trạng thái hồ sơ**: AI tuyệt đối không tự động chuyển trạng thái thụ lý hồ sơ từ `PROCESSING` sang `APPROVED`, `REJECTED` hay bất kỳ trạng thái nào khác.
5. **AI không tự ký / gửi văn bản**: AI không có chữ ký số và không được quyền tự động ký duyệt, đóng dấu, ban hành hay phát hành công văn, quyết định thông báo đến công dân/tổ chức.
6. **Cảnh báo pháp lý bắt buộc trên mọi bản gợi ý**: Mọi giao diện, báo cáo phân tích, phiếu rà soát và dự thảo văn bản AI đều phải in đậm khuyến cáo pháp lý chuẩn:
   > **⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA:** Căn cứ pháp lý hiển thị là phiên bản dữ liệu hệ thống ghi nhận tại thời điểm AI rà soát; cán bộ phải kiểm tra văn bản pháp luật hiện hành, văn bản sửa đổi/bổ sung/thay thế nếu có, quy hoạch/kế hoạch sử dụng đất và quy trình nội bộ địa phương tại thời điểm xử lý hồ sơ.

---

## 2. UAT Scope

Phạm vi nghiệm thu UAT tổng thể bao phủ toàn bộ 13 mô-đun và chức năng giao cắt giữa Quản lý hồ sơ TTHC và Quản trị tri thức pháp lý:

1. **Hồ sơ TTHC (Administrative Procedure Cases)**: Quản lý danh sách, thông tin người nộp, tình trạng giải quyết và tài liệu đính kèm.
2. **AI review cấp GCN lần đầu**: Mô-đun thẩm tra AI cho thủ tục Cấp Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở và tài sản khác gắn liền với đất lần đầu.
3. **AI review chuyển mục đích sử dụng đất**: Mô-đun thẩm tra AI cho thủ tục Cho phép chuyển mục đích sử dụng đất.
4. **Checklist hồ sơ (Checklist Evaluation)**: Đánh giá tính hợp lệ, đầy đủ của từng thành phần hồ sơ theo tiêu chí pháp lý.
5. **Legal snapshot (Bản chụp căn cứ pháp lý)**: Cơ chế lưu vết bất biến căn cứ pháp lý áp dụng tại thời điểm rà soát.
6. **Draft document (Dự thảo văn bản TTHC)**: Sinh tự động các dự thảo tờ trình, công văn bổ sung, quyết định dựa trên kết quả AI.
7. **Word/PDF export**: Xuất khẩu báo cáo rà soát và dự thảo văn bản ra định dạng chuẩn hành chính (.docx, .pdf).
8. **Legal Knowledge (Kho căn cứ pháp lý)**: Danh mục văn bản, mối quan hệ hiệu lực và cây gia phả pháp luật.
9. **Legal Version Governance (Quản trị version pháp lý)**: Quy trình rà soát tác động, tạo bản nháp, simulation, kích hoạt và hoàn tác.
10. **Phân quyền (RBAC Security Guard)**: Kiểm soát truy cập chặt chẽ theo vai trò người dùng từ UI đến Backend API.
11. **Audit trail (Dấu vết kiểm toán)**: Nhật ký toàn diện ghi lại lịch sử thao tác, workflow, kích hoạt, hoàn tác và kiểm chứng.
12. **Error handling (Xử lý ngoại lệ)**: Khả năng phản hồi an toàn, hiển thị thông báo rõ ràng khi gặp lỗi mạng, lỗi quyền hoặc dữ liệu trống.
13. **Data safety (An toàn dữ liệu & Không đột biến)**: Đảm bảo không thay đổi trái phép hồ sơ cũ, kết quả AI cũ hay snapshot pháp lý.

---

## 3. Key User Roles

Ma trận phân quyền nghiệp vụ chi tiết cho 04 nhóm vai trò người dùng trong luồng AI xử lý TTHC:

| Chức năng / Thẩm quyền Nghiệp vụ | `ADMIN` (Quản trị viên) | `MANAGER` (Lãnh đạo) | `STAFF` (Chuyên viên) | `VIEWER` (Người xem / Auditor) |
| :--- | :---: | :---: | :---: | :---: |
| **Xem danh sách & chi tiết hồ sơ TTHC** | ✔ Toàn quyền | ✔ Toàn quyền | ✔ Toàn quyền | ✔ Read-only |
| **Chạy AI Review (Cấp GCN & Chuyển MĐSDĐ)** | ✔ Được phép | ✔ Được phép | ✔ Được phép | ✖ Bị chặn (403) |
| **Xem báo cáo AI & Bản chụp Legal Snapshot** | ✔ Toàn quyền | ✔ Toàn quyền | ✔ Toàn quyền | ✔ Read-only |
| **Sinh dự thảo văn bản TTHC (Drafting)** | ✔ Được phép | ✔ Được phép | ✔ Được phép | ✖ Bị chặn (403) |
| **Xuất khẩu văn bản Word / PDF (Export)** | ✔ Được phép | ✔ Được phép | ✔ Được phép | ✔ Read-only (Tải về) |
| **Thao tác Review Workflow Cập nhật pháp lý** | ✔ Toàn quyền | ✔ Toàn quyền | ✔ Thêm ý kiến / Hỏi | ✖ Bị chặn (403) |
| **Tạo bản nháp & Chạy Simulation (Shadow Test)**| ✔ Được phép | ✔ Được phép | ✔ Được phép | ✖ Bị chặn (403) |
| **Kích hoạt version chính thức (Activation)** | ✔ Thẩm quyền cao | ✔ Thẩm quyền cao | ✖ Bị chặn (UI ẩn / 403)| ✖ Bị chặn (403) |
| **Hoàn tác version khẩn cấp (Rollback)** | ✔ Thẩm quyền cao | ✔ Thẩm quyền cao | ✖ Bị chặn (UI ẩn / 403)| ✖ Bị chặn (403) |
| **Chạy Hậu kiểm (Post-activation/Rollback Audit)**| ✔ Read-only | ✔ Read-only | ✔ Read-only | ✔ Read-only |
| **Can thiệp sửa DB / Xóa lịch sử Audit Trail** | ✖ Cấm tuyệt đối | ✖ Cấm tuyệt đối | ✖ Cấm tuyệt đối | ✖ Cấm tuyệt đối |

---

## 4. End-to-end UAT Flow

Luồng kiểm thử nghiệm thu tổng thể từ đầu đến cuối (End-to-End UAT Flow) được chuẩn hóa theo 12 bước liên hoàn:

```
[1. Đăng nhập hệ thống (Chọn Role chuẩn)]
               │
               ▼
[2. Mở danh sách hồ sơ TTHC (Đất đai)]
               │
               ▼
[3. Chọn hồ sơ TTHC (Cấp GCN / Chuyển mục đích)]
               │
               ▼
[4. Chạy AI review (Thẩm tra tự động)]
               │
               ▼
[5. Kiểm tra cảnh báo AI (Bắt buộc hiển thị)]
               │
               ▼
[6. Kiểm tra checklist (Tiêu chí thành phần)]
               │
               ▼
[7. Kiểm tra căn cứ pháp lý & Snapshot (Bất biến)]
               │
               ▼
[8. Sinh dự thảo văn bản (Tờ trình / Công văn)]
               │
               ▼
[9. Export Word/PDF (Chuẩn định dạng hành chính)]
               │
               ▼
[10. Kiểm tra audit trail (Ghi vết thời gian thực)]
               │
               ▼
[11. Kiểm tra không có thay đổi trái phép (DB/Case intact)]
               │
               ▼
[12. Kiểm tra phân quyền RBAC (Chéo tài khoản)]
```

1. **Đăng nhập**: Đăng nhập với tài khoản hợp lệ (`ADMIN`, `MANAGER`, `STAFF`, `VIEWER`).
2. **Mở danh sách hồ sơ**: Truy cập mô-đun Quản lý hồ sơ TTHC đất đai.
3. **Chọn hồ sơ TTHC**: Mở chi tiết một hồ sơ Cấp GCN lần đầu hoặc Chuyển mục đích sử dụng đất đang ở trạng thái `PROCESSING`.
4. **Chạy AI review**: Bấm nút kích hoạt thẩm tra AI; quan sát quá trình phân tích và tiến trình tải.
5. **Kiểm tra cảnh báo AI**: Xác nhận lời nhắc **"⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA"** xuất hiện nổi bật trên đầu báo cáo.
6. **Kiểm tra checklist**: Đối chiếu bảng đánh giá thành phần hồ sơ (Hợp lệ / Thiếu / Cần làm rõ) do AI bóc tách.
7. **Kiểm tra căn cứ pháp lý snapshot**: Vào thẻ Legal Snapshot, xác nhận hệ thống ghi nhận chính xác ID phiên bản luật, thủ tục, prompt và checklist tại thời điểm rà soát.
8. **Sinh dự thảo văn bản**: Bấm tạo dự thảo văn bản TTHC; kiểm tra nội dung lời văn hành chính trang trọng, không có từ ngữ khẳng định tuyệt đối thay cán bộ.
9. **Export Word/PDF**: Tải xuống văn bản ở định dạng `.docx` và `.pdf`; kiểm tra định dạng layout, font chữ hành chính và khung cảnh báo AI.
10. **Kiểm tra audit trail**: Mở lịch sử thao tác; xác nhận hệ thống ghi vết đầy đủ hành động chạy review, sinh dự thảo và xuất file.
11. **Kiểm tra không có thay đổi trái phép**: Xác minh trạng thái hồ sơ vẫn là `PROCESSING`, không bị AI tự động duyệt hay tự động gửi đi.
12. **Kiểm tra phân quyền**: Đăng nhập chéo bằng tài khoản `STAFF`/`VIEWER` để kiểm chứng các ranh giới bảo mật (chặn kích hoạt, rollback, hoặc chạy review ngoài quyền).

---

## 5. AI Review Governance Checks

Checklist 9 tiêu chuẩn vàng thẩm định tính tuân thủ quản trị của mô-đun AI Review:

- [ ] **AI-01. Cảnh báo bắt buộc trên output**: 100% kết quả phân tích AI hiển thị trên giao diện phải có banner cảnh báo đỏ/vàng: `BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA`.
- [ ] **AI-02. Không dùng ngôn ngữ kết luận tuyệt đối**: Văn phong AI không được sử dụng các câu khẳng định thẩm quyền như: *"Hồ sơ hợp lệ 100%"*, *"Chấp thuận cấp giấy"*, *"Quyết định cho phép chuyển mục đích"*.
- [ ] **AI-03. Sử dụng từ ngữ tham mưu chuẩn**: Văn phong AI bắt buộc dùng các cụm từ tham mưu hành chính: *"Gợi ý rà soát"*, *"Cần kiểm tra đối chiếu bản gốc"*, *"Đề xuất chuyên viên làm rõ"*, *"Căn cứ theo thông tin nhận dạng sơ bộ"*.
- [ ] **AI-04. Không tự xác nhận đủ điều kiện pháp lý**: AI chỉ đánh giá mức độ phù hợp dựa trên tài liệu đính kèm; quyền xác nhận đủ điều kiện pháp lý thuộc thẩm quyền ký của cán bộ thụ lý.
- [ ] **AI-05. Không tự đề nghị cấp giấy như kết luận cuối**: Các kết luận trên báo cáo AI chỉ là "Ý kiến tham khảo cho chuyên viên", không được định dạng như một Quyết định hay Tờ trình hành chính đã được ký duyệt.
- [ ] **AI-06. Không tự thay đổi trạng thái hồ sơ**: Sau khi AI hoàn tất rà soát, trường `status` của bảng `administrative_procedure_cases` trong CSDL phải giữ nguyên giá trị ban đầu.
- [ ] **AI-07. Không tự phân công cán bộ**: AI không được tự động gán hoặc thay đổi người thụ lý (`assignedToId`) của hồ sơ TTHC.
- [ ] **AI-08. Không tự gửi email/SMS/Zalo**: Hệ thống không được kích hoạt bất kỳ webhook hay tiến trình ngầm nào gửi thông báo kết quả AI cho người nộp hồ sơ khi chuyên viên chưa bấm nút phát hành chính thức.
- [ ] **AI-09. Không tự phát hành văn bản**: Mọi dự thảo công văn, tờ trình do AI sinh ra phải nằm trong vùng lưu trữ nháp (`DRAFT`), không được tự động cấp số văn bản hay tự động chuyển sang văn bản đến/đi của cơ quan.

---

## 6. Legal Snapshot UAT

Checklist thẩm định tính bất biến và khả năng truy xuất nguồn gốc của Bản chụp căn cứ pháp lý (`ProcedureAiAnalysisLegalSnapshot`):

- [ ] **SN-01. Gắn kết snapshot phù hợp**: Mỗi lần chạy AI Review (`ProcedureAiAnalysis`), hệ thống bắt buộc phải sinh ra một bản ghi snapshot tương ứng, ánh xạ chính xác mã ID của `ProcedureTypeVersion`, `AiPromptVersion` và `ChecklistVersion` đang `ACTIVE`.
- [ ] **SN-02. Bất biến khi luật thay đổi**: Khi có văn bản luật mới ban hành và phiên bản thủ tục mới được ban hành, các snapshot cũ của những hồ sơ đã thẩm tra trước đó **phải giữ nguyên 100% dữ liệu**, không bị cập nhật theo luật mới.
- [ ] **SN-03. Bất biến khi Activation / Rollback**: Khi Lãnh đạo thực hiện Kích hoạt (`ACTIVATE`) hoặc Hoàn tác (`ROLLBACK`) một version pháp lý, toàn bộ dữ liệu trong bảng `procedure_ai_analysis_legal_snapshots` phải được bảo toàn nguyên trạng.
- [ ] **SN-04. Khả năng xem lại lịch sử (Traceability)**: Cán bộ mở một hồ sơ TTHC đã thẩm tra từ 6 tháng trước, bấm vào thẻ Legal Snapshot, hệ thống phải hiển thị chính xác nội dung prompt, checklist và luật áp dụng tại thời điểm 6 tháng trước đó.
- [ ] **SN-05. Không mất kết nối dữ liệu**: Đảm bảo mối quan hệ khóa ngoại (Foreign Key / Relation) giữa bài phân tích AI và bản chụp pháp lý không bao giờ bị đứt gãy hoặc rò rỉ Null.

---

## 7. Case Safety UAT

Checklist thẩm định cam kết an toàn hồ sơ TTHC (Case Safety Guarantee):

- [ ] **CS-01. AI Review không đổi trạng thái**: Thực hiện bấm chạy AI review nhiều lần trên cùng một hồ sơ; xác nhận trạng thái hồ sơ (`PROCESSING`) và các thông tin người nộp tuyệt đối không bị thay đổi.
- [ ] **CS-02. Simulation không sửa hồ sơ thật**: Chạy tính năng Shadow Testing (Modal 10) trên 05 hồ sơ mẫu; kiểm tra CSDL xác nhận bảng `procedure_ai_analyses` và `administrative_procedure_cases` không có bất kỳ lệnh `UPDATE` hay `INSERT` trái phép nào.
- [ ] **CS-03. Export Word/PDF không gửi văn bản**: Bấm xuất khẩu file Word và PDF; xác nhận thao tác chỉ tạo stream tải file về trình duyệt máy trạm của cán bộ, không gửi qua mạng hay lưu ra thư mục công khai.
- [ ] **CS-04. Activation/Rollback không sửa hồ sơ cũ**: Thực hiện kích hoạt version mới hoặc hoàn tác version cũ trong Kho kiến thức; kiểm tra chéo các hồ sơ TTHC đang giải quyết, xác nhận không có hồ sơ nào bị lỗi hay bị lùi trạng thái.
- [ ] **CS-05. Post-verification hoàn toàn chỉ đọc**: Bấm nút Hậu kiểm sau kích hoạt và sau rollback; xác nhận API kiểm chứng trả về HTTP 200 OK và CSDL không có bất kỳ thay đổi nào (100% Read-only).

---

## 8. Document Drafting & Export UAT

Checklist thẩm định chất lượng và tính chuẩn mực của tính năng Sinh dự thảo và Xuất văn bản:

- [ ] **DD-01. Tiêu đề dự thảo rõ ràng**: Văn bản do AI sinh ra phải có tiêu đề hành chính chuẩn (ví dụ: *DỰ THẢO TỜ TRÌNH V/v Thẩm định hồ sơ cấp Giấy chứng nhận quyền sử dụng đất*).
- [ ] **DD-02. Cảnh báo bản gợi ý AI trên file xuất**: Trên file Word (`.docx`) và file PDF (`.pdf`) xuất ra, ngay dưới phần tiêu đề hoặc ở chân trang (footer) phải có dòng khuyến cáo in đậm: *Tài liệu tham khảo do AI hỗ trợ tổng hợp – Cán bộ nghiệp vụ kiểm tra và chịu trách nhiệm trước khi trình ký*.
- [ ] **DD-03. Nội dung hành chính trang trọng**: Văn phong trong dự thảo tuân thủ thể thức văn bản hành chính nhà nước (theo Nghị định 30/2020/NĐ-CP), câu từ rõ ràng, khúc chiết, chuẩn mực.
- [ ] **DD-04. Không ký thay cán bộ**: Tại phần chữ ký cuối văn bản, chỉ để trống khối ký chức danh (ví dụ: *NGƯỜI THẨM ĐỊNH / CHUYÊN VIÊN THỤ LÝ - [Ký và ghi rõ họ tên]*); tuyệt đối không tự động chèn chữ ký số hay hình ảnh chữ ký của bất kỳ ai.
- [ ] **DD-05. Không đóng dấu / thay ban hành**: Không tự động chèn con dấu cơ quan hay số/ký hiệu công văn chính thức.
- [ ] **DD-06. Word export đúng định dạng**: Mở file `.docx` bằng Microsoft Word hoặc LibreOffice; xác nhận layout không bị vỡ, bảng biểu thẳng hàng, font chữ chuẩn Unicode (Times New Roman / Arial).
- [ ] **DD-07. PDF export đúng nội dung**: Mở file `.pdf`; xác nhận hiển thị sắc nét, hỗ trợ tốt tiếng Việt có dấu, không bị lỗi font hay mất ký tự.
- [ ] **DD-08. Không tự gửi văn bản**: Xác nhận quy trình tải file về là cục bộ (local download), hệ thống không tự động đính kèm file vào email hay cổng dịch vụ công để gửi công dân.

---

## 9. Legal Version Governance UAT Integration

Checklist kiểm chứng sự tích hợp liền mạch giữa mô-đun AI TTHC với 07 mốc Quản trị Phiên bản Pháp lý đã hoàn thành (Phases 8F-E):

- [ ] **VG-01. Tích hợp Draft Version**: Khi AI rà soát hồ sơ, hệ thống tự động lọc bỏ các bản `DRAFT`, chỉ áp dụng bản `ACTIVE`.
- [ ] **VG-02. Tích hợp Simulation**: Đảm bảo kết quả chạy mô phỏng trên hồ sơ TTHC mẫu được lưu chính xác vào mảng `simulations` trong nhật ký cập nhật pháp lý.
- [ ] **VG-03. Tích hợp Activation**: Ngay sau khi Lãnh đạo thực hiện xác nhận 4 bước kích hoạt version mới, hồ sơ TTHC nộp vào sau thời điểm đó phải tự động được AI áp dụng cấu hình `ACTIVE` mới nhất.
- [ ] **VG-04. Tích hợp Post-activation Verification**: Bảng hậu kiểm sau kích hoạt hiển thị chuẩn xác số lượng hồ sơ TTHC và snapshot pháp lý đang được bảo toàn trong CSDL.
- [ ] **VG-05. Tích hợp Rollback**: Khi Lãnh đạo thực hiện hoàn tác khẩn cấp về version trước, hệ thống lập tức trỏ AI Review của các hồ sơ mới về lại bản `ACTIVE` được khôi phục.
- [ ] **VG-06. Tích hợp Post-rollback Verification**: Bảng hậu kiểm sau rollback (tại 2 vị trí trên modal nhật ký) xác nhận 100% hồ sơ TTHC cũ không bị ảnh hưởng.
- [ ] **VG-07. Tích hợp Audit Trail**: Mảng `workflowHistory`, `activationHistory` và `rollbackHistory` liên kết chặt chẽ với dữ liệu thẩm tra AI, bảo đảm khả năng truy vết thanh tra toàn diện.

---

## 10. Security & Permission Hardening Checklist

Checklist gia cố bảo mật và kiểm soát truy cập (Security & RBAC Hardening):

- [ ] **SE-01. STAFF không thấy nút quản trị nhạy cảm**: Kiểm tra giao diện khi đăng nhập bằng `STAFF`; xác nhận các nút "Kích hoạt version", "Hoàn tác version", "Duyệt tạo version" đều bị ẩn hoàn toàn.
- [ ] **SE-02. VIEWER chỉ đọc tuyệt đối**: Đăng nhập bằng `VIEWER`; xác nhận bị ẩn toàn bộ các nút thao tác chạy AI Review, tạo bản nháp, rà soát ý kiến hay xuất văn bản chỉnh sửa.
- [ ] **SE-03. ADMIN/MANAGER độc quyền Activation/Rollback**: Xác nhận chỉ 02 vai trò Lãnh đạo mới có thẩm quyền truy cập các modal xác nhận 4 bước nhạy cảm.
- [ ] **SE-04. Endpoint nhạy cảm có Guard bảo vệ**: Kiểm tra mã nguồn Backend và rà soát API; xác nhận 100% các endpoint xử lý AI và quản trị version đều có `@UseGuards(JwtAuthGuard, RolesGuard)` và `@Roles(...)`.
- [ ] **SE-05. Frontend không chỉ dựa vào ẩn nút**: Dùng công cụ cURL hoặc Postman gửi request trực tiếp đến API với token của `STAFF` hoặc `VIEWER` để gọi lệnh kích hoạt/rollback/chạy AI review trái phép.
- [ ] **SE-06. Backend luôn kiểm tra quyền thật**: Xác nhận Backend từ chối request trái phép từ Postman và trả về HTTP Status 403 Forbidden.
- [ ] **SE-07. Lỗi 401/403 hiển thị rõ ràng**: Khi phiên làm việc hết hạn (401) hoặc truy cập không đủ quyền (403), giao diện Frontend phải hiển thị thông báo lỗi thân thiện, dễ hiểu, không bị trắng trang hay treo ứng dụng.

---

## 11. API/Error Handling Hardening

Checklist gia cố khả năng xử lý lỗi và tính bồi hoàn giao diện (Error Handling & UI Resilience):

- [ ] **EH-01. API 204 không làm UI im lặng**: Khi API trả về HTTP 204 No Content (hoặc danh sách rỗng), giao diện phải hiển thị trạng thái rỗng (Empty state) rõ ràng (ví dụ: *Chưa có bài rà soát AI nào cho hồ sơ này*), không được để trống màn hình gây hiểu lầm.
- [ ] **EH-02. API 401/403 hiển thị lỗi quyền**: Hiển thị Toast thông báo hoặc Modal báo lỗi truy cập khi gặp lỗi xác thực/phân quyền.
- [ ] **EH-03. API 404 hiển thị không tìm thấy dữ liệu**: Khi truy xuất một hồ sơ TTHC hoặc nhật ký không tồn tại (404 Not Found), UI hiển thị thông báo hướng dẫn quay lại danh sách.
- [ ] **EH-04. API 500 hiển thị lỗi hệ thống**: Khi máy chủ gặp sự cố nội bộ (500 Internal Server Error), UI hiển thị thông báo xin lỗi thân thiện và khuyên cán bộ thử lại sau, kèm mã lỗi kỹ thuật để báo cho IT.
- [ ] **EH-05. Empty response có thông báo rõ**: Mọi danh sách (văn bản, version, ý kiến workflow) khi trống đều có icon và lời nhắn hướng dẫn thao tác.
- [ ] **EH-06. Loading state rõ ràng**: Khi đang chạy AI Review hoặc tải dữ liệu lớn, nút bấm phải chuyển sang trạng thái disabled, hiển thị spinner xoay và lời nhắn *Đang xử lý...*.
- [ ] **EH-07. Error state rõ ràng**: Khi thao tác thất bại, hệ thống giữ nguyên form nhập liệu, tô đỏ trường lỗi và hiển thị thông điệp giải thích lý do.
- [ ] **EH-08. Không crash modal**: Trong mọi trường hợp lỗi mạng hay lỗi parse JSON, các modal (Modal 8, 10, 11, 12) tuyệt đối không bị crash (trắng trang ứng dụng); phải có Error Boundary bảo vệ.

---

## 12. Data Integrity Checks

Checklist gia cố tính toàn vẹn và bất biến của dữ liệu (Data Integrity Hardening):

- [ ] **DI-01. Không duplicate ACTIVE version**: Kiểm tra ràng buộc CSDL; bảo đảm tại bất kỳ thời điểm nào, mỗi thủ tục/lĩnh vực chỉ có duy nhất 01 bản `ProcedureTypeVersion`, `AiPromptVersion` và `ChecklistVersion` ở trạng thái `ACTIVE`.
- [ ] **DI-02. Chuyển đổi trạng thái DRAFT/ACTIVE/REPLACED đúng**: Xác nhận chuỗi chuyển đổi hiệu lực tuân thủ logic nguyên tử, không có tình trạng version bị kẹt ở trạng thái lửng lơ hay mất ngày hiệu lực (`effectiveFrom`/`effectiveTo`).
- [ ] **DI-03. `activationHistory` đầy đủ**: Mảng lịch sử kích hoạt trong log notes luôn ghi nhận đủ thời gian, user ID, vai trò và ghi chú chỉ đạo.
- [ ] **DI-04. `rollbackHistory` đầy đủ nếu rollback**: Mảng lịch sử hoàn tác luôn lưu vết chi tiết lý do và thông tin phiên bản khôi phục.
- [ ] **DI-05. `workflowHistory` đầy đủ**: Dòng thời gian rà soát cập nhật pháp lý ghi nhận mạch lạc, không bị mất mát hay ghi đè.
- [ ] **DI-06. `ProcedureAiAnalysis` không bị sửa ngoài thao tác hợp lệ**: Bảng kết quả thẩm tra AI chỉ được tạo mới hoặc cập nhật khi Cán bộ chủ động bấm chạy review lại trên hồ sơ đang xử lý.
- [ ] **DI-07. `ProcedureAiAnalysisLegalSnapshot` không bị sửa**: Bảng bản chụp căn cứ pháp lý là **đối tượng chỉ thêm mới (Append-only / Immutable)**; tuyệt đối không có lệnh `UPDATE` hay `DELETE` nào được phép thực thi trên bảng này.

---

## 13. Manual UAT Test Matrix

Ma trận kiểm thử thủ công chuẩn hóa (Manual UAT Test Matrix) phục vụ ghi nhận kết quả thực thi thực tế:

| Test ID | Module | Scenario (Kịch bản kiểm thử) | Role | Preconditions (Điều kiện tiên quyết) | Steps (Các bước thực hiện) | Expected Result (Kết quả mong đợi) | Actual Result (Kết quả thực tế) | PASS/FAIL | Severity | Notes / Defect ID | Tester | Date |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- | :--- | :---: | :---: | :--- | :--- | :---: |
| `AI-01` | AI Review | Kiểm tra hiển thị cảnh báo pháp lý bắt buộc trên báo cáo rà soát | `STAFF` | Hồ sơ TTHC đang ở trạng thái `PROCESSING` | 1. Mở hồ sơ Cấp GCN<br>2. Bấm "Chạy AI Review"<br>3. Quan sát đầu báo cáo | Hiển thị rõ ràng banner cảnh báo đỏ/vàng về trách nhiệm kiểm tra của cán bộ | Banner hiển thị đúng quy định | **PASS** | `Critical` | Chuẩn Human-in-the-loop | Nguyễn Văn A | 06/07/2026 |
| `SN-03` | Snapshot | Kiểm tra tính bất biến của Legal Snapshot sau khi Rollback version | `ADMIN` | Hồ sơ đã có AI Review; Nhật ký có lịch sử kích hoạt | 1. Thực hiện Rollback version<br>2. Mở lại hồ sơ TTHC cũ<br>3. Kiểm tra thẻ Legal Snapshot | Dữ liệu snapshot của hồ sơ cũ giữ nguyên 100%, không bị đổi theo version rollback | Snapshot bất biến tuyệt đối | **PASS** | `Critical` | Bảo toàn dữ liệu lịch sử | Trần Thị B | 06/07/2026 |
| `SE-05` | Security | Kiểm tra Backend từ chối request kích hoạt version trái phép từ STAFF | `STAFF` | Có Token JWT của tài khoản STAFF; Log đang `APPROVED` | 1. Mở Postman/cURL<br>2. Gửi POST `/activate-version` với token STAFF | Backend từ chối request, trả về HTTP Status 403 Forbidden | Trả về đúng 403 Forbidden | **PASS** | `High` | Guard bảo vệ tốt | Lê Văn C | 06/07/2026 |
| `DD-04` | Export | Kiểm tra dự thảo văn bản Word không tự động ký thay hay đóng dấu | `MANAGER` | Hồ sơ đã chạy AI review xong | 1. Bấm tạo dự thảo Tờ trình<br>2. Export ra file Word (.docx)<br>3. Mở file kiểm tra phần chữ ký | Phần chữ ký để trống khối chức danh cán bộ, không có chữ ký số/con dấu tự động | Khối chữ ký để trống chuẩn | **PASS** | `High` | Tuân thủ thể thức văn bản | Phạm Văn D | 06/07/2026 |
| *...* | *...* | *[Điền các Test ID khác từ Mục 5 đến Mục 12]* | *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

---

## 14. Hardening Backlog

Danh mục các công việc gia cố kỹ thuật và tối ưu hóa hệ thống (Hardening Backlog) được phân cấp theo 04 mức độ ưu tiên (Severity/Priority):

### 🔴 Nhóm 1: Critical Priority (Ưu tiên tối cao - Bắt buộc xử lý trước UAT Sign-off)
1. **Chuẩn hóa cảnh báo AI trên mọi output**: Rà soát toàn bộ các component hiển thị kết quả AI (Card, Modal, PDF export, Word export), bảo đảm 100% đều tích hợp chuỗi cảnh báo pháp lý chuẩn `BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA`.
2. **Rà soát & Gia cố Endpoint Permission**: Kiểm tra bảo mật toàn diện trên tất cả các controller (`LegalKnowledgeController`, `CaseController`, `AiReviewController`), bảo đảm mọi endpoint nhạy cảm đều gắn `@Roles(Role.ADMIN, Role.MANAGER)`.
3. **Đảm bảo tính bất biến của Legal Snapshot**: Viết thêm unit test và integration test khẳng định bảng `ProcedureAiAnalysisLegalSnapshot` không bao giờ bị can thiệp bởi các lệnh sửa đổi hay xóa bỏ.

### 🟠 Nhóm 2: High Priority (Ưu tiên cao - Xử lý trong đợt Hardening chính)
4. **Rà soát & Tối ưu hóa UI Empty/Error States**: Chuẩn hóa các màn hình thông báo khi API trả về 204 No Content, 404 Not Found hoặc khi mất kết nối mạng, đảm bảo không có giao diện nào bị trắng hoặc treo spinner vô tận.
5. **Rà soát định dạng Export Word/PDF**: Kiểm tra độ tương thích font chữ Unicode tiếng Việt, căn lề hành chính chuẩn và bảng biểu trên các trình duyệt khác nhau (Chrome, Edge, Safari).
6. **Kiểm tra quy tắc Anti-duplication trên DB**: Gia cố các ràng buộc kiểm tra đồng thời (concurrency check) trong Prisma Transaction để ngăn chặn tuyệt đối việc tạo ra 02 version `ACTIVE` cùng lúc khi có tải cao.

### 🟡 Nhóm 3: Medium Priority (Ưu tiên trung bình - Tối ưu hóa trải nghiệm & Hiệu năng)
7. **Rà soát hiển thị Legal Snapshot trên UI**: Nâng cấp giao diện thẻ Legal Snapshot trong chi tiết hồ sơ, làm nổi bật sự khác biệt giữa căn cứ lúc rà soát và căn cứ hiện hành (nếu có thay đổi luật).
8. **Tối ưu hóa hiệu năng truy vấn Audit Trail**: Đánh chỉ mục (Indexing) các trường tìm kiếm thường dùng và tối ưu hóa câu lệnh query JSON trong trường `notes` của bảng `LegalUpdateLog`.
9. **Bổ sung Test Cases tự động (E2E Tests)**: Xây dựng bộ kịch bản kiểm thử tự động End-to-End bằng Cypress hoặc Playwright cho luồng AI Review và Kích hoạt/Rollback version.

### 🟢 Nhóm 4: Low Priority (Ưu tiên thấp - Hoàn thiện tài liệu & Dữ liệu mẫu)
10. **Tạo bộ dữ liệu UAT mẫu chuẩn hóa (Seed Data)**: Xây dựng bộ script tạo dữ liệu mẫu phong phú (10 hồ sơ Cấp GCN, 10 hồ sơ Chuyển mục đích, 05 nhật ký pháp lý ở các trạng thái) phục vụ đào tạo và kiểm thử.
11. **Hoàn thiện hướng dẫn sử dụng Tooltip trên UI**: Bổ sung các chú thích giải thích nhanh (Tooltip) tại các nút bấm nghiệp vụ phức tạp trên giao diện.

---

## 15. UAT Exit Criteria

Mô-đun AI xử lý TTHC và Quản trị version pháp lý chỉ được đánh giá là **HOÀN THÀNH NGHIỆM THU (UAT Sign-off & Ready for Production)** khi thỏa mãn đồng thời 08 điều kiện tiên quyết sau:

1. **Không còn lỗi Critical**: 100% các lỗi mức độ nghiêm trọng tối cao (`Critical`) đã được khắc phục triệt để và kiểm chứng lại thành công.
2. **Lỗi High có phương án xử lý**: Toàn bộ lỗi mức độ cao (`High`) đã được giải quyết hoặc có giải pháp thay thế tạm thời (Workaround) được Lãnh đạo chấp thuận bằng văn bản.
3. **Core AI Review vận hành ổn định**: Mô-đun thẩm tra AI cho cả 02 thủ tục (Cấp GCN lần đầu & Chuyển mục đích) hoạt động chính xác, không crash, hiển thị đầy đủ cảnh báo và checklist.
4. **Export Word/PDF chuẩn định dạng**: Tính năng xuất khẩu văn bản ra file `.docx` và `.pdf` hoạt động mượt mà, đúng thể thức hành chính, không lỗi font tiếng Việt.
5. **Legal Snapshot truy xuất chính xác**: Khả năng lưu vết và xem lại bản chụp căn cứ pháp lý áp dụng cho từng hồ sơ đạt độ chính xác 100%, không bị ảnh hưởng bởi biến động luật sau đó.
6. **Activation/Rollback Verification hoạt động tốt**: Bảng hậu kiểm chỉ đọc sau kích hoạt và sau hoàn tác trả về kết quả `✔ PASS` trên các dữ liệu chuẩn, phản ánh đúng tình trạng sức khỏe CSDL.
7. **Phân quyền RBAC đạt chuẩn bảo mật**: Khẳng định tuyệt đối không có lỗ hổng vượt quyền (Privilege Escalation); `STAFF`/`VIEWER` bị chặn tuyệt đối khỏi các thao tác quản trị nhạy cảm.
8. **Có Biên bản ký nghiệm thu UAT chính thức**: Bộ tài liệu nghiệm thu được đại diện Đội ngũ kiểm thử, Cán bộ nghiệp vụ và Lãnh đạo cơ quan ký xác nhận (Sign-off).

---

## 16. Out of Scope

Để bảo đảm sự tập trung cao độ vào mục tiêu lập kế hoạch nghiệm thu và gia cố kiến trúc trong Phase 9A, các nội dung sau được xác định rõ là **NẰM NGOÀI PHẠM VI (Out of Scope)**:

1. **Không chỉnh sửa mã nguồn (No Code Modifications)**: Tuyệt đối không thực hiện bất kỳ thay đổi nào trên code Backend (`legalflow-backend`) hay Frontend (`src`).
2. **Không chỉnh sửa cơ sở dữ liệu (No DB Modifications)**: Không thực hiện các câu lệnh sửa đổi CSDL, không can thiệp dữ liệu hồ sơ TTHC hay kết quả AI cũ.
3. **Không tạo Migration hay thay đổi Schema**: Không sửa file `schema.prisma`, không sinh mới hay chạy migration, không can thiệp biến môi trường `.env`.
4. **Không phát triển tính năng mới**: Không thiết kế thêm giao diện UI mới, không mở thêm REST API endpoint mới ngoài các tính năng đã hoàn thiện ở Phase 8F.
5. **Không cào dữ liệu pháp luật online tự động**: Chưa triển khai kết nối tự động thời gian thực với Cổng Thông tin Pháp luật Quốc gia (sẽ xem xét ở định hướng mở rộng tương lai).
6. **Không triển khai trực tiếp lên môi trường Production**: Phase 9A chỉ dừng ở bước hoàn thiện Kế hoạch UAT và Hardening Backlog trên môi trường UAT/Staging.

---

## 17. Recommended Next Phase

Để khép kín chuỗi chuyển giao công nghệ, đưa hệ thống từ giai đoạn lập kế hoạch nghiệm thu sang giai đoạn gia cố kỹ thuật thực tế và chuẩn bị phát hành chính thức, đề xuất mốc triển khai tiếp theo:

### 🚀 **`Phase 9B: TTHC AI Governance Hardening Implementation & Production Release Candidate`**
- **Nội dung trọng tâm**:
  - Thực thi gia cố mã nguồn theo Danh mục Hardening Backlog đã ban hành tại Mục 14 (chuẩn hóa 100% cảnh báo AI, gia cố Guard bảo mật, tối ưu hóa xử lý ngoại lệ 401/403/404/500 và Empty states).
  - Chạy kịch bản kiểm thử tự động toàn diện (Regression Testing & E2E Testing) trên toàn bộ cụm dịch vụ Docker UAT.
  - Tổ chức buổi nghiệm thu thực tế với Quý cơ quan, ký Biên bản UAT Sign-off chính thức và đóng gói gắn thẻ phát hành **`v2.9.0-RC1`** (Release Candidate 1) cho toàn bộ hệ thống LegalFlow V2.

---
*Tài liệu Kế hoạch UAT & Hardening được biên soạn và ban hành trong khuôn khổ hoàn thành Phase 9A của hệ thống LegalFlow V2.*
