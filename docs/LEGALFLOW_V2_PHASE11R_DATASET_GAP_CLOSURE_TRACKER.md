# LEGALFLOW V2 - PHASE 11R
# DATASET GAP CLOSURE TRACKER

## 1. Purpose

Tài liệu này là Sổ theo dõi đóng khoảng trống thẩm quyền và khiếm khuyết dữ liệu vòng 2 (`Dataset Gap Closure Tracker Round 2`) được thiết lập tại Phase 11R nhằm ghi nhận, kiểm chứng và chốt trạng thái đóng (`Closed`) đối với các bất cập thẩm quyền và metadata từng được theo dõi tại Phase 11Q (`GAP-2024-01..05`).  
Sổ theo dõi đóng khoảng trống đóng vai trò là "Sổ kiểm toán đóng rào chắn chặng cuối" (`Final Gate Audit Ledger`), bảo đảm mọi bất cập về chữ ký của Lãnh đạo Vụ Pháp chế hay mâu thuẫn phạm vi áp dụng đều phải có kết luận rạch ròi, qua đó ra Quyết định Đóng gói Nạp (`Import Decision`) chuẩn xác cho từng văn bản trước khi đưa vào manifest cuối cùng.

## 2. Gap Closure Tracker

*(Tuân thủ nguyên tắc không tự điền tên thật nếu chưa được cung cấp chính thức, hệ thống sử dụng các chức danh và mã vai trò chuyên môn chuẩn hóa):*

| Gap ID | Source ID | Document Title | Gap Type | Previous Status (11Q) | Round 2 Action | Evidence Added | Reviewer Confirmation | Approver Confirmation | Final Status | Import Decision | Notes |
| :--- | :--- | :--- | :--- | :---: | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **GAP-2024-01** | `REG-2024-001` | Luật Đất đai 2024 (`31/2024/QH15`) | `Missing Manager Approval` | `Open / In Review` | Tiếp tục hoàn thiện hồ sơ trình ký Bảng rà soát 5 nghị định thi hành đầy đủ để trình Lãnh đạo Vụ xem xét. | Hồ sơ rà soát danh mục nghị định thi hành đã được tổng hợp xong, đang gửi Lãnh đạo Vụ thẩm định. | `Yes` (Reviewed) | `Pending` | `Still Open` | `Defer to Later Batch` | Trì hoãn nạp sang các đợt sau (`BATCH-2024-002`) cho đến khi Lãnh đạo Vụ chính thức ký `Approved`. |
| **GAP-2024-02** | `REG-2024-002` | Nghị định quy định chi tiết Đăng ký đất đai (`101/2024/NĐ-CP`) | `Missing Amendment Review` & `Risk Note` | `In Review` | Hoàn tất biên bản họp chuyên môn thẩm định trích đoạn hướng dẫn chuyển tiếp hồ sơ cũ Chương VII tại `risk_note`. | Biên bản họp thẩm định điều khoản chuyển tiếp đã được ký xác nhận bởi `Specialist A`. | `Yes` (Reviewed) | `Pending` | `Still Open` / `In Review` | `Defer to Later Batch` | Đã có chữ ký rà soát chuyên môn; đang chờ Lãnh đạo Vụ ký nháy đồng ý nạp để đưa vào lô sau. |
| **GAP-2024-03** | `REG-2024-003` | Quyết định hạn mức giao đất Tỉnh X (`45/2024/QĐ-UBND`) | `Missing Local Scope Coordination` | `Evidence Added` | Lấy ý kiến cuối cùng từ Sở TNMT Tỉnh X và Vụ Pháp chế để chốt phạm vi áp dụng cho luồng tra cứu Một cửa. | Công văn số 112/STNMT phúc đáp xác nhận mã `Province X` và ranh giới giải quyết thủ tục. | `Yes` (Reviewed) | `Pending` | `Deferred` | `Defer to Later Batch` | Chuyển sang lô nạp chuyên đề địa phương sau khi Lãnh đạo Vụ Pháp chế hoàn tất ký duyệt công văn. |
| **GAP-2024-04** | `REG-2024-004` | Quyết định phê duyệt KHSDĐ năm 2024 Huyện A (`120/QĐ-UBND`) | `Unknown Legal Status / Expired` | **`Resolved / Rejected`** | Đối chiếu công báo chốt chắc chắn văn bản đã hết thời kỳ quy hoạch 2024, không còn giá trị pháp lý cho 2026. | Quyết định 120/QĐ-UBND ghi rõ kỳ hạn năm 2024 (`Effective End: 2024-12-31`). | `Yes` (Confirmed Expired) | `Yes` (Rejected) | **`Rejected`** | **`Reject / Exclude from Batch`** | Bóc tách hoàn toàn khỏi manifest nạp; từ chối đưa vào cơ sở dữ liệu production vĩnh viễn. |
| **GAP-2024-05** | `REG-2024-005` | Quy trình nội bộ giải quyết TTHC lĩnh vực đất đai (SOP `888/QĐ-UBND`) | `None` (Zero Gaps) | **`Resolved / Confirmed`** | Khóa niêm phong mã băm tệp dữ liệu Lô mẫu số 01 (`BATCH-2024-001`), chuẩn bị sẵn sàng cho thao tác nạp. | Tệp CSV/JSON và toàn văn MinIO hợp lệ 100%, có đủ chữ ký xác nhận hợp pháp. | `Yes` (`SOP Officer D`) | `Yes` (Legal Lead `Approved`) | **`Closed`** | **`Include in Final Batch` (Pilot Batch 01)** | Bản ghi hoàn hảo đạt chuẩn `Approved` 100%, sẵn sàng chuyển sang Phase 11S để thực thi nạp có kiểm soát. |

## 3. Final Status Values

Hệ thống định nghĩa 6 mức giá trị trạng thái chốt cuối cùng (`Final Status Values`) để phân loại kết quả rà soát vòng 2:
- `Closed`: Khoảng trống hoặc khiếm khuyết đã được đóng lại hoàn toàn 100%, metadata sạch, đủ bằng chứng và có trọn vẹn chữ ký `Reviewer` lẫn `Approver`.
- `Closed with Warning`: Khoảng trống đã được đóng về mặt kỹ thuật, tuy nhiên cần lưu ý cảnh báo rủi ro nghiệp vụ nhỏ (như văn bản sắp đến hạn rà soát định kỳ).
- `Deferred`: Khoảng trống được thống nhất hoãn xử lý, chuyển bản ghi sang các lô nạp đợt sau để chờ bổ sung văn bản mới hoặc chờ Lãnh đạo ký duyệt.
- `Rejected`: Khoảng trống vi phạm nguyên tắc an toàn nghiêm trọng (như văn bản hết kỳ hạn hoặc bị bãi bỏ), dẫn đến quyết định từ chối nạp vĩnh viễn.
- `Still Open`: Khoảng trống đang tiếp tục được mở và xử lý tích cực, chưa đáp ứng tiêu chuẩn để đóng tại thời điểm rà soát vòng 2.
- `Not Applicable`: Khoảng trống không còn giá trị áp dụng do bản ghi đã được thay thế bằng một văn bản quy phạm pháp luật khác trong hệ thống.

## 4. Import Decision Values

Đối với mỗi bản ghi được thẩm định vòng 2, Hội đồng Quản trị Kỹ thuật ra 1 trong 6 Quyết định Nạp (`Import Decision Values`):
- `Include in Final Batch`: Cho phép đóng gói bản ghi vào manifest của Lô dữ liệu cuối cùng để chuyển sang thực thi nạp chính thức.
- `Include with Warning`: Cho phép đóng gói vào lô nạp nhưng phải hiển thị cảnh báo nghiệp vụ nổi bật cho cán bộ khi tra cứu trên giao diện Một cửa.
- `Exclude from Batch`: Bóc tách và loại bỏ bản ghi ra khỏi danh sách manifest của lô nạp ứng viên đợt này.
- `Defer to Later Batch`: Trì hoãn việc nạp bản ghi, dời sang các lô dữ liệu kế tiếp sau khi hoàn thiện đầy đủ hồ sơ trình ký.
- `Reject`: Từ chối nạp vĩnh viễn đối với bản ghi lỗi không thể khắc phục hoặc văn bản đã hết hiệu lực thi hành.
- `Needs Further Review`: Chuyển bản ghi trở lại cho Hội đồng Pháp chế Vụ để tổ chức họp rà soát và thẩm định bổ sung.

## 5. Blocking Gap Rules

Nhằm giữ vững bức tường lửa bảo vệ sự tinh khôi của cơ sở dữ liệu, Hội đồng Quản trị Kỹ thuật ban hành **7 Quy tắc Giới hạn Khóa Nạp (`Blocking Gap Rules`)**. Hệ thống **TUYỆT ĐỐI KHÔNG ĐƯỢC PHÉP ĐƯA BẢN GHI VÀO LÔ NẠP CUỐI CÙNG (`EXCLUDE FROM FINAL BATCH`)** nếu bản ghi vi phạm bất kỳ tiêu chí nào sau đây:
1. **Khuyết hoặc sai lệch URL nguồn (`Missing Source Evidence Rule`):** Bản ghi để trống URL nguồn hoặc có đường dẫn không phải tên miền chính thống của cơ quan hành chính nhà nước (`.gov.vn`).
2. **Tình trạng hiệu lực Unknown (`Unknown Legal Status Rule`):** Bản ghi có trường `legal_status` bị để `Unknown`, `Unverified` hoặc chưa kiểm chứng công báo mới nhất.
3. **Thiếu chữ ký Reviewer (`Missing Reviewer Approval Rule`):** Bản ghi chưa được Cán bộ nghiệp vụ chuyên trách thẩm định và ký xác nhận rà soát `Reviewed / Cleaned`.
4. **Thiếu chữ ký Approver (`Missing Approver Approval Rule`):** Bản ghi chưa được Lãnh đạo Vụ/Phòng Pháp chế ký xác nhận phiếu đồng ý nạp `Approval Status: Approved`.
5. **Xung đột pháp lý chưa xử lý (`Unresolved Legal Conflict Rule`):** Bản ghi có mâu thuẫn về thẩm quyền ban hành, chồng chéo căn cứ pháp lý hoặc có tranh chấp áp dụng chưa được Hội đồng Pháp chế phán xử.
6. **Phạm vi áp dụng địa phương chưa rõ ràng (`Ambiguous Local Scope Rule`):** Quyết định hoặc SOP của địa phương nhưng để trống trường `local_applicability` hoặc chưa thống nhất được mã địa bàn Một cửa.
7. **Trùng lặp dữ liệu chưa bóc tách (`Unresolved Duplicate Rule`):** Bản ghi bị API kiểm tra `dry-run` cảnh báo trùng lặp số ký hiệu hoặc nội dung với DB production mà chưa được xử lý.
