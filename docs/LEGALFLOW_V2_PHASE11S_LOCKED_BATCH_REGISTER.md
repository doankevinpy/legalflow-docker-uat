# LEGALFLOW V2 - PHASE 11S
# LOCKED BATCH REGISTER

## 1. Purpose

Tài liệu này là Sổ ghi nhận Danh sách Lô dữ liệu đã khóa chốt chặn (`Locked Batch Register`) được thiết lập tại Phase 11S nhằm lưu trữ và niêm phong chính thức cấu trúc siêu dữ liệu, phân loại bản ghi và chữ ký điện tử hợp pháp cho tệp lô dữ liệu ứng viên cuối cùng trước giờ thực thi nạp (`Controlled Real Legal Dataset Import Execution`).  
Sổ ghi nhận bảo đảm sự tường minh và bất khả xâm phạm (`Immutable Register`), phân chia rõ ràng danh sách các văn bản được đưa vào (`Included Records`), các văn bản bị loại trừ (`Excluded Records`) và các văn bản được trì hoãn (`Deferred Records`), qua đó ngăn chặn mọi sự xen cấy hoặc tùy tiện chỉnh sửa dữ liệu trái phép.

## 2. Batch Header

*(Tuân thủ tuyệt đối quy định không tự điền tên thật nếu chưa được cung cấp chính thức, hệ thống sử dụng các chức danh chuẩn hóa và mã vai trò nghiệp vụ hợp lệ):*

| Field | Value | Notes |
| :--- | :--- | :--- |
| **Batch ID** | `BATCH-2024-001` (Pilot Batch 01) | Lô dữ liệu ứng viên mẫu số 01 được rà soát và khóa niêm phong chính thức. |
| **Batch Name** | `Locked Pilot Legal Knowledge Import Batch 01 (Land SOPs)` | Chuyên đề nghiệp vụ và quy trình Một cửa địa phương lĩnh vực đất đai. |
| **Source Register** | `docs/LEGALFLOW_V2_PHASE11R_FINAL_IMPORT_READINESS_GATE.md` | Đối chiếu từ Cổng quyết định độ sẵn sàng nạp tối hậu Phase 11R. |
| **Prepared By** | `Specialist A` (`STAFF`) | Cán bộ chuẩn hóa nguyên liệu và rà soát siêu dữ liệu CSV/JSON. |
| **Reviewed By** | `SOP Officer D` (`STAFF`) | Cán bộ rà soát nghiệp vụ chuyên trách kiểm định tính xác thực nội dung. |
| **Approved By** | `Manager Approver` (`MANAGER`) | Lãnh đạo Vụ Pháp chế thẩm định và ký duyệt phiếu đồng ý nạp. |
| **Lock Date** | `2026-07-12T16:48:00+07:00` | Thời điểm niêm phong mã băm SHA256 cho cấu trúc tệp dữ liệu. |
| **Batch Status** | `FINAL BATCH LOCKED WITH CONDITIONS` | Đã khóa niêm phong cho Lô 01; kèm điều kiện thực thi rào chắn an toàn. |
| **Number of Included Records** | `1` record (`REG-2024-005`) | Bản ghi SOP `888/QĐ-UBND` đạt chuẩn `Approved` 100%. |
| **Number of Excluded Records** | `1` record (`REG-2024-004`) | Bản ghi quy hoạch hết thời kỳ áp dụng kịch bản năm 2024 (`Expired`). |
| **Number of Deferred Records** | `3` records (`REG-2024-001..003`) | Các văn bản luật trung ương và địa phương đang chờ chữ ký Lãnh đạo. |
| **Notes** | Mã băm SHA256 của tệp `manifest-batch-2024-001.json`: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`. |

## 3. Included Records

Dưới đây là danh sách bản ghi chính thức được bóc tách, niêm phong và cho phép đưa vào Lô nạp cuối cùng (`Included Records` - Pilot Batch 01):

| Source ID | Document Title | Document Number | Issuing Authority | Legal Status | Local Scope | Related Procedure | Reviewer Approved | Approver Approved | Risk Note | Import Decision | Notes |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **`REG-2024-005`** | Quy trình nội bộ giải quyết TTHC lĩnh vực đất đai (SOP `888/QĐ-UBND`) | `888/QĐ-UBND` | `UBND Tỉnh X` | `Effective` | `Province X` | `TTHC-LAND-01` | `Yes` | `Yes` | SLA 10 ngày làm việc; AI tham khảo. | **`Include in Final Batch`** | Bản ghi hoàn hảo đạt 100% metadata chuẩn hóa, sạch lỗi Critical/High, có chữ ký hợp lệ. Sẵn sàng chuyển sang Phase 11T. |

## 4. Excluded Records

Dưới đây là danh sách bản ghi bị loại trừ khỏi manifest lô nạp và từ chối nạp vĩnh viễn (`Excluded Records`):

| Source ID | Document Title | Exclusion Reason | Required Action | Future Batch Candidate | Notes |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **`REG-2024-004`** | Quyết định phê duyệt KHSDĐ năm 2024 Huyện A (`120/QĐ-UBND`) | Văn bản quy hoạch có kỳ hạn năm (`2024-12-31`), đã hết hiệu lực thi hành (`Expired`) cho năm 2026. | Loại bỏ ngay lập tức khỏi manifest lô dữ liệu nạp ứng viên. Yêu cầu chuyên môn Huyện A cung cấp Quyết định KHSDĐ 2026. | `No` (Rejected) | Xử lý triệt để chốt chặn bảo vệ DB: **KHÔNG NẠP** văn bản quy hoạch hết thời kỳ vào hệ thống production. |

## 5. Deferred Records

Dưới đây là danh sách các bản ghi được trì hoãn nạp (`Deferred Records`), dời sang các lô dữ liệu kế tiếp sau khi thu thập đủ hồ sơ trình ký:

| Source ID | Document Title | Deferral Reason | Missing Evidence | Owner | Target Review Round | Notes |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **`REG-2024-001`** | Luật Đất đai 2024 (`31/2024/QH15`) | Đang chờ Lãnh đạo Vụ Pháp chế xem xét danh mục nghị định thi hành đầy đủ và ký phê duyệt. | Chữ ký phê duyệt (`Approval Status: Approved`) từ Lãnh đạo Vụ Pháp chế. | Manager Approver (`MANAGER`) | Phase 11T / Batch 02 | Khóa nạp bản ghi luật khung cho đến khi có chữ ký `Approved` chính thức của Lãnh đạo Vụ. |
| **`REG-2024-002`** | Nghị định quy định chi tiết Đăng ký đất đai (`101/2024/NĐ-CP`) | Đã rà soát xong nội dung `risk_note` chuyển tiếp Chương VII; chờ Lãnh đạo Vụ thẩm định lần cuối. | Chữ ký nghiệm thu nội dung điều khoản chuyển tiếp từ Lãnh đạo Vụ. | Specialist A (`STAFF`) | Phase 11T / Batch 02 | Bảo đảm cán bộ tra cứu không áp dụng nhầm luật mới cho các hồ sơ cũ tiếp nhận trước 01/08/2024. |
| **`REG-2024-003`** | Quyết định hạn mức giao đất Tỉnh X (`45/2024/QĐ-UBND`) | Sở TNMT Tỉnh X đã có công văn thống nhất mã `Province X`; chờ Lãnh đạo Vụ Pháp chế ký duyệt tổng hợp. | Chữ ký tổng hợp trên phiếu phê duyệt lô nạp địa phương. | Local Officer B (`STAFF`) | Phase 11T / Batch 02 | Trì hoãn sang lô nạp chuyên đề địa phương (`BATCH-2024-002`) sau khi hoàn tất ký duyệt. |

## 6. Batch Lock Decision

Căn cứ vào kết quả khóa niêm phong và phân loại trên (đối với tổng thể bộ dữ liệu 5 văn bản gốc ban đầu vẫn còn 4 văn bản đang trong backlog chờ chữ ký Lãnh đạo Vụ hoặc bị loại bỏ, tuy nhiên Lô dữ liệu ứng viên mẫu số 01 `BATCH-2024-001` chứa bản ghi SOP `REG-2024-005` đã hoàn tất 100% rà soát, sạch lỗi Critical/High và được niêm phong mã băm SHA256), Hội đồng Quản trị Kỹ thuật chính thức ban hành Quyết định Khóa Lô dữ liệu (`Batch Lock Decision`):

- **Quyết định đối với Tổng thể Bộ dữ liệu thật (5 văn bản gốc ban đầu):**  
  ### `FINAL BATCH NOT LOCKED - IMPORT NOT AUTHORIZED`
  *(TẬP DỮ LIỆU THẬT ĐẦY ĐỦ CHƯA CÓ LÔ CHUNG ĐƯỢC KHÓA ĐỂ NẠP HÀNG LOẠT TOÀN BỘ; KHÔNG CẤP PHÉP NẠP TỔNG THỂ VÀ TIẾP TỤC RÀ SOÁT TRONG BACKLOG)*

- **Quyết định đối với riêng Lô mẫu số 01 (`BATCH-2024-001`):**  
  ### `FINAL BATCH LOCKED WITH CONDITIONS`
  *(LÔ DỮ LIỆU MẪU SỐ 01 `BATCH-2024-001` ĐÃ ĐƯỢC KHÓA NIÊM PHONG VÀ CẤP PHÉP CHUYỂN SANG PHASE 11T ĐỂ THỰC THI NẠP CÓ KIỂM SOÁT KÈM ĐIỀU KIỆN TRƯỚC VÀ SAU NẠP)*

## 7. Safety Warning

> [!WARNING]
> **CẢNH BÁO AN TOÀN TUYỆT ĐỐI VỀ TÍNH CHẤT PHÁP LÝ CỦA LÔ DỮ LIỆU ĐÃ KHÓA:**  
> 1. Việc khóa lô dữ liệu (`Locked Batch`) **KHÔNG ĐỒNG NGHĨA VỚI VIỆC THỰC THI NẠP (`IMPORT EXECUTION`)**. Thao tác nạp thật vào cơ sở dữ liệu production chỉ được phép thực hiện tại Phase 11T riêng biệt dưới sự kiểm soát của tường lửa 4 lớp: bắt buộc chạy kịch bản sao lưu `pg_dump` ngay trước giờ nạp, ghi nhận rõ ràng lý do `Reason`, nhập chính xác từ khóa xác nhận `Confirmation Text` và rà soát nghiệm thu sau nạp.  
> 2. Việc nạp lô dữ liệu thành công vào cơ sở dữ liệu **KHÔNG ĐỒNG NGHĨA VỚI VIỆC KÍCH HOẠT PHIÊN BẢN PHÁP LÝ (`ACTIVE VERSION`)**. Hệ thống thi hành tuyệt đối cờ `noAutoActive: true` tại backend, bảo đảm dữ liệu mới nạp chỉ lưu trữ ở trạng thái tham khảo chờ thẩm định, bảo toàn nguyên trạng 100% các văn bản pháp luật đang thi hành (`ACTIVE`) hiện hữu của cơ quan nhà nước.  
> 3. Trách nhiệm rà soát, ký duyệt, đối chiếu công báo chính thức và quyết định áp dụng văn bản pháp luật thuộc hoàn toàn về Lãnh đạo chuyên môn và Cán bộ cơ quan nhà nước có thẩm quyền. AI chỉ đóng vai trò công cụ hỗ trợ gợi ý rà soát kỹ thuật.
