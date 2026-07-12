# LEGALFLOW V2 - PHASE 11O
# APPROVED IMPORT BATCH MANIFEST

## 1. Purpose

Tài liệu này là Bản tuyên bố chi tiết và đóng băng lô dữ liệu (`Approved Import Batch Manifest`) được lập tại Phase 11O nhằm tổng hợp chính xác danh sách các bản ghi đã qua làm sạch, thẩm định và được Lãnh đạo Vụ Pháp chế phê duyệt đủ điều kiện đưa vào nạp có kiểm soát.  
Manifest phân định rạch ròi giữa các bản ghi được chấp thuận đưa vào lô nạp (`Approved Records Manifest`) và các bản ghi bị bóc tách/trì hoãn (`Excluded / Deferred Records`), làm căn cứ pháp lý và kỹ thuật duy nhất trước thời điểm thực thi nạp thực tế.

## 2. Batch Information

*(Lưu ý về danh tính nhân sự: Tuân thủ yêu cầu không tự điền tên thật nếu chưa được cung cấp chính thức, hệ thống sử dụng các mã vai trò chuẩn hóa như `SOP Officer D`, `Legal Lead`, `Manager Approver`):*

| Batch ID | Batch Name | Dataset Source | Prepared By | Reviewed By | Approved By | Approval Date | Number of Records | Batch Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **BATCH-2024-001** | Lô rà soát số 01 - SOP Quy trình nội bộ TTHC Đất đai | Cổng TTĐT Sở TNMT & UBND Tỉnh X (`sotnmt.tinhx.gov.vn`) | SOP Officer D (`STAFF`) | Legal Lead (`MANAGER`) | Lãnh đạo Vụ Pháp chế (`MANAGER`) | 2026-07-12 | 1 bản ghi `Approved` (trên tổng số 5 bản ghi thực tế) | `Ready for Controlled Import` (đối với lô mẫu 01) | Lô ứng viên đầu tiên đạt 100% tiêu chí chuẩn hóa và phê duyệt chính thức. |

## 3. Batch Status Values

Quy trình theo dõi và quản trị mỗi lô dữ liệu nạp được phân loại theo 7 mức trạng thái chuẩn (`Batch Status Values`):
- `Draft`: Lô dữ liệu đang trong quá trình tổng hợp thô ban đầu từ Sổ làm sạch Phase 11N.
- `Pending Review`: Lô dữ liệu đã gom xong các bản ghi ứng viên, đang chờ Hội đồng chuyên môn rà soát metadata và tình trạng hiệu lực.
- `Approved Candidate`: Lô dữ liệu đã qua rà soát kỹ thuật của cán bộ chuyên môn, đang trình Lãnh đạo Vụ Pháp chế ký phê duyệt.
- `Ready for Controlled Import`: Lô dữ liệu đã được Lãnh đạo Vụ ký duyệt chính thức bằng văn bản, sẵn sàng cho công cụ kỹ thuật nạp vào DB tại phase sau.
- `Ready with Warnings`: Lô dữ liệu đã được phê duyệt nạp nhưng kèm theo yêu cầu giám sát hoặc các bản ghi có lời nhắc rủi ro nghiệp vụ cao.
- `Blocked`: Lô dữ liệu bị khóa tạm thời do phát hiện lỗi cấu trúc, thiếu bản sao lưu DB (`backup plan`) hoặc vướng mắc giải thích pháp luật.
- `Rejected`: Lô dữ liệu bị từ chối nạp do chứa tỷ lệ bản ghi hết hiệu lực lớn, sai lệch nguồn gốc hoặc thiếu chữ ký Lãnh đạo.

## 4. Approved Records Manifest

Dưới đây là bảng danh sách chi tiết các bản ghi đã đạt đủ 100% tiêu chí kiểm tra, được niêm phong vào lô nạp chính thức số 01 (`BATCH-2024-001`):

| Source ID | Document Title | Document Number | Issuing Authority | Document Type | Effective Date | Legal Status | Local Scope | Related Procedure | Reviewer | Approver | Approval Status | Risk Note | Import Readiness | Notes |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| **REG-2024-005** | Quy trình nội bộ giải quyết thủ tục hành chính lĩnh vực đất đai (SOP cấp mới) | 888/QĐ-UBND | UBND Tỉnh X | SOP | 2024-09-15 | Effective | Province X | TTHC-LAND-01 | SOP Officer D | Lãnh đạo Vụ Pháp chế | **Approved** | Định mức thời gian xử lý SLA là 10 ngày làm việc; các lời nhắc AI chỉ mang tính tham khảo hỗ trợ cán bộ. | `Ready for Controlled Import` | Bản ghi chuẩn mực đạt 100% tiêu chí thẩm định; metadata sạch và khớp hoàn toàn quy trình Một cửa. |

## 5. Excluded / Deferred Records

Nhằm bảo đảm sự tinh khôi và an toàn tuyệt đối cho cơ sở dữ liệu production, các bản ghi chưa đạt chuẩn phê duyệt hoặc đã hết kỳ hạn áp dụng được bóc tách và theo dõi riêng tại danh sách loại trừ/trì hoãn (`Excluded / Deferred Records`):

| Source ID | Document Title | Reason Excluded | Required Action | Owner | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **REG-2024-001** | Luật Đất đai 2024 (`31/2024/QH15`) | Chưa cập nhật trọn vẹn danh mục các nghị định quy định chi tiết thi hành mới ban hành và chưa có chữ ký ký duyệt chính thức của Lãnh đạo Vụ Pháp chế (`Needs Manager Approval`). | Hoàn thiện danh mục nghị định hướng dẫn chi tiết; trình Lãnh đạo Vụ Pháp chế họp thẩm định và ký duyệt phiếu `Approval Status: Approved`. | Legal Lead (`MANAGER`) | `Deferred / In Review` | Trì hoãn sang các lô nạp tiếp theo (`BATCH-2024-002`) sau khi Lãnh đạo Vụ phê duyệt hoàn tất. |
| **REG-2024-002** | Nghị định quy định chi tiết Đăng ký đất đai (`101/2024/NĐ-CP`) | Đã bổ sung trích đoạn chuyển tiếp tại `risk_note` trong Phase 11N, tuy nhiên đang chờ Lãnh đạo Vụ Pháp chế rà soát lần cuối và ký xác nhận cho phép nạp. | Hoàn tất rà soát đối chiếu điều khoản chuyển tiếp tại Chương VII; trình Lãnh đạo Vụ ký duyệt phê duyệt `Approved`. | Specialist A (`STAFF`) | `Deferred / In Review` | Bản ghi đã sạch metadata, sẵn sàng đưa vào lô tiếp theo ngay khi có chữ ký Lãnh đạo Vụ. |
| **REG-2024-003** | Quyết định hạn mức giao đất, tách/hợp thửa Tỉnh X (`45/2024/QĐ-UBND`) | Đã làm sạch và chuẩn hóa phân vùng áp dụng địa phương, đang chờ Hội đồng chuyên môn của Sở TNMT Tỉnh X và Vụ Pháp chế đối chiếu lần cuối. | Lấy ý kiến thống nhất bằng văn bản giữa Sở TNMT Tỉnh X và Vụ Pháp chế; hoàn tất chữ ký `Approver Sign-off`. | Local Officer B (`STAFF`) | `Deferred / In Review` | Trì hoãn sang lô nạp riêng cho địa phương sau khi hoàn tất thủ tục ký duyệt chéo. |
| **REG-2024-004** | Kế hoạch sử dụng đất năm 2024 Huyện A (`120/QĐ-UBND`) | Văn bản quy hoạch/kế hoạch sử dụng đất đã hết thời hạn áp dụng kịch bản năm 2024 (`2024-01-01` &rarr; `2024-12-31`), không còn giá trị pháp lý cho năm hiện hành `2026`. | Loại bỏ vĩnh viễn khỏi danh sách ứng viên nạp. Yêu cầu cơ quan đề xuất cung cấp Quyết định phê duyệt Kế hoạch sử dụng đất năm 2026 thay thế. | Planning Clerk C (`STAFF`) | **`Rejected / Excluded`** | Bị loại bỏ hoàn toàn, tuyệt đối không được phép nạp vào cơ sở dữ liệu `legalflow_prod`. |

## 6. Batch Decision

Căn cứ thực trạng tổng thể của bộ dữ liệu tri thức pháp lý thật với 4/5 bản ghi gốc ban đầu vẫn đang trong trạng thái trì hoãn rà soát (`Deferred / In Review`) hoặc bị loại bỏ (`Rejected`), trong khi lô ứng viên số 01 (`BATCH-2024-001`) mới chỉ bao gồm 1 bản ghi SOP đã được duyệt trọn vẹn, Hội đồng Thẩm định Kỹ thuật và Pháp chế Đề xuất Quyết định Toàn cục:

### `BATCH NOT READY`
*(LÔ DỮ LIỆU THẬT HOÀN CHỈNH CHƯA SẴN SÀNG ĐỂ NẠP TOÀN BỘ; TẠM DỪNG NẠP HÀNG LOẠT VÀ TIẾP TỤC RÀ SOÁT HOÀN THIỆN DANH MỤC TRONG BACKLOG)*

*(Lưu ý chuyên môn đối với lô mẫu số 01: Riêng đối với lô nhỏ `BATCH-2024-001` (chứa duy nhất bản ghi SOP `REG-2024-005` đã được Lãnh đạo Vụ ký duyệt 100%), nếu Lãnh đạo dự án có yêu cầu thực thi kiểm chứng dòng chảy nạp thực tế ở phạm vi hẹp (`Pilot Controlled Import`), lô `BATCH-2024-001` được phân loại độc lập là `READY FOR CONTROLLED IMPORT` tại Phase 11P tiếp theo với điều kiện tuân thủ đủ 4 tường lửa bảo vệ).*

## 7. Safety Warning

> [!WARNING]
> **CẢNH BÁO AN TOÀN QUẢN TRỊ BẢN TUYÊN BỐ LÔ DỮ LIỆU (`MANIFEST SAFETY WARNING`):**  
> Việc lập Bản tuyên bố chi tiết lô dữ liệu (`Approved Import Batch Manifest`) này **HOÀN TOÀN KHÔNG ĐỒNG NGHĨA VỚI VIỆC THỰC THI NẠP (`NO IMPORT EXECUTION`)** vào cơ sở dữ liệu đang vận hành thực tế.  
> Lệnh nạp thực tế chỉ được phép thực thi tại một giai đoạn riêng biệt (`Phase 11P`), nơi hệ thống bắt buộc thi hành đầy đủ 4 rào chắn:
> 1. **Thực thi sao lưu DB (`Backup Required`):** Chạy `pg_dump` tạo bản sao lưu toàn vẹn ngay trước giờ bấm Execute.
> 2. **Nhập lý do kiểm toán (`Reason Required`):** Ghi rõ lý do và số công văn phê duyệt lô dữ liệu để lưu vết kiểm toán minh bạch.
> 3. **Xác nhận từ khóa an toàn (`Confirmation Text Required`):** Người nhập liệu phải gõ chính xác chuỗi: `"I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION"`.
> 4. **Nghiệm thu sau nạp (`Post-import Verification`):** Đối chiếu số bản ghi đã nạp vào DB, bảo đảm tuyệt đối **không tự động kích hoạt (`noAutoActive: true`)** và không làm biến đổi hay hoàn tác (`no rollback`) bất kỳ phiên bản pháp lý nào đang thi hành.  
> Việc nạp thành công vào DB không đồng nghĩa với việc kích hoạt phiên bản (`ACTIVE`). Cán bộ nghiệp vụ vẫn phải kiểm tra, đối chiếu văn bản gốc theo đúng thẩm quyền hành chính nhà nước.
