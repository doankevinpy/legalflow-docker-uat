# LEGALFLOW V2 - PHASE 8F-E-D-G

# LEGAL VERSION GOVERNANCE UAT CHECKLIST

**Ngày phát hành:** 06/07/2026  
**Mô-đun:** Quản trị Phiên bản Pháp lý & Kiểm toán (Legal Knowledge Version Governance & Audit Track)  
**Trạng thái:** ĐÃ HOÀN THÀNH (100% Comprehensive UAT Checklist)  

---

## 1. Purpose

Tài liệu này cung cấp **Bộ tiêu chí kiểm thử và nghiệm thu người dùng (User Acceptance Testing - UAT Checklist)** tiêu chuẩn cho toàn bộ chuỗi tính năng Quản trị Phiên bản Pháp lý (Legal Version Governance) trong hệ thống LegalFlow V2.

Checklist được thiết kế nhằm giúp Quý cơ quan, Đội ngũ kiểm thử độc lập (Auditors), Lãnh đạo và Cán bộ nghiệp vụ thẩm định tính đúng đắn của logic nghiệp vụ, xác minh tính an toàn tuyệt đối của dữ liệu, kiểm tra cơ chế phân quyền theo vai trò (RBAC), và bảo đảm sự tuân thủ 100% nguyên tắc **Human-in-the-Loop** trước khi ban hành ứng dụng trên môi trường thực tế.

---

## 2. UAT Scope

Phạm vi nghiệm thu UAT bao phủ toàn bộ 11 cấu phần cốt lõi của chuỗi Quản trị Phiên bản Pháp lý:

1. **Kho căn cứ pháp lý (Legal Knowledge Base)**: Danh mục văn bản, thuộc tính và cấu trúc hiệu lực.
2. **Nhật ký cập nhật pháp lý (Legal Update Logs)**: Cấu trúc theo dõi biến động chính sách và quản lý trạng thái rà soát.
3. **Phân tích tác động (Impact Analysis)**: AI rà soát và nhận diện các đối tượng chịu tác động từ luật mới.
4. **Review Workflow (Quy trình rà soát 6 bước)**: Chuỗi hành động rà soát nghiệp vụ giữa chuyên viên và lãnh đạo.
5. **Tạo bản nháp version (Draft Version Creation)**: Khởi tạo đồng bộ bản dự thảo cho Thủ tục, Prompt AI và Checklist.
6. **Chạy thử bản nháp (Draft Simulation / Shadow Testing)**: Kiểm thử song song bản nháp trên hồ sơ TTHC thực tế.
7. **Kích hoạt version (Manual Activation)**: Chuyển đổi hiệu lực chính thức từ DRAFT sang ACTIVE qua xác nhận 4 bước.
8. **Kiểm chứng sau kích hoạt (Post-activation Verification)**: Bảng hậu kiểm read-only đánh giá sức khỏe CSDL sau ban hành.
9. **Hoàn tác version (Manual Rollback)**: Cơ chế khôi phục khẩn cấp phiên bản cũ khi phát hiện bất thường pháp lý.
10. **Kiểm chứng sau rollback (Post-rollback Verification)**: Bảng hậu kiểm read-only thẩm định tính toàn vẹn sau hoàn tác.
11. **Audit Trail (Lưu trữ dấu vết kiểm toán)**: Tính bất biến và minh bạch của toàn bộ lịch sử thao tác trong CSDL.

---

## 3. Test Roles

Hệ thống LegalFlow V2 áp dụng kiểm soát truy cập theo vai trò (RBAC) chặt chẽ. Bộ UAT Checklist phân định rõ quyền hạn và kịch bản test cho 04 nhóm quyền:

| Vai trò | Mã Role | Thẩm quyền trong Module Quản trị Version Pháp lý | Nguyên tắc AI An toàn |
| :---: | :---: | :--- | :--- |
| **Quản trị viên** | `ADMIN` | Toàn quyền: Xem, Rà soát (Review), Tạo bản nháp (Draft), Chạy thử nghiệm (Simulation), Kích hoạt (Activation), Hoàn tác (Rollback), Hậu kiểm (Verification). | **Không vai trò nào** được phép để AI tự động kích hoạt hay tự động rollback version. |
| **Lãnh đạo** | `MANAGER` | Toàn quyền nghiệp vụ: Rà soát, Tạo bản nháp, Chạy thử nghiệm, Kích hoạt chính thức, Hoàn tác khẩn cấp, Hậu kiểm. | Mọi quyết định thay đổi trạng thái pháp lý bắt buộc phải có chữ ký/xác nhận của con người. |
| **Chuyên viên** | `STAFF` | Quyền rà soát: Xem kho kiến thức, tham gia Review Workflow (Thêm ý kiến, Yêu cầu bổ sung), Hậu kiểm read-only. **Bị chặn:** Kích hoạt và Hoàn tác version. | Cán bộ chịu trách nhiệm kiểm tra lại toàn bộ gợi ý từ AI trước khi trình Lãnh đạo. |
| **Người xem** | `VIEWER` | Quyền chỉ đọc: Xem danh sách văn bản, xem chi tiết nhật ký, xem lịch sử workflow, truy xuất Hậu kiểm read-only. **Bị chặn:** Mọi thao tác ghi/sửa/xóa. | Chỉ sử dụng hệ thống để tra cứu và giám sát tuân thủ. |

---

## 4. Pre-UAT Setup Checklist

Trước khi bắt đầu các kịch bản kiểm thử chi tiết, Người kiểm thử (Tester) cần xác nhận môi trường đã đạt các tiêu chuẩn nền tảng sau:

- [ ] **1. Docker Services running**: Cụm container Docker (`docker compose ps`) đang hoạt động ổn định ở trạng thái `Up` / `healthy`.
- [ ] **2. Backend port 3000 pass**: API Server phản hồi tốt tại `http://localhost:3000/api/health` (trả về status 200/OK).
- [ ] **3. Frontend port 5173 pass**: Giao diện Vite Dev Server truy cập mượt mà tại `http://localhost:5173`.
- [ ] **4. Caddy 8080 pass**: Reverse Proxy Caddy hoạt động bình thường, định tuyến chuẩn xác giữa frontend và backend.
- [ ] **5. Postgres pass**: CSDL PostgreSQL (cổng 5432) kết nối tốt, không có lỗi connection timeout hay migration pending.
- [ ] **6. MinIO pass**: Object Storage MinIO (cổng 9000/9001) sẵn sàng lưu trữ tài liệu minh chứng.
- [ ] **7. Login thành công**: Đăng nhập tốt với đầy đủ 04 tài khoản test đại diện cho 04 vai trò (`ADMIN`, `MANAGER`, `STAFF`, `VIEWER`).
- [ ] **8. Có dữ liệu LegalUpdateLog APPROVED**: Tồn tại ít nhất 01 nhật ký cập nhật pháp lý ở trạng thái Đã phê duyệt (`APPROVED`).
- [ ] **9. Có version ACTIVE/REPLACED**: Trong CSDL có ít nhất 01 cặp phiên bản thủ tục ở trạng thái `ACTIVE` và `REPLACED` để đối chiếu.
- [ ] **10. Có log test phù hợp**: Chuẩn bị sẵn 01 nhật ký riêng dành cho kiểm thử (để không làm ảnh hưởng đến dữ liệu thật đang vận hành).

---

## 5. Legal Knowledge Read-only UAT

Kiểm chứng khả năng hiển thị chuẩn xác và tính bảo mật chỉ đọc của kho tri thức pháp lý:

- [ ] **RO-01. Xem danh sách văn bản pháp lý**: Đăng nhập với các role, vào Tab 1 (Văn bản pháp luật), xác nhận hiển thị đầy đủ Số hiệu, Tên văn bản, Cơ quan ban hành, Ngày ban hành.
- [ ] **RO-02. Xem loại văn bản**: Kiểm tra phân loại chính xác các tầng văn bản: Luật (`LAW`), Nghị định (`DECREE`), Thông tư (`CIRCULAR`), Quyết định (`DECISION`).
- [ ] **RO-03. Xem trạng thái văn bản**: Xác nhận màu sắc huy hiệu chuẩn cho các trạng thái: Có hiệu lực (`ACTIVE`), Hết hiệu lực (`EXPIRED`), Dự thảo (`DRAFT`).
- [ ] **RO-04. Xem quan hệ văn bản**: Mở chi tiết văn bản, kiểm tra cây liên kết pháp lý (`REPLACES`, `AMENDS`, `GUIDES`, `IMPLEMENTS`, `REFERENCES`).
- [ ] **RO-05. Xem version thủ tục**: Vào Tab 3, xác nhận danh sách các phiên bản cấu hình thủ tục (`ProcedureTypeVersion`) với mốc thời gian `effectiveFrom` / `effectiveTo`.
- [ ] **RO-06. Xem prompt version**: Vào Tab 4, xác nhận hiển thị nội dung System Prompt AI (`AiPromptVersion`) ứng với từng giai đoạn pháp luật.
- [ ] **RO-07. Xem checklist version**: Vào Tab 5, kiểm tra danh mục tiêu chí kiểm tra hồ sơ TTHC (`ChecklistVersion`).
- [ ] **RO-08. Không có thao tác sửa dữ liệu ngoài quyền**: Đăng nhập với role `VIEWER` hoặc `STAFF`, xác nhận các nút Thêm mới, Sửa, Xóa văn bản/version đều bị ẩn hoặc từ chối truy cập từ backend (403 Forbidden).

---

## 6. Legal Update Impact Analysis UAT

Kiểm chứng năng lực rà soát và đánh giá tác động tự động của AI khi có biến động pháp luật:

- [ ] **IA-01. Tạo hoặc chọn LegalUpdateLog**: Chọn một nhật ký biến động chính sách (ví dụ: Luật Đất đai mới ban hành).
- [ ] **IA-02. Chạy phân tích tác động**: Bấm nút kích hoạt AI rà soát tác động (`Impact Analysis`), xác nhận hệ thống trả về danh sách thủ tục, prompt và checklist bị ảnh hưởng.
- [ ] **IA-03. Cảnh báo AI bắt buộc**: Xác nhận trên báo cáo Phân tích tác động hiển thị khung cảnh báo in đậm:
  > **⚠️ BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA:** Căn cứ pháp lý hiển thị là phiên bản dữ liệu hệ thống ghi nhận tại thời điểm AI rà soát; cán bộ phải kiểm tra văn bản pháp luật hiện hành và quy trình nội bộ tại thời điểm xử lý hồ sơ.
- [ ] **IA-04. Không tự đổi trạng thái hồ sơ**: Kiểm tra các hồ sơ TTHC thực tế trong hệ thống; xác nhận việc chạy Impact Analysis **hoàn toàn không làm thay đổi** trạng thái hồ sơ đang xử lý.
- [ ] **IA-05. Không tự tạo version ACTIVE**: Xác nhận AI chỉ đưa ra gợi ý rà soát, **tuyệt đối không tự động sinh ra** hoặc tự động kích hoạt phiên bản thủ tục mới thành `ACTIVE`.

---

## 7. Review Workflow UAT

Kiểm chứng quy trình rà soát nghiệp vụ 6 bước trên nhật ký cập nhật pháp lý:

- [ ] **RW-01. Start review (Bắt đầu rà soát)**: Cán bộ bấm chuyển trạng thái từ `PENDING` $\rightarrow$ `REVIEWING`, hệ thống cập nhật subStatus thành `IN_REVIEW`.
- [ ] **RW-02. Add review note (Thêm ý kiến)**: Nhập ý kiến trao đổi nghiệp vụ vào khung rà soát; xác nhận ý kiến hiển thị tức thì trên dòng thời gian.
- [ ] **RW-03. Request more info (Yêu cầu làm rõ)**: Lãnh đạo hoặc chuyên viên bấm yêu cầu bổ sung thông tin, trạng thái nhật ký chuyển rõ ràng.
- [ ] **RW-04. Approve for versioning (Phê duyệt tạo version)**: Lãnh đạo (`ADMIN`/`MANAGER`) bấm phê duyệt hướng xử lý, trạng thái chính chuyển thành `APPROVED`.
- [ ] **RW-05. Reject (Từ chối)**: Bấm từ chối cập nhật pháp lý (trường hợp văn bản không áp dụng cho địa phương), trạng thái chuyển `REJECTED`.
- [ ] **RW-06. Close (Đóng nhật ký)**: Đóng hồ sơ rà soát sau khi hoàn tất hoặc không có nhu cầu xử lý tiếp.
- [ ] **RW-07. Workflow history ghi đúng**: Kiểm tra mảng `workflowHistory` trong chi tiết nhật ký; xác nhận ghi nhận chuẩn xác hành động, thời gian, người thực hiện và ghi chú.
- [ ] **RW-08. STAFF/VIEWER không thao tác sai quyền**: Đăng nhập bằng `STAFF`/`VIEWER`, xác nhận không thể bấm nút Phê duyệt (`APPROVE_FOR_VERSIONING`) hay Từ chối (`REJECT`).

---

## 8. Draft Version Creation UAT

Kiểm chứng tính năng tự động khởi tạo tổ hợp bản nháp pháp lý từ nhật ký đã phê duyệt:

- [ ] **DV-01. Tạo draft ProcedureTypeVersion**: Bấm tạo bản nháp trên log `APPROVED`, xác nhận hệ thống sinh ra bản nháp cấu hình thủ tục mới.
- [ ] **DV-02. Tạo draft AiPromptVersion**: Xác nhận bản nháp System Prompt AI được tạo đồng bộ, kế thừa nội dung từ version hiện hành.
- [ ] **DV-03. Tạo draft ChecklistVersion**: Xác nhận bản nháp Checklist tiêu chí kiểm tra được khởi tạo thành công.
- [ ] **DV-04. Draft có status DRAFT**: Kiểm tra trong CSDL và UI, xác nhận 100% các version vừa tạo đều có trạng thái `DRAFT` (huy hiệu màu cam).
- [ ] **DV-05. Không ảnh hưởng ACTIVE version**: Kiểm tra phiên bản thủ tục đang có hiệu lực (`ACTIVE`), xác nhận không bị mất hiệu lực hay thay đổi trường `effectiveTo`.
- [ ] **DV-06. Không sửa hồ sơ TTHC**: Xác nhận các hồ sơ TTHC đang giải quyết ngoài bộ phận một cửa vẫn tiếp tục áp dụng phiên bản `ACTIVE` cũ, không bị trỏ sang bản `DRAFT`.

---

## 9. Draft Simulation / Shadow Testing UAT

Kiểm chứng tính năng chạy mô phỏng và kiểm thử song song bản nháp trên hồ sơ TTHC mẫu:

- [ ] **ST-01. Chọn hồ sơ mẫu**: Mở Modal 10 (Shadow Testing), chọn 01 đến 05 hồ sơ TTHC mẫu đã có kết quả thẩm tra trước đây.
- [ ] **ST-02. Chạy simulation**: Bấm nút thực thi mô phỏng; xác nhận hệ thống chạy AI rà soát thử nghiệm bằng cấu hình `DRAFT` mới.
- [ ] **ST-03. Kết quả simulation lưu vào notes**: Kiểm tra chi tiết nhật ký; xác nhận kết quả đối chiếu (Diff summary, chênh lệch điểm tin cậy, cờ rủi ro) được lưu chuẩn xác vào mảng `simulations` trong trường `notes`.
- [ ] **ST-04. Không sửa ProcedureAiAnalysis thật**: Vào bảng `procedure_ai_analyses` trong CSDL; xác nhận kết quả rà soát chính thức của hồ sơ mẫu **hoàn toàn không bị ghi đè** hay thay đổi bởi tiến trình simulation.
- [ ] **ST-05. Không sửa trạng thái hồ sơ**: Xác nhận trạng thái hồ sơ TTHC (`PROCESSING`, `APPROVED`...) được giữ nguyên tuyệt đối.
- [ ] **ST-06. Không tạo văn bản chính thức**: Xác nhận simulation chỉ sinh ra báo cáo đối chiếu trên màn hình Modal 10, không phát sinh công văn hay quyết định hành chính chính thức.

---

## 10. Manual Activation UAT

Kiểm chứng quy trình kích hoạt phiên bản pháp lý thủ công với cơ chế bảo vệ nhiều bước:

- [ ] **MA-01. Chỉ ADMIN/MANAGER thấy chức năng kích hoạt**: Đăng nhập bằng `STAFF`/`VIEWER`, xác nhận nút "Kích hoạt version" bị ẩn hoàn toàn. Đăng nhập bằng `ADMIN`/`MANAGER`, nút hiển thị sáng.
- [ ] **MA-02. Có modal xác nhận nhiều bước**: Bấm nút Kích hoạt, xác nhận hệ thống mở Modal 11 với luồng xác nhận 4 bước (Review hiện hành $\rightarrow$ Review nháp $\rightarrow$ Ghi chú $\rightarrow$ Xác nhận).
- [ ] **MA-03. Phải nhập lý do**: Tại bước 3, để trống ô ghi chú chỉ đạo; xác nhận không thể bấm nút tiếp theo hoặc xác nhận.
- [ ] **MA-04. Phải nhập confirmation text**: Tại bước 4, nhập sai chuỗi hoặc để trống; xác nhận nút "Xác nhận kích hoạt version" bị khóa (disabled/grayscale). Gõ chính xác `ACTIVATE VERSION`, nút mở khóa thành màu xanh.
- [ ] **MA-05. Không tự kích hoạt khi chỉ mở modal**: Mở Modal 11, chuyển đi chuyển lại giữa các bước rồi bấm Đóng modal; kiểm tra CSDL xác nhận version **chưa bị kích hoạt** (không có request API nào bị bắn tự động).
- [ ] **MA-06. Chỉ kích hoạt khi bấm xác nhận cuối**: Bấm nút xác nhận cuối cùng; kiểm tra Network tab thấy request `POST /activate-version` được gửi đi và trả về HTTP 200/201.
- [ ] **MA-07. ACTIVE/REPLACED thay đổi đúng**: Kiểm tra CSDL; xác nhận phiên bản `DRAFT` đã chuyển thành `ACTIVE` (`effectiveFrom = now()`), và phiên bản `ACTIVE` cũ chuyển thành `REPLACED` (`effectiveTo = now()`) trong cùng một giao dịch nguyên tử.
- [ ] **MA-08. activationHistory ghi đúng**: Mở chi tiết nhật ký; xác nhận sự kiện kích hoạt đã được lưu đầy đủ vào mảng `activationHistory` và dòng thời gian `workflowHistory`.

---

## 11. Post-activation Verification UAT

Kiểm chứng tính năng hậu kiểm chỉ đọc (Read-only Audit) sau khi kích hoạt phiên bản:

- [ ] **AV-01. Thấy panel “Kiểm chứng sau kích hoạt”**: Mở nhật ký đã kích hoạt version; xác nhận xuất hiện khối giao diện hậu kiểm viền xanh (blue/emerald) trên màn hình.
- [ ] **AV-02. Bấm “Kiểm tra sau kích hoạt”**: Bấm nút thao tác kiểm chứng trên panel.
- [ ] **AV-03. Network gọi GET activation-verification**: Kiểm tra Network tab; xác nhận trình duyệt gửi đúng request `GET /api/legal-knowledge/update-logs/:id/activation-verification`.
- [ ] **AV-04. Status 200**: Xác nhận API phản hồi thành công với HTTP Status 200 OK.
- [ ] **AV-05. Response có overallStatus**: Kiểm tra payload JSON trả về; xác nhận có trường `overallStatus` với giá trị chuẩn (`PASS`, `WARNING`, hoặc `FAIL`).
- [ ] **AV-06. UI hiển thị PASS/WARNING/FAIL**: Xác nhận trên giao diện xuất hiện huy hiệu trạng thái màu sắc chuẩn hóa (`✔ PASS` xanh lá, `⚠ WARNING` vàng, hoặc `✖ FAIL` đỏ) kèm bảng chi tiết 7 tiêu chí.
- [ ] **AV-07. Không có POST thay đổi dữ liệu**: Xác nhận tiến trình kiểm chứng là **100% chỉ đọc (read-only)**, tuyệt đối không phát sinh request `POST`/`PUT`/`DELETE` hay thay đổi CSDL.

---

## 12. Manual Rollback UI UAT

Kiểm chứng giao diện và cơ chế an toàn của tính năng hoàn tác phiên bản pháp lý thủ công:

- [ ] **RB-01. Chỉ ADMIN/MANAGER thấy nút “Hoàn tác version”**: Kiểm tra phân quyền UI; xác nhận chỉ tài khoản Lãnh đạo (`ADMIN`/`MANAGER`) mới nhìn thấy nút cảnh báo đỏ "Hoàn tác version".
- [ ] **RB-02. Modal 4 bước hoạt động**: Bấm nút Hoàn tác; xác nhận Modal 12 hiển thị với quy trình 4 bước thẩm định khắt khe.
- [ ] **RB-03. Lý do rollback tối thiểu 10 ký tự**: Tại bước nhập lý do hoàn tác, nhập dưới 10 ký tự (ví dụ: `lỗi`); xác nhận nút tiếp tục bị khóa kèm thông báo yêu cầu nhập chi tiết tối thiểu 10 ký tự.
- [ ] **RB-04. confirmationText chỉ chấp nhận chuỗi chuẩn**: Tại bước xác nhận cuối, thử gõ các chuỗi ngẫu nhiên; xác nhận nút hoàn tác bị khóa. Gõ chính xác `ROLLBACK VERSION` hoặc `TOI XAC NHAN ROLLBACK VERSION`; xác nhận nút bật sáng màu đỏ.
- [ ] **RB-05. Không gọi POST rollback-version khi chỉ mở modal/chuyển bước**: Mở Modal 12, thao tác xem qua 4 bước rồi đóng lại; xác nhận trong Network tab **không có bất kỳ request `POST /rollback-version` nào** được gọi.
- [ ] **RB-06. Chỉ gọi rollback khi bấm xác nhận cuối**: Bấm nút xác nhận hoàn tác cuối cùng; xác nhận hệ thống thực thi request rollback và trả về thông báo thành công.
- [ ] **RB-07. Không rollback thật nếu chưa có log test an toàn**: Khuyến cáo người kiểm thử **chỉ thực hiện thao tác rollback thật trên nhật ký test**; không tùy tiện hoàn tác trên các version đang áp dụng cho hồ sơ sản xuất thực tế.

---

## 13. Post-rollback Verification UAT

Kiểm chứng bảng hậu kiểm chỉ đọc sau khi thực hiện hoàn tác phiên bản:

- [ ] **RV-01. Thấy panel “Kiểm chứng sau rollback”**: Mở chi tiết nhật ký; xác nhận xuất hiện khối UI hậu kiểm rollback viền tím mờ tại **02 vị trí chiến lược** (ngay dưới khu vực rollback và tại Lịch sử rà soát).
- [ ] **RV-02. Bấm “Kiểm tra sau rollback”**: Bấm nút thao tác kiểm tra trên panel.
- [ ] **RV-03. Network gọi GET rollback-verification**: Kiểm tra Network tab; xác nhận trình duyệt gửi request `GET /api/legal-knowledge/update-logs/:id/rollback-verification`.
- [ ] **RV-04. Status 200**: Xác nhận API trả về HTTP Status 200 OK với cấu trúc JSON chuẩn.
- [ ] **RV-05. Response có overallStatus**: Xác nhận payload phản hồi chứa thuộc tính `overallStatus`.
- [ ] **RV-06. UI hiển thị PASS/WARNING/FAIL**: Xác nhận UI hiển thị rõ ràng huy hiệu trạng thái tổng quan cùng danh sách 7 hạng mục kiểm chứng tiêu chuẩn vàng.
- [ ] **RV-07. WARNING là hợp lệ nếu chưa từng rollback**: Với các nhật ký chưa từng thực hiện hoàn tác thực tế, xác nhận hệ thống trả về `⚠ WARNING` (hợp lệ do không tìm thấy lịch sử rollback trong log notes) thay vì báo lỗi hệ thống.
- [ ] **RV-08. Không có POST rollback-version khi chỉ kiểm chứng**: Xác nhận việc bấm nút kiểm chứng hậu rollback hoàn toàn chỉ đọc, không kích hoạt lệnh rollback lại hay thay đổi trạng thái version.

---

## 14. Audit Trail UAT

Kiểm chứng tính đầy đủ, chính xác và bất biến của dấu vết kiểm toán trong CSDL:

- [ ] **AT-01. `workflowHistory` ghi đúng**: Kiểm tra lịch sử workflow; xác nhận toàn bộ các mốc rà soát, phê duyệt, kích hoạt, hoàn tác đều được ghi vết tuần tự theo thời gian thực.
- [ ] **AT-02. `draftVersions` ghi đúng**: Xác nhận mã ID của các bản nháp khởi tạo được ánh xạ chính xác trong trường notes của nhật ký.
- [ ] **AT-03. `simulations` ghi đúng**: Xác nhận kết quả các đợt chạy thử nghiệm Shadow Testing được lưu trữ đầy đủ, không bị ghi đè mất mát.
- [ ] **AT-04. `activationHistory` ghi đúng**: Xác nhận lưu vết đầy đủ thông tin người kích hoạt, thời gian, lý do chỉ đạo và danh sách version chuyển đổi.
- [ ] **AT-05. `rollbackHistory` ghi đúng nếu rollback thật**: Nếu có thực hiện rollback, xác nhận nguyên nhân hoàn tác và thông tin người thực hiện được ghi nhận chi tiết vào `rollbackHistory`.
- [ ] **AT-06. Không mất lịch sử cũ**: Xác nhận sau nhiều lần kích hoạt, mô phỏng và hoàn tác, các bản ghi nhật ký cũ trong trường notes vẫn được tích lũy nguyên vẹn, **tuyệt đối không bị xóa bỏ hay làm ngắt quãng**.

---

## 15. Safety UAT

Kiểm chứng các ranh giới an toàn tối cao nhằm bảo vệ tính pháp lý và trách nhiệm công vụ:

- [ ] **SF-01. Không AI tự kích hoạt version**: Kiểm chứng dưới tải mô phỏng hoặc chạy AI phân tích; xác nhận không có bất kỳ trigger tự động nào chuyển version sang `ACTIVE`.
- [ ] **SF-02. Không AI tự rollback**: Xác nhận AI không tự động đảo ngược version khi phát hiện lỗi điểm tin cậy hay rủi ro pháp lý.
- [ ] **SF-03. Không tự sửa hồ sơ TTHC**: Rà soát bảng `administrative_procedure_cases`; xác nhận 100% hồ sơ giữ nguyên trạng thái, thông tin người nộp và kết quả thẩm định.
- [ ] **SF-04. Không tự sửa ProcedureAiAnalysis**: Rà soát bảng `procedure_ai_analyses`; xác nhận các bài rà soát AI cũ không bị tự động tính toán lại hay thay đổi nội dung.
- [ ] **SF-05. Không tự sửa ProcedureAiAnalysisLegalSnapshot**: Rà soát bảng `procedure_ai_analysis_legal_snapshots`; xác nhận các bản chụp căn cứ pháp lý tại thời điểm thụ lý hồ sơ được bảo toàn bất biến vĩnh viễn.
- [ ] **SF-06. Không tự ký/gửi văn bản**: Xác nhận hệ thống không tự động tạo chữ ký số hay tự động gửi công văn thông báo cho công dân khi có thay đổi version pháp lý.
- [ ] **SF-07. Không kết luận thay cán bộ**: Xác nhận mọi giao diện đều tuân thủ nguyên tắc AI chỉ gợi ý; quyền kết luận hợp lệ/không hợp lệ trên hồ sơ TTHC thuộc quyền quyết định duy nhất của cán bộ.

---

## 16. UAT Result Template

Bảng mẫu chuẩn hóa dùng để Người kiểm thử ghi nhận kết quả thực thi từng kịch bản trong quá trình nghiệm thu:

| Test ID | Scenario (Kịch bản kiểm thử) | Role | Steps (Các bước thực hiện) | Expected Result (Kết quả mong đợi) | Actual Result (Kết quả thực tế) | PASS/FAIL | Notes / Defect ID | Tester | Date |
| :---: | :--- | :---: | :--- | :--- | :--- | :---: | :--- | :---: | :---: |
| `MA-04` | Nhập sai confirmation text khi kích hoạt version | `MANAGER` | 1. Mở Modal 11<br>2. Nhập "ACTIVATE"<br>3. Quan sát nút xác nhận | Nút "Xác nhận kích hoạt" bị khóa (disabled) | Nút bị khóa đúng mong đợi | **PASS** | Hoạt động chuẩn | Nguyễn Văn A | 06/07/2026 |
| `RB-03` | Nhập lý do rollback dưới 10 ký tự | `ADMIN` | 1. Mở Modal 12<br>2. Nhập "lỗi"<br>3. Bấm Tiếp tục | Hệ thống báo lỗi, không cho sang bước tiếp theo | Hiển thị cảnh báo yêu cầu $\ge 10$ ký tự | **PASS** | Hoạt động chuẩn | Trần Thị B | 06/07/2026 |
| `AV-07` | Kiểm tra tính read-only của Hậu kiểm kích hoạt | `STAFF` | 1. Bấm "Kiểm tra sau kích hoạt"<br>2. Kiểm tra Network & DB | Chỉ gọi API GET, CSDL không thay đổi | API GET 200 OK, DB giữ nguyên trạng | **PASS** | Cam kết Read-only tốt | Lê Văn C | 06/07/2026 |
| *...* | *[Điền các Test ID khác từ Mục 5 đến Mục 15]* | *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

---

## 17. Known Warnings

Trong quá trình thực thi kiểm thử UAT, Người kiểm thử có thể gặp 03 cảnh báo kỹ thuật tiêu chuẩn dưới đây. Xin khẳng định các cảnh báo này **hoàn toàn vô hại, không ảnh hưởng đến chức năng, logic nghiệp vụ hay độ an toàn của ứng dụng**:

1. **Docker Compose `version` obsolete warning**: Cảnh báo `attribute "version" is obsolete` khi chạy lệnh Docker Compose v2. Đây là chuẩn cú pháp mới của Docker, không làm sai lệch hoạt động của container.
2. **Vite chunk size warning**: Cảnh báo `Some chunks are larger than 500 kB` khi build frontend. Đây là gợi ý tối ưu hóa chia nhỏ file (code-splitting) của Vite cho các thư viện UI lớn, không ảnh hưởng đến tốc độ hay logic chạy thực tế.
3. **Windows LF/CRLF warning**: Cảnh báo chuyển đổi ký tự xuống dòng của Git trên môi trường Windows (`LF will be replaced by CRLF`). Đây là cơ chế tương thích hệ điều hành tiêu chuẩn, không thay đổi mã nguồn.

---

## 18. UAT Sign-off

Sau khi hoàn tất bộ tiêu chí kiểm thử trên, Đại diện Đội ngũ nghiệm thu và Lãnh đạo cơ quan thực hiện ký xác nhận nghiệm thu (Sign-off) theo mẫu dưới đây:

### PHIẾU XÁC NHẬN NGHIỆM THU NGHIỆP VỤ (UAT SIGN-OFF)

- **Đơn vị sử dụng / Nghiệm thu**: .....................................................................................................................
- **Người kiểm thử chính (Lead Tester)**: ........................................... **Vai trò**: ...........................................
- **Ngày thực hiện kiểm thử**: Từ ngày ....../....../2026 đến ngày ....../....../2026
- **Môi trường kiểm thử**: Docker UAT Stack (`http://localhost:5173` & `http://localhost:3000`)

#### TỔNG HỢP KẾT QUẢ
- Tổng số kịch bản thực hiện: .......... / .......... kịch bản.
- Số kịch bản ĐẠT (**PASS**): .......... kịch bản (Đạt tỷ lệ: ..........%).
- Số kịch bản KHÔNG ĐẠT (**FAIL**): .......... kịch bản.
- Ghi chú các lỗi tồn đọng (nếu có): ...........................................................................................................

#### CAM KẾT VÀ XÁC NHẬN CỦA ĐỘI NGŨ NGHIỆM THU
1. Chúng tôi xác nhận đã thực hiện kiểm thử thực tế toàn bộ các kịch bản trong danh sách **Phase 8F-E-D-G UAT Checklist**.
2. Xác nhận **chưa phát hiện lỗi nghiêm trọng (Critical/Fatal bugs)** nào ảnh hưởng đến tính an toàn dữ liệu, tính bảo mật hay ranh giới Human-in-the-Loop của hệ thống.
3. Xác nhận module **Quản trị Phiên bản Pháp lý (Legal Knowledge Version Governance)** thuộc LegalFlow V2 đã hoạt động ổn định, đúng thiết kế nghiệp vụ và đủ điều kiện chuyển sang giai đoạn chuẩn bị triển khai thực tế.

| Đại diện Đội ngũ Kiểm thử (Tester) | Đại diện Cán bộ Pháp chế (Officer) | Lãnh đạo Cơ quan Phê duyệt (Manager/Admin) |
| :---: | :---: | :---: |
| *(Ký, ghi rõ họ tên)* | *(Ký, ghi rõ họ tên)* | *(Ký, đóng dấu, ghi rõ họ tên)* |
| <br><br><br> | <br><br><br> | <br><br><br> |

---
*Tài liệu UAT Checklist được ban hành trong khuôn khổ hoàn thành mốc Phase 8F-E-D-G của hệ thống LegalFlow V2.*
