# LEGALFLOW V2 - PHASE 10A
# PILOT UAT OFFICER GUIDE

**Ngày ban hành:** 08/07/2026  
**Phiên bản hệ thống:** `v2.9.13-final-uat-release-candidate-complete` ➔ Phase 10A  
**Chuyên trách xây dựng:** Trợ lý kỹ thuật & kiểm thử UAT (Antigravity AI)

---

## 1. Purpose
Tài liệu **Pilot UAT Officer Guide** là cẩm nang hướng dẫn thực hành chuyên sâu dành riêng cho **Cán bộ, Chuyên viên nghiệp vụ và Lãnh đạo thẩm định** tham gia chương trình Kiểm thử Chấp nhận Người dùng cuối thực tế (`Pilot UAT`) trên hệ thống LegalFlow v2.
Tài liệu giúp các chuyên viên làm quen với giao diện nghiệp vụ, hiểu rõ cơ chế hỗ trợ của Trợ lý AI, thực hiện đúng các thao tác kiểm thử theo kịch bản chuẩn và đóng góp ý kiến hoàn thiện hệ thống trước khi triển khai chính thức trên toàn địa phương.

---

## 2. Roles in Pilot
Trong quá trình tham gia kiểm thử thí điểm (`Pilot UAT`), mỗi cán bộ sẽ được phân công một tài khoản gắn với một trong 4 vai trò tiêu chuẩn của hệ thống:
1. **`ADMIN` (Quản trị viên hệ thống):**
   * **Đặc quyền:** Có toàn quyền truy cập, tạo mới, chỉnh sửa và quản lý tất cả các hồ sơ thủ tục hành chính, tài khoản người dùng và thông số cấu hình.
   * **Nhiệm vụ UAT:** Kiểm thử toàn diện tất cả các luồng nghiệp vụ, chạy AI Review, xuất văn bản và thực hiện các thao tác quản trị tri thức pháp lý cao nhất (`Activate`/`Rollback` phiên bản).
2. **`MANAGER` (Lãnh đạo bộ phận / Trưởng phòng thẩm định):**
   * **Đặc quyền:** Quản lý, giám sát tiến độ xử lý hồ sơ toàn đơn vị, phân công thụ lý và thẩm định chuyên môn.
   * **Nhiệm vụ UAT:** Kiểm thử luồng kiểm duyệt kết quả rà soát của chuyên viên, đánh giá chất lượng gợi ý từ Trợ lý AI và kiểm chứng phân hệ Quản trị tri thức pháp lý (`Activate`/`Simulation` quy trình nghiệp vụ mới).
3. **`STAFF` (Chuyên viên thụ lý hồ sơ / Cán bộ một cửa):**
   * **Đặc quyền:** Tiếp nhận hồ sơ mới từ công dân, xử lý, thẩm định và cập nhật trạng thái các hồ sơ do chính mình được phân công thụ lý.
   * **Nhiệm vụ UAT:** Trực tiếp sử dụng Trợ lý AI để rà soát hồ sơ Cấp GCN lần đầu và Chuyển mục đích, kiểm chứng `Legal Snapshot`, xuất phiếu dự thảo Word (`DU_THAO_GOI_Y_AI_...`) và đối chiếu với quy định thực tế.
4. **`VIEWER` (Cán bộ quan sát / Thanh tra / Khách mời):**
   * **Đặc quyền:** Quyền truy cập **Chỉ đọc (`Read-Only`)** vào danh sách và chi tiết hồ sơ để phục vụ tra cứu, thống kê và giám sát.
   * **Nhiệm vụ UAT:** Kiểm chứng tính chính xác của cơ chế bảo mật (RBAC), xác nhận rằng tài khoản `VIEWER` tuyệt đối không thể nhìn thấy nút chạy AI Review, không thể xuất tài liệu rà soát và không thể truy cập các chức năng quản trị nhạy cảm.

---

## 3. UAT Scenarios

Cán bộ tham gia Pilot UAT thực hiện lần lượt 11 kịch bản kiểm thử thực tế theo bảng dưới đây:

| Mã kịch bản | Tên kịch bản kiểm thử | Mô tả thao tác thực hiện (Action Step) | Kết quả mong đợi (Expected Behavior) | Vai trò áp dụng |
| :---: | :--- | :--- | :--- | :--- |
| **S-01** | **Đăng nhập hệ thống (`Login`)** | Truy cập địa chỉ `http://kevindoan-legalflow.local:8080` (hoặc URL chính thức). Nhập tên đăng nhập và mật khẩu được cấp phát. | Đăng nhập thành công, hệ thống chuyển hướng vào trang chính. Tên tài khoản và Role hiển thị đúng ở góc trên bên phải màn hình. | Tất cả 4 vai trò (`ADMIN`, `MANAGER`, `STAFF`, `VIEWER`) |
| **S-02** | **Xem danh sách hồ sơ (`ProcedureCaseList`)** | Nhấn vào menu **Hồ sơ TTHC**. Thử nghiệm các bộ lọc: Lĩnh vực (`Đất đai`), Trạng thái (`RECEIVED`, `PROCESSING`, `COMPLETED`) và ô tìm kiếm Mã hồ sơ/Tên người nộp. | Danh sách hồ sơ hiển thị nhanh, rõ ràng. Bộ lọc lọc đúng hồ sơ theo tiêu chí. Nhấp vào một dòng hồ sơ bất kỳ sẽ mở ra trang chi tiết. | Tất cả 4 vai trò |
| **S-03** | **Mở chi tiết hồ sơ (`ProcedureCaseDetail`)** | Từ danh sách, nhấp vào một hồ sơ Cấp GCN lần đầu hoặc Chuyển mục đích sử dụng đất để vào trang chi tiết (`/procedure-cases/:id`). | Trang chi tiết hiển thị đầy đủ thông tin: Mã hồ sơ, Tên người nộp, Địa chỉ thửa đất, Diện tích, Sơ đồ và Trạng thái thụ lý hiện tại. | Tất cả 4 vai trò |
| **S-04** | **Chạy AI review (`Run AI Analysis`)** | Tại trang chi tiết hồ sơ (đang ở trạng thái `RECEIVED` hoặc `PROCESSING`), chuyển sang Tab **AI Review** và nhấn nút **Chạy AI Rà soát (`Chạy AI Rà soát`)**. | Hệ thống hiển thị trạng thái đang phân tích. Sau vài giây, kết quả rà soát xuất hiện bao gồm: Đánh giá tính hợp lệ, Phân tích điều kiện và Khuyến nghị xử lý rõ ràng. | `ADMIN`, `MANAGER`, `STAFF` |
| **S-05** | **Xem legal snapshot (`Check Legal Snapshot`)** | Sau khi chạy AI Review thành công, chuyển sang Tab **Legal Snapshot** (hoặc xem mục Căn cứ pháp lý gắn liền với kết quả phân tích). | Hiển thị chi tiết danh sách văn bản luật (Luật Đất đai 2024, Nghị định 101/2024/NĐ-CP...), điều khoản cụ thể và Prompt Version đã được AI sử dụng tại đúng thời điểm rà soát. | Tất cả 4 vai trò |
| **S-06** | **Xem cảnh báo AI (`Check AI Warning Banner`)** | Kiểm tra khu vực phía trên cùng của Tab AI Review và các khối thông báo kết quả thẩm định. | Khối cảnh báo màu vàng/hổ phách hiển thị nổi bật với dòng chữ: **`BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA`**, khẳng định AI chỉ hỗ trợ nội bộ. | Tất cả 4 vai trò |
| **S-07** | **Tạo/xem dự thảo (`Check Action Section`)** | Kiểm tra khu vực section **`Dự thảo / In / Xuất văn bản`** hiển thị cố định ngay phía dưới hoặc bên cạnh kết quả rà soát AI. | Section hiển thị đầy đủ 3 nút hành động: **Xem trước phiếu rà soát (PDF)**, **In trực tiếp**, và **Xuất file Word (.docx)**. | `ADMIN`, `MANAGER`, `STAFF` |
| **S-08** | **Xuất Word (`Export Word Docx`)** | Nhấn vào nút **Xuất file Word (.docx)**. Chờ hệ thống sinh file và trình duyệt tự động kích hoạt tải xuống máy tính cá nhân. | Mở thư mục Downloads, kiểm tra file tải về. **Bảo đảm 100% tên file bắt đầu bằng tiền tố `DU_THAO_GOI_Y_AI_...`** và bên trong văn bản có đầy đủ banner cảnh báo từ chối trách nhiệm. | `ADMIN`, `MANAGER`, `STAFF` |
| **S-09** | **Thử quyền VIEWER (`Verify VIEWER Restrictions`)** | Đăng xuất, đăng nhập lại bằng tài khoản có role `VIEWER`. Mở chi tiết một hồ sơ TTHC bất kỳ và kiểm tra các Tab thao tác. | Cán bộ `VIEWER` vẫn xem được thông tin hồ sơ và kết quả AI cũ, nhưng **nút "Chạy AI Rà soát" và toàn bộ section "Dự thảo / In / Xuất văn bản" bị ẩn hoàn toàn hoặc vô hiệu hóa**. | `VIEWER` |
| **S-10** | **Xem Legal Knowledge (`Browse Legal Knowledge`)** | Nhấn vào menu **Legal Knowledge**. Xem danh sách các Văn bản pháp luật, Quy trình thẩm định, AI Prompts và Checklist hiện có. | Danh sách hiển thị rõ ràng phiên bản (`Version`), Trạng thái (`Active` / `Pending` / `Deprecated`) và Ngày ban hành của từng tri thức pháp lý. | Tất cả 4 vai trò |
| **S-11** | **Verification read-only (`Verify Knowledge Verification`)** | Với tài khoản `ADMIN` hoặc `MANAGER`, vào Tab **AI Prompts**, chọn một prompt đang `Pending` và nhấn nút **Chạy Thử nghiệm (`Simulation / Verification`)**. | Hệ thống cho phép chạy thử prompt trên dữ liệu mẫu để đánh giá chất lượng (`Impact Analysis`) mà **không hề làm thay đổi bất kỳ hồ sơ thực tế hay CSDL sản xuất nào**. | `ADMIN`, `MANAGER` |

---

## 4. What Officers Must Check

Khi thực hiện kiểm thử trên từng hồ sơ đất đai, cán bộ nghiệp vụ cần tập trung rà soát kỹ lưỡng **6 câu hỏi then chốt** sau đây:
1. **AI có đúng là gợi ý không?** — Kết quả phân tích của AI có mang tính chất tham khảo, đối chiếu luật hay không? AI có vi phạm nguyên tắc tự ý kết luận thay thẩm quyền quyết định của cán bộ hay không?
2. **Có cảnh báo không?** — Cảnh báo `BẢN GỢI Ý AI – CÁN BỘ PHẢI KIỂM TRA` có luôn hiển thị rõ ràng, trực quan trên giao diện màn hình và trên trang đầu của tài liệu xuất ra hay không?
3. **Căn cứ pháp lý có rõ không?** — Phần `Legal Snapshot` có chỉ ra chính xác Luật Đất đai 2024, Nghị định hướng dẫn thi hành và các điều, khoản hợp lệ tương ứng với loại thủ tục hay không?
4. **Văn bản xuất ra có chữ dự thảo/gợi ý AI không?** — Tên file Word (`.docx`) tải về có đúng chuẩn tiền tố `DU_THAO_GOI_Y_AI_phieu-ra-soat-...` không? Tiêu đề tài liệu bên trong có ghi rõ là "Bản dự thảo / gợi ý nội bộ" không?
5. **Có chỗ nào gây hiểu nhầm là văn bản chính thức không?** — Trong giao diện hoặc trong file Word/PDF xuất ra có bất kỳ cụm từ, con dấu đỏ giả lập, hay chữ ký tự động nào dễ khiến công dân hoặc bên thứ ba hiểu nhầm đây là Quyết định pháp lý chính thức của cơ quan nhà nước không? *(Nếu phát hiện có, phải báo cáo `Critical Bug` ngay).*
6. **Lỗi có hiển thị rõ không?** — Khi bị mất kết nối mạng hoặc khi cố tình gọi một chức năng bị chặn, giao diện có hiển thị khối thông báo lỗi màu đỏ rõ ràng kèm nút **Thử lại (`Thử lại`)** hay không? Có bị rơi vào màn hình trắng hay hiển thị nhầm thành "Chưa có hồ sơ" không?

---

## 5. Feedback Form Template

Trong suốt quá trình Pilot UAT, mỗi khi phát hiện lỗi (`Bug`) hoặc có ý kiến đóng góp cải tiến (`Suggestion`), cán bộ ghi nhận vào Mẫu Phiếu Phản hồi UAT chuẩn hóa dưới đây (có thể điền trên file Excel/Word chung của tổ thẩm định):

```markdown
### PHIẾU GHI NHẬN KẾT QUẢ KIỂM THỬ PILOT UAT — LEGALFLOW V2

- **Người thực hiện kiểm thử (Họ và tên):** .....................................................................
- **Vai trò được cấp phát (Role):** [ ] ADMIN    [ ] MANAGER    [ ] STAFF    [ ] VIEWER
- **Đơn vị công tác:** Phòng Đăng ký & Cấp GCN đất đai — Sở Tài nguyên & Môi trường
- **Ngày thực hiện kiểm thử:** .../.../2026

---

#### BẢNG CHI TIẾT KẾT QUẢ VÀ Ý KIẾN ĐÓNG GÓP:

| STT | Mã kịch bản / Tình huống test | Kết quả thực tế (Pass/Fail) | Mô tả lỗi phát hiện (Nếu có) | Mức độ ảnh hưởng (Critical/High/Medium/Low) | Ý kiến đóng góp / Đề xuất cải tiến UX/UI | Đính kèm ảnh chụp màn hình (Tên file ảnh) |
| :---: | :--- | :---: | :--- | :---: | :--- | :--- |
| **01** | S-04: Chạy AI Review trên hồ sơ Cấp GCN lần đầu mã số HS-2026-001 | PASS | Không có lỗi. AI rà soát nhanh, căn cứ chuẩn xác. | N/A | Nên bổ sung thêm nút copy nhanh căn cứ pháp lý vào clipboard. | `uat_s04_pass.png` |
| **02** | S-08: Xuất file Word phiếu rà soát cho hồ sơ HS-2026-002 | PASS | Tên file tải về đúng tiền tố `DU_THAO_GOI_Y_AI_...`. Cảnh báo vàng hiển thị rõ ở đầu trang. | N/A | Bố cục bảng biểu trong file Word nên chỉnh căn lề rộng hơn 1 chút. | `uat_s08_export.png` |
| **03** | ....................................................... | ............ | .................................................................... | ................................. | ................................................................................. | ............................. |
```

**Phân loại Mức độ ảnh hưởng (Severity Guide):**
* **`Critical`:** Lỗi sập hệ thống, mất dữ liệu, sai luật nghiêm trọng hoặc văn bản xuất ra không có cảnh báo AI/tiền tố an toàn.
* **`High`:** Chức năng chính (Chạy AI, Xuất file, Lọc danh sách) không hoạt động hoặc phân quyền RBAC bị rò rỉ.
* **`Medium`:** Lỗi hiển thị giao diện, câu chữ gây khó hiểu cho cán bộ nhưng không làm sai lệch kết quả nghiệp vụ.
* **`Low`:** Góp ý nhỏ về màu sắc, kích thước nút bấm, tốc độ phản hồi hoặc mong muốn thêm tiện ích phụ.

---

## 6. Safety Reminder

> [!CAUTION]
> **TƯYÊN BỐ AN TOÀN PHÁP LÝ VÀ NHẮC NHỞ NGHIỆP VỤ (MUST READ FOR ALL OFFICERS):**
>
> 1. **AI KHÔNG THAY THẾ CÁN BỘ KẾT LUẬN:** Trợ lý AI LegalFlow được thiết kế như một công cụ hỗ trợ rà soát, tổng hợp thông tin và đối chiếu văn bản pháp luật ban đầu. Toàn bộ kết quả phân tích của AI **chỉ mang tính chất tham khảo nội bộ**. Cán bộ thụ lý và Lãnh đạo phòng thẩm định **phải chịu trách nhiệm pháp lý hoàn toàn và cuối cùng** đối với mọi kết luận thẩm định, phê duyệt hay từ chối hồ sơ TTHC của công dân.
> 2. **VĂN BẢN XUẤT RA LÀ BẢN DỰ THẢO / GỢI Ý:** Mọi tài liệu Word (`.docx`) hoặc PDF xuất ra từ mục AI Review đều mang nhãn `DU_THAO_GOI_Y_AI_...`. Cán bộ **tuyệt đối không được sử dụng nguyên trạng văn bản dự thảo này để đóng dấu, ký duyệt hoặc ban hành chính thức ra công chúng**.
> 3. **KHÔNG DÙNG BẢN THỬ NGHIỆM ĐỂ BAN HÀNH THẬT:** Trong giai đoạn Pilot UAT, dữ liệu trên hệ thống phục vụ mục đích kiểm chứng và chẩn đoán. Cán bộ không tự ý sử dụng các quyết định trên hệ thống thí điểm để thay thế luồng giải quyết TTHC trên Cổng Dịch vụ công chính thức của tỉnh.
> 4. **PHẢI ĐỐI CHIẾU QUY ĐỊNH PHÁP LUẬT HIỆN HÀNH:** Mặc dù hệ thống có tính năng `Legal Snapshot` ghi nhận căn cứ tại thời điểm chạy AI, chuyên viên thụ lý vẫn có nghĩa vụ rà soát, đối chiếu với các văn bản quy phạm pháp luật mới nhất hoặc các quy định đặc thù của HĐND/UBND tỉnh ban hành tại thời điểm giải quyết hồ sơ.

---

## 7. Pilot Exit Criteria

Chương trình Kiểm thử Chấp nhận Người dùng cuối thí điểm (`Pilot UAT`) chỉ được tuyên bố kết thúc thành công và đủ điều kiện trình Lãnh đạo phê duyệt chuyển sang giai đoạn Vận hành chính thức (`Production Golive`) khi đáp ứng đầy đủ **05 Tiêu chí kết thúc (`Exit Criteria`)** sau đây:

1. **Không còn lỗi `Critical` (`Zero Critical Bugs`):** Toàn bộ các lỗi nghiêm trọng ảnh hưởng đến tính toàn vẹn dữ liệu, phân quyền RBAC, và an toàn xuất văn bản (`DU_THAO_GOI_Y_AI_`) phải được khắc phục triệt để 100%.
2. **Lỗi `High` có phương án xử lý thỏa đáng (`High Bugs Resolved/Mitigated`):** Không còn lỗi `High` nào tồn đọng mà chưa được giải quyết hoặc chưa có giải pháp thay thế hợp lệ (`Workaround`) được Lãnh đạo chấp thuận.
3. **Cán bộ xác nhận đáp ứng nghiệp vụ (`Officer Acceptance Sign-off`):** Tối thiểu **80% cán bộ, chuyên viên** tham gia kiểm thử đồng ý ký xác nhận vào Phiếu nghiệm thu UAT, đánh giá hệ thống dễ sử dụng, Trợ lý AI hỗ trợ hiệu quả và đáp ứng tốt quy trình thẩm định TTHC đất đai.
4. **Backup/Restore đã diễn tập thành công (`Restore Drill Confirmed`):** Quản trị viên hệ thống đã hoàn thành ít nhất 01 cuộc diễn tập sao lưu và phục hồi dữ liệu (`Restore Drill`) thành công trên môi trường Sandbox theo đúng cẩm nang `Backup & Restore Checklist`.
5. **Lãnh đạo đồng ý bước tiếp theo (`Leadership Approval`):** Có biên bản nghiệm thu hoặc văn bản đồng ý chính thức từ Lãnh đạo Sở/Văn phòng Đăng ký đất đai cho phép đóng gói chặng Pilot và chuyển sang triển khai thực tiễn toàn diện (`Phase 10B` hoặc `Golive Production`).
