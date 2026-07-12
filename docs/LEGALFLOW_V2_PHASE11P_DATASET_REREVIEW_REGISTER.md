# LEGALFLOW V2 - PHASE 11P
# DATASET RE-REVIEW REGISTER

## 1. Purpose

Tài liệu này là Sổ rà soát lại tập dữ liệu tri thức pháp lý (`Dataset Re-review Register`) được thiết lập tại Phase 11P nhằm thẩm định sâu từng bản ghi thuộc danh mục 5 văn bản thực tế gốc của hệ thống trước thời điểm ra quyết định nạp chính thức.  
Sổ rà soát lại đóng vai trò là công cụ kiểm toán chi tiết (`Granular Audit Tool`), theo dõi sát sao tình trạng thẩm định của cả Lô dữ liệu mẫu số 01 đã được duyệt (`BATCH-2024-001` gồm bản ghi `REG-2024-005`) cũng như tiến độ khắc phục metadata, kiểm tra hiệu lực và lấy chữ ký Lãnh đạo đối với 4 văn bản luật đang tồn đọng trong danh sách chờ (`Backlog/Deferred Records`), bảo đảm không có bất kỳ bản ghi nào bị nạp sót rào chắn hoặc nạp trái phép.

## 2. Re-review Register

*(Lưu ý về danh tính nhân sự: Tuân thủ tuyệt đối yêu cầu không tự điền tên thật nếu chưa được cung cấp chính thức, hệ thống sử dụng các chức danh và mã vai trò chuyên môn chuẩn hóa):*

| Review ID | Source ID | Document Title | Document Number | Document Type | Legal Status | Local Scope | Related Procedure | Reviewer Status | Approver Status | Risk Note Present | Import Readiness | Re-review Decision | Notes |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- | :---: | :---: | :--- | :--- |
| **REV-2024-01** | `REG-2024-001` | Luật Đất đai 2024 | 31/2024/QH15 | Law | Effective | National | TTHC-LAND-01..05 | `Reviewed / Cleaned` | `Pending Sign-off` | `Yes` | `Needs Completion` | `Needs Manager Approval` | Đã hoàn thiện danh mục 5 nghị định hướng dẫn chi tiết; đang trình Lãnh đạo Vụ Pháp chế họp thẩm định và ký phê duyệt `Approved`. |
| **REV-2024-02** | `REG-2024-002` | Nghị định quy định chi tiết thi hành Luật Đất đai về Đăng ký đất đai, tài sản gắn liền với đất | 101/2024/NĐ-CP | Decree | Effective | National | TTHC-LAND-01..03 | `Reviewed / Cleaned` | `Pending Sign-off` | `Yes` | `Needs Completion` | `Needs Manager Approval` | Đã bổ sung đầy đủ trích đoạn điều khoản chuyển tiếp tại Chương VII vào `risk_note`; chờ Lãnh đạo Vụ ký duyệt. |
| **REV-2024-03** | `REG-2024-003` | Quyết định ban hành Quy định hạn mức giao đất, tách thửa, hợp thửa trên địa bàn Tỉnh X | 45/2024/QĐ-UBND | Decision | Effective | Province X | TTHC-LAND-02 | `Reviewed / Cleaned` | `In Coordination` | `Yes` | `Needs Completion` | `Needs Legal Review` / `Defer to Later Batch` | Đã chuẩn hóa phân vùng địa phương (`Province X`); đang chờ thống nhất văn bản ý kiến giữa Sở TNMT Tỉnh X và Vụ Pháp chế. |
| **REV-2024-04** | `REG-2024-004` | Quyết định phê duyệt Kế hoạch sử dụng đất năm 2024 Huyện A | 120/QĐ-UBND | Decision | **Expired** | District A | TTHC-LAND-04 | `Reviewed / Cleaned` | `Rejected Sign-off` | `Yes` (Expired warning) | `Not Applicable` | **`Exclude from Batch`** / **`Rejected`** | Văn bản quy hoạch đã hết thời gian áp dụng kịch bản năm 2024; bị loại bỏ vĩnh viễn khỏi danh sách ứng viên nạp vào DB production. |
| **REV-2024-05** | `REG-2024-005` | Quy trình nội bộ giải quyết thủ tục hành chính lĩnh vực đất đai (SOP cấp mới GCN) | 888/QĐ-UBND | SOP | Effective | Province X | TTHC-LAND-01 | `Reviewed / Cleaned` | **`Approved`** | `Yes` | **`Ready for Controlled Import`** | **`Ready for Controlled Import`** | Bản ghi chuẩn mực trong lô `BATCH-2024-001`; đạt 100% tiêu chuẩn thẩm định metadata và có chữ ký xác nhận của Lãnh đạo Vụ. |

## 3. Re-review Decision Values

Toàn bộ kết quả rà soát lại trên sổ theo dõi được phân loại nghiêm ngặt theo 8 mức quyết định thẩm định (`Re-review Decision Values`):
- `Ready for Controlled Import`: Bản ghi đạt 100% tiêu chuẩn sạch về metadata, nguồn công báo, hiệu lực pháp lý hiện hành, lời nhắc rủi ro và đã có chữ ký Lãnh đạo Vụ phê duyệt (`Approved`). Sẵn sàng đưa vào nạp có kiểm soát.
- `Ready with Warning`: Bản ghi đạt đủ điều kiện nạp nhưng có lời nhắc rủi ro chuyển tiếp pháp lý phức tạp hoặc đang chờ hướng dẫn thi hành bổ sung, đòi hỏi giám sát chặt chẽ khi áp dụng.
- `Needs Metadata Completion`: Bản ghi bị thiếu cột trường thông tin bắt buộc (như số hiệu, ngày hiệu lực, cơ quan ban hành hoặc liên kết sửa đổi/thay thế), bắt buộc phải làm sạch trước.
- `Needs Legal Review`: Bản ghi cần được Hội đồng chuyên môn hoặc Lãnh đạo thẩm định sâu thêm về tình trạng hiệu lực, điều khoản bãi bỏ ngầm hoặc ranh giới phạm vi áp dụng địa phương.
- `Needs Manager Approval`: Bản ghi đã hoàn tất làm sạch kỹ thuật (`Reviewed / Cleaned`) nhưng chưa có chữ ký ký duyệt chính thức (`Approved`) của Lãnh đạo Vụ/Phòng Pháp chế.
- `Exclude from Batch`: Bản ghi bị bóc tách khỏi lô nạp hiện tại do thuộc chuyên đề khác hoặc cần tách luồng nạp riêng theo địa bàn hành chính.
- `Defer to Later Batch`: Bản ghi được trì hoãn sang các lô nạp đợt sau (`BATCH-2024-002`, `003`) để chờ văn bản thống nhất ý kiến giữa các cơ quan ban hành.
- `Rejected`: Bản ghi bị từ chối nạp vĩnh viễn do đã hết hiệu lực thi hành (`Expired`), bị bãi bỏ toàn bộ hoặc sai lệch nguồn gốc không thể xác minh.

## 4. Common Re-review Issues

Trong quá trình rà soát lại tập dữ liệu tri thức pháp lý thật, Hội đồng Thẩm định ghi nhận 10 nhóm khiếm khuyết phổ biến (`Common Re-review Issues`) cần được kiểm soát và xử lý triệt để:
1. **Thiếu nguồn (`Missing Source URL / Unverified Domain`):** Bản ghi để rỗng trường `source_url` hoặc dẫn link về các trang web phi chính thống, báo chí thương mại, thiếu độ tin cậy cậy pháp lý.
2. **Thiếu ngày hiệu lực (`Missing Effective Date / Invalid Format`):** Trường `effective_date` để `null` hoặc ghi định dạng text tự do (`15/09/2024`), vi phạm chuẩn ISO 8601 (`YYYY-MM-DD`) của API.
3. **Thiếu phạm vi áp dụng (`Missing Local Scope`):** Văn bản do UBND/HĐND cấp tỉnh hoặc huyện ban hành nhưng trường `local_applicability` bị để trống hoặc ghi nhầm là `National`.
4. **Chưa kiểm tra văn bản thay thế (`Unchecked Amendment / Replacement Links`):** Văn bản có nội dung sửa đổi, bổ sung hoặc thay thế cho luật cũ nhưng không nhập mã văn bản liên quan vào trường `replaces_document`.
5. **Risk note chưa rõ ràng (`Ambiguous / Empty Risk Note`):** Trường `risk_note` để trống hoặc chỉ ghi chuỗi vô nghĩa, không hướng dẫn được thời hạn SLA hay lưu ý chuyển tiếp pháp lý cho cán bộ tra cứu.
6. **Chưa mapping thủ tục (`Missing Procedure Mapping`):** Bản ghi quy định trực tiếp về hồ sơ đăng ký đất đai nhưng không ánh xạ mã chuyên đề `TTHC-LAND-01..05` tương ứng.
7. **Trùng lặp dữ liệu (`Unresolved Duplicate Records`):** Tệp import chứa nhiều dòng trùng lặp số ký hiệu (`document_number`) hoặc trùng với văn bản đã có trong DB production mà không bóc tách.
8. **Reviewer chưa duyệt (`Missing Reviewer Sign-off`):** Cán bộ thẩm định tự ý nạp hoặc chuyển giao danh sách văn bản thô khi chưa ký xác nhận chịu trách nhiệm `Reviewed / Cleaned`.
9. **Approver chưa duyệt (`Missing Manager Approval Sign-off`):** Danh mục văn bản chưa được trình qua cuộc họp Lãnh đạo Vụ Pháp chế hoặc chưa có phiếu phê duyệt `Approval Status: Approved`.
10. **Dữ liệu chưa đủ điều kiện import (`Premature Import Execution Attempt`):** Cố gắng bấm nút nạp hàng loạt (`Execute Import`) khi tập dữ liệu vẫn còn tồn tại lỗi Critical/High hoặc thiếu bản sao lưu DB (`backup plan`).

## 5. Safety Warning

> [!WARNING]
> **CẢNH BÁO AN TOÀN QUẢN TRỊ SỔ RÀ SOÁT LẠI (`RE-REVIEW REGISTER SAFETY WARNING`):**  
> Việc lập Sổ rà soát lại tập dữ liệu (`Dataset Re-review Register`) này **HOÀN TOÀN KHÔNG ĐỒNG NGHĨA VỚI VIỆC THỰC THI NẠP (`NO IMPORT EXECUTION`)** vào cơ sở dữ liệu `legalflow_prod`.  
> Lệnh nạp thực tế chỉ được phép thực thi tại một giai đoạn riêng biệt (`Phase 11Q`), nơi hệ thống bắt buộc thi hành đầy đủ 4 rào chắn phòng thủ:
> 1. **Thực thi sao lưu DB (`Backup Required`):** Chạy `pg_dump` tạo bản sao lưu toàn vẹn ngay trước giờ bấm Execute.
> 2. **Nhập lý do kiểm toán (`Reason Required`):** Ghi rõ lý do và số công văn phê duyệt lô dữ liệu để lưu vết kiểm toán minh bạch.
> 3. **Xác nhận từ khóa an toàn (`Confirmation Text Required`):** Người nhập liệu phải gõ chính xác chuỗi: `"I UNDERSTAND IMPORT DOES NOT ACTIVE LEGAL VERSION"`.
> 4. **Nghiệm thu sau nạp (`Post-import Verification`):** Đối chiếu số bản ghi đã nạp vào DB, bảo đảm tuyệt đối **không tự động kích hoạt (`noAutoActive: true`)** và không làm biến đổi hay hoàn tác (`no rollback`) bất kỳ phiên bản pháp lý nào đang thi hành.  
> Việc nạp thành công vào DB không đồng nghĩa với việc kích hoạt phiên bản (`ACTIVE`). Cán bộ nghiệp vụ vẫn phải kiểm tra, đối chiếu văn bản gốc theo đúng thẩm quyền hành chính nhà nước.
