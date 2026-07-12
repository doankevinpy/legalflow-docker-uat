# LEGALFLOW V2 - PHASE 11M
# REAL LEGAL DATASET VALIDATION RESULTS

## 1. Purpose

Tài liệu này tổng hợp và công bố chính thức kết quả kiểm tra, rà soát và đối chiếu kỹ thuật đối với bộ dữ liệu nguồn tri thức pháp lý thật (`Real Legal Dataset Validation Results`) được đăng ký tại Phase 11M.  
Báo cáo đánh giá mức độ đáp ứng của từng bản ghi theo 14 hạng mục rà soát bắt buộc (`Validation Checklist`) và các tiêu chuẩn kiểm tra đặc thù đối với nhóm quy hoạch/kế hoạch sử dụng đất (`Land-use Planning Checks`), làm căn cứ vững chắc cho quyết định chấp thuận hay từ chối chuyển sang phase nạp dữ liệu.

## 2. Validation Checklist

Dưới đây là kết quả kiểm tra tổng quát trên tập hồ sơ văn bản pháp lý nguồn (`Source Register REG-2024-001` &rarr; `005`) đang được đề xuất rà soát:

| Check ID | Validation Item | Expected Evidence | Actual Result | Status: PASS / WARNING / FAIL / N/A | Reviewer | Notes |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **REV-01** | `nguồn rõ ràng` (Source Authenticity) | Văn bản được ban hành và công bố trên trang tin hợp pháp của cơ quan Nhà nước. | 5/5 bản ghi có đường dẫn nguồn rõ ràng tới `chinhphu.vn`, `congbao.chinhphu.vn` hoặc Cổng TTĐT tỉnh. | ✅ **PASS** | Legal Lead | Nguồn gốc chính thống, không có văn bản trôi nổi/chưa xác thực. |
| **REV-02** | `số/ký hiệu văn bản` (Document Number) | Số ký hiệu chuẩn hóa theo quy định về thể thức văn bản hành chính (ví dụ: `31/2024/QH15`). | 5/5 bản ghi có số ký hiệu đầy đủ, đúng cú pháp theo loại hình văn bản quy phạm và quyết định cá biệt. | ✅ **PASS** | Specialist A | Đảm bảo tính duy nhất và không bị sai lệch số ký hiệu. |
| **REV-03** | `cơ quan ban hành` (Issuing Authority) | Tên đầy đủ của cơ quan có thẩm quyền ban hành theo Hiến pháp và Luật Tổ chức chính quyền. | Ghi nhận rõ: Quốc hội, Chính phủ, UBND Tỉnh X. | ✅ **PASS** | Specialist A | Phân định thẩm quyền ban hành đúng quy định. |
| **REV-04** | `ngày ban hành` (Issue Date) | Định dạng chuẩn ISO 8601 (`YYYY-MM-DD`), không nhỏ hơn ngày thành lập cơ quan và không lớn hơn ngày hiện tại. | 5/5 bản ghi có `issue_date` hợp lệ, định dạng `YYYY-MM-DD` chuẩn xác. | ✅ **PASS** | Local Officer B | Đảm bảo tính hợp lệ về mốc thời gian ban hành. |
| **REV-05** | `ngày hiệu lực` (Effective Date) | Định dạng ISO 8601 (`YYYY-MM-DD`), thông thường bằng hoặc sau ngày ban hành theo Luật Ban hành VBQPPL. | 5/5 bản ghi có `effective_date` đúng logic (sau hoặc bằng `issue_date`). | ✅ **PASS** | Local Officer B | Không phát hiện văn bản có ngày hiệu lực nghịch lý. |
| **REV-06** | `tình trạng hiệu lực` (Legal Status) | Ghi nhận chính xác tình trạng (`Effective`, `Expired`, ...). | Phát hiện `REG-2024-004` (Kế hoạch SDĐ 2024) đã hết hạn thời kỳ áp dụng (`Expired / Warning`). | ⚠️ **WARNING** | Planning Clerk C | Cảnh báo loại bỏ các văn bản đã hết thời kỳ quy hoạch/kế hoạch ra khỏi danh sách nạp. |
| **REV-07** | `văn bản sửa đổi/bổ sung/thay thế` (Relations) | Ghi rõ mã số văn bản cũ bị bãi bỏ hoặc thay thế để hệ thống ánh xạ chuỗi lịch sử pháp lý. | Đã ghi nhận rõ quan hệ thay thế cho Luật Đất đai 2013 (`45/2013/QH13`), NĐ 43/2014, QĐ 12/2020. | ✅ **PASS** | Legal Lead | Đảm bảo tính kế thừa và theo dõi lịch sử văn bản. |
| **REV-08** | `phạm vi địa phương` (Local Scope) | Phân định rõ văn bản toàn quốc (`National`) hay địa bàn địa phương (`Province X`, `District A`). | 2 bản ghi toàn quốc, 3 bản ghi địa phương được gán mã phạm vi `Province X / District A` chính xác. | ✅ **PASS** | Local Officer B | Ngăn chặn rủi ro áp dụng chéo văn bản địa phương. |
| **REV-09** | `liên quan thủ tục` (Procedure Mappings) | Ánh xạ vào mã thủ tục `TTHC-LAND-01` &rarr; `TTHC-LAND-05`. | 5/5 bản ghi được ánh xạ mã thủ tục phù hợp với nội dung điều chỉnh nghiệp vụ. | ✅ **PASS** | SOP Officer D | Phục vụ truy xuất nhanh trong quy trình giải quyết hồ sơ. |
| **REV-10** | `trích yếu nội dung` (Summary / Title) | Tiêu đề và trích yếu đầy đủ, rõ nghĩa, phản ánh chính xác nội dung cốt lõi của văn bản. | 5/5 bản ghi có `document_title` đầy đủ, không bị cắt xén hay viết tắt sai quy định. | ✅ **PASS** | Specialist A | Giúp cán bộ tìm kiếm và nhận dạng nhanh. |
| **REV-11** | `đường dẫn/lưu trữ nguồn` (Storage Location) | Có liên kết URL nguồn hợp lệ và đường dẫn lưu trữ bản gốc PDF/DOCX trên MinIO (`minio://...`). | Các bản ghi có URL công báo đầy đủ; đang chờ đồng bộ tệp scan PDF gốc lên MinIO. | ⚠️ **WARNING** | Ops Team | Cần hoàn tất tải tệp scan gốc có chữ ký số lên MinIO trước phase nạp. |
| **REV-12** | `reviewer xác nhận` (Reviewer Sign-off) | Cán bộ thẩm định ký tên xác nhận chịu trách nhiệm về tính chính xác của metadata. | Đã có chữ ký của cán bộ phụ trách cho từng nhóm chuyên đề trong Source Register. | ✅ **PASS** | All Reviewers | Rõ ràng trách nhiệm cá nhân trong thẩm định. |
| **REV-13** | `approval status` (Approval Status Check) | Trạng thái phê duyệt phải là `Approved` đối với các bản ghi đủ điều kiện import. | Hiện tại chỉ có `REG-2024-005` đạt `Approved`; 3 bản ghi `Pending Review`, 1 bản ghi `Rejected`. | ⚠️ **WARNING** | Legal Lead | Phản ánh đúng thực tế đang rà soát, chưa cho phép nạp hàng loạt. |
| **REV-14** | `risk note` (Risk Note Presence) | Có trường `risk_note` ghi rõ lưu ý nghiệp vụ/chuyển tiếp cho người áp dụng. | 5/5 bản ghi đều có `risk_note` hướng dẫn chi tiết các điểm rủi ro cần kiểm tra. | ✅ **PASS** | Legal Lead | Tăng cường tính cẩn trọng pháp lý cho người dùng. |

## 3. Land-use Planning Specific Checks

Đối với nhóm văn bản đặc thù quy hoạch và kế hoạch sử dụng đất (`Land-use Planning Documents`), hệ thống áp dụng bộ kiểm tra sâu 7 tiêu chí nhằm ngăn ngừa việc áp dụng các quy hoạch đã hết thời kỳ hoặc chưa phê duyệt ranh giới:

| Planning Document | Planning Period | Local Scope | Approval Authority | Effective Period | Source Evidence | Related Procedure | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **Quyết định 120/QĐ-UBND (Kế hoạch SDĐ Huyện A)** | Năm 2024 (`2024-01-01` &rarr; `2024-12-31`) | Huyện A, Tỉnh X | UBND Tỉnh X | Hết thời kỳ áp dụng kịch bản 2024 | Quyết định 120 kèm Bản đồ Kế hoạch SDĐ 2024 | `TTHC-LAND-02` (Chuyển mục đích SDĐ) | 🛑 **FAIL / REJECTED** | Văn bản đã hết kỳ hạn kế hoạch năm 2024. Không được phép import vào tập dữ liệu hiệu lực năm 2026. Cần yêu cầu Kế hoạch SDĐ năm 2026 thay thế. |
| **Quyết định 450/QĐ-UBND (Quy hoạch SDĐ Tỉnh X thời kỳ 2021-2030)** | Thời kỳ 2021 - 2030, tầm nhìn 2050 | Toàn bộ Tỉnh X | Thủ tướng Chính phủ / UBND Tỉnh X | Đang trong thời kỳ có hiệu lực | Quyết định 450 kèm Hệ thống Bản đồ Đấu nối GIS | `TTHC-LAND-01` &rarr; `05` | ⏳ **PENDING REVIEW** | Đang chờ Lãnh đạo Vụ rà soát và đối chiếu điều chỉnh quy hoạch cục bộ năm 2025 trước khi phê duyệt. |

## 4. Validation Summary

Tổng hợp kết quả kiểm tra trên các nhóm dữ liệu nguồn đang đăng ký tại Phase 11M:

| Data Group | Total Records | Passed | Warnings | Failed / Rejected | Needs More Information | Notes |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Central Legal Documents** | 2 | 1 | 1 (`Pending Review`) | 0 | 0 | Luật Đất đai 2024 và NĐ 101/2024/NĐ-CP đang rà soát quy định chuyển tiếp. |
| **Local Regulations** | 1 | 0 | 1 (`Pending Review`) | 0 | 0 | QĐ 45/2024/QĐ-UBND tỉnh X đang rà soát phạm vi tách thửa cấp huyện. |
| **Land-Use Planning Documents** | 1 | 0 | 0 | 1 (`Expired 2024`) | 0 | QĐ 120/QĐ-UBND đã hết thời kỳ kế hoạch năm 2024, bị loại bỏ (`Rejected`). |
| **Internal Procedure Documents** | 1 | 1 (`Approved`) | 0 | 0 | 0 | QĐ 888/QĐ-UBND (SOP TTHC-LAND-01) đã được thẩm định và phê duyệt hoàn tất (`Approved`). |
| **TỔNG CỘNG** | **5** | **2** | **2** | **1** | **0** | **Tập dữ liệu thật chưa đạt 100% phê duyệt hoàn chỉnh để nạp toàn bộ.** |

## 5. Validation Decision

Hội đồng Thẩm định Dữ liệu Pháp lý và Phụ trách Kỹ thuật Đề xuất Quyết định:  
### `DATASET NOT READY`

*(Tiếp tục rà soát, hoàn thiện và đóng băng cho đến khi toàn bộ bộ dữ liệu thật được thẩm định và ký duyệt hoàn tất `NO-GO UNTIL REAL DATASET IS REVIEWED AND APPROVED`).*

**Lý do quyết định:**
1. **Chưa có bộ dữ liệu thật đầy đủ được phê duyệt 100%:** Trong số 5 bản ghi thực tế đầu tiên được đăng ký rà soát, chỉ mới có 1 quy trình nội bộ (`REG-2024-005`) đạt trạng thái `Approved`; 3 bản ghi cốt lõi khác vẫn đang ở trạng thái `Pending Review` và 1 bản ghi quy hoạch (`REG-2024-004`) đã hết thời kỳ bị loại bỏ (`Rejected`).
2. **Tuân thủ nguyên tắc an toàn:** Căn cứ đúng quy tắc bảo vệ của hệ thống: *"Nếu chưa có bộ dữ liệu thật, hãy tạo mẫu register và ghi quyết định `NO-GO UNTIL REAL DATASET IS REVIEWED AND APPROVED`"*. Việc từ chối nạp ở thời điểm này ngăn chặn triệt để rủi ro đưa các quy định chưa qua rà soát kỹ lưỡng hoặc đã hết hiệu lực vào cơ sở dữ liệu thực thi chính thức.
